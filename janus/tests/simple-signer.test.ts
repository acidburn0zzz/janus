import { SimpleSigner } from "../services/simple-signer"
import * as mocha from 'mocha'
import * as chai from 'chai'
import { Wallet } from "ethers";

var Web3 = require("web3");
var assert = require('assert');
const expect = chai.expect;
const should = chai.should();
var nodeUrl = "http://localhost:22001";

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

describe('simple-signer tests', () => {
    let privateKey = "0x6281cbb32d9b47407932af4214c9aa75e37bb8c58dbdde82b31745ed89ea3f13";
    var web3;

    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async () => {
            //add init here
            if(nodeUrl)
                web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
        });
        return fn();
    });

    it('sign test message', async function () {        
        let simpleSigner = new SimpleSigner(privateKey);
        let testMessage = "test message";
        assert.notEqual(simpleSigner,null,"SimpleSigner not created");
        let signature = await simpleSigner.sign(testMessage);
        assert.notEqual(signature,null,"signature is null");

        //verifying signature
        let wallet = new Wallet(privateKey, web3.currentProvider);
        let walletAddress = wallet.address;
        let sigerAddress = await Wallet.verifyMessage(testMessage, signature);
        assert.equal(sigerAddress,walletAddress,"signer account not matching");
    });
});