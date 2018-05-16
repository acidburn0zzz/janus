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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@manosamy/janus-common/build/common/utils");
var models_1 = require("@manosamy/janus-common/build/common/models");
var Constants = require("@manosamy/janus-common/build/common/constants");
var asymmetrickey_encryption_1 = require("@manosamy/janus-common/build/common/asymmetrickey-encryption");
var symmetrickey_encryption_1 = require("@manosamy/janus-common/build/common/symmetrickey-encryption");
var ethers = require("ethers");
var cachingService = require("../services/wallet-caching-service");
var vaultService = require("../services/secure-enclave-service");
var smart_contract_service_1 = require("../services/smart-contract-service");
var ethersUtils = ethers.utils;
var walletObject = ethers.Wallet;
var providers = ethers.providers;
var utils = new utils_1.Utils();
var addressIndex = -1;
/*
    For a given GUID, this class generates a one time deterministic wallet. The generated one time wallet
    will be cached using the WalletCaching Service
*/
var AddressObfuscator = /** @class */ (function () {
    function AddressObfuscator(options) {
        this.walletCache = new cachingService.WalletCachingService();
        this.secureEnclave = new vaultService.SecureEnclaveService();
        if (options.contractsPath.length == 0 || options.abiPath.length == 0 || options.blockchainProvider.length == 0 ||
            options.oracleServiceUri.length == 0 || options.vaultServiceUri.length == 0)
            throw Constants.errorObfuscatorOptionsEmpty;
        this.smartContractService = smart_contract_service_1.SmartContractService.getInstance(options.contractsPath, options.abiPath, options.blockchainProvider);
    }
    /**
     * for a given guid, this method returns a one time address generated using a HD wallet. If the address
     already exists in the cache, the existing address is returned
     * @param request
     */
    AddressObfuscator.prototype.getOnetimeAddress = function (request) {
        var response = new models_1.OneTimeAddressResponse(request.messageObject.guid);
        try {
            //verify if the signature on the message matches
            var verifiedAddress = this.verifyPayload(request.message, request.signature);
            if (verifiedAddress === Constants.errorInvalidSignature) {
                response.error = Constants.errorInvalidSignature;
                return response;
            }
            var otaData = this.walletCache.getOneTimeAddress(request.messageObject.guid);
            if (otaData == null) {
                //we did not find the OTA. So lets create a new one
                var walletPath = this.getNextAddressPath();
                //Create a new wallet object from a given mnemonic.
                var wallet = walletObject.fromMnemonic(this.getMnemonic(request.messageObject.companyName), walletPath);
                var bitcorePublicKey = utils.bitcorePublicKey(wallet.privateKey);
                otaData = new models_1.OneTimeAddressData(wallet.address, walletPath, bitcorePublicKey, request.messageObject.companyName, request.messageObject.guid);
                this.walletCache.saveOneTimeAddress(otaData);
            }
            response.OTAddress = otaData.OTAddress.toLowerCase();
            response.bitcorePublicKey = otaData.bitcorePublicKey;
            response.encryptedSymmetricKey = otaData.encryptedSymmetricKey;
        }
        catch (error) {
            console.log(error);
            //something bombed. return error
            response.error = Constants.errorOTAGenFailed + ": " + error;
        }
        return response;
    };
    /**
     * decrypts the data using the wallet that the request guid id associated with
     * @param request
     */
    AddressObfuscator.prototype.decryptData = function (request) {
        var response = new models_1.DecryptDataResponse(request.messageObject.guid);
        try {
            //get the otadata object for the specified guid
            var otaData = this.walletCache.getOneTimeAddress(request.messageObject.guid);
            if (otaData == null) {
                response.error = Constants.errorRequestOtaFailed;
                return response;
            }
            //verify the message signature and get the public address of the signer
            var verifiedAddress = this.verifyPayload(request.message, request.signature);
            if (verifiedAddress === Constants.errorInvalidSignature) {
                response.error = Constants.errorInvalidSignature;
                return response;
            }
            var asymEncryp_1 = new asymmetrickey_encryption_1.AsymmetricKeyEncryption();
            var symEncryp_1 = new symmetrickey_encryption_1.SymmetricKeyEncryption();
            var wallet_1 = this.getWallet(otaData.signerCompany, otaData.walletPath);
            //decrypt the data that is in the message object
            request.messageObject.keys.forEach(function (element) {
                console.log("key = ", element.key);
                //decrypt the symmetric key here
                var decryptedSymmetricKey = asymEncryp_1.decrypt(element.key, wallet_1.privateKey);
                element.fields.forEach(function (field) {
                    console.log(field, "=", request.messageObject.data[field]);
                    //decrypt the data using the decrypted symmetric key here
                    response.data[field] = symEncryp_1.decrypt(request.messageObject.data[field], decryptedSymmetricKey);
                });
            });
        }
        catch (error) {
            utils.writeFormattedMessage("Error while decrypting data", error);
            //something bombed. return error
            response.error = Constants.errorDecryptionFailed + ": " + error;
        }
        return response;
    };
    /**
     * For a given set of data, this method encrypts the data using the symmetric key passed in the request
     * @param request
     */
    AddressObfuscator.prototype.encryptData = function (request) {
        var response = new models_1.EncryptDataResponse(request.messageObject.guid);
        try {
            //get the otadata object for the specified guid
            var otaData = this.walletCache.getOneTimeAddress(request.messageObject.guid);
            if (otaData == null) {
                response.error = Constants.errorRequestOtaFailed;
                return response;
            }
            //verify the message signature and get the public address of the signer
            var verifiedAddress = this.verifyPayload(request.message, request.signature);
            if (verifiedAddress === Constants.errorInvalidSignature) {
                response.error = Constants.errorInvalidSignature;
                return response;
            }
            var asymEncryp_2 = new asymmetrickey_encryption_1.AsymmetricKeyEncryption();
            var symEncryp_2 = new symmetrickey_encryption_1.SymmetricKeyEncryption();
            var wallet_2 = this.getWallet(otaData.signerCompany, otaData.walletPath);
            //encrypt the data that is in the message object
            request.messageObject.keys.forEach(function (element) {
                console.log("key = ", element.key);
                //decrypt the symmetric key here
                var decryptedSymmetricKey = asymEncryp_2.decrypt(element.key, wallet_2.privateKey);
                element.fields.forEach(function (field) {
                    console.log(field, "=", request.messageObject.data[field]);
                    //encrypt the data using the decrypted symmetric key here
                    response.data[field] = symEncryp_2.encrypt(request.messageObject.data[field], decryptedSymmetricKey);
                });
            });
        }
        catch (error) {
            utils.writeFormattedMessage("Error while encrypting data", error);
            response.error = Constants.errorEncryptionFailed + ": " + error;
        }
        return response;
    };
    /**
     *
     * @param request
     */
    AddressObfuscator.prototype.grantAccess = function (request, grantAccessProperties) {
        return __awaiter(this, void 0, void 0, function () {
            var response, verifiedAddress, utf8Bytes, messageHash, otaData, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        utils.writeFormattedMessage("Inside grantAccess", grantAccessProperties);
                        response = new models_1.GrantAccessResponse(request.data.guid);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        verifiedAddress = this.verifyPayload(JSON.stringify(request.data), request.signature);
                        if (verifiedAddress === Constants.errorInvalidSignature) {
                            response.error = Constants.errorInvalidSignature;
                            return [2 /*return*/, response];
                        }
                        utf8Bytes = ethersUtils.toUtf8Bytes(JSON.stringify(request.otherInfo));
                        messageHash = ethersUtils.keccak256(utf8Bytes);
                        if (messageHash != request.data.messageHash) {
                            response.error = Constants.errorInvalidHash;
                            return [2 /*return*/, response];
                        }
                        otaData = this.walletCache.getOneTimeAddress(request.data.guid);
                        if (otaData == null) {
                            response.error = Constants.errorRequestOtaFailed;
                            return [2 /*return*/, response];
                        }
                        grantAccessProperties.guid = request.data.guid;
                        grantAccessProperties.factoryAddress = request.otherInfo.factoryAddress;
                        grantAccessProperties.methodName = request.otherInfo.methodName;
                        grantAccessProperties.contractName = request.otherInfo.contractName;
                        grantAccessProperties.partyIndex = request.otherInfo.partyIndex;
                        grantAccessProperties.otherPartyIndex = request.otherInfo.otherPartyIndex;
                        grantAccessProperties.partyCompanyName = request.otherInfo.partyCompanyName;
                        grantAccessProperties.otherPartyCompanyName = request.otherInfo.otherPartyCompanyName;
                        //grantAccessProperties.oneTimeAddress = otaData.OTAddress;
                        grantAccessProperties.signingWallet = this.getWallet(otaData.signerCompany, otaData.walletPath);
                        _a = response;
                        return [4 /*yield*/, this.smartContractService.grantAccess(grantAccessProperties)];
                    case 2:
                        _a.accessibleSymmetricKeys = (_b.sent());
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        utils.writeFormattedMessage("Error while granting access", error_1);
                        response.error = Constants.errorEncryptionFailed + ": " + error_1;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    AddressObfuscator.prototype.postTransaction = function (request, postTxnProperties) {
        return __awaiter(this, void 0, void 0, function () {
            var response, otaData, property, i, fn, txnReceipt, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = new models_1.PostTransactionResponse({ guid: request.data.guid, transactionHash: [] });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        otaData = this.walletCache.getOneTimeAddress(request.data.guid);
                        if (otaData == null) {
                            response.error = Constants.errorRequestOtaFailed;
                            return [2 /*return*/, response];
                        }
                        for (property in request.data) {
                            if (request.data.hasOwnProperty(property)) {
                                if (property == "guid" || property == "messageHash")
                                    continue;
                                postTxnProperties.data[property] = request.data[property];
                            }
                        }
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < request.transactionInfo.functionList.length)) return [3 /*break*/, 5];
                        fn = request.transactionInfo.functionList[i];
                        utils.writeFormattedMessage("Function data", fn);
                        postTxnProperties.guid = request.data.guid;
                        postTxnProperties.factoryAddress = request.transactionInfo.factoryAddress;
                        postTxnProperties.methodName = fn.name;
                        postTxnProperties.contractName = request.transactionInfo.contractName;
                        //postTxnProperties.oneTimeAddress = "0xac39b311dceb2a4b2f5d8461c1cdaf756f4f7ae9";
                        postTxnProperties.oneTimeAddress = otaData.OTAddress;
                        postTxnProperties.symmetricKeyIndex = parseInt(fn.params[0], 10);
                        postTxnProperties.parameters = fn.params.slice(1);
                        postTxnProperties.signingWallet = this.getWallet(otaData.signerCompany, otaData.walletPath);
                        return [4 /*yield*/, this.smartContractService.sendTransaction(postTxnProperties)];
                    case 3:
                        txnReceipt = _a.sent();
                        response.transactionHash.push(txnReceipt);
                        utils.writeFormattedMessage("Transaction receipt for " + fn, txnReceipt);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        utils.writeFormattedMessage("Error inside postTransaction", error_2);
                        response.error = Constants.errorPostTransaction;
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, response];
                }
            });
        });
    };
    //private methods
    /**
     * gets the hd wallet address path using the next index in the sequence
     */
    AddressObfuscator.prototype.getNextAddressPath = function () {
        //Increment the address index
        addressIndex = addressIndex + 1;
        //return the hd wallet path to the new index
        return "m/44'/60'/0'/0/" + addressIndex;
    };
    /**
     * This method returns the mnemonic string used in the hd wallet for a specific requesting entity
     The mnemonic should have a secure vault from which to read.
     * @param companyName
     */
    AddressObfuscator.prototype.getMnemonic = function (companyName) {
        return this.secureEnclave.getMnemonic(companyName);
    };
    /**
     * for a given company name and wallet path, this method returns the deterministic wallet
     * @param companyName
     * @param walletPath
     */
    AddressObfuscator.prototype.getWallet = function (companyName, walletPath) {
        var wallet = walletObject.fromMnemonic(this.getMnemonic(companyName), walletPath);
        return wallet;
    };
    /**
     * for a given message and signature, this method returns the public address
     pf the wallet that was used to sign this message
     * @param message
     * @param signature
     */
    AddressObfuscator.prototype.verifyPayload = function (message, signature) {
        try {
            //verify the original message was signed by the party
            var signerAddress = walletObject.verifyMessage(message, signature);
            //TODO: verify permission of the address from the smart contract
            //return the signer address
            return signerAddress;
        }
        catch (error) {
            console.log(error);
            //something bombed. return error
            return Constants.errorInvalidSignature;
        }
    };
    return AddressObfuscator;
}());
exports.AddressObfuscator = AddressObfuscator;
//# sourceMappingURL=addressobfuscator.js.map