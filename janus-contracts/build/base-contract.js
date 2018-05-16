"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@manosamy/janus-common/build/common/utils");
var utils = new utils_1.Utils();
var fs = require('fs');
var Web3 = require("web3");
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