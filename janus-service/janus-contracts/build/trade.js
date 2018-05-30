"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var ethers = require("ethers");
var utils_1 = require("@manosamy/janus-common/build/common/utils");
var asymmetrickey_encryption_1 = require("@manosamy/janus-common/build/common/asymmetrickey-encryption");
var symmetrickey_encryption_1 = require("@manosamy/janus-common/build/common/symmetrickey-encryption");
var base_contract_1 = require("./base-contract");
var tradefactory_1 = require("./tradefactory");
var ethersUtils = ethers.utils;
var walletObject = ethers.Wallet;
var Web3 = require("web3");
var Tx = require('ethereumjs-tx');
var utils = new utils_1.Utils();
var Trade = /** @class */ (function (_super) {
    __extends(Trade, _super);
    function Trade(abiPath, provider) {
        var _this = _super.call(this, abiPath, provider) || this;
        _this.getWeb3();
        return _this;
    }
    Trade.prototype.getContract = function (guid, factoryAddress, signingWalletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var tradeString, tradeFactoryContract, tradeAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.trade) return [3 /*break*/, 2];
                        utils.writeFormattedMessage("Inside Trade getContract", { guid: guid, facAddress: factoryAddress, walletAddress: signingWalletAddress });
                        tradeString = this.loadAbi("Trade", this.abiPath);
                        this.tradeAbi = JSON.parse(tradeString);
                        this.trade = new this.web3.eth.Contract(this.tradeAbi.abi);
                        tradeFactoryContract = new tradefactory_1.TradeFactory(this.abiPath, this.provider);
                        return [4 /*yield*/, tradeFactoryContract.getContract(guid, factoryAddress, signingWalletAddress)];
                    case 1:
                        tradeAddress = _a.sent();
                        this.trade.options.address = tradeAddress;
                        utils.writeFormattedMessage("Trade Address", tradeAddress);
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.trade];
                }
            });
        });
    };
    Trade.prototype.getAccessibleSymmetricKeyForParty = function (guid, factoryAddress, signingAddress, symmetricKeyIndex, partyOneTimeAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var tradeContract, symmetricKey, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getContract(guid, factoryAddress, signingAddress)];
                    case 1:
                        tradeContract = _a.sent();
                        utils.writeFormattedMessage("Symmetric key for trade with Guid", guid);
                        return [4 /*yield*/, tradeContract.methods.getAccessibleSymmetricKeyForParty(partyOneTimeAddress, symmetricKeyIndex).
                                call({ from: signingAddress })];
                    case 2:
                        symmetricKey = _a.sent();
                        return [2 /*return*/, symmetricKey];
                    case 3:
                        error_1 = _a.sent();
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Trade.prototype.updateData = function (txnProps) {
        return __awaiter(this, void 0, void 0, function () {
            var symmetricKey, asymEncryp, symEncryp_1, privateKey, decryptedSymmetricKey_1, encryptedData_1, tradeContract, functionAbi_1, txnObject, estimatedGas, signedTransaction, txnReceipt, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utils.writeFormattedMessage("Inside updateData", txnProps);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.getAccessibleSymmetricKeyForParty(txnProps.guid, txnProps.factoryAddress, txnProps.signingWallet.address, txnProps.symmetricKeyIndex, txnProps.oneTimeAddress)];
                    case 2:
                        symmetricKey = _a.sent();
                        utils.writeFormattedMessage("Symmetric Key", symmetricKey);
                        asymEncryp = new asymmetrickey_encryption_1.AsymmetricKeyEncryption();
                        symEncryp_1 = new symmetrickey_encryption_1.SymmetricKeyEncryption();
                        //decrypt the symmetric key here
                        utils.writeFormattedMessage("Private key", txnProps.signingWallet.privateKey);
                        privateKey = txnProps.signingWallet.privateKey;
                        decryptedSymmetricKey_1 = asymEncryp.decrypt(symmetricKey.slice(2), privateKey);
                        utils.writeFormattedMessage("Decrypted Symmetric Key", decryptedSymmetricKey_1);
                        encryptedData_1 = new Object();
                        utils.writeFormattedMessage("Function parameters", txnProps.parameters);
                        utils.writeFormattedMessage("Function data", txnProps.data);
                        txnProps.parameters.forEach(function (element) {
                            encryptedData_1[element] = symEncryp_1.encrypt(String(txnProps.data[element]), decryptedSymmetricKey_1);
                            utils.writeFormattedMessage("Encrypted Data for " + element, encryptedData_1[element]);
                        });
                        return [4 /*yield*/, this.getContract(txnProps.guid, txnProps.factoryAddress, txnProps.signingWallet.address)];
                    case 3:
                        tradeContract = _a.sent();
                        this.tradeAbi.abi.forEach(function (element) {
                            if (element.name == txnProps.methodName) {
                                functionAbi_1 = element;
                            }
                        });
                        txnObject = this.web3.eth.abi.encodeFunctionCall({
                            name: txnProps.methodName,
                            type: 'function',
                            inputs: functionAbi_1.inputs,
                        }, [utils.keccak256(symmetricKey), encryptedData_1['tradeDate'], encryptedData_1['product'],
                            encryptedData_1['qty'], encryptedData_1['price']]);
                        return [4 /*yield*/, this.web3.eth.estimateGas({
                                to: this.trade.options.address,
                                data: txnObject
                            })];
                    case 4:
                        estimatedGas = _a.sent();
                        estimatedGas = estimatedGas + 20000;
                        utils.writeFormattedMessage("estimatedGas", estimatedGas);
                        return [4 /*yield*/, this.web3.eth.accounts.signTransaction({
                                to: this.trade.options.address, data: txnObject,
                                gas: estimatedGas
                            }, privateKey)];
                    case 5:
                        signedTransaction = _a.sent();
                        return [4 /*yield*/, this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)];
                    case 6:
                        txnReceipt = _a.sent();
                        utils.writeFormattedMessage("Send Transaction Receipt", txnReceipt);
                        return [2 /*return*/, txnReceipt.transactionHash];
                    case 7:
                        error_2 = _a.sent();
                        utils.writeFormattedMessage("Error in updateData", error_2);
                        throw error_2;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Trade.prototype.updatePaymentInfo = function (txnProps) {
        return __awaiter(this, void 0, void 0, function () {
            var symmetricKey, asymEncryp, symEncryp_2, privateKey, decryptedSymmetricKey_2, encryptedData_2, tradeContract, functionAbi_2, txnObject, estimatedGas, signedTransaction, txnReceipt, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getAccessibleSymmetricKeyForParty(txnProps.guid, txnProps.factoryAddress, txnProps.signingWallet.address, txnProps.symmetricKeyIndex, txnProps.oneTimeAddress)];
                    case 1:
                        symmetricKey = _a.sent();
                        utils.writeFormattedMessage("Symmetric Key", symmetricKey);
                        asymEncryp = new asymmetrickey_encryption_1.AsymmetricKeyEncryption();
                        symEncryp_2 = new symmetrickey_encryption_1.SymmetricKeyEncryption();
                        //decrypt the symmetric key here
                        utils.writeFormattedMessage("Private key", txnProps.signingWallet.privateKey);
                        privateKey = txnProps.signingWallet.privateKey;
                        decryptedSymmetricKey_2 = asymEncryp.decrypt(symmetricKey.slice(2), privateKey);
                        utils.writeFormattedMessage("Decrypted Symmetric Key", decryptedSymmetricKey_2);
                        encryptedData_2 = new Object();
                        txnProps.parameters.forEach(function (element) {
                            encryptedData_2[element] = symEncryp_2.encrypt(String(txnProps.data[element]), decryptedSymmetricKey_2);
                            utils.writeFormattedMessage("Encrypted data for " + element, encryptedData_2[element]);
                        });
                        return [4 /*yield*/, this.getContract(txnProps.guid, txnProps.factoryAddress, txnProps.signingWallet.address)];
                    case 2:
                        tradeContract = _a.sent();
                        this.tradeAbi.abi.forEach(function (element) {
                            if (element.name == txnProps.methodName) {
                                functionAbi_2 = element;
                            }
                        });
                        txnObject = this.web3.eth.abi.encodeFunctionCall({
                            name: txnProps.methodName,
                            type: 'function',
                            inputs: functionAbi_2.inputs,
                        }, [utils.keccak256(symmetricKey), encryptedData_2['paymentTerm']]);
                        return [4 /*yield*/, this.web3.eth.estimateGas({
                                to: this.trade.options.address,
                                data: txnObject
                            })];
                    case 3:
                        estimatedGas = _a.sent();
                        estimatedGas = estimatedGas + 20000;
                        utils.writeFormattedMessage("estimatedGas", estimatedGas);
                        return [4 /*yield*/, this.web3.eth.accounts.signTransaction({
                                to: this.trade.options.address, data: txnObject,
                                gas: estimatedGas
                            }, privateKey)];
                    case 4:
                        signedTransaction = _a.sent();
                        return [4 /*yield*/, this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)];
                    case 5:
                        txnReceipt = _a.sent();
                        utils.writeFormattedMessage("Send Transaction Receipt", txnReceipt);
                        return [2 /*return*/, txnReceipt.transactionHash];
                    case 6:
                        error_3 = _a.sent();
                        utils.writeFormattedMessage("Error in updatePaymentInfo", error_3);
                        throw error_3;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Trade.prototype.grantAccess = function (grntaccsProps) {
        return __awaiter(this, void 0, void 0, function () {
            var tradeContract, otherPartyOTA, partyOTA, asymEncryp, symEncryp, symKeyIndex, encryptedKeys, symmetricKey, privateKey, decryptedSymmetricKey, otherPartyEncSymKey, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.getContract(grntaccsProps.guid, grntaccsProps.factoryAddress, grntaccsProps.signingWallet.address)];
                    case 1:
                        tradeContract = _a.sent();
                        return [4 /*yield*/, tradeContract.methods.partyOTAddresses(grntaccsProps.otherPartyIndex).
                                call({ from: grntaccsProps.signingWallet.address })];
                    case 2:
                        otherPartyOTA = _a.sent();
                        return [4 /*yield*/, tradeContract.methods.partyOTAddresses(grntaccsProps.partyIndex).
                                call({ from: grntaccsProps.signingWallet.address })];
                    case 3:
                        partyOTA = _a.sent();
                        asymEncryp = new asymmetrickey_encryption_1.AsymmetricKeyEncryption();
                        symEncryp = new symmetrickey_encryption_1.SymmetricKeyEncryption();
                        symKeyIndex = -1;
                        encryptedKeys = void 0;
                        _a.label = 4;
                    case 4:
                        if (!(symKeyIndex != 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, tradeContract.methods.SYMKEY_LIST(grntaccsProps.partyIndex, 0).
                                call({ from: grntaccsProps.signingWallet.address })];
                    case 5:
                        symKeyIndex = _a.sent();
                        if (symKeyIndex == 0)
                            return [3 /*break*/, 7];
                        return [4 /*yield*/, this.getAccessibleSymmetricKeyForParty(grntaccsProps.guid, grntaccsProps.factoryAddress, grntaccsProps.signingWallet.address, symKeyIndex, partyOTA)];
                    case 6:
                        symmetricKey = _a.sent();
                        privateKey = "0xb96e9ccb774cc33213cbcb2c69d3cdae17b0fe4888a1ccd343cbd1a17fd98b18";
                        decryptedSymmetricKey = asymEncryp.decrypt(symmetricKey.slice(2), privateKey);
                        otherPartyEncSymKey = asymEncryp.encrypt(decryptedSymmetricKey, grntaccsProps.otherPartyBitcorePubKey);
                        encryptedKeys.push({ encryptedSymKey: otherPartyEncSymKey, symKeyIndex: symKeyIndex });
                        return [3 /*break*/, 4];
                    case 7:
                        utils.writeFormattedMessage("Symmetric key list", encryptedKeys);
                        return [2 /*return*/, encryptedKeys];
                    case 8:
                        error_4 = _a.sent();
                        utils.writeFormattedMessage("Error in grant access", error_4);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return Trade;
}(base_contract_1.BaseContract));
exports.Trade = Trade;
//# sourceMappingURL=trade.js.map