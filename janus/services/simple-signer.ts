import { Wallet } from "ethers";
import { ISigner } from "../interfaces/isigner";
var Web3 = require("web3");

export class SimpleSigner implements ISigner {
    private wallet: Wallet; 
    private web3;

    constructor(privateKey) {
        let nodeUrl = process.env.NODE_URL;
        this.web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
        this.wallet = new Wallet(privateKey, this.web3.currentProvider);
    }

    public async sign(message: string): Promise<string> {
        let signature: string;
        if(message && this.wallet)
            signature = this.wallet.signMessage(message);
        return signature;
    }

}

export default SimpleSigner;