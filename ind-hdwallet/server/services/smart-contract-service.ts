import ethers = require('ethers');
import * as indCommon from 'ind-common';

const ethersUtils = ethers.utils;
const walletObject = ethers.Wallet;

const Web3 = require("web3");
const solc = require("solc");
const Tx = require('ethereumjs-tx');
var fs = require('fs');
var path_module = require('path');
const utils = new indCommon.Utils();

export class SendTransactionProperties implements indCommon.SendTransactionPropertiesInterface {
    guid: string;
    factoryAddress: string;
    contractName: string;
    methodName: string;
    parameters: string[];
    data: {};
    symmetricKeyIndex: number;
    oneTimeAddress: string;
    signingWallet: ethers.Wallet;

    constructor() {
        this.data = new Object();
    }
}

export class SmartContractService implements indCommon.SmartContractServiceInterface {

    private web3: any;
    private contractPath: string;
    private provider: string;
    private static _instance: indCommon.SmartContractServiceInterface;


    private constructor(contractPath: string, provider: string) {
        this.contractPath = contractPath;
        this.provider = provider;


        this.getWeb3();
    }

    private getWeb3() {
        this.web3 = new Web3(Web3.givenProvider || this.provider);
    }

    public static getInstance(contractPath: string, provider: string) : indCommon.SmartContractServiceInterface {
        this._instance = this._instance || new SmartContractService(contractPath, provider);

            return this._instance;
    }

    public async sendTransaction(transactionProperties: indCommon.SendTransactionProperties): Promise<Object> {
        //Check the method name and use decorators to find the right method to execute

        try
        {
            let path = this.contractPath + '\\' + transactionProperties.contractName;

            utils.writeFormattedMessage("Inside Send Txn: Contract Path", path);

            let x = require(path);

            let contract = Object.create(x[transactionProperties.contractName].prototype);

            let args = new Array<string>();
            args.push('c:\\Forcefield\\privy\\contracts\\abi');
            args.push(this.provider);

            contract.constructor.apply(contract, args);

            return await contract[transactionProperties.methodName](transactionProperties);

        }
        catch (error) {
            utils.writeFormattedMessage("Error in sendTransaction", error);
        }
    }
}