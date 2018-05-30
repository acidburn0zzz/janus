"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var indCommon = require("@manosamy/janus-common");
var utils = new indCommon.Utils();
var Sample = /** @class */ (function () {
    function Sample() {
    }
    Sample.prototype.doSomething = function (work) {
        utils.writeFormattedMessage("Doing Something", work);
    };
    return Sample;
}());
exports.Sample = Sample;
//# sourceMappingURL=sample.js.map