import { SmartContractService } from "../services/smart-contract-service"
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

describe('smart-contract-service tests', () => {
    
    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async () => {
            //add init here
        });
        return fn();
    });

    it('verify Account', async function () {
        this.timeout(0);
        let smartContractService = new SmartContractService(null);
        let result = await smartContractService.verifyAccount("0x54C57ae841886D815e054225b9075C87058F366c", "company1");
        
        assert.notEqual(result,null,"failed to verify account");
        assert.equal(result.status,true,"address not valid");
        assert.equal(result.error,"",result.error);
    });

});