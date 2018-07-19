export interface ISmartContractService {
    verifyAccount(address: string, companyName: string): Promise<{status: boolean, error: string}>;
    getTransactionReceipt(txnHash, interval): Promise<any>;
}