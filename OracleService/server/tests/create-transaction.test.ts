import * as service from "../script/oracle.service"
import * as common from "ind-common" 

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
        
        let request: common.CreateUpdateTransactionRequest = new common.CreateUpdateTransactionRequest();
        request.data = new common.TransactionData();
        request.data.guid = "12dfdfg";
        request.otherInfo = new common.TransactionInfo();
        request.otherInfo.marketplaceAddress = "0x0000";
        request.otherInfo.myParty = new common.Party({ partyType: 1, partyAddress: "0x12345", companyName: "Mercuria" });
        request.otherInfo.parties = [new common.Party({ partyType: 2, partyAddress: "0x56789", companyName: "Shell" })];
        request.signature = '';
        var response = await oracleSevice.createTransaction(request);
        console.log(response);
        assert.equal(response.status,true,"Transaction creation failed:"+ response.error);
    });

});