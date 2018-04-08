export interface BaseMessageObject { guid: string; companyName: string; };
export type KeyFields = { key: string; fields: string[] };
export interface DecryptDataRequestMessage extends BaseMessageObject { keys: KeyFields[]; data: {} };
export interface EncryptDataRequestMessage extends BaseMessageObject { keys: KeyFields[]; data: {} };
export interface GrantAccessRequestMessage extends BaseMessageObject {
    accessibleSymmetricKey: string;
    partyOTAddress: string;
    partyBitcorePublicKey: string;
    contractAddress: string;
};

export interface PostTxnOtherInfo {
    
}