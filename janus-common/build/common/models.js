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
var constants = require("./constants");
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