import ethers = require('ethers');

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
}