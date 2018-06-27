import { IStorageProvider } from "../interfaces/istorage-provider";
import { OnetimeKey } from "../common/models";
import { Utils } from "../services/utils";
import ethers = require('ethers');
import bitcore = require('bitcore-lib');
const utils = new Utils();
const walletObject = ethers.Wallet;
let addressIndex: number = -1;

export class OnetimeKeyGeneratorService {
    private walletCache: IStorageProvider;
    private mnemonics: string;
    
    constructor(mnemonic: string,  storageProvider: IStorageProvider) {
        this.mnemonics = mnemonic;
        this.walletCache = storageProvider;
    }
    
    public async getOnetimeKey(txnRef: string, networkId: string): Promise<OnetimeKey> {
        let onetimeKeyData = await this.createOrGetOnetimeKeyFromStorage(txnRef, networkId);
        
        if(onetimeKeyData) 
            return {networkId: onetimeKeyData.networkId, address: onetimeKeyData.onetimeAddress, publicKey: onetimeKeyData.onetimePublicKey};
        
        return null;
    }

    public async signTransaction(txnRef: string, networkId: string, txn: any, web3): Promise<{signedTx: string, signedTxObj: any, rawTx: any}> {
        let signedTx;
        let txnObj;
        let keyData = await this.createOrGetOnetimeKeyFromStorage(txnRef, networkId);
        
        if(keyData && txn) {
            let wallet = walletObject.fromMnemonic(this.mnemonics, keyData.derivedPath);
            txn["from"] = wallet.address;
            txn["nonce"] = await web3.eth.getTransactionCount(wallet.address);
            console.log("Tx before signing:",txn);                
            
            txnObj = utils.buildTransaction(txn);            
            let pKey = Buffer.from(wallet.privateKey.slice(2), 'hex');
            txnObj.sign(pKey);
            //console.log("txnObj",txnObj);
            signedTx ='0x'+ txnObj.serialize().toString('hex');
        }
        return {signedTx: signedTx, signedTxObj: txnObj, rawTx: txn};
    } 

    public async signMessage(txnRef: string, networkId: string, message: string): Promise<string> {
        let signature;
        let keyData = await this.createOrGetOnetimeKeyFromStorage(txnRef, networkId);
        if(keyData) {
            var wallet = walletObject.fromMnemonic(this.mnemonics, keyData.derivedPath);
            signature = wallet.signMessage(message);
        }
        return signature;
    }

    private async createOrGetOnetimeKeyFromStorage(txnRef: string, networkId: string) {
        let result = await this.walletCache.readOnetimeKeyPath(txnRef, networkId);
        if(!result) {
            let walletPath: string = this.getNextAddressPath();
            //Create a new wallet object from a given mnemonic.
            var wallet = walletObject.fromMnemonic(this.mnemonics, walletPath);
            var bitcorePublicKey = this.bitcorePublicKey(wallet.privateKey);
            
            await this.walletCache.storeOnetimeKeyPath(txnRef, networkId, wallet.address, bitcorePublicKey, walletPath);
            
            //console.log({networkId: networkId, address: wallet.address, publicKey: bitcorePublicKey, privateKey: wallet.privateKey});
            result = {txnRef:txnRef, networkId: networkId, onetimeAddress: wallet.address, onetimePublicKey: bitcorePublicKey, derivedPath: walletPath};
        }
        return result;
    }

    /**
     * gets the wallet address path using the next index in the sequence
     */
    private getNextAddressPath(): string {
        //Increment the address index
        addressIndex = addressIndex + 1;

        //return the wallet path to the new index
        return "m/44'/60'/0'/0/" + addressIndex;
    }

    private bitcorePublicKey(privateKey: string) {
        var privKey = new bitcore.PrivateKey(privateKey.slice(2));
        var pubKey = new bitcore.PublicKey.fromPrivateKey(privKey);
        return pubKey.toString();
    }
}