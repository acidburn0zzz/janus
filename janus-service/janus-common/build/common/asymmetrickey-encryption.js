"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ECIES = require('bitcore-ecies');
var bitcore = require('bitcore-lib');
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