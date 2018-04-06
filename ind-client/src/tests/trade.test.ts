import * as model from "../script/models" 
import * as indClient from "../script/ind-client" 
import * as constants from "../script/constants" 
//import * as httpService from '../script/http.service';
import * as mocha from 'mocha'
import * as chai from 'chai'
import { HttpService, Party, RegistrationData, WalletRegistrationRequest } from 'ind-common';

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
    let httpService: HttpService;

    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async function () {
            //add init here
            agentUrl = "localhost:4000";
            oracleUrl = "localhost:8000";
            marketplaceAddress = "0xc3846686993466515c28504cf75a98cb777967ae";
            tradeFactoryAddress = "0xc3846686993466515c28504cf75a98cb777967ae";
            testTradeNumber = 0;
            httpService = new HttpService();
            console.log("directory:", process.cwd());
            client = new indClient.IndClient(marketplaceAddress, tradeFactoryAddress, agentUrl, oracleUrl, httpService);

            let message = new RegistrationData({companyName: "Mercuria", url: "localhost:4000"});
            let request = new WalletRegistrationRequest({message: message});
            let response = await httpService.RaiseHttpRequest("localhost", "8000", "/registerWalletAgent", "POST", request);
            console.log("Registered Mercuria:", response);

            message = new RegistrationData({companyName: "Shell", url: "localhost:4000"});
            request = new WalletRegistrationRequest({message: message});
            response = await httpService.RaiseHttpRequest("localhost", "8000", "/registerWalletAgent", "POST", request);
            console.log("Registered Shell:", response);

            message = new RegistrationData({companyName: "BP", url: "localhost:4000"});
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
        
        let myParty = new Party({partyType:model.PartyType.Buyer,partyAddress:buyerAddress,companyName:buyerCompanyName});
        let otherParty = new Party({partyType:model.PartyType.Seller,partyAddress:sellerAddress,companyName:sellerCompanyName});
        let response = await client.createTrade(myParty,otherParty, new Date(), "WTI", 10000, 50, "term1");
        
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

        let myParty = new Party({partyType:model.PartyType.Buyer,partyAddress:buyerAddress,companyName:buyerCompanyName});
        let parties = [new Party({partyType:model.PartyType.Broker,partyAddress:brokerAddress,companyName:brokerCompanyName})];
        let response = await client.updateParty(testTradeNumber, myParty, parties);
        
        //verify
        assert.notEqual(response,null,"Update party failed");
        console.log(response);
        assert.equal(response.status,true,response.error);
    });
});