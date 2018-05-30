"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var ethers = require("ethers");
var chai = require("chai");
var guid_typescript_1 = require("guid-typescript");
var utils_1 = require("@manosamy/janus-common/build/common/utils");
var models_1 = require("@manosamy/janus-common/build/common/models");
var asymmetrickey_encryption_1 = require("@manosamy/janus-common/build/common/asymmetrickey-encryption");
var symmetrickey_encryption_1 = require("@manosamy/janus-common/build/common/symmetrickey-encryption");
var addressobfuscator_1 = require("../script/addressobfuscator");
var smart_contract_service_1 = require("../services/smart-contract-service");
var expect = chai.expect;
var should = chai.should();
var ethersUtils = ethers.utils;
describe('address obfuscator', function () {
    it('should return a one time address for a given guid', function () {
        var options = {
            blockchainProvider: "http://forcefield01.uksouth.cloudapp.azure.com:8545",
            contractsPath: "C:\\Code\\BlockChain\\privy\\Contracts\\build",
            abiPath: "C:\\Code\\BlockChain\\privy\\Contracts\\abi",
            oracleServiceUri: "uri",
            vaultServiceUri: "vault"
        };
        var obfuscator = new addressobfuscator_1.AddressObfuscator(options);
        var addressRequest = new models_1.OneTimeAddressRequest();
        var senderWallet = ethers.Wallet.createRandom();
        var messageObject = {
            guid: guid_typescript_1.Guid.create().toString(),
            companyName: "Shell Corporation"
        };
        addressRequest.message = JSON.stringify(messageObject);
        addressRequest.signature = senderWallet.signMessage(addressRequest.message);
        addressRequest.messageObject = messageObject;
        var response = obfuscator.getOnetimeAddress(addressRequest);
        (new utils_1.Utils()).writeFormattedMessage("getOneTimeAddress Response", response);
        response.error.should.equal("OK");
        response.OTAddress.length.should.greaterThan(0);
    });
});
describe('encrypt decrypt methods', function () {
    /**
     * get the one time address for this test
     */
    var options = {
        blockchainProvider: "http://forcefield01.uksouth.cloudapp.azure.com:8545",
        contractsPath: "C:\\Code\\BlockChain\\privy\\Contracts\\build",
        abiPath: "C:\\Code\\BlockChain\\privy\\Contracts\\abi",
        oracleServiceUri: "uri",
        vaultServiceUri: "vault"
    };
    var obfuscator = new addressobfuscator_1.AddressObfuscator(options);
    var senderWallet = ethers.Wallet.createRandom();
    var addressRequest = new models_1.OneTimeAddressRequest();
    var utils = new utils_1.Utils();
    var otaResponse;
    var responseEncrypt = new models_1.EncryptDataResponse("");
    var symEngine = new symmetrickey_encryption_1.SymmetricKeyEncryption();
    var asymEngine = new asymmetrickey_encryption_1.AsymmetricKeyEncryption();
    var symmetricKeyBuyer = symEngine.generateSymKey();
    var symmetricKeyInspector = symEngine.generateSymKey();
    var encryptedSymmetricKeyBuyer;
    var encryptedSymmetricKeyInspector;
    var guidString = guid_typescript_1.Guid.create().toString();
    var messageObject = {
        guid: guidString,
        companyName: "Shell Corporation"
    };
    before(function () {
        addressRequest.message = JSON.stringify(messageObject);
        addressRequest.signature = senderWallet.signMessage(addressRequest.message);
        addressRequest.messageObject = messageObject;
        otaResponse = obfuscator.getOnetimeAddress(addressRequest);
        encryptedSymmetricKeyBuyer = asymEngine.encrypt(symmetricKeyBuyer, otaResponse.bitcorePublicKey);
        encryptedSymmetricKeyInspector = asymEngine.encrypt(symmetricKeyInspector, otaResponse.bitcorePublicKey);
        utils.writeFormattedMessage("After generating OTA", addressRequest);
    });
    it('should encrypt data', function () {
        /**
         * Create a decrypt request object and populate the sample encrypted data
         */
        try {
            var requestEncrypt = new models_1.EncryptDataRequest();
            var encryptMessageObject = {
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
        catch (error) {
            console.log(error);
        }
    });
    it('should decrypt data', function () {
        /**
         * Create a decrypt request object and populate the sample encrypted data
         */
        var requestDecrypt = new models_1.DecryptDataRequest();
        var decryptMessageObject = {
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
        var responseDecrypt = obfuscator.decryptData(requestDecrypt);
        responseDecrypt.data["buyer"].should.equal("Mercuria");
        responseDecrypt.data["apiGravity"].should.equal("38.5");
    });
});
describe('execute transactions', function () {
    //create a sample request Object
    var utils = new utils_1.Utils();
    var senderWallet = ethers.Wallet.createRandom();
    var options = {
        blockchainProvider: "http://forcefield01.uksouth.cloudapp.azure.com:8545",
        contractsPath: "C:\\Code\\BlockChain\\privy\\Contracts\\build",
        abiPath: "C:\\Code\\BlockChain\\privy\\Contracts\\abi",
        oracleServiceUri: "uri",
        vaultServiceUri: "vault"
    };
    var obfuscator = new addressobfuscator_1.AddressObfuscator(options);
    var addressRequest = new models_1.OneTimeAddressRequest();
    var messageObject = {
        guid: "9d6f99ce-f3ee-7c16-b729-038857d338ce",
        companyName: "Shell Corporation"
    };
    addressRequest.message = JSON.stringify(messageObject);
    addressRequest.signature = senderWallet.signMessage(addressRequest.message);
    addressRequest.messageObject = messageObject;
    var response = obfuscator.getOnetimeAddress(addressRequest);
    it('should update data in a contract', function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, postTxnProperties, transactionData, functionInfo, utf8Bytes, txnReceipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(0);
                        request = new models_1.PostTransactionRequest({});
                        postTxnProperties = new smart_contract_service_1.SendTransactionProperties();
                        transactionData = new models_1.TransactionData({});
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
                        functionInfo = new models_1.FunctionInfo({});
                        functionInfo.name = "updateData";
                        functionInfo.params = ["1", "tradeDate", "product", "qty", "price"];
                        request.transactionInfo = {
                            factoryAddress: "0x7904adfd948f5f99a987a86768f5decc1aecdea2",
                            marketplaceAddress: "",
                            contractName: "Trade",
                            functionList: [functionInfo]
                        };
                        utf8Bytes = ethersUtils.toUtf8Bytes(JSON.stringify(request.transactionInfo));
                        request.data.messageHash = ethersUtils.keccak256(utf8Bytes);
                        request.signature = senderWallet.signMessage(JSON.stringify(request.data));
                        return [4 /*yield*/, obfuscator.postTransaction(request, postTxnProperties)];
                    case 1:
                        txnReceipt = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should update payment terms in a contract', function () { return __awaiter(_this, void 0, void 0, function () {
        var request, postTxnProperties, transactionData, functionInfo, utf8Bytes, txnReceipt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.timeout(0);
                    request = new models_1.PostTransactionRequest({});
                    postTxnProperties = new smart_contract_service_1.SendTransactionProperties();
                    transactionData = new models_1.TransactionData({});
                    transactionData.guid = messageObject.guid;
                    transactionData.businessData = {
                        paymentTerm: "FOB",
                    };
                    request.data = transactionData;
                    request.signature = "";
                    functionInfo = new models_1.FunctionInfo({});
                    functionInfo.name = "updatePaymentInfo";
                    functionInfo.params = ["1", "paymentTerm"];
                    request.transactionInfo = {
                        factoryAddress: "0x7904adfd948f5f99a987a86768f5decc1aecdea2",
                        marketplaceAddress: "",
                        contractName: "Trade",
                        functionList: [functionInfo]
                    };
                    utf8Bytes = ethersUtils.toUtf8Bytes(JSON.stringify(request.transactionInfo));
                    request.data.messageHash = ethersUtils.keccak256(utf8Bytes);
                    request.signature = senderWallet.signMessage(JSON.stringify(request.data));
                    return [4 /*yield*/, obfuscator.postTransaction(request, postTxnProperties)];
                case 1:
                    txnReceipt = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=addressobfuscator.test.js.map