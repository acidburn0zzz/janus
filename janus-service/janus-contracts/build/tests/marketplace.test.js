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
var chai = require("chai");
//import * as contracts from "contracts";
var marketplacedirectory_1 = require("../marketplacedirectory");
var Web3 = require("web3");
var assert = require('assert');
var expect = chai.expect;
var should = chai.should();
var mochaAsync = function (fn) {
    return function () { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fn()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2:
                    err_1 = _a.sent();
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    }); };
};
var mochaAsyncBeforeHook = function (fn) {
    return function () { return __awaiter(_this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fn()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2:
                    err_2 = _a.sent();
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    }); };
};
describe.only('Marketplace Directory tests', function () {
    var marketplaceAddress;
    var tradeFactoryAddress;
    var abiPath;
    var contractsPath;
    var nodeUrl;
    var web3;
    var marketplaceDirectory;
    var consortiumAddress;
    var companyAAddress;
    var companyBAddress;
    var emp1Address;
    var emp2Address;
    var consortiumPKey;
    var companyAPKey;
    var companyBPKey;
    var emp1PKey;
    var emp12Key;
    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    //add init here
                    abiPath = "C:\\Code\\BlockChain\\privy\\Contracts\\abi";
                    contractsPath = "C:\\Code\\BlockChain\\privy\\Contracts\\build";
                    nodeUrl = "c";
                    web3 = new Web3(nodeUrl);
                    marketplaceAddress = "0xe3a8baa236ac8df21e4f41a2de9d89b068ada2c5";
                    tradeFactoryAddress = "0x7904adfd948f5f99a987a86768f5decc1aecdea2";
                    consortiumAddress = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";
                    companyAAddress = "0xf17f52151EbEF6C7334FAD080c5704D77216b732";
                    companyBAddress = "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef";
                    consortiumPKey = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
                    companyAPKey = "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f";
                    companyBPKey = "0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1";
                    //web3.eth
                    marketplaceDirectory = new marketplacedirectory_1.MarketplaceDirectory(abiPath, nodeUrl, web3);
                    return [2 /*return*/];
                });
            });
        });
        return fn();
    });
    it('Add companies', function () {
        return __awaiter(this, void 0, void 0, function () {
            var companyAName, tx, participantA, companyBName, participantB;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(0);
                        console.log("In add companies test");
                        companyAName = "Mercuria";
                        return [4 /*yield*/, marketplaceDirectory.updateParticipant(marketplaceAddress, null, null, companyAName, companyAAddress, consortiumAddress)];
                    case 1:
                        tx = _a.sent();
                        console.log(tx);
                        return [4 /*yield*/, marketplaceDirectory.getParticipantByAddress(marketplaceAddress, companyAAddress, consortiumAddress)];
                    case 2:
                        participantA = _a.sent();
                        assert.notEqual(participantA, null, "Reading Directory failed");
                        console.log(participantA);
                        assert.equal(participantA.name, companyAName, "CompanyA participant name did not saved in directory");
                        assert.equal(participantA.walletAddress, companyAAddress, "CompanyA wallet address did not saved in directory");
                        companyBName = "Shell";
                        return [4 /*yield*/, marketplaceDirectory.updateParticipant(marketplaceAddress, null, null, companyBName, companyBAddress, consortiumAddress)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, marketplaceDirectory.getParticipantByAddress(marketplaceAddress, companyBAddress, consortiumAddress)];
                    case 4:
                        participantB = _a.sent();
                        assert.notEqual(participantB, null, "Reading Directory failed");
                        console.log(participantB);
                        assert.equal(participantB.name, companyBName, "CompanyB participant name did not saved in directory");
                        assert.equal(participantB.walletAddress, companyBAddress, "CompanyB wallet address did not saved in directory");
                        return [2 /*return*/];
                }
            });
        });
    });
});
//# sourceMappingURL=marketplace.test.js.map