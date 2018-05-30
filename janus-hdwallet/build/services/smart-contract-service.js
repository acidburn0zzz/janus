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
var ethers = require("ethers");
var utils_1 = require("@manosamy/janus-common/build/common/utils");
var ethersUtils = ethers.utils;
var walletObject = ethers.Wallet;
var Web3 = require("web3");
var Tx = require('ethereumjs-tx');
var fs = require('fs');
var path_module = require('path');
var utils = new utils_1.Utils();
var SendTransactionProperties = /** @class */ (function () {
    function SendTransactionProperties() {
        this.data = new Object();
    }
    return SendTransactionProperties;
}());
exports.SendTransactionProperties = SendTransactionProperties;
var GrantAccessProperties = /** @class */ (function () {
    function GrantAccessProperties() {
    }
    return GrantAccessProperties;
}());
exports.GrantAccessProperties = GrantAccessProperties;
var SmartContractService = /** @class */ (function () {
    function SmartContractService(contractPath, abiPath, provider) {
        this.contractPath = contractPath;
        this.abiPath = abiPath;
        this.provider = provider;
        this.getWeb3();
    }
    SmartContractService.prototype.getWeb3 = function () {
        this.web3 = new Web3(Web3.givenProvider || this.provider);
    };
    SmartContractService.getInstance = function (contractPath, abiPath, provider) {
        this._instance = this._instance || new SmartContractService(contractPath, abiPath, provider);
        return this._instance;
    };
    SmartContractService.prototype.sendTransaction = function (transactionProperties) {
        return __awaiter(this, void 0, void 0, function () {
            var returnObject, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.executeTransaction(transactionProperties)];
                    case 1:
                        returnObject = _a.sent();
                        return [2 /*return*/, returnObject];
                    case 2:
                        error_1 = _a.sent();
                        utils.writeFormattedMessage("Error in sendTransaction", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SmartContractService.prototype.grantAccess = function (grantAccessProperties) {
        return __awaiter(this, void 0, void 0, function () {
            var returnObject, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.executeTransaction(grantAccessProperties)];
                    case 1:
                        returnObject = _a.sent();
                        return [2 /*return*/, returnObject];
                    case 2:
                        error_2 = _a.sent();
                        utils.writeFormattedMessage("Error in grantAccess", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SmartContractService.prototype.executeTransaction = function (prop) {
        return __awaiter(this, void 0, void 0, function () {
            var x, contract, args, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(prop);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        x = require("C:\\Code\\BlockChain\\privy\\contracts\\build\\trade.js");
                        console.log("x", x);
                        contract = Object.create(x[prop.contractName].prototype);
                        args = new Array();
                        args.push(this.abiPath);
                        args.push(this.provider);
                        contract.constructor.apply(contract, args);
                        utils.writeFormattedMessage("Inside executeTransaction, After calling constructor", prop);
                        return [4 /*yield*/, contract[prop.methodName](prop)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_3 = _a.sent();
                        console.log(error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SmartContractService;
}());
exports.SmartContractService = SmartContractService;
//# sourceMappingURL=smart-contract-service.js.map