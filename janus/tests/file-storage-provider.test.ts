import { FileStorageProvider } from "../services/file-storage-provider"
import * as model from "../common/models" 
import * as mocha from 'mocha'
import * as chai from 'chai'
import { Guid } from "guid-typescript";

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

describe('file-storage-provider tests', () => {
    let networkId = "test-1";
    let partyName = "company1";
    let testAddress = '0x1dcde766A577abFe76BF32c1F0032FCd24f3a6c0';
    let testPublicKey = '03c59dad8c149bf99d5e2a3eff8c045994a4c29e850755a6780da4f6ec6d28f4d0';
    let testKeyPath = "m/44'/60'/0'/0/100";
    let guid: string;

    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async () => {
          //add init here
          guid = Guid.create().toString();
        });
        return fn();
    });

    it('store key map', async function () {
        let onetimeKey = new model.OnetimeKey({networkId: networkId, 
            address: testAddress,
            publicKey: testPublicKey});

        let storageProvider = new FileStorageProvider();
        assert.notEqual(storageProvider,null,"StorageProvider not created");
        await storageProvider.storeOnetimeKeyMap(guid, networkId, [{partyName: partyName, onetimeKey: onetimeKey }]);
    });

    it('read key map', async function () {
        let onetimeKey = new model.OnetimeKey({networkId: networkId, 
            address: testAddress,
            publicKey: testPublicKey});

        //storing a key map
        let storageProvider = new FileStorageProvider();
        assert.notEqual(storageProvider,null,"StorageProvider not created");
        await storageProvider.storeOnetimeKeyMap(guid, networkId, [{partyName: partyName, onetimeKey: onetimeKey }]);
        
        //reading back key map
        let response = await storageProvider.readOnetimeKeyMap(guid, networkId);
        assert.notEqual(response,null,"key map not read from storage");
        assert.equal(response.txnRef,guid,"TxnRef is wrong");
        assert.notEqual(response.partyKeyMap[0],null,"key map not read from storage");
        assert.equal(response.partyKeyMap[0].partyName,partyName,"Onetime key address is wrong");
        assert.equal(response.partyKeyMap[0].onetimeKey.address,onetimeKey.address,"Onetime key address is wrong");
        assert.equal(response.partyKeyMap[0].onetimeKey.publicKey,onetimeKey.publicKey,"Onetime key is wrong");
        assert.equal(response.partyKeyMap[0].onetimeKey.networkId,onetimeKey.networkId,"NetworkId is wrong");
    });

    it('store key path', async function () {
        let storageProvider = new FileStorageProvider();
        assert.notEqual(storageProvider,null,"StorageProvider not created");
        await storageProvider.storeOnetimeKeyPath(guid, networkId,testAddress,testPublicKey,testKeyPath);
    });

    it('read key path', async function () {     
        //storing key path
        let storageProvider = new FileStorageProvider();
        assert.notEqual(storageProvider,null,"StorageProvider not created");
        await storageProvider.storeOnetimeKeyPath(guid, networkId,testAddress,testPublicKey,testKeyPath);

        //reading key path
        let response = await storageProvider.readOnetimeKeyPath(guid, networkId);
        assert.notEqual(response,null,"key path not read from storage");
        assert.equal(response.derivedPath,testKeyPath,"Onetime key path is wrong");
        assert.equal(response.onetimeAddress,testAddress,"Onetime key address is wrong");
        assert.equal(response.onetimePublicKey,testPublicKey,"Onetime key is wrong");
        assert.equal(response.networkId,networkId,"NetworkId is wrong");
    });
});