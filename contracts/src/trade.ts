import ethers = require('ethers');
//import * as indCommon from 'ind-common';

import { EncryptedSymKeyInfo } from 'ind-common/build/common/common-types';
import { Utils } from 'ind-common/build/common/utils';

import { SendTransactionPropertiesInterface, GrantAccessPropertiesInterface } from 'ind-common/build/interfaces/smart-contract-service-interface';
import { AsymmetricKeyEncryption } from 'ind-common/build/common/asymmetrickey-encryption';
import { SymmetricKeyEncryption } from 'ind-common/build/common/symmetrickey-encryption';

import { BaseContract } from './base-contract';
import { TradeFactory } from './tradefactory';

const ethersUtils = ethers.utils;
const walletObject = ethers.Wallet;

const Web3 = require("web3");
const Tx = require('ethereumjs-tx');
const utils = new Utils();

export class Trade extends BaseContract {


    private trade: any;
    private tradeAbi: any;

    constructor(abiPath: string, provider: string) {
        super(abiPath, provider);
        this.getWeb3();
    }



    private async getContract(guid: string, factoryAddress: string, signingWalletAddress: string): Promise<any>
    {
        if (!this.trade) {
            utils.writeFormattedMessage("Inside Trade getContract", { guid: guid, facAddress: factoryAddress, walletAddress: signingWalletAddress });

            let tradeString: string = this.loadAbi("Trade", this.abiPath);
            this.tradeAbi = JSON.parse(tradeString);
            this.trade = new this.web3.eth.Contract(this.tradeAbi.abi);

            //get the contract address using the guid
            let tradeFactoryContract = new TradeFactory(this.abiPath, this.provider);
            let tradeAddress: string = await tradeFactoryContract.getContract(guid, factoryAddress, signingWalletAddress);

            this.trade.options.address = tradeAddress;

            utils.writeFormattedMessage("Trade Address", tradeAddress);
        }

        return this.trade;
    }

    public async getAccessibleSymmetricKeyForParty(guid: string, factoryAddress: string,
                signingAddress: string, symmetricKeyIndex: number,
                partyOneTimeAddress: string): Promise<string> {

        try {
            let tradeContract = await this.getContract(guid, factoryAddress, signingAddress);

            utils.writeFormattedMessage("Symmetric key for trade with Guid", guid);

            let symmetricKey = await tradeContract.methods.getAccessibleSymmetricKeyForParty(partyOneTimeAddress, symmetricKeyIndex).
                                                           call({ from: signingAddress });

            return symmetricKey;
        }
        catch (error) {
            throw error;
        }
    }

    public async updateData(txnProps: SendTransactionPropertiesInterface): Promise<string> {

        utils.writeFormattedMessage("Inside updateData", txnProps);

        try {
            let symmetricKey = await this.getAccessibleSymmetricKeyForParty(txnProps.guid, txnProps.factoryAddress,
                txnProps.signingWallet.address, txnProps.symmetricKeyIndex,
                txnProps.oneTimeAddress);

            utils.writeFormattedMessage("Symmetric Key", symmetricKey);

            //we got the symmetric key. Now encrypt the data using this key
            let asymEncryp: AsymmetricKeyEncryption = new AsymmetricKeyEncryption();
            let symEncryp: SymmetricKeyEncryption = new SymmetricKeyEncryption();

            //decrypt the symmetric key here
            utils.writeFormattedMessage("Private key", txnProps.signingWallet.privateKey);

            //TODO: uncomment before checking in
            //let decryptedSymmetricKey: string = asymEncryp.decrypt(symmetricKey, transactionProperties.signingWallet.privateKey);
            let privateKey = "0xb96e9ccb774cc33213cbcb2c69d3cdae17b0fe4888a1ccd343cbd1a17fd98b18";
            let decryptedSymmetricKey: string = asymEncryp.decrypt(symmetricKey.slice(2), privateKey);

            utils.writeFormattedMessage("Decrypted Symmetric Key", decryptedSymmetricKey);


            let encryptedData = new Object();

            utils.writeFormattedMessage("Function parameters", txnProps.parameters);
            utils.writeFormattedMessage("Function data", txnProps.data);


            txnProps.parameters.forEach((element) => {
                encryptedData[element] = symEncryp.encrypt(txnProps.data[element], decryptedSymmetricKey);
                utils.writeFormattedMessage("Encrypted Data for " + element, encryptedData[element]);
            });

            let tradeContract = await this.getContract(txnProps.guid, txnProps.factoryAddress,
                txnProps.signingWallet.address);

            let functionAbi: any;

            this.tradeAbi.abi.forEach(element => {
                if (element.name == txnProps.methodName) {
                    functionAbi = element;
                }
            })


            let txnObject = this.web3.eth.abi.encodeFunctionCall({
                    name: txnProps.methodName,
                    type: 'function',
                    inputs: functionAbi.inputs,
                }, [utils.keccak256(symmetricKey), encryptedData['tradeDate'], encryptedData['product'],
                    encryptedData['qty'], encryptedData['price']]);

            let estimatedGas = await this.web3.eth.estimateGas({
                to: this.trade.options.address,
                data: txnObject
            });

            let signedTransaction = await this.web3.eth.accounts.signTransaction({
                to: this.trade.options.address, data: txnObject,
                gas: estimatedGas
                },
                privateKey);

            let txnReceipt = await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

            utils.writeFormattedMessage("Send Transaction Receipt", txnReceipt);

            return txnReceipt.transactionHash;
        }
        catch (error) {
            utils.writeFormattedMessage("Error in updateData", error);
            throw error;
        }
    }

    public async updatePaymentInfo(txnProps: SendTransactionPropertiesInterface): Promise<string> {

        try {
            let symmetricKey = await this.getAccessibleSymmetricKeyForParty(txnProps.guid, txnProps.factoryAddress,
                txnProps.signingWallet.address, txnProps.symmetricKeyIndex, txnProps.oneTimeAddress);

            utils.writeFormattedMessage("Symmetric Key", symmetricKey);

            //we got the symmetric key. Now encrypt the data using this key
            let asymEncryp: AsymmetricKeyEncryption = new AsymmetricKeyEncryption();
            let symEncryp: SymmetricKeyEncryption = new SymmetricKeyEncryption();

            //decrypt the symmetric key here
            utils.writeFormattedMessage("Private key", txnProps.signingWallet.privateKey);

            //TODO: uncomment before checking in
            //let decryptedSymmetricKey: string = asymEncryp.decrypt(symmetricKey, transactionProperties.signingWallet.privateKey);
            let privateKey = "0xb96e9ccb774cc33213cbcb2c69d3cdae17b0fe4888a1ccd343cbd1a17fd98b18";
            let decryptedSymmetricKey: string = asymEncryp.decrypt(symmetricKey.slice(2), privateKey);

            utils.writeFormattedMessage("Decrypted Symmetric Key", decryptedSymmetricKey);


            let encryptedData = new Object();

            txnProps.parameters.forEach((element) => {
                encryptedData[element] = symEncryp.encrypt(txnProps.data[element], decryptedSymmetricKey);
                utils.writeFormattedMessage("Encrypted data for " + element, encryptedData[element]);
            });

            let tradeContract = await this.getContract(txnProps.guid, txnProps.factoryAddress,
                txnProps.signingWallet.address);

            let functionAbi: any;

            this.tradeAbi.abi.forEach(element => {
                if (element.name == txnProps.methodName) {
                    functionAbi = element;
                }
            })

            let txnObject = this.web3.eth.abi.encodeFunctionCall({
                name: txnProps.methodName,
                type: 'function',
                inputs: functionAbi.inputs,
            }, [utils.keccak256(symmetricKey), encryptedData['paymentTerm']]);

            let estimatedGas = await this.web3.eth.estimateGas({
                to: this.trade.options.address,
                data: txnObject
            });

            let signedTransaction = await this.web3.eth.accounts.signTransaction({
                to: this.trade.options.address, data: txnObject,
                gas: estimatedGas
            },
                privateKey);

            let txnReceipt = await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

            utils.writeFormattedMessage("Send Transaction Receipt", txnReceipt);

            return txnReceipt.transactionHash;

        }
        catch (error) {
            utils.writeFormattedMessage("Error in updatePaymentInfo", error);
            throw error;
        }

    }

    public async grantAccess(grntaccsProps: GrantAccessPropertiesInterface): Promise<EncryptedSymKeyInfo[]> {

        try {

            let tradeContract = await this.getContract(grntaccsProps.guid, grntaccsProps.factoryAddress,
                                                        grntaccsProps.signingWallet.address);

            //use the party index to get the one time address of the other party
            let otherPartyOTA = await tradeContract.methods.partyOTAddresses(grntaccsProps.otherPartyIndex).
                call({ from: grntaccsProps.signingWallet.address });

            let partyOTA = await tradeContract.methods.partyOTAddresses(grntaccsProps.partyIndex).
                call({ from: grntaccsProps.signingWallet.address });

            let asymEncryp: AsymmetricKeyEncryption = new AsymmetricKeyEncryption();
            let symEncryp: SymmetricKeyEncryption = new SymmetricKeyEncryption();

           
            //use the partyIndex to get the list of Sym key indicies
            let symKeyIndex = -1;

            let encryptedKeys: EncryptedSymKeyInfo[];

            while (symKeyIndex != 0) {
                symKeyIndex = await tradeContract.methods.SYMKEY_LIST(grntaccsProps.partyIndex, 0).
                    call({ from: grntaccsProps.signingWallet.address });

                if (symKeyIndex == 0) break;

                let symmetricKey = await this.getAccessibleSymmetricKeyForParty(grntaccsProps.guid, grntaccsProps.factoryAddress,
                    grntaccsProps.signingWallet.address, symKeyIndex, partyOTA);

                //decryprt the encrupted symmetric key using the party OTA
                //TODO: uncomment before checking in
                //let decryptedSymmetricKey: string = asymEncryp.decrypt(symmetricKey, transactionProperties.signingWallet.privateKey);
                let privateKey = "0xb96e9ccb774cc33213cbcb2c69d3cdae17b0fe4888a1ccd343cbd1a17fd98b18";
                let decryptedSymmetricKey: string = asymEncryp.decrypt(symmetricKey.slice(2), privateKey);

                let otherPartyEncSymKey = asymEncryp.encrypt(decryptedSymmetricKey, grntaccsProps.otherPartyBitcorePubKey);

                encryptedKeys.push({ encryptedSymKey: otherPartyEncSymKey, symKeyIndex: symKeyIndex });
            }

            utils.writeFormattedMessage("Symmetric key list", encryptedKeys);

            return encryptedKeys;
        }
        catch (error) {
            
            utils.writeFormattedMessage("Error in grant access", error); 
        }
    }
}
