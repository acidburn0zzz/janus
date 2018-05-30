import ethers = require('ethers');
import {
    SmartContractServiceInterface, SendTransactionPropertiesInterface,
    GrantAccessPropertiesInterface, ExecuteTransactionPropInterface
} from '@manosamy/janus-common/build/interfaces/smart-contract-service-interface';

import { EncryptedSymKeyInfo } from '@manosamy/janus-common/build/common/common-types';

import { Utils } from '@manosamy/janus-common/build/common/utils';
var contracts = require('@manosamy/janus-contracts');

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

        console.log(prop);
            try {
                // let path = this.contractPath + '\\' + prop.contractName.toLowerCase();
                // console.log("prop.contractName",prop.contractName.toLowerCase());
                // console.log("path", path);
                // let z = require("C:\\Code\\BlockChain\\privy\\ind-hdwallet-service\\build\\trade.js");
                // console.log("z", z);
                // let y = require("C:\\Code\\BlockChain\\privy\\contracts\\build\\trade.js");
                // console.log("y", y);
                //let path = this.contractPath + '\\' + prop.contractName.toLowerCase()+ ".js";
                //console.log("path", path);
                //let path1 = path.replace(/\\/g, "\\\\",);
                //console.log("path1", path1);
                //let y = require(path1);
                //console.log("y", y);
                //let path = "C:\\Code\\BlockChain\\privy\\contracts\\build\\trade.js";
                //console.log("path", path);
                //let x = require(this.contractPath.replace(/\\/g, "\\\\") + '\\\\' + prop.contractName.toLowerCase()+".js");
                //let x = require("C:\\Code\\BlockChain\\privy\\contracts\\build\\trade.js");
		        //let x = require(“\\Users\\mano\\quorum\\janus\\janus-contracts\\build\\trade.js”);

                //console.log("x", x);
                let contract = Object.create(contracts[prop.contractName].prototype);

                let args = new Array<string>();
                args.push(this.abiPath);
                args.push(this.provider);


                contract.constructor.apply(contract, args);


                utils.writeFormattedMessage("Inside executeTransaction, After calling constructor", prop);

                return await contract[prop.methodName](prop);

            }
            catch (error) {
                console.log(error);
                throw error;
            }
            
        }
}