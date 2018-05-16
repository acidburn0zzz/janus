export interface SecureEnclaveServiceInterface {
    getMnemonic(companyName: string, createNew: boolean): string;
}