import ethers = require('ethers');

export interface SendTransactionPropertiesInterface {
    guid: string;
    factoryAddress: string;
    contractName: string;
    methodName: string;
    parameters: string[];
    data: {};
    symmetricKeyIndex: number;
    oneTimeAddress: string;
    signingWallet: ethers.Wallet;
}

export interface SmartContractServiceInterface {
    
    getinstance(contractPath: string, provider: string): SmartContractServiceInterface;
    sendTransaction(transactionProperties: SendTransactionPropertiesInterface): Promise<Object>;
}