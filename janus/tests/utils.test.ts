import { Utils } from "../services/utils"
import * as mocha from 'mocha'
import * as chai from 'chai'
import { OnetimeKey } from "../common/models";

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

    it('test buildTransaction method case 1', function () {
        let txn = {
            to: "0x54C57ae841886D815e054225b9075C87058F366c",
            nonce: 10,
            gas: 50000,
            gasPrice: 10,
            data: "0x000021",
            chainId: 1
        }
        
        let tx = (new Utils()).buildTransaction(txn);
        assert.notEqual(tx,null,"failed to build transaction object");
        assert.equal(tx.to.toString('hex').toLowerCase(),('54C57ae841886D815e054225b9075C87058F366c').toLowerCase(),"invalid to");
        assert.equal(tx.nonce.toString('hex'),'0a',"invalid nonce");
        assert.equal(tx.gas.toString('hex'),'c350',"invalid gas");
        assert.equal(tx.gasPrice.toString('hex'),'0a',"invalid gasPrice");
        assert.equal(tx.data.toString('hex'),'000021',"invalid data");
        assert.equal(tx.getChainId(),'0x01',"invalid chainId");
    });

    it('test buildTransaction method case 2', function () {
        let txn = {
            to: "0x54C57ae841886D815e054225b9075C87058F366c",
            nonce: 10,
            gasLimit: 50000,
            data: "0x00",
            value: 10,
            chainId: 1
        }
        
        let tx = (new Utils()).buildTransaction(txn);
        assert.notEqual(tx,null,"failed to build transaction object");
        assert.equal(tx.to.toString('hex').toLowerCase(),('54C57ae841886D815e054225b9075C87058F366c').toLowerCase(),"invalid to");
        assert.equal(tx.nonce.toString('hex'),'0a',"invalid nonce");
        assert.equal(tx.gas.toString('hex'),'c350',"invalid gas");
        assert.equal(tx.gasPrice.toString('hex'),'',"invalid gasPrice");
        assert.equal(tx.data.toString('hex'),'00',"invalid data");
        assert.equal(tx.value.toString('hex'),'0a',"invalid value");
        assert.equal(tx.getChainId(),'0x01',"invalid chainId");
    });

    it('test objToMap method', function () {
        let object = {field1: "f1", field2: "f2"}
        
        let map = (new Utils()).objToMap(object);
        assert.notEqual(map,null,"failed to convert obj to map");
        assert.equal(map.size,2,"invalid no of items in map");
        assert.equal(map.get("field1"),"f1","invalid value in map");
        assert.equal(map.get("field2"),"f2","invalid value in map");
    });

    it('test checkIfKeyMapHasAllKeys method case 1', function () {
        let keyMap = new Array<{partyName:string,onetimeKey:OnetimeKey}>();
        let otKey1 = new OnetimeKey({address: "0x54C57ae841886D815e054225b9075C87058F366c"});
        keyMap.push({partyName: "P1", onetimeKey: otKey1});
        keyMap.push({partyName: "P2", onetimeKey: null});
        
        let result = (new Utils()).checkIfKeyMapHasAllKeys(keyMap);
        assert.equal(result,false,"invalid result on checking keymap");
    });

    it('test checkIfKeyMapHasAllKeys method case 2', function () {
        let keyMap = new Array<{partyName:string,onetimeKey:OnetimeKey}>();
        let otKey1 = new OnetimeKey({address: "0x54C57ae841886D815e054225b9075C87058F366c"});
        let otKey2 = new OnetimeKey({address: "0x54C57ae841886D815e054225b9075C87058F366c"});
        keyMap.push({partyName: "P1", onetimeKey: otKey1});
        keyMap.push({partyName: "P2", onetimeKey: otKey2});
        
        let result = (new Utils()).checkIfKeyMapHasAllKeys(keyMap);
        assert.equal(result,true,"invalid result on checking keymap");
    });

    it('test sleep method', async function () {
        let startTime = (new Date()).getTime(); 
        await (new Utils()).sleep(200);
        let endTime = (new Date()).getTime(); 
        //console.log("sleep time", (endTime-startTime));
        assert.equal((endTime-startTime) > 200,true,"sleep time is less than the requested time, " + (endTime-startTime));
        //assert.equal((endTime-startTime) <= 205,true,"sleep time is larger than the requested time + offset (5ms)");
    });

});