import { ISmartContractService } from "../interfaces/ismart-contract-service";
var Web3 = require("web3");
import { Utils } from "../services/utils";
const utils = new Utils();

export class SmartContractService implements ISmartContractService {
    private web3;

    constructor(web3) {
        this.web3 = web3;
    }

    public async verifyAccount(address: string, companyName: string): Promise<{status: boolean, error: string}> {
        //Implement the custom verification logic here
        
        return {status: true, error: ""};
    }

    public async getTransactionReceipt(txnHash, interval) {
        let attempt = 1;
        let maxAttent = 10;
        let defaultInterval = 500;
        return await this.transactionReceiptAsync(txnHash, interval || defaultInterval, attempt, maxAttent);
    };

    private async transactionReceiptAsync(txnHash, interval, attempt, maxAttent) {
        var receipt = this.web3.eth.getTransactionReceipt(txnHash);
        console.log("receipt:", receipt);
        if (!receipt) {
            console.log("Attempt:", attempt);
            attempt = attempt+1;
            if(attempt > maxAttent) {
                console.log("Stopping");
                receipt = {error: "Failed to get receipt"}
            } else {
                await utils.sleep(interval);
                receipt = await this.transactionReceiptAsync(txnHash, interval, attempt, maxAttent);                
            }
        } 
        return receipt;
    };

}