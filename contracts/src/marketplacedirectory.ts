import ethers = require('ethers');
import * as indCommon from 'ind-common';
import { BaseContract } from './base-contract';

const ethersUtils = ethers.utils;
const walletObject = ethers.Wallet;

const Web3 = require("web3");
const Tx = require('ethereumjs-tx');
const utils = new indCommon.Utils();

export class MarketplaceDirectory extends BaseContract {

    constructor(abiPath: string, provider: string) {
        super(abiPath, provider);
        this.getWeb3();
    }

    public async getContract(marketplaceDirectoryAddress: string, signingWalletAddress: string): Promise<any> {

        utils.writeFormattedMessage("Inside getContract", { marketplaceDirectoryAddress: marketplaceDirectoryAddress, walletAddress: signingWalletAddress } );

        //get the contract address using the guid
        let marketplaceDirectoryString: string = this.loadAbi("MarketplaceDirectory", this.abiPath);
        let marketplaceDirectoryAbi = JSON.parse(marketplaceDirectoryString);
        let marketplaceDirectory = new this.web3.eth.Contract(marketplaceDirectoryAbi.abi);

        marketplaceDirectory.options.address = marketplaceDirectoryAddress;

        return marketplaceDirectory;
    }

    public async getParticipantByAddress(marketplaceDirectoryAddress: string, participantWalletAddress: string, signingWalletAddress: string): Promise<any> {
        //get the contract instance
        let marketplaceDirectory = await this.getContract(marketplaceDirectoryAddress, signingWalletAddress);
        let participant = marketplaceDirectory.methods.participant(participantWalletAddress).call({from: signingWalletAddress});
        
        utils.writeFormattedMessage("participant",participant);
        
        return participant;
    }
    
    public async getParticipantByName(marketplaceDirectoryAddress: string, participantName: string, parentName: string, signingWalletAddress: string): Promise<any> {
        //get the contract instance
        let marketplaceDirectory = await this.getContract(marketplaceDirectoryAddress, signingWalletAddress);
        let participant = marketplaceDirectory.methods.participant(participantName, parentName).call({from: signingWalletAddress});
        
        utils.writeFormattedMessage("participant",participant);
        
        return participant;
    }
}