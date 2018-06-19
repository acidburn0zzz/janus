import { FileDirectoryProvider } from "../services/file-directory-provider"
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

describe('file-directory-provider tests', () => {
    let companyName = "company1";
    let testAddress = '0x1dcde766A577abFe76BF32c1F0032FCd24f3a6c0';
    let testPublicKey = '03c59dad8c149bf99d5e2a3eff8c045994a4c29e850755a6780da4f6ec6d28f4d0';
    
    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async () => {
          //add init here
        });
        return fn();
    });

    it('add a key to directory', async function () {        
        let directoryProvider = new FileDirectoryProvider();
        assert.notEqual(directoryProvider,null,"DirectoryProvider not created");
        await directoryProvider.addCompanyKey(companyName, "publicAddress", testAddress);
    });

    it('read key from directory', async function () {
        //storing a key
        let directoryProvider = new FileDirectoryProvider();
        assert.notEqual(directoryProvider,null,"DirectoryProvider not created");
        await directoryProvider.addCompanyKey(companyName, "publicAddress", testAddress);
        
        //reading back key
        let response = await directoryProvider.getCompanyKey(companyName, "publicAddress");
        assert.notEqual(response,null,"key not read from storage");
        assert.equal(response,testAddress,"key is wrong");
    });

    it('add multiple keys to directory', async function () {
        let directoryProvider = new FileDirectoryProvider();
        assert.notEqual(directoryProvider,null,"DirectoryProvider not created");
        await directoryProvider.addCompanyKey(companyName, "publicAddress", testAddress);
        await directoryProvider.addCompanyKey(companyName, "shhKey", testPublicKey);
    });

    it('read multiple keys to directory', async function () {     
        //storing keys
        let directoryProvider = new FileDirectoryProvider();
        assert.notEqual(directoryProvider,null,"DirectoryProvider not created");
        await directoryProvider.addCompanyKey(companyName, "publicAddress", testAddress);
        await directoryProvider.addCompanyKey(companyName, "shhKey", testPublicKey);

        //reading back key1
        let response = await directoryProvider.getCompanyKey(companyName, "publicAddress");
        assert.notEqual(response,null,"key not read from storage");
        assert.equal(response,testAddress,"key is wrong");

        //reading back key2
        response = await directoryProvider.getCompanyKey(companyName, "shhKey");
        assert.notEqual(response,null,"key not read from storage");
        assert.equal(response,testPublicKey,"key is wrong");
    });
});