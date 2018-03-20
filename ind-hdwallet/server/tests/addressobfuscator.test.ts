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
        let messageObject = {
            guid: Guid.create().toString(),
            companyName: "Shell Corporation"
        };

        addressRequest.message = JSON.stringify(messageObject);

        addressRequest.signature = senderWallet.signMessage(addressRequest.message);
        addressRequest.messageObject = messageObject;

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
    let guidString = Guid.create().toString();
    let messageObject = {
        guid: guidString,
        companyName: "Shell Corporation"
    };

    before(() => {
        addressRequest.message = JSON.stringify(messageObject);
        addressRequest.signature = senderWallet.signMessage(addressRequest.message);
        addressRequest.messageObject = messageObject;

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
        let encryptMessageObject = {
            guid: guidString,
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
            },
            companyName: "Shell Corporation"
        };

        requestEncrypt.message = JSON.stringify(encryptMessageObject);
        requestEncrypt.signature = senderWallet.signMessage(requestEncrypt.message);
        requestEncrypt.messageObject = encryptMessageObject;

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
        let decryptMessageObject = {
            guid: guidString,
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
            },
            companyName: "Shell Corporation"
        };

        requestDecrypt.message = JSON.stringify(decryptMessageObject);
        requestDecrypt.signature = senderWallet.signMessage(requestDecrypt.message);
        requestDecrypt.messageObject = decryptMessageObject;

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
        let partyGuidString = Guid.create().toString();
        let grantAccessMessageObject = {
            guid: partyGuidString,
            companyName: "Acme Inspections"
        };
        partyAddressRequest.message = JSON.stringify(grantAccessMessageObject);
        partyAddressRequest.signature = senderWallet.signMessage(partyAddressRequest.message);
        partyAddressRequest.messageObject = grantAccessMessageObject;

        let partyOtaResponse = obfuscator.getOnetimeAddress(partyAddressRequest);

        let requestGrantAccess = new GrantAccessRequest();
        let requestGrantAccessMessageObject = {
            guid: guidString,
            accessibleSymmetricKey: encryptedSymmetricKeyInspector,
            partyOTAddress: partyOtaResponse.OTAddress,
            partyBitcorePublicKey: partyOtaResponse.bitcorePublicKey,
            contractAddress: "0x123456",
            companyName: "Acme Inspections"
        }
        requestGrantAccess.message = JSON.stringify(requestGrantAccessMessageObject);
        requestGrantAccess.signature = senderWallet.signMessage(requestGrantAccess.message);
        requestGrantAccess.messageObject = requestGrantAccessMessageObject;

        let responseGrantAccess = obfuscator.grantAccess(requestGrantAccess);

        //decrypt the data using the newly created encrypted symmetric key
        let requestDecrypt = new DecryptDataRequest();
        let decryptMessageObject = {
                                        guid: partyGuidString,
                                        keys: [
                                            { key: responseGrantAccess.partyEncryptedSymmetricKey, fields: ["commodity", "apiGravity"] }
                                        ],
                                        data: {
                                            commodity: responseEncrypt.data["commodity"],
                                            apiGravity: responseEncrypt.data["apiGravity"]
                                        },
                                        companyName: "Shell Corporation"
                                    };

        requestDecrypt.message = JSON.stringify(decryptMessageObject);
        requestDecrypt.signature = senderWallet.signMessage(requestDecrypt.message);
        requestDecrypt.messageObject = decryptMessageObject;
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
