import { OnetimeKey } from '../common/models';

export interface IStorageProvider {
    storeOnetimeKeyMap(txnRef:string, networkId:string, parties:Array<{partyName:string,onetimeKey:OnetimeKey}>);
    readOnetimeKeyMap(txnRef:string, networkId:string): Promise<{txnRef:string, networkId:string, partyKeyMap:Array<{partyName:string,onetimeKey:OnetimeKey}>}>;
    storeOnetimeKeyPath(txnRef:string, networkId:string, onetimeAddress:string, onetimePublicKey:string, derivedPath:string);
    readOnetimeKeyPath(txnRef:string, networkId:string): Promise<{txnRef:string, networkId:string, onetimeAddress:string, onetimePublicKey:string, derivedPath:string}>;
}