import ethers = require('ethers');
import * as indCommon from '@manosamy/janus-common';
import { BaseContract } from './base-contract';

const ethersUtils = ethers.utils;
const walletObject = ethers.Wallet;

const Web3 = require("web3");
const Tx = require('ethereumjs-tx');
const utils = new indCommon.Utils();

export class MarketplaceDirectory extends BaseContract {

    constructor(abiPath: string, provider: string, web3: any) {
        super(abiPath, provider);
        if(web3)
            this.web3 = web3;
        this.getWeb3();
    }

    public async getContract(marketplaceDirectoryAddress: string, signingWalletAddress: string): Promise<any> {

        utils.writeFormattedMessage("Inside getContract", { marketplaceDirectoryAddress: marketplaceDirectoryAddress, walletAddress: signingWalletAddress } );

        //get the contract instance
        let marketplaceDirectoryString: string = this.loadAbi("MarketplaceDirectoryInterface", this.abiPath);
        let marketplaceDirectoryAbi = JSON.parse(marketplaceDirectoryString);
        let marketplaceDirectory = new this.web3.eth.Contract(marketplaceDirectoryAbi.abi);

        marketplaceDirectory.options.address = marketplaceDirectoryAddress;

        return marketplaceDirectory;
    }

    public async updateParticipant(marketplaceDirectoryAddress: string, effectiveDate: Date, terminationDate: Date, participantName: string, 
        participantWalletAddress: string, callerAddress: string) {
        
        utils.writeFormattedMessage("Inside updateParticipant", {marketplaceDirectoryAddress: marketplaceDirectoryAddress, effectiveDate: effectiveDate, terminationDate: terminationDate, participantName: participantName, participantWalletAddress: participantWalletAddress, callerAddress: callerAddress} );

        //get the contract instance
        let marketplaceDirectory = await this.getContract(marketplaceDirectoryAddress, callerAddress);
        let tx = await marketplaceDirectory.methods.updateParticipant(((effectiveDate!=null)?effectiveDate.getTime():0), ((terminationDate!=null)?terminationDate.getTime():0),participantName,participantWalletAddress).send({from: callerAddress});
        
        console.log("Transaction", tx);
        //utils.writeFormattedMessage("Transaction tx",tx);
        return tx;
    }

    public async getParticipantByAddress(marketplaceDirectoryAddress: string, participantWalletAddress: string, callerAddress: string): Promise<any> {
        //get the contract instance
        let marketplaceDirectory = await this.getContract(marketplaceDirectoryAddress, callerAddress);
        let participant = await marketplaceDirectory.methods.participant(participantWalletAddress).call({from: callerAddress});
        
        utils.writeFormattedMessage("participant",participant);
        
        return participant;
    }
    
    public async getParticipantByName(marketplaceDirectoryAddress: string, participantName: string, parentName: string, callerAddress: string): Promise<any> {
        //get the contract instance
        let marketplaceDirectory = await this.getContract(marketplaceDirectoryAddress, callerAddress);
        let participant = await marketplaceDirectory.methods.participant(participantName, parentName).call({from: callerAddress});
        
        utils.writeFormattedMessage("participant",participant);
        
        return participant;
    }

    public async CheckIfParticipantActiveByName(marketplaceDirectoryAddress: string, participantName: string, parentName: string, asofDate: Date, callerAddress: string): Promise<any> {
        //get the contract instance
        if(!asofDate) asofDate = new Date();
        let marketplaceDirectory = await this.getContract(marketplaceDirectoryAddress, callerAddress);
        let IsActive = await marketplaceDirectory.methods.IsParticipantActive(participantName, parentName, asofDate).call({from: callerAddress});
        
        utils.writeFormattedMessage("IsActive",IsActive);
        
        return IsActive;
    }

    public async CheckIfParticipantActiveByAddress(marketplaceDirectoryAddress: string, participantWalletAddress: string, asofDate: Date, callerAddress: string): Promise<any> {
        //get the contract instance
        if(!asofDate) asofDate = new Date();
        let marketplaceDirectory = await this.getContract(marketplaceDirectoryAddress, callerAddress);
        let IsActive = await marketplaceDirectory.methods.IsParticipantActive(participantWalletAddress, asofDate).call({from: callerAddress});
        
        utils.writeFormattedMessage("IsActive",IsActive);
        
        return IsActive;
    }
}