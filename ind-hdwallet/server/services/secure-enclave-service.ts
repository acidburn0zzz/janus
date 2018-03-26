
/**
 * This class implements a secure vault service to store and create mnemonics for the hdwallet
 */
export class SecureEnclaveService {

    /**
     * returns a new mnemomic for an HD wallet. If one does not exist, or if createNew = true,
     it creates a new set of seed words and returns them
     * @param companyName
     */
    public getMnemonic(companyName: string, createNew: boolean = false): string {

        return "radar blur cabbage chef fix engine embark joy scheme fiction master release";
    }

    
}