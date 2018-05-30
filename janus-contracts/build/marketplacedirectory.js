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
var indCommon = require("@manosamy/janus-common");
var base_contract_1 = require("./base-contract");
var ethersUtils = ethers.utils;
var walletObject = ethers.Wallet;
var Web3 = require("web3");
var Tx = require('ethereumjs-tx');
var utils = new indCommon.Utils();
var MarketplaceDirectory = /** @class */ (function (_super) {
    __extends(MarketplaceDirectory, _super);
    function MarketplaceDirectory(abiPath, provider, web3) {
        var _this = _super.call(this, abiPath, provider) || this;
        if (web3)
            _this.web3 = web3;
        _this.getWeb3();
        return _this;
    }
    MarketplaceDirectory.prototype.getContract = function (marketplaceDirectoryAddress, signingWalletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var marketplaceDirectoryString, marketplaceDirectoryAbi, marketplaceDirectory;
            return __generator(this, function (_a) {
                utils.writeFormattedMessage("Inside getContract", { marketplaceDirectoryAddress: marketplaceDirectoryAddress, walletAddress: signingWalletAddress });
                marketplaceDirectoryString = this.loadAbi("MarketplaceDirectoryInterface", this.abiPath);
                marketplaceDirectoryAbi = JSON.parse(marketplaceDirectoryString);
                marketplaceDirectory = new this.web3.eth.Contract(marketplaceDirectoryAbi.abi);
                marketplaceDirectory.options.address = marketplaceDirectoryAddress;
                return [2 /*return*/, marketplaceDirectory];
            });
        });
    };
    MarketplaceDirectory.prototype.updateParticipant = function (marketplaceDirectoryAddress, effectiveDate, terminationDate, participantName, participantWalletAddress, callerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var marketplaceDirectory, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utils.writeFormattedMessage("Inside updateParticipant", { marketplaceDirectoryAddress: marketplaceDirectoryAddress, effectiveDate: effectiveDate, terminationDate: terminationDate, participantName: participantName, participantWalletAddress: participantWalletAddress, callerAddress: callerAddress });
                        return [4 /*yield*/, this.getContract(marketplaceDirectoryAddress, callerAddress)];
                    case 1:
                        marketplaceDirectory = _a.sent();
                        return [4 /*yield*/, marketplaceDirectory.methods.updateParticipant(((effectiveDate != null) ? effectiveDate.getTime() : 0), ((terminationDate != null) ? terminationDate.getTime() : 0), participantName, participantWalletAddress).send({ from: callerAddress })];
                    case 2:
                        tx = _a.sent();
                        console.log("Transaction", tx);
                        //utils.writeFormattedMessage("Transaction tx",tx);
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    MarketplaceDirectory.prototype.getParticipantByAddress = function (marketplaceDirectoryAddress, participantWalletAddress, callerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var marketplaceDirectory, participant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContract(marketplaceDirectoryAddress, callerAddress)];
                    case 1:
                        marketplaceDirectory = _a.sent();
                        return [4 /*yield*/, marketplaceDirectory.methods.participant(participantWalletAddress).call({ from: callerAddress })];
                    case 2:
                        participant = _a.sent();
                        utils.writeFormattedMessage("participant", participant);
                        return [2 /*return*/, participant];
                }
            });
        });
    };
    MarketplaceDirectory.prototype.getParticipantByName = function (marketplaceDirectoryAddress, participantName, parentName, callerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var marketplaceDirectory, participant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContract(marketplaceDirectoryAddress, callerAddress)];
                    case 1:
                        marketplaceDirectory = _a.sent();
                        return [4 /*yield*/, marketplaceDirectory.methods.participant(participantName, parentName).call({ from: callerAddress })];
                    case 2:
                        participant = _a.sent();
                        utils.writeFormattedMessage("participant", participant);
                        return [2 /*return*/, participant];
                }
            });
        });
    };
    MarketplaceDirectory.prototype.CheckIfParticipantActiveByName = function (marketplaceDirectoryAddress, participantName, parentName, asofDate, callerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var marketplaceDirectory, IsActive;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //get the contract instance
                        if (!asofDate)
                            asofDate = new Date();
                        return [4 /*yield*/, this.getContract(marketplaceDirectoryAddress, callerAddress)];
                    case 1:
                        marketplaceDirectory = _a.sent();
                        return [4 /*yield*/, marketplaceDirectory.methods.IsParticipantActive(participantName, parentName, asofDate).call({ from: callerAddress })];
                    case 2:
                        IsActive = _a.sent();
                        utils.writeFormattedMessage("IsActive", IsActive);
                        return [2 /*return*/, IsActive];
                }
            });
        });
    };
    MarketplaceDirectory.prototype.CheckIfParticipantActiveByAddress = function (marketplaceDirectoryAddress, participantWalletAddress, asofDate, callerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var marketplaceDirectory, IsActive;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //get the contract instance
                        if (!asofDate)
                            asofDate = new Date();
                        return [4 /*yield*/, this.getContract(marketplaceDirectoryAddress, callerAddress)];
                    case 1:
                        marketplaceDirectory = _a.sent();
                        return [4 /*yield*/, marketplaceDirectory.methods.IsParticipantActive(participantWalletAddress, asofDate).call({ from: callerAddress })];
                    case 2:
                        IsActive = _a.sent();
                        utils.writeFormattedMessage("IsActive", IsActive);
                        return [2 /*return*/, IsActive];
                }
            });
        });
    };
    return MarketplaceDirectory;
}(base_contract_1.BaseContract));
exports.MarketplaceDirectory = MarketplaceDirectory;
//# sourceMappingURL=marketplacedirectory.js.map