import { Wallet } from "ethers";
import { ISigner } from "../interfaces/isigner";
var Web3 = require("web3");

export class SimpleSigner implements ISigner {
    private wallet: Wallet; 
    private web3;

    constructor(web3, privateKey) {
        this.web3 = web3;
        this.wallet = new Wallet(privateKey, this.web3.currentProvider);
    }

    public async sign(message: string): Promise<string> {
        let signature: string;
        if(message && this.wallet)
            signature = this.wallet.signMessage(message);
        return signature;
    }

}