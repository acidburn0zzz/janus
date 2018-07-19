import { IStorageProvider } from "../interfaces/istorage-provider";
import { OnetimeKey } from "../common/models";

export class FileStorageProvider implements IStorageProvider {

    private onetimeKeyPathMap: Map<string,{onetimeAddress:string, onetimePublicKey:string, derivedPath:string}>;
    private onetimeKeysMap: Map<string,Map<string,OnetimeKey>>;
    
    constructor() {
        this.onetimeKeyPathMap = new Map<string,{onetimeAddress:string, onetimePublicKey:string, derivedPath:string}>();
        this.onetimeKeysMap = new Map<string,Map<string,OnetimeKey>>();
    }

    public async storeOnetimeKeyMap(txnRef:string, networkId:string, partyKeyMap:Array<{partyName:string,onetimeKey:OnetimeKey}>) {
        let key = this.buildKey(txnRef, networkId);
        let partyKeyMapObj: Map<string,OnetimeKey>;
        if(this.onetimeKeysMap.has(key)) {
            partyKeyMapObj = this.onetimeKeysMap.get(key);
        } else {
            partyKeyMapObj = new Map<string,OnetimeKey>();
        }
        if(partyKeyMap) {
            partyKeyMap.forEach(function (value, index, array) {
                if(value)
                    partyKeyMapObj.set(value.partyName, value.onetimeKey);
            })
        }
        this.onetimeKeysMap.set(key, partyKeyMapObj);
    }

    public async readOnetimeKeyMap(txnRef:string, networkId:string): Promise<{txnRef:string, networkId:string, partyKeyMap:Array<{partyName:string,onetimeKey:OnetimeKey}>}> {
        let key = this.buildKey(txnRef, networkId);
        let partyKeyMapArray: Array<{partyName:string,onetimeKey:OnetimeKey}>;
        let partyKeyMapObj: Map<string,OnetimeKey>;
        if(this.onetimeKeysMap.has(key)) {
            partyKeyMapObj = this.onetimeKeysMap.get(key);
        }
        if(partyKeyMapObj) {
            partyKeyMapArray = new Array<{partyName:string,onetimeKey:OnetimeKey}>();
            partyKeyMapObj.forEach(function (value, key, map) {
                partyKeyMapArray.push({partyName:key,onetimeKey:value});
            })
        }
        if(partyKeyMapArray)
            return {txnRef: txnRef, networkId: networkId, partyKeyMap: partyKeyMapArray};
        return null;
    }

    public async storeOnetimeKeyPath(txnRef:string, networkId:string, onetimeAddress:string, onetimePublicKey:string, derivedPath:string) {
        let key = this.buildKey(txnRef, networkId);
        this.onetimeKeyPathMap.set(key, {onetimeAddress: onetimeAddress, onetimePublicKey: onetimePublicKey, derivedPath: derivedPath});
    }

    public async readOnetimeKeyPath(txnRef:string, networkId:string): Promise<{txnRef:string, networkId:string, onetimeAddress:string, onetimePublicKey:string, derivedPath:string}> {
        let key = this.buildKey(txnRef, networkId);
        if(this.onetimeKeyPathMap.has(key)) {
            let keyPath = this.onetimeKeyPathMap.get(key);
            if(keyPath) {
                return {txnRef:txnRef, networkId:networkId, onetimeAddress:keyPath.onetimeAddress, onetimePublicKey:keyPath.onetimePublicKey, derivedPath:keyPath.derivedPath};
            }
        }
        return null;
    }

    private buildKey(txnRef:string, networkId:string): string {
        return txnRef + "_" + networkId;
    }
}
export default FileStorageProvider;