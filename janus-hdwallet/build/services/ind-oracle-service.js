"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IndirectionOracleService = /** @class */ (function () {
    function IndirectionOracleService() {
    }
    IndirectionOracleService.instance = function () {
        if (this._instance == null)
            this._instance = new IndirectionOracleService();
        return this._instance;
    };
    IndirectionOracleService.prototype.register = function (companyName, url) {
    };
    IndirectionOracleService.prototype.unRegister = function (companyName) {
    };
    return IndirectionOracleService;
}());
exports.IndirectionOracleService = IndirectionOracleService;
//# sourceMappingURL=ind-oracle-service.js.map