(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("web3");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.OK = "OK";
exports.errorInvalidSignature = "error: Invalid Signature";
exports.errorInvalidHash = "error: The message hashes did not match";
exports.errorDecryptionFailed = "error: Decryption failed";
exports.errorEncryptionFailed = "error: Encryption failed";
exports.errorOTAGenFailed = "error: OTA gen failed";
exports.errorTradeNumberNotFound = "error: Trade number not found";
exports.errorContractIdNotFound = "error: Contract Id not found";
exports.errorAcceptTradeFailed = "error: Accept trade failed";
exports.errorCancelTradeFailed = "error: Cancel trade failed";
exports.errorRequestObjectParseFailed = "error: Could not parse request object";
exports.errorRequestOtaFailed = "error: Could not find the one time address for the specified guid";
exports.errorPostTransaction = "error: PostTransaction failed";
exports.errorObfuscatorOptionsEmpty = "error: Address obfuscator options cannot be empty";
//export let mecuriaMnemonic: string = "radar blur cabbage chef fix engine embark joy scheme fiction master release";
//export let shellMnemonic: string = "buyer try humor into improve thrive fruit funny skate velvet vanish live";
//export let trafiMnemonic: string = "volume roast script mind garbage embark lizard utility else blur year dentist";
//export let bpMnemonic: string = "foil feed pool urban pupil eyebrow step guess plug palace lion neutral";
//export let kochMnemonic: string = "type either sock busy quote sugar bullet wish use visit magnet innocent";
//export let acmeSAASVendorMnemonic: string = "twenty neither hill property whisper frozen angry peace industry easily return switch";
//# sourceMappingURL=constants.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("bitcore-lib");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("ethers");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", { value: true });
var constants = __webpack_require__(1);
var BaseData = /** @class */ (function () {
    function BaseData() {
    }
    return BaseData;
}());
exports.BaseData = BaseData;
var BaseRequest = /** @class */ (function () {
    function BaseRequest() {
    }
    return BaseRequest;
}());
exports.BaseRequest = BaseRequest;
var BaseResponse = /** @class */ (function () {
    function BaseResponse(guid) {
        if (guid === void 0) { guid = ""; }
        this.guid = guid;
        this.error = constants.OK;
    }
    return BaseResponse;
}());
exports.BaseResponse = BaseResponse;
/*
    Object data passed by the indirection oracle when it is requesting a one time address
    message: JSON string in the following shape
    {
        "guid": "0x1234",
        "companyName": "Acme inc",
        "signerName": "John Smith"
    }
*/
var PartyType;
(function (PartyType) {
    PartyType[PartyType["Unassigned"] = 0] = "Unassigned";
    PartyType[PartyType["Buyer"] = 1] = "Buyer";
    PartyType[PartyType["Seller"] = 2] = "Seller";
    PartyType[PartyType["Broker"] = 3] = "Broker";
})(PartyType = exports.PartyType || (exports.PartyType = {}));
var PartyOTAddress = /** @class */ (function () {
    function PartyOTAddress() {
    }
    return PartyOTAddress;
}());
exports.PartyOTAddress = PartyOTAddress;
var Party = /** @class */ (function () {
    function Party(fields) {
        Object.assign(this, fields);
    }
    return Party;
}());
exports.Party = Party;
var OneTimeAddressRequest = /** @class */ (function (_super) {
    __extends(OneTimeAddressRequest, _super);
    function OneTimeAddressRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OneTimeAddressRequest;
}(BaseRequest));
exports.OneTimeAddressRequest = OneTimeAddressRequest;
/**
 * one time address response object returned by the wallet service
 */
var OneTimeAddressResponse = /** @class */ (function (_super) {
    __extends(OneTimeAddressResponse, _super);
    function OneTimeAddressResponse(guid) {
        if (guid === void 0) { guid = ""; }
        var _this = _super.call(this, guid) || this;
        _this.OTAddress = "0x00";
        _this.bitcorePublicKey = "0x00";
        return _this;
    }
    return OneTimeAddressResponse;
}(BaseResponse));
exports.OneTimeAddressResponse = OneTimeAddressResponse;
var OneTimeAddressData = /** @class */ (function () {
    function OneTimeAddressData(otaddress, walletPath, bitcorePublicKey, signerCompany, guid) {
        this.OTAddress = otaddress;
        this.walletPath = walletPath;
        this.bitcorePublicKey = bitcorePublicKey;
        this.signerCompany = signerCompany;
        this.guid = guid;
    }
    return OneTimeAddressData;
}());
exports.OneTimeAddressData = OneTimeAddressData;
/**
 * request data sent to decrypt a set of data fields
    message is a JSON string expected in the following shape
    {
                        "guid" : "1234",
                        "keys" : [
                            { "key": "0xkey1",
                                "fields": [ "F1", "F2", "F3"] },
                                { "key": "0xkey2",
                                "fields": [ "F4", "F5", "F6"] },
                                { "key": "0xkey3",
                                "fields": [ "F7", "F8", "F9"] }
                            ],
                "data": {
                    "F1": "0x1234",
                    "F2": "0x1234",
                    "F3": "0x1234",
                    "F4": "0x1234",
                    "F5": "0x1234",
                    "F6": "0x1234",
                    "F7": "0x1234",
                    "F8": "0x1234",
                    "F9": "0x1234"
                }
    }
 */
var DecryptDataRequest = /** @class */ (function (_super) {
    __extends(DecryptDataRequest, _super);
    function DecryptDataRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DecryptDataRequest;
}(BaseRequest));
exports.DecryptDataRequest = DecryptDataRequest;
var DecryptDataResponse = /** @class */ (function (_super) {
    __extends(DecryptDataResponse, _super);
    function DecryptDataResponse(guid) {
        if (guid === void 0) { guid = ""; }
        var _this = _super.call(this, guid) || this;
        _this.data = {};
        return _this;
    }
    return DecryptDataResponse;
}(BaseResponse));
exports.DecryptDataResponse = DecryptDataResponse;
/**
 * request data sent to encrypt a set of data fields
    message is a JSON string expected in the following shape
    {
                        "guid": "1234",
                        "keys" : [
                            { "key": "0xkey1",
                                "fields": [ "buyer", "seller", "price", "quantity", "uom"] },
                                { "key": "0xkey2",
                                "fields": [ "commodity", "apiGravity"] },
                            ],
                        "data": { buyer: 'Mercuria',
                          seller: 'Shell',
                          price: '55',
                          quantity: '100000',
                          uom: 'BBL',
                          commodity: 'Brent',
                          apiGravity: '38.5' }
                            }
 */
var EncryptDataRequest = /** @class */ (function (_super) {
    __extends(EncryptDataRequest, _super);
    function EncryptDataRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EncryptDataRequest;
}(BaseRequest));
exports.EncryptDataRequest = EncryptDataRequest;
var EncryptDataResponse = /** @class */ (function (_super) {
    __extends(EncryptDataResponse, _super);
    function EncryptDataResponse(guid) {
        if (guid === void 0) { guid = ""; }
        var _this = _super.call(this, guid) || this;
        _this.data = {};
        return _this;
    }
    return EncryptDataResponse;
}(BaseResponse));
exports.EncryptDataResponse = EncryptDataResponse;
/**
 * Models for Granting access to a third party

    message is a JSON object with the following shape
    {
        "data": {
            "guid": "1234",
            "messageHash": ""
        },
        "signature": "0x07c5afcc235567ccc94b94f997867eeca15573ff859b053aba5ce321cf76aeb92d4822fb0007ba58b4c41b"
        "otherInfo": {
                
            }
    }
 */
var GrantAccessRequest = /** @class */ (function (_super) {
    __extends(GrantAccessRequest, _super);
    function GrantAccessRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GrantAccessRequest;
}(BaseRequest));
exports.GrantAccessRequest = GrantAccessRequest;
var GrantAccessResponse = /** @class */ (function (_super) {
    __extends(GrantAccessResponse, _super);
    function GrantAccessResponse(guid) {
        if (guid === void 0) { guid = ""; }
        var _this = _super.call(this, guid) || this;
        _this.error = "OK";
        return _this;
    }
    return GrantAccessResponse;
}(BaseResponse));
exports.GrantAccessResponse = GrantAccessResponse;
/**
 *
{
    "data": {
        "guid": "5465675565",
        "messageHash": "65u56rytuy56454",
        "fields": {
            "tradeDate": "12/20/2017",
            "qty": "100000",
            "product": "WTI",
            "price": "39.6",
            "buyer": "Mercuria",
            "seller": "Shell",
        }
    },
    "signature": "0x07c5afcc235567ccc94b94f997867eeca15573ff859b053aba5ce321cf76aeb92d4822fb0007ba58b4c41b",
    "otherInfo": {
        "factoryAddress": "0x03334c41b",
        "marketplaceAddress": "0x5454565",
        "contractName": "Trade"
        "myParty": Party,
        "otherParty": Party,
        "functionList": [
                    "updateData",
                    "updatePaymentInfo"
        ],
        functionArgs: {
            "updateData": [
                        "symmetricKeyIndex",
                        "tradeDate",
                        "product",
                        "qty",
                        "price"
            ],
            "updatePaymentInfo": [
                        "symmetricKeyIndex",
                        "paymentTerm"
            ]
        }
    }
}

 */
var TransactionData = /** @class */ (function (_super) {
    __extends(TransactionData, _super);
    function TransactionData(fields) {
        var _this = _super.call(this) || this;
        Object.assign(_this, fields);
        return _this;
    }
    return TransactionData;
}(BaseData));
exports.TransactionData = TransactionData;
var TransactionInfo = /** @class */ (function () {
    function TransactionInfo(fields) {
        Object.assign(this, fields);
    }
    return TransactionInfo;
}());
exports.TransactionInfo = TransactionInfo;
var FunctionInfo = /** @class */ (function () {
    function FunctionInfo(fields) {
        Object.assign(this, fields);
    }
    return FunctionInfo;
}());
exports.FunctionInfo = FunctionInfo;
var CreateTransactionRequest = /** @class */ (function () {
    function CreateTransactionRequest(fields) {
        Object.assign(this, fields);
    }
    return CreateTransactionRequest;
}());
exports.CreateTransactionRequest = CreateTransactionRequest;
var CreateTransactionResponse = /** @class */ (function (_super) {
    __extends(CreateTransactionResponse, _super);
    function CreateTransactionResponse(fields) {
        var _this = _super.call(this) || this;
        Object.assign(_this, fields);
        return _this;
    }
    return CreateTransactionResponse;
}(BaseResponse));
exports.CreateTransactionResponse = CreateTransactionResponse;
var PostTransactionRequest = /** @class */ (function (_super) {
    __extends(PostTransactionRequest, _super);
    function PostTransactionRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PostTransactionRequest;
}(CreateTransactionRequest));
exports.PostTransactionRequest = PostTransactionRequest;
var PostTransactionResponse = /** @class */ (function (_super) {
    __extends(PostTransactionResponse, _super);
    function PostTransactionResponse(fields) {
        var _this = _super.call(this, fields) || this;
        Object.assign(_this, fields);
        return _this;
    }
    return PostTransactionResponse;
}(CreateTransactionResponse));
exports.PostTransactionResponse = PostTransactionResponse;
var RegistrationData = /** @class */ (function (_super) {
    __extends(RegistrationData, _super);
    function RegistrationData(fields) {
        var _this = _super.call(this) || this;
        Object.assign(_this, fields);
        return _this;
    }
    return RegistrationData;
}(BaseData));
exports.RegistrationData = RegistrationData;
var WalletRegistrationRequest = /** @class */ (function () {
    function WalletRegistrationRequest(fields) {
        Object.assign(this, fields);
    }
    return WalletRegistrationRequest;
}());
exports.WalletRegistrationRequest = WalletRegistrationRequest;
var WalletRegistrationResponse = /** @class */ (function (_super) {
    __extends(WalletRegistrationResponse, _super);
    function WalletRegistrationResponse(fields) {
        var _this = _super.call(this) || this;
        Object.assign(_this, fields);
        return _this;
    }
    return WalletRegistrationResponse;
}(BaseResponse));
exports.WalletRegistrationResponse = WalletRegistrationResponse;
var UnRegistrationData = /** @class */ (function (_super) {
    __extends(UnRegistrationData, _super);
    function UnRegistrationData(fields) {
        var _this = _super.call(this) || this;
        Object.assign(_this, fields);
        return _this;
    }
    return UnRegistrationData;
}(BaseData));
exports.UnRegistrationData = UnRegistrationData;
var WalletUnRegistrationRequest = /** @class */ (function () {
    function WalletUnRegistrationRequest(fields) {
        Object.assign(this, fields);
    }
    return WalletUnRegistrationRequest;
}());
exports.WalletUnRegistrationRequest = WalletUnRegistrationRequest;
var WalletUnRegistrationResponse = /** @class */ (function (_super) {
    __extends(WalletUnRegistrationResponse, _super);
    function WalletUnRegistrationResponse(fields) {
        var _this = _super.call(this) || this;
        Object.assign(_this, fields);
        return _this;
    }
    return WalletUnRegistrationResponse;
}(BaseResponse));
exports.WalletUnRegistrationResponse = WalletUnRegistrationResponse;
var MeterSummaryData = /** @class */ (function (_super) {
    __extends(MeterSummaryData, _super);
    function MeterSummaryData(fields) {
        var _this = _super.call(this) || this;
        Object.assign(_this, fields);
        return _this;
    }
    return MeterSummaryData;
}(BaseData));
exports.MeterSummaryData = MeterSummaryData;
var MeterSummaryRequest = /** @class */ (function () {
    function MeterSummaryRequest(fields) {
        Object.assign(this, fields);
    }
    return MeterSummaryRequest;
}());
exports.MeterSummaryRequest = MeterSummaryRequest;
var MeterSummaryResponse = /** @class */ (function (_super) {
    __extends(MeterSummaryResponse, _super);
    function MeterSummaryResponse(fields) {
        var _this = _super.call(this) || this;
        Object.assign(_this, fields);
        return _this;
    }
    return MeterSummaryResponse;
}(BaseResponse));
exports.MeterSummaryResponse = MeterSummaryResponse;
//# sourceMappingURL=models.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var bitcore = __webpack_require__(2);
var Web3 = __webpack_require__(0);
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.prototype.bitcorePublicKey = function (privateKey) {
        var privKey = new bitcore.PrivateKey(privateKey.slice(2));
        var pubKey = new bitcore.PublicKey.fromPrivateKey(privKey);
        return pubKey.toString();
    };
    Utils.prototype.writeFormattedMessage = function (header, message) {
        console.log("");
        console.log("===" + header + "===");
        console.log(message);
        console.log("=== END", header, "END===");
    };
    Utils.prototype.keccak256 = function (data) {
        return Web3.utils.sha3(data);
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("ethereumjs-tx");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var bitcore = __webpack_require__(2);
var Web3 = __webpack_require__(0);
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.prototype.bitcorePublicKey = function (privateKey) {
        var privKey = new bitcore.PrivateKey(privateKey.slice(2));
        var pubKey = new bitcore.PublicKey.fromPrivateKey(privKey);
        return pubKey.toString();
    };
    Utils.prototype.writeFormattedMessage = function (header, message) {
        console.log("");
        console.log("===" + header + "===");
        console.log(message);
        console.log("=== END", header, "END===");
    };
    Utils.prototype.keccak256 = function (data) {
        return Web3.utils.sha3(data);
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("app-root-path");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ECIES = __webpack_require__(11);
var bitcore = __webpack_require__(2);
var AsymmetricKeyEncryption = /** @class */ (function () {
    function AsymmetricKeyEncryption() {
    }
    AsymmetricKeyEncryption.prototype.bitcorePublicKey = function (privateKey) {
        var privKey = new bitcore.PrivateKey(privateKey.slice(2));
        var pubKey = new bitcore.PublicKey.fromPrivateKey(privKey);
        return pubKey.toString();
    };
    AsymmetricKeyEncryption.prototype.encrypt = function (dataUtf8Text, bitcorePublicKey) {
        /*
         * this key is used as false sample, because bitcore would crash when alice has no privateKey
         */
        var bitcorePrivateKey = new bitcore.PrivateKey('52435b1ff21b894da15d87399011841d5edec2de4552fdc29c8299574436925d');
        var keyset = ECIES().privateKey(bitcorePrivateKey).publicKey(new bitcore.PublicKey(bitcorePublicKey));
        var encrypted = keyset.encrypt(dataUtf8Text);
        return encrypted.toString('hex');
    };
    ;
    AsymmetricKeyEncryption.prototype.decrypt = function (encryptedDataHex, privateKey) {
        var bitcorePrivateKey = new bitcore.PrivateKey(privateKey.slice(2));
        var keyset = ECIES().privateKey(bitcorePrivateKey);
        var decryptMe = new Buffer(encryptedDataHex, 'hex');
        var decrypted = keyset.decrypt(decryptMe);
        return decrypted.toString('utf8');
    };
    return AsymmetricKeyEncryption;
}());
exports.AsymmetricKeyEncryption = AsymmetricKeyEncryption;
//# sourceMappingURL=asymmetrickey-encryption.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("bitcore-ecies");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var crypto = __webpack_require__(13);
var cipher = crypto.createCipher('aes256', 'a password');
var algorithm = 'aes256';
var inputEncoding = 'utf8';
var outputEncoding = 'hex';
var SymmetricKeyEncryption = /** @class */ (function () {
    function SymmetricKeyEncryption() {
        this.ALPHANUMERIC = "-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_";
    }
    SymmetricKeyEncryption.prototype.randomSalt = function (len) {
        var s = "";
        for (var i = 0; i < len; i++) {
            var index = Math.floor(Math.random() * 64);
            s = s + this.ALPHANUMERIC.substring(index, index + 1);
        }
        return s;
    };
    SymmetricKeyEncryption.prototype.generateSymKey = function () {
        return this.randomSalt(128);
    };
    SymmetricKeyEncryption.prototype.encrypt = function (dataUtf8Text, key) {
        var cipher = crypto.createCipher(algorithm, key);
        var ciphered = cipher.update(dataUtf8Text, inputEncoding, outputEncoding);
        ciphered += cipher.final(outputEncoding);
        return ciphered;
    };
    SymmetricKeyEncryption.prototype.decrypt = function (encryptedDataHex, key) {
        var decipher = crypto.createDecipher(algorithm, key);
        var finalData = decipher.update(encryptedDataHex, outputEncoding, inputEncoding);
        finalData += decipher.final(inputEncoding);
        return finalData;
    };
    return SymmetricKeyEncryption;
}());
exports.SymmetricKeyEncryption = SymmetricKeyEncryption;
//# sourceMappingURL=symmetrickey-encryption.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

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
var ethers = __webpack_require__(3);
var utils_1 = __webpack_require__(5);
var ethersUtils = ethers.utils;
var walletObject = ethers.Wallet;
var Web3 = __webpack_require__(0);
var Tx = __webpack_require__(6);
var fs = __webpack_require__(16);
var path_module = __webpack_require__(31);
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
                        x = __webpack_require__(32);
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

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(7);
var utils = new utils_1.Utils();
var fs = __webpack_require__(16);
var Web3 = __webpack_require__(0);
var BaseContract = /** @class */ (function () {
    function BaseContract(abiPath, provider) {
        this.provider = provider;
        this.abiPath = abiPath;
    }
    BaseContract.prototype.getWeb3 = function () {
        if (!this.web3)
            this.web3 = new Web3(Web3.givenProvider || this.provider);
    };
    BaseContract.prototype.loadAbi = function (name, path) {
        var abi = "";
        path = path + '\\' + name + '.json';
        utils.writeFormattedMessage("Inside loadAbi", path);
        if (fs.existsSync(path)) {
            var data = fs.readFileSync(path, 'utf8');
            //utils.writeFormattedMessage("Inside readFile of loadAbi", data);
            abi = data;
        }
        return abi;
    };
    return BaseContract;
}());
exports.BaseContract = BaseContract;
//# sourceMappingURL=base-contract.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 */
var app = __webpack_require__(19);
var http = __webpack_require__(14);
var debug = __webpack_require__(36);
var hdwalletConfig = __webpack_require__(37);
// binding to console
var log = debug('modern-express:server');
log.log = console.log.bind(console);
/**
 * Get port from environment and store in Express.
 */
var PORT = process.env.PORT || '4000';
function getPort(val) {
    /**
     * Normalize a port into a number, string, or false.
     */
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
app.set('port', PORT);
/**
 * Create HTTP server.
 */
var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(PORT);
server.on('listening', function () {
    /**
     * Event listener for HTTP server "listening" event.
     */
    var addr = server.address();
    var bind = (typeof addr === 'string' ? "pipe " + addr : "port " + addr.port);
    log("Listening on " + bind);
});


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var express = __webpack_require__(8);
var logger = __webpack_require__(20);
var bodyParser = __webpack_require__(21);
var root = __webpack_require__(9);
var cookieParser = __webpack_require__(22);
var routes = __webpack_require__(23);
var app = express();
// view engine setup
app.set('views', root + "/server/views/");
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Request-Method', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
app.use('/', routes);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

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
var express = __webpack_require__(8);
var Constants = __webpack_require__(1);
var models_1 = __webpack_require__(4);
var addressobfuscator_1 = __webpack_require__(24);
var smart_contract_service_1 = __webpack_require__(15);
var router = express.Router();
var options = {
    blockchainProvider: "http://forcefield01.uksouth.cloudapp.azure.com:8545",
    contractsPath: "C:\\Code\\BlockChain\\privy\\contracts\\build",
    abiPath: "C:\\Code\\BlockChain\\privy\\contracts\\abi",
    oracleServiceUri: "uri",
    vaultServiceUri: "vault"
};
var addressObfuscator = new addressobfuscator_1.AddressObfuscator(options);
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Indirection service reference implementation'
    });
});
router.post('/getOTAddress', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var responseData, requestData;
    return __generator(this, function (_a) {
        responseData = new models_1.OneTimeAddressResponse();
        try {
            requestData = new models_1.OneTimeAddressRequest();
            requestData.message = req.body.message;
            requestData.signature = req.body.signature;
            requestData.messageObject = JSON.parse(req.body.message);
            responseData = addressObfuscator.getOnetimeAddress(requestData);
        }
        catch (error) {
            responseData.error = Constants.errorRequestObjectParseFailed + " " + error;
        }
        res.send(responseData);
        return [2 /*return*/];
    });
}); });
router.post('/decryptData', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var responseData, requestData;
    return __generator(this, function (_a) {
        try {
            responseData = new models_1.DecryptDataResponse();
            requestData = new models_1.DecryptDataRequest();
            requestData.message = req.body.message;
            requestData.signature = req.body.signature;
            requestData.messageObject = JSON.parse(req.body.message);
            responseData = addressObfuscator.decryptData(requestData);
        }
        catch (error) {
            responseData.error = Constants.errorRequestObjectParseFailed + " " + error;
        }
        res.send(responseData);
        return [2 /*return*/];
    });
}); });
router.post('/encryptData', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var responseData, requestData;
    return __generator(this, function (_a) {
        try {
            responseData = new models_1.EncryptDataResponse();
            requestData = new models_1.EncryptDataRequest();
            requestData.message = req.body.message;
            requestData.signature = req.body.signature;
            requestData.messageObject = JSON.parse(req.body.message);
            responseData = addressObfuscator.encryptData(requestData);
        }
        catch (error) {
            responseData.error = Constants.errorRequestObjectParseFailed + " " + error;
        }
        res.send(responseData);
        return [2 /*return*/];
    });
}); });
router.post('/grantAccess', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var responseData, requestData, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                responseData = new models_1.GrantAccessResponse();
                requestData = new models_1.GrantAccessRequest();
                requestData.message = req.body.message;
                requestData.signature = req.body.signature;
                requestData.otherInfo = JSON.parse(req.body.otherInfo);
                return [4 /*yield*/, addressObfuscator.grantAccess(requestData, new smart_contract_service_1.GrantAccessProperties())];
            case 1:
                responseData = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                responseData.error = Constants.errorRequestObjectParseFailed + " " + error_1;
                return [3 /*break*/, 3];
            case 3:
                res.send(responseData);
                return [2 /*return*/];
        }
    });
}); });
router.post('/postTransaction', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var responseData, requestData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                responseData = new models_1.PostTransactionResponse({});
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                requestData = new models_1.PostTransactionRequest({});
                requestData.data = req.body.data;
                requestData.signature = req.body.signature;
                requestData.transactionInfo = req.body.transactionInfo; //JSON.parse(req.body.transactionInfo);
                return [4 /*yield*/, addressObfuscator.postTransaction(requestData, new smart_contract_service_1.SendTransactionProperties())];
            case 2:
                responseData = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                responseData.error = Constants.errorRequestObjectParseFailed + " " + error_2;
                return [3 /*break*/, 4];
            case 4:
                res.send(responseData);
                return [2 /*return*/];
        }
    });
}); });
module.exports = router;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

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
var utils_1 = __webpack_require__(5);
var models_1 = __webpack_require__(4);
var Constants = __webpack_require__(1);
var asymmetrickey_encryption_1 = __webpack_require__(10);
var symmetrickey_encryption_1 = __webpack_require__(12);
var ethers = __webpack_require__(3);
var cachingService = __webpack_require__(25);
var vaultService = __webpack_require__(30);
var smart_contract_service_1 = __webpack_require__(15);
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

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var indCommon = __webpack_require__(26);
/*
    This is a reference caching service used to cache the one time wallets generated. If the wallet service is
    restarted it can be read from the cache to the local data structures
*/
var WalletCachingService = /** @class */ (function () {
    function WalletCachingService() {
        this._map = new Map();
        //private members
    }
    /*
        saves the one time address data in the local cache and the backing db
    */
    WalletCachingService.prototype.saveOneTimeAddress = function (oneTimeAddress) {
        (new indCommon.Utils()).writeFormattedMessage("saving one time address for ", oneTimeAddress.guid);
        //save the one time address data in the local cache
        this._map[oneTimeAddress.guid] = oneTimeAddress;
        //TODO
        //save the address data in the backing db
    };
    /*
        reads and returns the onetime address, if exists from the local cache. If not
        returns null
    */
    WalletCachingService.prototype.getOneTimeAddress = function (guid) {
        (new indCommon.Utils()).writeFormattedMessage("requesting one time address for ", guid);
        return this._map[guid];
    };
    /*
        checks if the specified guid exists in our cache with an associated one time address
        returns true if exists, false otherwise
    */
    WalletCachingService.prototype.isOurEntity = function (guid) {
        return true;
    };
    return WalletCachingService;
}());
exports.WalletCachingService = WalletCachingService;
//# sourceMappingURL=wallet-caching-service.js.map

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const constants = __webpack_require__(1);
const asymmetricEncryption = __webpack_require__(10);
const symmetricEncryption = __webpack_require__(12);
const models = __webpack_require__(4);
const utils = __webpack_require__(5);
const ihttpService = __webpack_require__(27);
const httpService = __webpack_require__(28);
const commonTypes = __webpack_require__(29);

exports.Constants = constants;
exports.OneTimeAddressRequest = models.OneTimeAddressRequest;
exports.OneTimeAddressResponse = models.OneTimeAddressResponse;
exports.OneTimeAddressData = models.OneTimeAddressData
exports.DecryptDataRequest = models.DecryptDataRequest;
exports.DecryptDataResponse = models.DecryptDataResponse;
exports.EncryptDataRequest = models.EncryptDataRequest;
exports.EncryptDataResponse = models.EncryptDataResponse;
exports.GrantAccessRequest = models.GrantAccessRequest;
exports.GrantAccessResponse = models.GrantAccessResponse;
exports.EncryptedSymKeyInfo = commonTypes.EncryptedSymKeyInfo;

exports.PostTransactionRequest = models.PostTransactionRequest;
exports.PostTransactionResponse = models.PostTransactionResponse;
exports.Party = models.Party;
exports.PartyType = models.PartyType;
exports.Response = models.Response;
exports.FunctionInfo = models.FunctionInfo;
exports.TransactionData = models.TransactionData;
exports.TransactionInfo = models.TransactionInfo;
exports.RegistrationData = models.RegistrationData;
exports.UnRegistrationData = models.UnRegistrationData;
exports.CreateTransactionRequest = models.CreateTransactionRequest;
exports.CreateTransactionResponse = models.CreateTransactionResponse;
exports.WalletRegistrationRequest = models.WalletRegistrationRequest;
exports.WalletRegistrationResponse = models.WalletRegistrationResponse;
exports.WalletUnRegistrationRequest = models.WalletUnRegistrationRequest;
exports.WalletUnRegistrationResponse = models.WalletUnRegistrationResponse;
exports.MeterSummaryData = models.MeterSummaryData;
exports.MeterSummaryRequest = models.MeterSummaryRequest;
exports.MeterSummaryResponse = models.MeterSummaryResponse;
exports.Utils = utils.Utils;
exports.AsymmetricKeyEncryption = asymmetricEncryption.AsymmetricKeyEncryption;
exports.SymmetricKeyEncryption = symmetricEncryption.SymmetricKeyEncryption;
exports.IHttpService = ihttpService.IHttpService;
exports.HttpService = httpService.HttpService;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=ihttp.service.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

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
var http = __webpack_require__(14);
var HttpService = /** @class */ (function () {
    function HttpService() {
    }
    HttpService.prototype.RaiseHttpRequest = function (host, port, path, method, data, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonPaylod, post_options, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jsonPaylod = JSON.stringify(data);
                        console.log("jsonPaylod", jsonPaylod);
                        post_options = {
                            host: host,
                            port: port,
                            path: path,
                            method: method,
                            timeout: timeout || 120000,
                            headers: {
                                'Content-Type': 'application/json',
                                'Content-Length': Buffer.byteLength(jsonPaylod)
                            }
                        };
                        console.log("post_options", post_options);
                        return [4 /*yield*/, this.httpRequest(post_options, jsonPaylod)];
                    case 1:
                        response = _a.sent();
                        console.log("Http response", response);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    HttpService.prototype.httpRequest = function (params, postData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var req = http.request(params, function (res) {
                            // reject on bad status
                            if (res.statusCode < 200 || res.statusCode >= 300) {
                                return reject(new Error('statusCode=' + res.statusCode));
                            }
                            // cumulate data
                            var body = [];
                            res.on('data', function (chunk) {
                                body.push(chunk);
                            });
                            // resolve on end
                            res.on('end', function () {
                                try {
                                    body = JSON.parse(Buffer.concat(body).toString());
                                }
                                catch (e) {
                                    console.log(new Date(), "Error", e);
                                    reject(e);
                                }
                                resolve(body);
                            });
                        });
                        // reject on request error
                        req.on('error', function (err) {
                            // This is not a "Second reject", just a different sort of failure
                            reject(err);
                        });
                        if (postData) {
                            req.write(postData);
                        }
                        // IMPORTANT
                        req.end();
                    })];
            });
        });
    };
    return HttpService;
}());
exports.HttpService = HttpService;
//# sourceMappingURL=http.service.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
;
;
;
//# sourceMappingURL=common-types.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var shellMnemonic = "radar blur cabbage chef fix engine embark joy scheme fiction master release";
var mecuriaMnemonic = "buyer try humor into improve thrive fruit funny skate velvet vanish live";
var trafiMnemonic = "volume roast script mind garbage embark lizard utility else blur year dentist";
var bpMnemonic = "foil feed pool urban pupil eyebrow step guess plug palace lion neutral";
var kochMnemonic = "type either sock busy quote sugar bullet wish use visit magnet innocent";
var acmeSAASVendorMnemonic = "twenty neither hill property whisper frozen angry peace industry easily return switch";
/**
 * This class implements a secure vault service to store and create mnemonics for the hdwallet
 */
var SecureEnclaveService = /** @class */ (function () {
    function SecureEnclaveService() {
    }
    /**
     * returns a new mnemomic for an HD wallet. If one does not exist, or if createNew = true,
     it creates a new set of seed words and returns them
     * @param companyName
     */
    SecureEnclaveService.prototype.getMnemonic = function (companyName, createNew) {
        if (createNew === void 0) { createNew = false; }
        var mnemonic;
        switch (companyName) {
            case "Mercuria":
                mnemonic = mecuriaMnemonic;
                break;
            case "Shell Corporation":
                mnemonic = shellMnemonic;
                break;
            case "Trafigura":
                mnemonic = trafiMnemonic;
                break;
            case "BP":
                mnemonic = bpMnemonic;
                break;
            case "Koch":
                mnemonic = kochMnemonic;
                break;
            case "AcmeSAASVendor":
                mnemonic = acmeSAASVendorMnemonic;
                break;
            default:
                mnemonic = shellMnemonic;
        }
        console.log("Mnemonic:", mnemonic);
        return mnemonic;
    };
    return SecureEnclaveService;
}());
exports.SecureEnclaveService = SecureEnclaveService;
//# sourceMappingURL=secure-enclave-service.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

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
var ethers = __webpack_require__(3);
var utils_1 = __webpack_require__(7);
var asymmetrickey_encryption_1 = __webpack_require__(33);
var symmetrickey_encryption_1 = __webpack_require__(34);
var base_contract_1 = __webpack_require__(17);
var tradefactory_1 = __webpack_require__(35);
var ethersUtils = ethers.utils;
var walletObject = ethers.Wallet;
var Web3 = __webpack_require__(0);
var Tx = __webpack_require__(6);
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

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ECIES = __webpack_require__(11);
var bitcore = __webpack_require__(2);
var AsymmetricKeyEncryption = /** @class */ (function () {
    function AsymmetricKeyEncryption() {
    }
    AsymmetricKeyEncryption.prototype.bitcorePublicKey = function (privateKey) {
        var privKey = new bitcore.PrivateKey(privateKey.slice(2));
        var pubKey = new bitcore.PublicKey.fromPrivateKey(privKey);
        return pubKey.toString();
    };
    AsymmetricKeyEncryption.prototype.encrypt = function (dataUtf8Text, bitcorePublicKey) {
        /*
         * this key is used as false sample, because bitcore would crash when alice has no privateKey
         */
        var bitcorePrivateKey = new bitcore.PrivateKey('52435b1ff21b894da15d87399011841d5edec2de4552fdc29c8299574436925d');
        var keyset = ECIES().privateKey(bitcorePrivateKey).publicKey(new bitcore.PublicKey(bitcorePublicKey));
        var encrypted = keyset.encrypt(dataUtf8Text);
        return encrypted.toString('hex');
    };
    ;
    AsymmetricKeyEncryption.prototype.decrypt = function (encryptedDataHex, privateKey) {
        var bitcorePrivateKey = new bitcore.PrivateKey(privateKey.slice(2));
        var keyset = ECIES().privateKey(bitcorePrivateKey);
        var decryptMe = new Buffer(encryptedDataHex, 'hex');
        var decrypted = keyset.decrypt(decryptMe);
        return decrypted.toString('utf8');
    };
    return AsymmetricKeyEncryption;
}());
exports.AsymmetricKeyEncryption = AsymmetricKeyEncryption;
//# sourceMappingURL=asymmetrickey-encryption.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var crypto = __webpack_require__(13);
var cipher = crypto.createCipher('aes256', 'a password');
var algorithm = 'aes256';
var inputEncoding = 'utf8';
var outputEncoding = 'hex';
var SymmetricKeyEncryption = /** @class */ (function () {
    function SymmetricKeyEncryption() {
        this.ALPHANUMERIC = "-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_";
    }
    SymmetricKeyEncryption.prototype.randomSalt = function (len) {
        var s = "";
        for (var i = 0; i < len; i++) {
            var index = Math.floor(Math.random() * 64);
            s = s + this.ALPHANUMERIC.substring(index, index + 1);
        }
        return s;
    };
    SymmetricKeyEncryption.prototype.generateSymKey = function () {
        return this.randomSalt(128);
    };
    SymmetricKeyEncryption.prototype.encrypt = function (dataUtf8Text, key) {
        var cipher = crypto.createCipher(algorithm, key);
        var ciphered = cipher.update(dataUtf8Text, inputEncoding, outputEncoding);
        ciphered += cipher.final(outputEncoding);
        return ciphered;
    };
    SymmetricKeyEncryption.prototype.decrypt = function (encryptedDataHex, key) {
        var decipher = crypto.createDecipher(algorithm, key);
        var finalData = decipher.update(encryptedDataHex, outputEncoding, inputEncoding);
        finalData += decipher.final(inputEncoding);
        return finalData;
    };
    return SymmetricKeyEncryption;
}());
exports.SymmetricKeyEncryption = SymmetricKeyEncryption;
//# sourceMappingURL=symmetrickey-encryption.js.map

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

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
var ethers = __webpack_require__(3);
var utils_1 = __webpack_require__(7);
var base_contract_1 = __webpack_require__(17);
var ethersUtils = ethers.utils;
var walletObject = ethers.Wallet;
var Web3 = __webpack_require__(0);
var Tx = __webpack_require__(6);
var utils = new utils_1.Utils();
var TradeFactory = /** @class */ (function (_super) {
    __extends(TradeFactory, _super);
    function TradeFactory(abiPath, provider) {
        var _this = _super.call(this, abiPath, provider) || this;
        _this.getWeb3();
        return _this;
    }
    TradeFactory.prototype.getContract = function (guid, factoryAddress, signingWalletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var tradeFactoryString, tradeFactoryAbi, tradeFactory, tradeAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utils.writeFormattedMessage("Inside TradeFactory getContract", { guid: guid, facAddress: factoryAddress, walletAddress: signingWalletAddress });
                        tradeFactoryString = this.loadAbi("TradeFactory", this.abiPath);
                        tradeFactoryAbi = JSON.parse(tradeFactoryString);
                        tradeFactory = new this.web3.eth.Contract(tradeFactoryAbi.abi);
                        tradeAddress = "";
                        tradeFactory.options.address = factoryAddress;
                        return [4 /*yield*/, tradeFactory.methods.getContract(guid).call({ from: signingWalletAddress })];
                    case 1:
                        tradeAddress = _a.sent();
                        utils.writeFormattedMessage("getContract Trade Address", tradeAddress);
                        return [2 /*return*/, tradeAddress];
                }
            });
        });
    };
    return TradeFactory;
}(base_contract_1.BaseContract));
exports.TradeFactory = TradeFactory;
//# sourceMappingURL=tradefactory.js.map

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

const root = __webpack_require__(9).path;

module.exports = {
    companyName: "Shell Corporation",
    baseUrl: "http://localhost:"
};

/***/ })
/******/ ])));