"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require('crypto');
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