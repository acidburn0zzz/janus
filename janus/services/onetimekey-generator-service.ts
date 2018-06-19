import { IStorageProvider } from "../interfaces/istorage-provider";
import { OnetimeKey } from "../common/models";
import ethers = require('ethers');
import bitcore = require('bitcore-lib');
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
        let onetimeKeyData = await this.walletCache.readOnetimeKeyPath(txnRef, networkId);
        let result: OnetimeKey;

        if(onetimeKeyData) {
            result = {networkId: onetimeKeyData.networkId, address: onetimeKeyData.onetimeAddress, publicKey: onetimeKeyData.onetimePublicKey};
        } else {
            let walletPath: string = this.getNextAddressPath();
            //Create a new wallet object from a given mnemonic.
            var wallet = walletObject.fromMnemonic(this.mnemonics, walletPath);
            var bitcorePublicKey = this.bitcorePublicKey(wallet.privateKey);
            
            await this.walletCache.storeOnetimeKeyPath(txnRef, networkId, wallet.address, bitcorePublicKey, walletPath);
            
            //console.log({networkId: networkId, address: wallet.address, publicKey: bitcorePublicKey, privateKey: wallet.privateKey});
            result = {networkId: networkId, address: wallet.address, publicKey: bitcorePublicKey};
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