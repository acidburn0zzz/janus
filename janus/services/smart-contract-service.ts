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
}