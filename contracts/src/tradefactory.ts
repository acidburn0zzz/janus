import ethers = require('ethers');
import { Utils } from 'ind-common/build/common/utils';

import { BaseContract } from './base-contract';

const ethersUtils = ethers.utils;
const walletObject = ethers.Wallet;

const Web3 = require("web3");
const Tx = require('ethereumjs-tx');
const utils = new Utils();

export class TradeFactory extends BaseContract {

    constructor(abiPath: string, provider: string) {
        super(abiPath, provider);
        this.getWeb3();
    }

    public async getContract(guid: string, factoryAddress: string, signingWalletAddress: string): Promise<string> {

        utils.writeFormattedMessage("Inside TradeFactory getContract", { guid: guid, facAddress: factoryAddress, walletAddress: signingWalletAddress } );

        //get the contract address using the guid
        let tradeFactoryString: string = this.loadAbi("TradeFactory", this.abiPath);
        let tradeFactoryAbi = JSON.parse(tradeFactoryString);
        let tradeFactory = new this.web3.eth.Contract(tradeFactoryAbi.abi);

        let tradeAddress: string = "";

        tradeFactory.options.address = factoryAddress;

        tradeAddress = await tradeFactory.methods.getContract(guid).call({ from: signingWalletAddress });


        utils.writeFormattedMessage("getContract Trade Address", tradeAddress);
        return tradeAddress;

    }

}