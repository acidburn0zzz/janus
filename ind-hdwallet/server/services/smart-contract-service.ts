import ethers = require('ethers');
import {
    SmartContractServiceInterface, SendTransactionPropertiesInterface,
    GrantAccessPropertiesInterface, ExecuteTransactionPropInterface
} from 'ind-common/build/interfaces/smart-contract-service-interface';

import { EncryptedSymKeyInfo } from 'ind-common/build/common/common-types';

import { Utils } from 'ind-common/build/common/utils';

const ethersUtils = ethers.utils;
const walletObject = ethers.Wallet;

const Web3 = require("web3");

const Tx = require('ethereumjs-tx');
var fs = require('fs');
var path_module = require('path');
const utils = new Utils();

export class SendTransactionProperties implements SendTransactionPropertiesInterface {
    guid: string;
    factoryAddress: string;
    contractName: string;
    methodName: string;
    signingWallet: ethers.Wallet;
    parameters: string[];
    data: {};
    symmetricKeyIndex: number;
    oneTimeAddress: string;

    constructor() {
        this.data = new Object();
    }
}

export class GrantAccessProperties implements GrantAccessPropertiesInterface {
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


export class SmartContractService implements SmartContractServiceInterface {

    private web3: any;
    private contractPath: string;
    private abiPath: string;
    private provider: string;
    private static _instance: SmartContractServiceInterface;


    private constructor(contractPath: string, abiPath: string, provider: string) {
        this.contractPath = contractPath;
        this.abiPath = abiPath;
        this.provider = provider;


        this.getWeb3();
    }

    private getWeb3() {
        this.web3 = new Web3(Web3.givenProvider || this.provider);
    }

    public static getInstance(contractPath: string, abiPath: string, provider: string) : SmartContractServiceInterface {
        this._instance = this._instance || new SmartContractService(contractPath, abiPath, provider);

            return this._instance;
    }

    public async sendTransaction(transactionProperties: SendTransactionProperties): Promise<string> {

        try
        {
            let returnObject = await this.executeTransaction(transactionProperties) as string;

            return returnObject;
        }
        catch (error) {
            utils.writeFormattedMessage("Error in sendTransaction", error);
        }
    }


    public async grantAccess(grantAccessProperties: GrantAccessPropertiesInterface): Promise<EncryptedSymKeyInfo[]> {

        try {
            let returnObject = await this.executeTransaction(grantAccessProperties) as EncryptedSymKeyInfo[];

            return returnObject;
        }
        catch (error) {
            utils.writeFormattedMessage("Error in grantAccess", error);
        }
        
    }

    private async executeTransaction<T extends ExecuteTransactionPropInterface>(prop: T): Promise<Object> {

            try {
                let path = this.contractPath + '\\' + prop.contractName;

                let x = require(path);

                let contract = Object.create(x[prop.contractName].prototype);

                let args = new Array<string>();
                args.push(this.abiPath);
                args.push(this.provider);


                contract.constructor.apply(contract, args);


                utils.writeFormattedMessage("Inside executeTransaction, After calling constructor", prop);

                return await contract[prop.methodName](prop);

            }
            catch (error) {
                throw error;
            }
            
        }
}