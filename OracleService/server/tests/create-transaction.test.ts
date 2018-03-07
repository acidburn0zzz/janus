import * as service from "../script/oracle.service"
import * as ethers from "ethers" 
import * as oracle from "ind-oracle" 

import * as mocha from 'mocha'
import * as chai from 'chai'

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

describe.only('Create transaction tests', () => {
    var oracleSevice: service.OracleService;
    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async () => {
          //add init here
          oracleSevice = new service.OracleService();
        });
        return fn();
    });

    it('Create black trade', async function () {
        this.timeout(0);
        console.log("In create black trade test");
        
        let request: oracle.CreateTransactionRequest = new oracle.CreateTransactionRequest();
        request.message = new oracle.TransactionData()
        request.message.marketplaceAddress = "0x0000";
        request.message.myParty = new oracle.Party({ partyType: 1, partyAddress: "0x12345", companyName: "Mercuria" });
        request.message.parties = [new oracle.Party({ partyType: 2, partyAddress: "0x56789", companyName: "Shell" })];
        request.message.signerCompany = "Mercuria";
        request.message.signerName = "Max";
        request.signature = '';
        var response = await oracleSevice.createTransaction(request);
        console.log(response);
        assert.equal(response.status,true,"Transaction creation failed:"+ response.error);
    });

});