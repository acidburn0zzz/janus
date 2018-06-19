import { ISigner } from "../interfaces/isigner";
import { IDirectoryProvider } from "../interfaces/idirectory-provider";
import { IMessageProvider } from "../interfaces/imessage-provider";
import { IStorageProvider } from "../interfaces/istorage-provider";
import { ISmartContractService } from "../interfaces/ismart-contract-service";
import { SmartContractService } from "../services/smart-contract-service";
import { OnetimeKeyGeneratorService } from "../services/onetimekey-generator-service";
import { Utils } from "../services/utils";
import { OnetimeKey, Message, MessageType, OnetimeKeyRequest, OnetimeKeyResponse } from "../common/models";
var Web3 = require("web3");
const utils = new Utils();

export class Hdwallet {
    private directoryProvider: IDirectoryProvider;
    private messageProvider: IMessageProvider
    private storageProvider: IStorageProvider;
    private simpleSigner: ISigner;
    private companyName: string;
    private mnemonics: string;
    private nodeUrl: string;
    private smartContractService: ISmartContractService;
    private onetimeKeyGenerator: OnetimeKeyGeneratorService;
    private web3;
    private callbackMap: Map<string, (response) => void>;

    constructor(companyName: string, mnemonic: string, nodeUrl: string, directoryProvider: IDirectoryProvider, 
        messageProvider: IMessageProvider, storageProvider: IStorageProvider, simpleSigner: ISigner) {
        this.companyName = companyName;
        this.mnemonics = mnemonic;
        this.nodeUrl = nodeUrl;
        this.directoryProvider = directoryProvider;
        this.messageProvider = messageProvider;
        this.storageProvider = storageProvider;
        this.simpleSigner = simpleSigner;

        //console.log(this.directoryProvider);
        if(this.nodeUrl)
            this.web3 = new Web3(new Web3.providers.HttpProvider(this.nodeUrl));

        this.smartContractService = new SmartContractService(this.web3);
        this.onetimeKeyGenerator = new OnetimeKeyGeneratorService(this.mnemonics, this.storageProvider);

        this.callbackMap = new Map<string, (message) => void>();
        this.messageProvider.watch(async (err, message) => { await this.onMessage(err, message); });        
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
                //Post OTA request for party
                let fromPublicKey = await this.directoryProvider.getCompanyKey(this.companyName, "shhKey");
                let toPublicKey = await this.directoryProvider.getCompanyKey(value, "shhKey");
                if(toPublicKey) {

                    let requestMsg = new OnetimeKeyRequest({transactionId:txnRef, networkId:networkId, sender:this.companyName, recepient:value});
                    let msgString = JSON.stringify(requestMsg);
                    let signature = await this.simpleSigner.sign(msgString);
                    let message = new Message({type: MessageType.OnetimeKeyRequest, payload: msgString, signature: signature});

                    await this.messageProvider.postMessage(fromPublicKey,toPublicKey,JSON.stringify(message));
                }
            }
        //});
        }
    }

    public async getOnetimeKeys(txnRef: string, networkId) {
        //Reading from storage provider
        return await this.storageProvider.readOnetimeKeyMap(txnRef, networkId);
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
        
        if(msgType == MessageType.OnetimeKeyRequest) {
            await this.processOnetimeKeyRequest(payload, result.signerAddress);
        } else if(msgType == MessageType.OnetimeKeyResponse) {
            await this.processOnetimeKeyResponse(payload, result.signerAddress);
        }

    }

    private async processOnetimeKeyRequest(payload: string, fromAddress: string) {
        let request = new OnetimeKeyRequest(JSON.parse(payload));
        
        //TODO: verify requester "fromAddress"
        
        //console.log("Onetime key request received for txnRef:", request.transactionId, " from", request.sender);
        let key: OnetimeKey = await this.onetimeKeyGenerator.getOnetimeKey(request.transactionId, request.networkId);
                
        let responseMsg = new OnetimeKeyResponse({transactionId:request.transactionId, networkId:request.networkId, sender:this.companyName, onetimeKey: key});
        let msgString = JSON.stringify(responseMsg);
        let signature = await this.simpleSigner.sign(msgString);
        let message = new Message({type: MessageType.OnetimeKeyResponse, payload: msgString, signature: signature});

        let fromPublicKey = await this.directoryProvider.getCompanyKey(this.companyName, "shhKey");
        let toPublicKey = await this.directoryProvider.getCompanyKey(request.sender, "shhKey");
        //console.log("Sending response with key:", key);
        //console.log("Sending response for txnRef:", request.transactionId);
        await this.messageProvider.postMessage(fromPublicKey,toPublicKey,JSON.stringify(message));
    }

    private async processOnetimeKeyResponse(payload: string, fromAddress: string) {
        let response = new OnetimeKeyResponse(JSON.parse(payload));
        
        //console.log("Onetime key response received for txnRef:", response.transactionId, " from", response.sender);
        //console.log("Response received:", response);
        await this.storageProvider.storeOnetimeKeyMap(response.transactionId, response.networkId, [{partyName:response.sender, onetimeKey:response.onetimeKey}]);

        let result = await this.storageProvider.readOnetimeKeyMap(response.transactionId, response.networkId);
        //console.log("Result:",result);
        //console.log("Result:",JSON.stringify(result));
        
        let hasAllKey = this.checkIfKeyMapHasAllKeys(result.partyKeyMap);
        if(hasAllKey) {
            this.invokeCallback(response.transactionId, result);
            this.unregisterCallback(response.transactionId);
        }
    }

    private checkIfKeyMapHasAllKeys(keyMap: Array<{partyName:string,onetimeKey:OnetimeKey}>): boolean {
        let hasAllKey = true;
        for(let i = 0; i<keyMap.length;i++) {
            let keyMapItem = keyMap[i];
            if(keyMapItem && !keyMapItem.onetimeKey) {
                hasAllKey = false;
                break;
            }
        }
        return hasAllKey;
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