import { ISigner } from "../interfaces/isigner";
import { IDirectoryProvider } from "../interfaces/idirectory-provider";
import { IMessageProvider } from "../interfaces/imessage-provider";
import { IStorageProvider } from "../interfaces/istorage-provider";
import { ISmartContractService } from "../interfaces/ismart-contract-service";
import { SmartContractService } from "../services/smart-contract-service";
import { OnetimeKeyGeneratorService } from "../services/onetimekey-generator-service";
import { Utils } from "../services/utils";
import { Hdwallet } from "./hdwallet";
import { OnetimeKey, Message, MessageType, OnetimeKeyRequest, OnetimeKeyResponse } from "../common/models";
var Tx = require('ethereumjs-tx');
var Web3 = require("web3");
const utils = new Utils();

export class Janus {
    private directoryProvider: IDirectoryProvider;
    private messageProvider: IMessageProvider
    private storageProvider: IStorageProvider;
    private signer: ISigner;
    private companyName: string;
    private mnemonics: string;
    private nodeUrl: string;
    private smartContractService: ISmartContractService;
    private web3;
    private callbackMap: Map<string, (response) => void>;
    private fundingAccount: string;
    private hdwallet: Hdwallet;

    constructor(companyName: string, mnemonics: string, nodeUrl: string, directoryProvider: IDirectoryProvider, 
        messageProvider: IMessageProvider, storageProvider: IStorageProvider, signer: ISigner) {
        this.companyName = companyName;
        this.mnemonics = mnemonics;
        this.nodeUrl = nodeUrl;
        this.directoryProvider = directoryProvider;
        this.messageProvider = messageProvider;
        this.storageProvider = storageProvider;
        this.signer = signer;
        
        //console.log(this.directoryProvider);
        if(this.nodeUrl)
            this.web3 = new Web3(new Web3.providers.HttpProvider(this.nodeUrl));
            
        //if(!this.web3)
            //TODO: throw error

        this.smartContractService = new SmartContractService(this.web3);
        
        this.callbackMap = new Map<string, (message) => void>();
        this.messageProvider.watch(async (err, message) => { await this.onMessage(err, message); });  

        this.fundingAccount = this.web3.eth.accounts[0];
    }

    public startHdwallet(messageProvider: IMessageProvider) {
        if(!this.hdwallet)
            this.hdwallet = new Hdwallet(this.companyName, this.mnemonics, this.directoryProvider, messageProvider, this.storageProvider, this.signer, this.web3);
    }

    public async requestOnetimeKeys(txnRef: string, networkId: string, parties: Array<string>, callback: (response) => void) {
        let partiesKeyMap = new Array<{partyName:string,onetimeKey:OnetimeKey}>();
        //parties.forEach(function (value, index, array) {
        for(let i = 0; i<parties.length;i++) {
            let value = parties[i];
            if(value) {
                partiesKeyMap.push({partyName:value, onetimeKey: null});
            }
        //});
        }
        await this.storageProvider.storeOnetimeKeyMap(txnRef, networkId, partiesKeyMap);

        this.registerCallback(txnRef, callback);

        //parties.forEach(function (value, index, array) {
        for(let i = 0; i<parties.length;i++) {
            let value = parties[i];
            if(value) {
                //console.log("In requestOnetimeKeys");
                //Post OTA request for party
                let fromPublicKey = await this.directoryProvider.getCompanyKey(this.companyName, "shhKey");
                let toPublicKey = await this.directoryProvider.getCompanyKey(value, "shhKey");
                if(toPublicKey) {
                    //console.log("toPublicKey", toPublicKey);
                    let requestMsg = new OnetimeKeyRequest({transactionId:txnRef, networkId:networkId, sender:this.companyName, recepient:value});
                    let msgString = JSON.stringify(requestMsg);
                    let signature = await this.signer.sign(msgString);
                    let message = new Message({type: MessageType.OnetimeKeyRequest, payload: msgString, signature: signature});
                    //console.log("sending message", message);
                    await this.messageProvider.postMessage(fromPublicKey,toPublicKey,JSON.stringify(message));
                }
            }
        //});
        }
    }

    public async getOnetimeKeys(txnRef: string, networkId) {
        //Reading from storage provider
        console.log(this.storageProvider);
        return await this.storageProvider.readOnetimeKeyMap(txnRef, networkId);
    }

    public async signTransaction(txnRef: string, networkId: string, txn: any ): Promise<{signedTx: string, signedTxObj: any, rawTx: any}> {
        let signedObj;
        if(this.hdwallet && txn) {
            signedObj = await this.hdwallet.signTransaction(txnRef, networkId, txn);
        }
        return signedObj;
    }

    public async signMessage(txnRef: string, networkId: string, message: string): Promise<string> {
        let signature;
        if(this.hdwallet) {
            signature = await this.hdwallet.signMessage(txnRef, networkId, message);
        }
        return signature;
    }

    public async postTransaction(txnRef: string, networkId: string, txn: any ): Promise<any> {
        let response;
        if(this.hdwallet) {
            if(!txn["gasPrice"])
                txn["gasPrice"] = 0;
            if(!txn["gas"] && !txn["gasLimit"]) {
                var block = this.web3.eth.getBlock("latest");
                txn["gasLimit"] = block.gasLimit;
            }
            let signedObj = await this.hdwallet.signTransaction(txnRef, networkId, txn);
            //console.log("SignedTx",signedObj.signedTx);
            await this.fundAccountIfNeeded(signedObj.rawTx["from"]);
            response = await this.web3.eth.sendRawTransaction(signedObj.signedTx);
        }
        return response;
    }

    public async getTransactionReceipt(txnHash: string, interval: number) {
        return await this.smartContractService.getTransactionReceipt(txnHash, interval);
    }

    private async fundAccountIfNeeded(address: string) {
        let balance = await this.web3.eth.getBalance(address);
        //console.log("account", address);
        //console.log("balance", balance);
        if(!balance || balance.lt(this.web3.toWei(0.05,"ether"))) {
            console.log("funding...");
            let amount = this.web3.toWei(0.1,"ether");
            let tx = await this.web3.eth.sendTransaction({from:this.fundingAccount, to:address, value:amount});
            console.log("tx hash:", tx);
            //let confirmedTxn = await this.web3.currentProvider.waitForTransaction(tx.hash, 20000);
            //console.log("confirmedTxn", confirmedTxn);
        }
    }

    private async onMessage(err, message) {
        if(err || !message) {
            console.log("Message:",message);
            console.log("Error:",err);
            return;
        }

        let msgType: MessageType = message["type"];
        let payload = message["payload"];
        let result = await utils.verifySignature(payload, message["signature"]);
        if(!result.isValid) {
            console.log("Invalid signature on message of type", msgType);
            return;
        }
        
        if(msgType == MessageType.OnetimeKeyResponse) {
            await this.processOnetimeKeyResponse(payload, result.signerAddress);
        }
    }

    private async processOnetimeKeyResponse(payload: string, fromAddress: string) {
        let response = new OnetimeKeyResponse(JSON.parse(payload));
        
        //TODO: verify responder "fromAddress"

        console.log("Onetime key response received for txnRef:", response.transactionId, " from", response.sender);
        //console.log("Response received:", response);
        await this.storageProvider.storeOnetimeKeyMap(response.transactionId, response.networkId, [{partyName:response.sender, onetimeKey:response.onetimeKey}]);

        let result = await this.storageProvider.readOnetimeKeyMap(response.transactionId, response.networkId);
        //console.log("Result:",result);
        //console.log("Result:",JSON.stringify(result));
        console.log(this.storageProvider);
        if(utils.checkIfKeyMapHasAllKeys(result.partyKeyMap)) {
            this.invokeCallback(response.transactionId, result);
            this.unregisterCallback(response.transactionId);
        }
    }

    private registerCallback(transactionId: string, callback: (response: any) => void) {
        if (transactionId && callback)
            this.callbackMap.set(transactionId, callback);
    }

    private unregisterCallback(transactionId: string) {
        if (transactionId)
            this.callbackMap.delete(transactionId);
    }

    private invokeCallback(transactionId: string, response: any) {
        if (transactionId && this.callbackMap.has(transactionId)){
            let callback = this.callbackMap.get(transactionId);
            if(callback)
                callback(response);
        }
    }
}