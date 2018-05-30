"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var indCommon = require("@manosamy/janus-common");
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