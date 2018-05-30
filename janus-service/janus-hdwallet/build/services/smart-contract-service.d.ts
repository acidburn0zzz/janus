import ethers = require('ethers');
import { SmartContractServiceInterface, SendTransactionPropertiesInterface, GrantAccessPropertiesInterface } from '@manosamy/janus-common/build/interfaces/smart-contract-service-interface';
import { EncryptedSymKeyInfo } from '@manosamy/janus-common/build/common/common-types';
export declare class SendTransactionProperties implements SendTransactionPropertiesInterface {
    guid: string;
    factoryAddress: string;
    contractName: string;
    methodName: string;
    signingWallet: ethers.Wallet;
    parameters: string[];
    data: {};
    symmetricKeyIndex: number;
    oneTimeAddress: string;
    constructor();
}
export declare class GrantAccessProperties implements GrantAccessPropertiesInterface {
    guid: string;
    factoryAddress: string;
    contractName: string;
    methodName: string;
    signingWallet: ethers.Wallet;
    partyIndex: number;
    otherPartyIndex: number;
    partyCompanyName: string;
    otherPartyCompanyName: string;
    otherPartyBitcorePubKey: string;
}
export declare class SmartContractService implements SmartContractServiceInterface {
    private web3;
    private contractPath;
    private abiPath;
    private provider;
    private static _instance;
    private constructor();
    private getWeb3();
    static getInstance(contractPath: string, abiPath: string, provider: string): SmartContractServiceInterface;
    sendTransaction(transactionProperties: SendTransactionProperties): Promise<string>;
    grantAccess(grantAccessProperties: GrantAccessPropertiesInterface): Promise<EncryptedSymKeyInfo[]>;
    private executeTransaction<T>(prop);
}
