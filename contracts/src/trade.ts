import ethers = require('ethers');
import * as indCommon from 'ind-common';
import { BaseContract } from './base-contract';
import { TradeFactory } from './tradefactory';

const ethersUtils = ethers.utils;
const walletObject = ethers.Wallet;

const Web3 = require("web3");
const Tx = require('ethereumjs-tx');
const utils = new indCommon.Utils();



export class Trade extends BaseContract {


    private trade: any;
    private tradeAbi: any;

    constructor(abiPath: string, provider: string) {
        super(abiPath, provider);
        this.getWeb3();
    }



    private async getContract(transactionProperties: indCommon.SendTransactionProperties): Promise<any>
    {
        if (!this.trade) {
            let tradeString: string = this.loadAbi("Trade", this.abiPath);
            this.tradeAbi = JSON.parse(tradeString);
            this.trade = new this.web3.eth.Contract(this.tradeAbi.abi);

            //get the contract address using the guid
            let tradeFactoryContract = new TradeFactory(this.abiPath, this.provider);
            let tradeAddress: string = await tradeFactoryContract.getContract(transactionProperties.guid, transactionProperties.factoryAddress,
                transactionProperties.signingWallet.address);

            this.trade.options.address = tradeAddress;

            utils.writeFormattedMessage("Trade Address", tradeAddress);
        }

        return this.trade;
    }

    public async getAccessibleSymmetricKeyForParty(transactionProperties: indCommon.SendTransactionProperties): Promise<string> {

        let tradeContract = await this.getContract(transactionProperties);

        utils.writeFormattedMessage("Transaction Properties", transactionProperties);

        let symmetricKey = await tradeContract.methods.getAccessibleSymmetricKeyForParty(transactionProperties.oneTimeAddress, transactionProperties.symmetricKeyIndex).
            call({ from: transactionProperties.signingWallet.address });

        return symmetricKey;
    }

    public async updateData(transactionProperties: indCommon.SendTransactionProperties): Promise<Object> {

        try {
            let symmetricKey = await this.getAccessibleSymmetricKeyForParty(transactionProperties);

            utils.writeFormattedMessage("Symmetric Key", symmetricKey);

            //we got the symmetric key. Now encrypt the data using this key
            let asymEncryp: indCommon.AsymmetricKeyEncryption = new indCommon.AsymmetricKeyEncryption();
            let symEncryp: indCommon.SymmetricKeyEncryption = new indCommon.SymmetricKeyEncryption();

            //decrypt the symmetric key here
            utils.writeFormattedMessage("Private key", transactionProperties.signingWallet.privateKey);

            //TODO: uncomment before checking in
            let privateKey = transactionProperties.signingWallet.privateKey;
            //let privateKey = "0xb96e9ccb774cc33213cbcb2c69d3cdae17b0fe4888a1ccd343cbd1a17fd98b18";
            let decryptedSymmetricKey: string = asymEncryp.decrypt(symmetricKey.slice(2), privateKey);

            utils.writeFormattedMessage("Decrypted Symmetric Key", decryptedSymmetricKey);


            let encryptedData = new Object();

            transactionProperties.parameters.forEach((element) => {
                encryptedData[element] = symEncryp.encrypt(String(transactionProperties.data[element]), decryptedSymmetricKey);
                utils.writeFormattedMessage("Decrypted Symmetric Key for " + element, encryptedData[element]);
            });

            let tradeContract = await this.getContract(transactionProperties);

            let functionAbi: any;

            this.tradeAbi.abi.forEach(element => {
                if (element.name == transactionProperties.methodName) {
                    functionAbi = element;
                }
            })


            let txnObject = this.web3.eth.abi.encodeFunctionCall({
                    name: transactionProperties.methodName,
                    type: 'function',
                    inputs: functionAbi.inputs,
                }, [utils.keccak256(symmetricKey), encryptedData['tradeDate'], encryptedData['product'],
                    encryptedData['qty'], encryptedData['price']]);

            let estimatedGas = await this.web3.eth.estimateGas({
                to: this.trade.options.address,
                data: txnObject
            });
	    
            estimatedGas = estimatedGas + 20000;
            utils.writeFormattedMessage("estimatedGas", estimatedGas);

            let signedTransaction = await this.web3.eth.accounts.signTransaction({
                to: this.trade.options.address, data: txnObject,
                gas: estimatedGas
                },
                privateKey);

            let txnReceipt = await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

            utils.writeFormattedMessage("Send Transaction Receipt", txnReceipt);

            return txnReceipt;
        }
        catch (error) {
            utils.writeFormattedMessage("Error in updateData", error);
            throw error;
        }
    }

    public async updatePaymentInfo(transactionProperties: indCommon.SendTransactionProperties): Promise<Object> {

        try {
            let symmetricKey = await this.getAccessibleSymmetricKeyForParty(transactionProperties);

            utils.writeFormattedMessage("Symmetric Key", symmetricKey);

            //we got the symmetric key. Now encrypt the data using this key
            let asymEncryp: indCommon.AsymmetricKeyEncryption = new indCommon.AsymmetricKeyEncryption();
            let symEncryp: indCommon.SymmetricKeyEncryption = new indCommon.SymmetricKeyEncryption();

            //decrypt the symmetric key here
            utils.writeFormattedMessage("Private key", transactionProperties.signingWallet.privateKey);

            //TODO: uncomment before checking in
            let privateKey = transactionProperties.signingWallet.privateKey;
            //let privateKey = "0xb96e9ccb774cc33213cbcb2c69d3cdae17b0fe4888a1ccd343cbd1a17fd98b18";
            let decryptedSymmetricKey: string = asymEncryp.decrypt(symmetricKey.slice(2), privateKey);

            utils.writeFormattedMessage("Decrypted Symmetric Key", decryptedSymmetricKey);


            let encryptedData = new Object();

            transactionProperties.parameters.forEach((element) => {
                encryptedData[element] = symEncryp.encrypt(transactionProperties.data[element], decryptedSymmetricKey);
                utils.writeFormattedMessage("Encrypted data for " + element, encryptedData[element]);
            });

            let tradeContract = await this.getContract(transactionProperties);

            let functionAbi: any;

            this.tradeAbi.abi.forEach(element => {
                if (element.name == transactionProperties.methodName) {
                    functionAbi = element;
                }
            })

            let txnObject = this.web3.eth.abi.encodeFunctionCall({
                name: transactionProperties.methodName,
                type: 'function',
                inputs: functionAbi.inputs,
            }, [utils.keccak256(symmetricKey), encryptedData['paymentTerm']]);

            let estimatedGas = await this.web3.eth.estimateGas({
                to: this.trade.options.address,
                data: txnObject
            });
	    
            estimatedGas = estimatedGas + 20000;
            utils.writeFormattedMessage("estimatedGas", estimatedGas);

            let signedTransaction = await this.web3.eth.accounts.signTransaction({
                to: this.trade.options.address, data: txnObject,
                gas: estimatedGas
            },
                privateKey);

            let txnReceipt = await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

            utils.writeFormattedMessage("Send Transaction Receipt", txnReceipt);

            return txnReceipt;

        }
        catch (error) {
            utils.writeFormattedMessage("Error in updatePaymentInfo", error);
            throw error;
        }

    }
}
