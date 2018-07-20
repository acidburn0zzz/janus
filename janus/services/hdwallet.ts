import { ISigner } from "../interfaces/isigner";
import { IDirectoryProvider } from "../interfaces/idirectory-provider";
import { IMessageProvider } from "../interfaces/imessage-provider";
import { IStorageProvider } from "../interfaces/istorage-provider";
import { ISmartContractService } from "../interfaces/ismart-contract-service";
import { SmartContractService } from "../services/smart-contract-service";
import { OnetimeKeyGeneratorService } from "../services/onetimekey-generator-service";
import { Utils } from "../services/utils";
import { OnetimeKey, Message, MessageType, OnetimeKeyRequest, OnetimeKeyResponse } from "../common/models";
var Tx = require('ethereumjs-tx');
var Web3 = require("web3");
const utils = new Utils();

export class Hdwallet {
    private directoryProvider: IDirectoryProvider;
    private messageProvider: IMessageProvider
    private storageProvider: IStorageProvider;
    private signer: ISigner;
    private companyName: string;
    private mnemonics: string;
    private smartContractService: ISmartContractService;
    private onetimeKeyGenerator: OnetimeKeyGeneratorService;
    private web3;

    constructor(companyName: string, mnemonic: string, directoryProvider: IDirectoryProvider, 
        messageProvider: IMessageProvider, storageProvider: IStorageProvider, signer: ISigner, web3) {
        this.companyName = companyName;
        this.mnemonics = mnemonic;
        this.directoryProvider = directoryProvider;
        this.messageProvider = messageProvider;
        this.storageProvider = storageProvider;
        this.signer = signer;
        this.web3 = web3;
                   
        if(!this.web3)
            throw "Web3 instance is null";

        this.smartContractService = new SmartContractService(this.web3);
        
        if(this.mnemonics)
            this.onetimeKeyGenerator = new OnetimeKeyGeneratorService(this.mnemonics, this.storageProvider);

        this.messageProvider.watch(async (err, message) => { await this.onMessage(err, message); });  
        console.log("HDWallet initialized");
    }

    public async signTransaction(txnRef: string, networkId: string, txn: any ): Promise<{signedTx: string, signedTxObj: any, rawTx: any}> {
        let signedObj;
        if(this.onetimeKeyGenerator && txn) {
            signedObj = await this.onetimeKeyGenerator.signTransaction(txnRef, networkId, txn, this.web3);
        }
        return signedObj;
    }

    public async signMessage(txnRef: string, networkId: string, message: string): Promise<string> {
        let signature;
        if(this.onetimeKeyGenerator) {
            signature = await this.onetimeKeyGenerator.signMessage(txnRef, networkId, message);
        }
        return signature;
    }

    private async onMessage(err, message) {
        //console.log("In hdwallet onMessage:",message);
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
        
        if(msgType == MessageType.OnetimeKeyRequest) {
            await this.processOnetimeKeyRequest(payload, result.signerAddress);
        }
    }

    private async processOnetimeKeyRequest(payload: string, fromAddress: string) {
        if(!this.onetimeKeyGenerator)
            return;

        let request = new OnetimeKeyRequest(JSON.parse(payload));
        
        //verify requester "fromAddress"
        let verifyResult = await this.smartContractService.verifyAccount(fromAddress, request.sender);
        if(!verifyResult.status) //invalid request
            return;

        //console.log("Onetime key request received for txnRef:", request.transactionId, " from", request.sender);
        let key: OnetimeKey = await this.onetimeKeyGenerator.getOnetimeKey(request.transactionId, request.networkId);
                
        let responseMsg = new OnetimeKeyResponse({transactionId:request.transactionId, networkId:request.networkId, sender:this.companyName, onetimeKey: key});
        let msgString = JSON.stringify(responseMsg);
        let signature = await this.signer.sign(msgString);
        let message = new Message({type: MessageType.OnetimeKeyResponse, payload: msgString, signature: signature});

        let fromPublicKey = await this.directoryProvider.getCompanyKey(this.companyName, "shhKey");
        let toPublicKey = await this.directoryProvider.getCompanyKey(request.sender, "shhKey");
        //console.log("Sending response with key:", key);
        //console.log("Sending response for txnRef:", request.transactionId);
        await this.messageProvider.postMessage(fromPublicKey,toPublicKey,JSON.stringify(message));
    }
}