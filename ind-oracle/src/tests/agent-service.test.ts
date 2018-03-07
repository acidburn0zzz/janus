import * as service from "../script/agent.service"
import * as model from "../script/models" 
import * as ethers from "ethers" 
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

describe('Agent-service tests', () => {
    var agentSevice;
    let testCompanyName = "BP";
    let testHost = "localhost";
    let testPort = "6000";

    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async () => {
          //add init here
          agentSevice = new service.AgentService();
          console.log("directory:", process.cwd());
        });
        return fn();
    });

    it('Register an ind-agent', async function () {
        this.timeout(0);
        console.log("In Register test");

        //register
        let message = new model.RegistrationData({companyName: testCompanyName, url: testHost+":"+testPort});
        let request = new model.WalletRegistrationRequest({message: message});
        var response = await agentSevice.registerWalletAgent(request);
        console.log(response);
        assert.equal(response,true,"Registration failed");

        //verify
        var walletUrl = await agentSevice.getWalletAgentUrl(testCompanyName);
        console.log(walletUrl);
        assert.notEqual(walletUrl,null,"Registration not done correctly");
        assert.equal(walletUrl.host,testHost,"Registration not done correctly");
        assert.equal(walletUrl.port,testPort,"Registration not done correctly");
    });

    it('UnRegister an ind-agent', async function () {
        this.timeout(0);
        console.log("In UnRegister test");

        //unregister
        let message = new model.UnRegistrationData({companyName: testCompanyName});
        let request = new model.WalletUnRegistrationRequest({message: message});
        var response = await agentSevice.unRegisterWalletAgent(request);
        console.log(response);
        assert.equal(response,true,"UnRegistration failed");

        //verify
        var walletUrl = await agentSevice.getWalletAgentUrl("BP");
        console.log(walletUrl);
        assert.equal(walletUrl,null,"UnRegistration not done correctly");
    });

});