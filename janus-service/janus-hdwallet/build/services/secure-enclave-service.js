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