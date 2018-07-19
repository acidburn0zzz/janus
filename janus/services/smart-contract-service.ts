import { ISmartContractService } from "../interfaces/ismart-contract-service";
var Web3 = require("web3");

export class SmartContractService implements ISmartContractService {
    private web3;

    constructor(web3) {
        this.web3 = web3;
    }

    public async verifyAccount(address: string, companyName: string): Promise<{status: boolean, error: string}> {
        return {status: true, error: ""};
    }

    public async getTransactionReceipt(txnHash, interval) {
        let attempt = 1;
        let maxAttent = 10;
        var transactionReceiptAsync;
        interval = interval ? interval : 500;
        
        return await this.transactionReceiptAsync(txnHash, interval, attempt, maxAttent);
    };

    private async transactionReceiptAsync(txnHash, interval, attempt, maxAttent) {
        var receipt = this.web3.eth.getTransactionReceipt(txnHash);
        console.log("receipt:", receipt);
        if (!receipt) {
            console.log("Attempt:", attempt);
            attempt = attempt+1;
            if(attempt > maxAttent) {
                console.log("Stopping");
                return {error: "Failed to get receipt"}
            } else {
                setTimeout(async () => {
                    receipt = await this.transactionReceiptAsync(txnHash, interval, attempt, maxAttent);
                }, interval);
            }
        } 
        return receipt;
    };

}