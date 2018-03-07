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

describe('Agent-registration tests', () => {
    var oracleSevice: service.OracleService;
    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async () => {
          //add init here
          oracleSevice = new service.OracleService();
        });
        return fn();
    });

    it('Register an ind-agent', async function () {
        this.timeout(0);
        console.log("In Register test");
        let request: oracle.WalletRegistrationRequest = new oracle.WalletRegistrationRequest();
        request.message = new oracle.RegistrationData()
        request.message.companyName = "BP";
        request.message.url = "localhost:6000";
        var response = await oracleSevice.registerWalletAgent(request);
        console.log(response);
        assert.equal(response,true,"Registration failed:"+ response.error);
    });

    it('UnRegister an ind-agent', async function () {
        this.timeout(0);
        console.log("In UnRegister test");
        let request: oracle.WalletUnRegistrationRequest = new oracle.WalletUnRegistrationRequest();
        request.message = new oracle.UnRegistrationData()
        request.message.companyName = "BP";
        var response = await oracleSevice.unRegisterWalletAgent(request);
        console.log(response);
        assert.equal(response,true,"UnRegistration failed:"+ response.error);
    });

});