import ethers = require('ethers');
var Tx = require('ethereumjs-tx');

export class Utils {
    public async verifySignature(message: string, signature: string): Promise<{isValid: boolean, signerAddress: string, error: string}>{
        let signerAddress: string, errorMsg: string;
        let isValid = false;
        try {
            signerAddress = ethers.Wallet.verifyMessage(message, signature);
            if(signerAddress) isValid = true;
        } catch (error) {
            errorMsg = error;
        }
        return {isValid: isValid, signerAddress: signerAddress, error: errorMsg };
    }

    public buildTransaction(txn: any) {
        if(!txn)
            return null;
        
        let rawTx = {
            from: txn["from"],
            to: txn["to"],
        };
        if (txn["nonce"])
            rawTx["nonce"] = ethers.utils.hexlify(txn["nonce"]);
        if (txn["value"])
            rawTx["value"] = ethers.utils.hexlify(txn["value"]);
        if (txn["gas"])
            rawTx["gasLimit"] = ethers.utils.hexlify(txn["gas"]);
        if (txn["gasLimit"])
            rawTx["gasLimit"] = ethers.utils.hexlify(txn["gasLimit"]);
        if (txn["gasPrice"])
            rawTx["gasPrice"] = ethers.utils.hexlify(txn["gasPrice"]);
        else
            rawTx["gasPrice"] = "0x0";
        if (txn["data"])
            rawTx["data"] = txn["data"];
        if (txn["chainId"])
            rawTx["chainId"] = ethers.Utils.hexlify(txn["chainId"]);
        
        return new Tx(rawTx);
    }

    public objToMap(obj: any) {
        const mp = new Map;
        Object.keys(obj). forEach (k => { mp.set(k, obj[k]) });
        return mp;
    }
}