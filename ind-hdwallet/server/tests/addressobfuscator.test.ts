import * as ethers from "ethers";
import * as mocha from 'mocha';
import * as chai from 'chai';
import { Guid } from 'guid-typescript';

//import * as indCommon from 'ind-common';
import * as Constants from 'ind-common/build/common/constants';
import { Utils } from 'ind-common/build/common/utils';
import {
    OneTimeAddressRequest, OneTimeAddressResponse, OneTimeAddressData, DecryptDataRequest, DecryptDataResponse,
    EncryptDataRequest, EncryptDataResponse, GrantAccessRequest, GrantAccessResponse, PostTransactionRequest, PostTransactionResponse,
    TransactionData, FunctionInfo, TransactionInfo
} from 'ind-common/build/common/models';

import { AsymmetricKeyEncryption } from 'ind-common/build/common/asymmetrickey-encryption';
import { SymmetricKeyEncryption } from 'ind-common/build/common/symmetrickey-encryption';

import { AddressObfuscatorOptions, AddressObfuscator } from '../script/addressobfuscator';
import { SmartContractService, SendTransactionProperties, GrantAccessProperties } from '../services/smart-contract-service';

const expect = chai.expect;
const should = chai.should();
const ethersUtils = ethers.utils;


describe('address obfuscator', () => {

    it('should return a one time address for a given guid', () => {

        let options: AddressObfuscatorOptions = {
            blockchainProvider: "http://forcefield01.uksouth.cloudapp.azure.com:8545",
            contractsPath: "c:\\Forcefield\\Privy\\Contracts\\build",
            abiPath: "c:\\Forcefield\\Privy\\Contracts\\abi",
            oracleServiceUri: "uri",
            vaultServiceUri: "vault"
        };

        let obfuscator = new AddressObfuscator(options);
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
    let options: AddressObfuscatorOptions = {
        blockchainProvider: "http://forcefield01.uksouth.cloudapp.azure.com:8545",
        contractsPath: "c:\\Forcefield\\Privy\\Contracts\\build",
        abiPath: "c:\\Forcefield\\Privy\\Contracts\\abi",
        oracleServiceUri: "uri",
        vaultServiceUri: "vault"
    };


    let obfuscator = new AddressObfuscator(options);
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

        try {
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
        }
        catch(error) {
            console.log(error);
        }
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
});


describe('execute transactions', () => {


    //create a sample request Object
    let utils = new Utils();
    let senderWallet = ethers.Wallet.createRandom();

    let options: AddressObfuscatorOptions = {
        blockchainProvider: "http://forcefield01.uksouth.cloudapp.azure.com:8545",
        contractsPath: "c:\\Forcefield\\Privy\\Contracts\\build",
        abiPath: "c:\\Forcefield\\Privy\\Contracts\\abi",
        oracleServiceUri: "uri",
        vaultServiceUri: "vault"
    };

    
    let obfuscator = new AddressObfuscator(options);

    let addressRequest = new OneTimeAddressRequest();
    let messageObject = {
        guid: "9d6f99ce-f3ee-7c16-b729-038857d338ce",
        companyName: "Shell Corporation"
    };

    addressRequest.message = JSON.stringify(messageObject);

    addressRequest.signature = senderWallet.signMessage(addressRequest.message);
    addressRequest.messageObject = messageObject;

    let response = obfuscator.getOnetimeAddress(addressRequest);

    it('should update data in a contract', async function() {
        this.timeout(0);

        let request: PostTransactionRequest = new PostTransactionRequest({});

        let postTxnProperties: SendTransactionProperties = new SendTransactionProperties();

        let transactionData = new TransactionData({});
        transactionData.guid = messageObject.guid;
        transactionData.businessData = {
            tradeDate: "12/20/2017",
            qty: "100000",
            product: "WTI",
            price: "55.0",
            paymentTerm: "FOB",
        };

        request.data = transactionData;

        request.signature = "";

        let functionInfo: FunctionInfo = new FunctionInfo({});
        functionInfo.name = "updateData";
        functionInfo.params = ["1", "tradeDate", "product", "qty", "price"];

        request.transactionInfo = {
            factoryAddress: "0x7904adfd948f5f99a987a86768f5decc1aecdea2",
            marketplaceAddress: "",
            contractName: "Trade",
            functionList: [functionInfo]
        };


        let utf8Bytes = ethersUtils.toUtf8Bytes(JSON.stringify(request.transactionInfo));
        request.data.messageHash = ethersUtils.keccak256(utf8Bytes);
        request.signature = senderWallet.signMessage(JSON.stringify(request.data));

        //we are injecting the postTxnProperties because the end user might use a different implementation
        let txnReceipt = await obfuscator.postTransaction(request, postTxnProperties);

    });

    it('should update payment terms in a contract', async () => {
        this.timeout(0);

        let request: PostTransactionRequest = new PostTransactionRequest({});

        let postTxnProperties: SendTransactionProperties = new SendTransactionProperties();

        let transactionData = new TransactionData({});
        transactionData.guid = messageObject.guid;
        transactionData.businessData = {
            paymentTerm: "FOB",
        };

        request.data = transactionData;

        request.signature = "";

        let functionInfo: FunctionInfo = new FunctionInfo({});
        functionInfo.name = "updatePaymentInfo";
        functionInfo.params = ["1", "paymentTerm"];

        request.transactionInfo = {
            factoryAddress: "0x7904adfd948f5f99a987a86768f5decc1aecdea2",
            marketplaceAddress: "",
            contractName: "Trade",
            functionList: [functionInfo]
        };


        let utf8Bytes = ethersUtils.toUtf8Bytes(JSON.stringify(request.transactionInfo));
        request.data.messageHash = ethersUtils.keccak256(utf8Bytes);
        request.signature = senderWallet.signMessage(JSON.stringify(request.data));

        //we are injecting the postTxnProperties because the end user might use a different implementation
        let txnReceipt = await obfuscator.postTransaction(request, postTxnProperties);

    });
});
