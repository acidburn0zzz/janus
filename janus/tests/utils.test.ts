import { Utils } from "../services/utils"
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

describe('utils tests', () => {
    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async () => {
            //add init here
        });
        return fn();
    });

    it('test verifySignature method', async function () {        
        let testMessage = "test message";
        let signature = "0x769451f7a13d8d41b529f1c14585a67e8bdab3402aa3c1a006fc3d125c7c24e437f1a3c9f5f2fb1263f3c7c3ad5897ffa71243bca3be5ed21fc90ecae76a2d211c";
        let signerAddress = "0x54C57ae841886D815e054225b9075C87058F366c";

        //verifying signature
        let response = await (new Utils()).verifySignature(testMessage, signature);
        assert.notEqual(response,null,"failed to verify signature");
        assert.equal(response.error,null,response.error);
        assert.equal(response.isValid,true,"signature not valid");
        assert.equal(response.signerAddress,signerAddress,"signer account not matching");
    });
});