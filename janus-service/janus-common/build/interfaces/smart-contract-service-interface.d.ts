import { EncryptedSymKeyInfo } from '../common/common-types';
export interface ExecuteTransactionPropInterface {
    guid: string;
    factoryAddress: string;
    contractName: string;
    methodName: string;
    signingWallet: any;
}
export interface SendTransactionPropertiesInterface extends ExecuteTransactionPropInterface {
    parameters: string[];
    data: {};
    symmetricKeyIndex: number;
    oneTimeAddress: string;
}
export interface GrantAccessPropertiesInterface extends ExecuteTransactionPropInterface {
    partyIndex: number;
    otherPartyIndex: number;
    partyCompanyName: string;
    otherPartyCompanyName: string;
    otherPartyBitcorePubKey: string;
}
export interface SmartContractServiceInterface {
    sendTransaction(transactionProperties: SendTransactionPropertiesInterface): Promise<string>;
    grantAccess(grantAccessProperties: GrantAccessPropertiesInterface): Promise<EncryptedSymKeyInfo[]>;
}
