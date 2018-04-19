import * as indClient from "../script/ind-client" 
import * as constants from "../script/constants" 
//import * as httpService from '../script/http.service';
import * as mocha from 'mocha'
import * as chai from 'chai'
import { Guid } from "guid-typescript";
import { HttpService, Party, PartyType, RegistrationData, WalletRegistrationRequest, MeterSummaryData, MeterSummaryRequest} from 'ind-common';

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

describe('Trade tests', () => {
    var agentSevice;
	let marketplaceAddress: string;
	let tradeFactoryAddress: string;
	let agentUrl: string;
	let oracleUrl: string;
    let client: indClient.IndClient;
    let testTradeNumber: number;
    let guid: string;
    let httpService: HttpService;

    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async function () {
            //add init here
            agentUrl = "localhost:4000";
            oracleUrl = "localhost:8000";
            marketplaceAddress = "0x7904adfd948f5f99a987a86768f5decc1aecdea2";
            tradeFactoryAddress = "0x7904adfd948f5f99a987a86768f5decc1aecdea2";
            guid = Guid.create().toString();
            testTradeNumber = 0;
            httpService = new HttpService();
            console.log("directory:", process.cwd());
            client = new indClient.IndClient(marketplaceAddress, tradeFactoryAddress, agentUrl, oracleUrl, httpService);

            let message = new RegistrationData({timestamp: (new Date()).getTime(), companyName: "Mercuria", url: "localhost:4000"});
            let request = new WalletRegistrationRequest({message: message});
            let response = await httpService.RaiseHttpRequest("localhost", "8000", "/registerWalletAgent", "POST", request);
            console.log("Registered Mercuria:", response);

            message = new RegistrationData({timestamp: (new Date()).getTime(), companyName: "Shell", url: "localhost:4000"});
            request = new WalletRegistrationRequest({message: message});
            response = await httpService.RaiseHttpRequest("localhost", "8000", "/registerWalletAgent", "POST", request);
            console.log("Registered Shell:", response);

            message = new RegistrationData({timestamp: (new Date()).getTime(), companyName: "BP", url: "localhost:4000"});
            request = new WalletRegistrationRequest({message: message});
            response = await httpService.RaiseHttpRequest("localhost", "8000", "/registerWalletAgent", "POST", request);
            console.log("Registered BP:", response);
        });
        return fn();
    });

    it('Create trade', async function () {
        this.timeout(0);
        console.log("In Create trade test");

        let buyerCompanyName = "Mercuria";
        let sellerCompanyName = "Shell";
        let buyerAddress: string = "0xf17f52151EbEF6C7334FAD080c5704D77216b732";
        let sellerAddress: string = "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef";
        
        let myParty = new Party({partyType:PartyType.Buyer,partyAddress:buyerAddress,companyName:buyerCompanyName});
        let otherParty = new Party({partyType:PartyType.Seller,partyAddress:sellerAddress,companyName:sellerCompanyName});
        let response = await client.createTrade(guid, myParty, otherParty, new Date(), "WTI", 10000, 50, "term1");
        
        //verify
        assert.notEqual(response,null,"Trade Creation failed");
        console.log(response);
        assert.equal(response.status,true,response.error);
        assert.notEqual(response.tradeNumber,0,"Trade Creation failed");
        testTradeNumber = response.tradeNumber;
    });

    it('Update party to trade', async function () {
        this.timeout(0);
        console.log("In Update party to trade test");

        assert.notEqual(testTradeNumber,0,"Trade not exist");

        let buyerCompanyName = "Mercuria";
        let brokerCompanyName = "BP";
        let buyerAddress: string = "0xf17f52151EbEF6C7334FAD080c5704D77216b732";
        let brokerAddress: string = "0x843Bb18ea2b86ef3807E006723784435FF00e27F";

        let myParty = new Party({partyType:PartyType.Buyer,partyAddress:buyerAddress,companyName:buyerCompanyName});
        let parties = [new Party({partyType:PartyType.Broker,partyAddress:brokerAddress,companyName:brokerCompanyName})];
        let response = await client.updateParty(guid, myParty, parties);
        
        //verify
        assert.notEqual(response,null,"Update party failed");
        console.log(response);
        assert.equal(response.status,true,response.error);
    });

    it('Read the meter summary', async function () {
        this.timeout(0);
        console.log("Read the meter summary test");

        let companyName = "Mercuria";
        //assert.notEqual(testTradeNumber,0,"Trade not exist");

        let data: MeterSummaryData = new MeterSummaryData({timestamp: (new Date()).getTime(), companyName:companyName,factoryAddress:tradeFactoryAddress})
        let request = new MeterSummaryRequest({message: data,signature:""});
        let response = await httpService.RaiseHttpRequest("localhost", "8000", "/getMeterSummary", "POST", request);
        console.log("Meter Summary for",companyName, ":", response);
        
        //verify
        assert.notEqual(response,null,"Meter reading failed");
        assert.equal(response.status,true,response.error);
    });
});