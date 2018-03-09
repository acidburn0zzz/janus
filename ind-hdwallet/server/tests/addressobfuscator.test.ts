import * as ethers from "ethers";
import * as mocha from 'mocha';
import * as chai from 'chai';
import { Guid } from 'guid-typescript';

import { AddressObfuscator } from '../script/addressobfuscator';
import {
    OneTimeAddressRequest, OneTimeAddressResponse, DecryptDataRequest, DecryptDataResponse,
    EncryptDataRequest, EncryptDataResponse, GrantAccessRequest, GrantAccessResponse
        } from '../script/models';
import { Utils } from '../script/utils';
import { AsymmetricKeyEncryption } from '../script/asymmetrickey-encryption';
import { SymmetricKeyEncryption } from '../script/symmetrickey-encryption';

const expect = chai.expect;
const should = chai.should();


describe('address obfuscator', () => {

    it('should return a one time address for a given guid', () => {

        let obfuscator = new AddressObfuscator();
        let addressRequest = new OneTimeAddressRequest();
        let senderWallet = ethers.Wallet.createRandom();

        addressRequest.guid = Guid.create().toString();
        addressRequest.message = JSON.stringify({
                                                    guid: addressRequest.guid,
                                                    companyName: "Shell Corporation",
                                                    signerName: "John Smith"
        });

        addressRequest.signature = senderWallet.signMessage(addressRequest.message);

        let response = obfuscator.getOnetimeAddress(addressRequest);

        (new Utils()).writeFormattedMessage("getOneTimeAddress Response", response);

        response.error.should.equal("OK");
        response.OTAddress.length.should.greaterThan(0);
    });
});

describe('encrypt decrypt methods', () => {

    /**
     * get the one time address for this test
     */

    let obfuscator = new AddressObfuscator();
    let senderWallet = ethers.Wallet.createRandom();
    let addressRequest = new OneTimeAddressRequest();

    let utils = new Utils();
    let otaResponse;
    let responseEncrypt = new EncryptDataResponse("");
    let symEngine = new SymmetricKeyEncryption();
    let asymEngine = new AsymmetricKeyEncryption();

    let symmetricKeyBuyer = symEngine.generateSymKey();
    let symmetricKeyInspector = symEngine.generateSymKey();

    let encryptedSymmetricKeyBuyer;
    let encryptedSymmetricKeyInspector;

    before(() => {
        addressRequest.guid = Guid.create().toString();
        addressRequest.message = JSON.stringify({
            guid: addressRequest.guid,
            companyName: "Shell Corporation",
            signerName: "John Smith"
        });

        addressRequest.signature = senderWallet.signMessage(addressRequest.message);
        otaResponse = obfuscator.getOnetimeAddress(addressRequest);

        encryptedSymmetricKeyBuyer = asymEngine.encrypt(symmetricKeyBuyer, otaResponse.bitcorePublicKey);
        encryptedSymmetricKeyInspector = asymEngine.encrypt(symmetricKeyInspector, otaResponse.bitcorePublicKey);

        utils.writeFormattedMessage("After generating OTA", addressRequest);

    })

    it('should encrypt data', () => {
        /**
         * Create a decrypt request object and populate the sample encrypted data
         */
        let requestEncrypt = new EncryptDataRequest();
        requestEncrypt.guid = addressRequest.guid;

        requestEncrypt.message = JSON.stringify({
            keys: [
                { key: encryptedSymmetricKeyBuyer, fields: ["buyer", "seller", "price", "quantity", "uom"] },
                { key: encryptedSymmetricKeyInspector, fields: ["commodity", "apiGravity"] }
            ],
            data: {
                buyer: 'Mercuria',
                seller: 'Shell',
                price: '55',
                quantity: '100000',
                uom: 'BBL',
                commodity: 'Brent',
                apiGravity: '38.5'
            }
        });

        requestEncrypt.signature = senderWallet.signMessage(requestEncrypt.message);
        /**
        * Invoke the encrypt data method here
        */

        utils.writeFormattedMessage("Before encrypting data", requestEncrypt.message);

        responseEncrypt = obfuscator.encryptData(requestEncrypt);

        utils.writeFormattedMessage("Response data", responseEncrypt.data);

    });

    it('should decrypt data', () => {
        /**
         * Create a decrypt request object and populate the sample encrypted data
         */
        let requestDecrypt = new DecryptDataRequest();
        requestDecrypt.guid = addressRequest.guid;

        requestDecrypt.message = JSON.stringify({
            keys: [
                { key: encryptedSymmetricKeyBuyer, fields: ["buyer", "seller", "price", "quantity", "uom"] },
                { key: encryptedSymmetricKeyInspector, fields: ["commodity", "apiGravity"] }
            ],
            data: {
                buyer: responseEncrypt.data["buyer"],
                seller: responseEncrypt.data["seller"],
                price: responseEncrypt.data["price"],
                quantity: responseEncrypt.data["quantity"],
                uom: responseEncrypt.data["uom"],
                commodity: responseEncrypt.data["commodity"],
                apiGravity: responseEncrypt.data["apiGravity"]
            }
        });

        requestDecrypt.signature = senderWallet.signMessage(requestDecrypt.message);
        /**
        * Invoke the decrypt data method here
        */

        utils.writeFormattedMessage("Before decrypting data", requestDecrypt.message);

        let responseDecrypt = obfuscator.decryptData(requestDecrypt);

        responseDecrypt.data["buyer"].should.equal("Mercuria");
        responseDecrypt.data["apiGravity"].should.equal("38.5");
    });

    it('should grant access to a new party', () => {

        /**
         * Create a new OTA for the requesting party
         */
        let partyAddressRequest = new OneTimeAddressRequest();
        partyAddressRequest.guid = Guid.create().toString();
        partyAddressRequest.message = JSON.stringify({
            guid: partyAddressRequest.guid,
            companyName: "Acme Inspections",
            signerName: "David Smith"
        });

        partyAddressRequest.signature = senderWallet.signMessage(partyAddressRequest.message);
        let partyOtaResponse = obfuscator.getOnetimeAddress(partyAddressRequest);

        let requestGrantAccess = new GrantAccessRequest(addressRequest.guid);
        requestGrantAccess.accessibleSymmetricKey = encryptedSymmetricKeyInspector;
        requestGrantAccess.message = "Signed message";
        requestGrantAccess.partyBitcorePublicKey = partyOtaResponse.bitcorePublicKey;

        requestGrantAccess.signature = senderWallet.signMessage(requestGrantAccess.message);

        let responseGrantAccess = obfuscator.grantAccess(requestGrantAccess);

        //decrypt the data using the newly created encrypted symmetric key
        let requestDecrypt = new DecryptDataRequest();
        requestDecrypt.guid = partyAddressRequest.guid;

        requestDecrypt.message = JSON.stringify({
            keys: [
                { key: responseGrantAccess.partyEncryptedSymmetricKey, fields: ["commodity", "apiGravity"] }
            ],
            data: {
                commodity: responseEncrypt.data["commodity"],
                apiGravity: responseEncrypt.data["apiGravity"]
            }
        });

        requestDecrypt.signature = senderWallet.signMessage(requestDecrypt.message);
        /**
        * Invoke the decrypt data method here
        */

        utils.writeFormattedMessage("Before decrypting grant access data", requestDecrypt.message);

        let responseDecrypt = obfuscator.decryptData(requestDecrypt);

        responseDecrypt.data["commodity"].should.equal("Brent");
        responseDecrypt.data["apiGravity"].should.equal("38.5");

        utils.writeFormattedMessage("Decrypted data by grant access", responseDecrypt.data);

    });
});
