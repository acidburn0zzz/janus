import { SecureEnclaveServiceInterface } from '@manosamy/janus-common/build/interfaces/secure-enclave-service-interface';

let shellMnemonic: string = "radar blur cabbage chef fix engine embark joy scheme fiction master release";
let mecuriaMnemonic: string = "buyer try humor into improve thrive fruit funny skate velvet vanish live";
let trafiMnemonic: string = "volume roast script mind garbage embark lizard utility else blur year dentist";
let bpMnemonic: string = "foil feed pool urban pupil eyebrow step guess plug palace lion neutral";
let kochMnemonic: string = "type either sock busy quote sugar bullet wish use visit magnet innocent";
let acmeSAASVendorMnemonic: string = "twenty neither hill property whisper frozen angry peace industry easily return switch";

/**
 * This class implements a secure vault service to store and create mnemonics for the hdwallet
 */
export class SecureEnclaveService implements SecureEnclaveServiceInterface {

    /**
     * returns a new mnemomic for an HD wallet. If one does not exist, or if createNew = true,
     it creates a new set of seed words and returns them
     * @param companyName
     */
    public getMnemonic(companyName: string, createNew: boolean = false): string {

        let mnemonic: string;
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
    }

    
}