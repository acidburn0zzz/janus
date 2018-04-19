import * as ethers from "ethers";
import * as mocha from 'mocha';
import * as chai from 'chai';
import { Guid } from 'guid-typescript';

import * as indCommon from 'ind-common';
import { AddressObfuscatorOptions, AddressObfuscator } from '../script/addressobfuscator';
import { SmartContractService } from '../services/smart-contract-service';

const expect = chai.expect;
const should = chai.should();
const ethersUtils = ethers.utils;


describe('address obfuscator', () => {

    it('should return a one time address for a given guid', () => {

        let options: AddressObfuscatorOptions = {
            blockchainProvider: "http://forcefield01.uksouth.cloudapp.azure.com:8545",
            contractsPath: "c:\\Forcefield\\Privy\\Contracts\\build",
            oracleServiceUri: "uri",
            vaultServiceUri: "vault"
        };

        let obfuscator = new AddressObfuscator(options);
        let addressRequest = new indCommon.OneTimeAddressRequest();
        let senderWallet = ethers.Wallet.createRandom();
        let messageObject = {
            guid: Guid.create().toString(),
            companyName: "Shell Corporation"
        };

        addressRequest.message = JSON.stringify(messageObject);

        addressRequest.signature = senderWallet.signMessage(addressRequest.message);
        addressRequest.messageObject = messageObject;

        let response = obfuscator.getOnetimeAddress(addressRequest);

        (new indCommon.Utils()).writeFormattedMessage("getOneTimeAddress Response", response);

        response.error.should.equal("OK");
        response.OTAddress.length.should.greaterThan(0);
    });
});

describe('encrypt decrypt methods', () => {

    /**
     * get the one time address for this test
     */
    let options: AddressObfuscatorOptions = {
        blockchainProvider: "http://forcefield01.uksouth.cloudapp.azure.com:8545",
        contractsPath: "c:\\Forcefield\\Privy\\Contracts\\build",
        oracleServiceUri: "uri",
        vaultServiceUri: "vault"
    };


    let obfuscator = new AddressObfuscator(options);
    let senderWallet = ethers.Wallet.createRandom();
    let addressRequest = new indCommon.OneTimeAddressRequest();

    let utils = new indCommon.Utils();
    let otaResponse;
    let responseEncrypt = new indCommon.EncryptDataResponse("");
    let symEngine = new indCommon.SymmetricKeyEncryption();
    let asymEngine = new indCommon.AsymmetricKeyEncryption();

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

        try {
            let requestEncrypt = new indCommon.EncryptDataRequest();
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
        }
        catch(error) {
            console.log(error);
        }
    });

    it('should decrypt data', () => {
        /**
         * Create a decrypt request object and populate the sample encrypted data
         */
        let requestDecrypt = new indCommon.DecryptDataRequest();
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
        let partyAddressRequest = new indCommon.OneTimeAddressRequest();
        let partyGuidString = Guid.create().toString();
        let grantAccessMessageObject = {
            guid: partyGuidString,
            companyName: "Acme Inspections"
        };
        partyAddressRequest.message = JSON.stringify(grantAccessMessageObject);
        partyAddressRequest.signature = senderWallet.signMessage(partyAddressRequest.message);
        partyAddressRequest.messageObject = grantAccessMessageObject;

        let partyOtaResponse = obfuscator.getOnetimeAddress(partyAddressRequest);

        let requestGrantAccess = new indCommon.GrantAccessRequest();
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
        let requestDecrypt = new indCommon.DecryptDataRequest();
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


describe('post transaction', () => {

    //create a sample request Object
    let utils = new indCommon.Utils();
    let senderWallet = ethers.Wallet.createRandom();

    let options: AddressObfuscatorOptions = {
        blockchainProvider: "http://forcefield01.uksouth.cloudapp.azure.com:8545",
        contractsPath: "c:\\Forcefield\\Privy\\Contracts\\build",
        oracleServiceUri: "uri",
        vaultServiceUri: "vault"
    };
    

    let obfuscator = new AddressObfuscator(options);

    let addressRequest = new indCommon.OneTimeAddressRequest();
    let messageObject = {
        guid: "9d6f99ce-f3ee-7c16-b729-038857d338ce",
        companyName: "Shell Corporation"
    };

    addressRequest.message = JSON.stringify(messageObject);

    addressRequest.signature = senderWallet.signMessage(addressRequest.message);
    addressRequest.messageObject = messageObject;

    let response = obfuscator.getOnetimeAddress(addressRequest);

    it('should update data in a contract', async () => {
        let request: indCommon.PostTransactionRequest = new indCommon.PostTransactionRequest();



        request.data = {
            guid: messageObject.guid,
            tradeDate: "12/20/2017",
            qty: "100000",
            product: "WTI",
            price: "55.0",
            paymentTerm: "FOB",
            messageHash: ""
        };

        request.Signature = "";

        request.otherInfo = {
            factoryAddress: "0x7904adfd948f5f99a987a86768f5decc1aecdea2",
            contractName: "Trade",
            functionList: [
                "updateData"
            ],
            updateData: [
                1,
                "tradeDate",
                "product",
                "qty",
                "price"
            ]
        };


        let utf8Bytes = ethersUtils.toUtf8Bytes(JSON.stringify(request.otherInfo));
        request.data.messageHash = ethersUtils.keccak256(utf8Bytes);
        request.signature = senderWallet.signMessage(JSON.stringify(request.data));

        let txnReceipt = await obfuscator.postTransaction(request);

    });
    
    //it('should update payment terms in a contract', async () => {
    //    let request: indCommon.PostTransactionRequest = new indCommon.PostTransactionRequest();

    //    request.data = {
    //        guid: messageObject.guid,
    //        paymentTerm: "FOB",
    //        messageHash: ""
    //    };

    //    request.Signature = "";

    //    request.otherInfo = {
    //        factoryAddress: "0x7904adfd948f5f99a987a86768f5decc1aecdea2",
    //        contractName: "Trade",
    //        functionList: [
    //            "updatePaymentInfo"
    //        ],
    //        updatePaymentInfo: [
    //            1,
    //            "paymentTerm",
    //        ]
    //    };


    //    let utf8Bytes = ethersUtils.toUtf8Bytes(JSON.stringify(request.otherInfo));
    //    request.data.messageHash = ethersUtils.keccak256(utf8Bytes);
    //    request.signature = senderWallet.signMessage(JSON.stringify(request.data));

    //    let txReceipt = await obfuscator.postTransaction(request, new abiLoader.SendTransactionProperties());

    //});

});
