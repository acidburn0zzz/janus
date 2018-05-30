import { SecureEnclaveServiceInterface } from '@manosamy/janus-common/build/interfaces/secure-enclave-service-interface';
/**
 * This class implements a secure vault service to store and create mnemonics for the hdwallet
 */
export declare class SecureEnclaveService implements SecureEnclaveServiceInterface {
    /**
     * returns a new mnemomic for an HD wallet. If one does not exist, or if createNew = true,
     it creates a new set of seed words and returns them
     * @param companyName
     */
    getMnemonic(companyName: string, createNew?: boolean): string;
}
