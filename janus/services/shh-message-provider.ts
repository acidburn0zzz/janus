import { IMessageProvider } from "../interfaces/imessage-provider";
var Web3 = require("web3");

export class ShhMessageProvider implements IMessageProvider {
    private web3;
    private shh;
    private myPrvKeyId;
    private myPubKey;
    private symKeyId;
    private symKey;
    private privateMessFilterId;
    private publicMessFilterId;
    private callback: (err, message) => void;
    
    constructor(web3, ShhKeyId) {
        var self = this;
        this.web3 = web3;
        this.shh = this.web3.shh;
        //console.log("Shh version:", this.shh.version());
        
        this.myPrvKeyId = ShhKeyId;
        if(!this.myPrvKeyId) {
            this.myPrvKeyId = process.env["ShhKeyId"];
            if(!this.myPrvKeyId)
                this.myPrvKeyId = this.shh.newKeyPair();
        }

        if(this.myPrvKeyId)
            this.myPubKey = this.shh.getPublicKey(this.myPrvKeyId);
        //console.log("myKeyId", this.myPrvKeyId);
        //console.log("myPubKey", this.myPubKey);
            

        this.symKey = process.env["ShhSymKey"];
        if(this.symKey)
            this.symKeyId = this.shh.addSymKey(this.symKey);
        
        //console.log("symKeyId", this.symKeyId);
        //console.log("symKey", this.symKey);
        
        if(this.myPrvKeyId) {
            this.privateMessFilterId = this.shh.newMessageFilter(
                {privateKeyID:this.myPrvKeyId}, async (err, res) => { await this.onMessage(err, res); }
            );
        }
        //console.log("privateMessFilterId", this.privateMessFilterId);

        if(this.symKeyId) {
            this.publicMessFilterId = this.shh.newMessageFilter(
                {symKeyID: this.symKeyId, topic: '0x12345678'}, async (err, res) => { await this.onMessage(err, res); }                                
            );                  
        }
        //console.log("publicMessFilterId", this.publicMessFilterId);
    }
    private async onMessage(err, res) {
        let message;
        if(!err) {
            let payload = this.web3.toAscii(res["payload"]);
            message = JSON.parse(payload)
        }
        if(this.callback)
            await this.callback(err, message);
    }

    public createNewKey() {
        this.myPrvKeyId = this.shh.newKeyPair();
        if(this.myPrvKeyId)
            this.myPubKey = this.shh.getPublicKey(this.myPrvKeyId);

        if(this.privateMessFilterId)
            this.shh.uninstallFilter(this.privateMessFilterId);
        
        this.privateMessFilterId = this.shh.newMessageFilter(
            {privateKeyID:this.myPrvKeyId}, async (err, res) => { await this.onMessage(err, res); }
        );
        //console.log("privateMessFilterId", this.privateMessFilterId);
    }

    public getPublicKey(): string {
        //console.log("this.myPubKey",this.myPubKey);
        return this.myPubKey;
    }

    public async postMessage(from:string, to:string, message:string){
        //console.log("Posting message:", message);
        //console.log("Posting message to:", to, ", from:", from);
        if(to) {
            this.shh.post({
                pubKey: to,
                topic: '0x12345678',
                ttl: 7,
                powTarget: 2.01,
                powTime: 2,
                payload: this.web3.fromAscii(message)
            });
        } else {
            this.shh.post({
                symKeyID: this.symKeyId,
                topic: '0x12345678',
                ttl: 7,
                powTarget: 2.01,
                powTime: 2,
                payload: this.web3.fromAscii(message)
            });
        }
    }

    public watch(callback: (err, message) => void){
        this.callback = callback;
    }
}