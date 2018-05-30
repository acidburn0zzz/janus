"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bitcore = require('bitcore-lib');
var Web3 = require("web3");
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