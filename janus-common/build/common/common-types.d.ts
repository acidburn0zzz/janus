export interface BaseMessageObject {
    guid: string;
    companyName: string;
}
export declare type KeyFields = {
    key: string;
    fields: string[];
};
export interface DecryptDataRequestMessage extends BaseMessageObject {
    keys: KeyFields[];
    data: {};
}
export interface EncryptDataRequestMessage extends BaseMessageObject {
    keys: KeyFields[];
    data: {};
}
export interface PostTxnOtherInfo {
}
export interface EncryptedSymKeyInfo {
    encryptedSymKey: string;
    symKeyIndex: number;
}
