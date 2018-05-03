//import * as constants from "../script/constants" 
import * as mocha from 'mocha'
import * as chai from 'chai'
//import * as contracts from "contracts";
import { MarketplaceDirectory } from "../marketplacedirectory" 
const Web3 = require("web3");

var assert = require('assert');
const expect = chai.expect;
const should = chai.should();

var mochaAsync = (fn) => {
    return async () => {
        try {
            await fn();
            return;
        } catch (err) {
            throw err;
        }
    };
  };
  
var mochaAsyncBeforeHook = (fn) => {
    return async () => {
        try {
            await fn();
            return;
        } catch (err) {
            return;
        }
    };
};

describe.only('Marketplace Directory tests', () => {
    let marketplaceAddress: string;
	let tradeFactoryAddress: string;
	let abiPath: string;
    let contractsPath: string;
    let nodeUrl: string;
    let web3;
    let marketplaceDirectory: MarketplaceDirectory;
    
    let consortiumAddress: string;
    let companyAAddress: string;
    let companyBAddress: string;
    let emp1Address: string;
    let emp2Address: string;

    let consortiumPKey: string;
    let companyAPKey: string;
    let companyBPKey: string;
    let emp1PKey: string;
    let emp12Key: string

    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async function () {
            //add init here
            abiPath = "C:\\Code\\BlockChain\\privy\\Contracts\\abi"
            contractsPath = "C:\\Code\\BlockChain\\privy\\Contracts\\build";
            nodeUrl = "c";
            web3 = new Web3(nodeUrl);

            marketplaceAddress = "0xe3a8baa236ac8df21e4f41a2de9d89b068ada2c5";
            tradeFactoryAddress = "0x7904adfd948f5f99a987a86768f5decc1aecdea2";
            
            consortiumAddress = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";
            companyAAddress = "0xf17f52151EbEF6C7334FAD080c5704D77216b732";
            companyBAddress = "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef";            
            consortiumPKey = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
            companyAPKey = "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f";
            companyBPKey = "0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1";

            //web3.eth

            marketplaceDirectory = new MarketplaceDirectory(abiPath, nodeUrl, web3);

        });
        return fn();
    });

    it('Add companies', async function () {
        this.timeout(0);
        console.log("In add companies test");

        let companyAName = "Mercuria";
        let tx = await marketplaceDirectory.updateParticipant(marketplaceAddress,null,null,companyAName, companyAAddress, consortiumAddress);        
        console.log(tx);
        //verify
        let participantA = await marketplaceDirectory.getParticipantByAddress(marketplaceAddress, companyAAddress, consortiumAddress);
        assert.notEqual(participantA,null,"Reading Directory failed");
        console.log(participantA);
        assert.equal(participantA.name,companyAName,"CompanyA participant name did not saved in directory");
        assert.equal(participantA.walletAddress,companyAAddress,"CompanyA wallet address did not saved in directory");
        
        let companyBName = "Shell";
        await marketplaceDirectory.updateParticipant(marketplaceAddress,null,null,companyBName, companyBAddress, consortiumAddress);        
        //verify
        let participantB = await marketplaceDirectory.getParticipantByAddress(marketplaceAddress, companyBAddress, consortiumAddress);
        assert.notEqual(participantB,null,"Reading Directory failed");
        console.log(participantB);
        assert.equal(participantB.name,companyBName,"CompanyB participant name did not saved in directory");
        assert.equal(participantB.walletAddress,companyBAddress,"CompanyB wallet address did not saved in directory");

    });

});