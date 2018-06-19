import { OnetimeKeyGeneratorService } from "../services/onetimekey-generator-service"
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

describe('OTKeyGenerator-service tests', () => {
    let mnemonic: string = "buyer try humor into improve thrive fruit funny skate velvet vanish live";
    let networkId = "test-1";

    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async () => {
          //add init here
        });
        return fn();
    });

    it('Get Onetime key guid', async function () {
        this.timeout(0);
        //generating onetime key for guid
        let storageProvider = new FileStorageProvider();
        let keyGenerator = new OnetimeKeyGeneratorService(mnemonic, storageProvider);
        
        let guid1 = Guid.create().toString();
        let response = await keyGenerator.getOnetimeKey(guid1, networkId);
        
        assert.notEqual(response,null,"Onetime key not generated");
        assert.notEqual(response.address,null,"Onetime key not generated");
        assert.notEqual(response.publicKey,null,"Onetime key not generated correctly");
        assert.equal(response.networkId,networkId,"NetworkId mismatch");        

    });
    
    it('Read Onetime key guid', async function () {
        this.timeout(0);
        //generating onetime key for guid
        let storageProvider = new FileStorageProvider();
        let keyGenerator = new OnetimeKeyGeneratorService(mnemonic, storageProvider);

        let guid1 = Guid.create().toString();
        let response1 = await keyGenerator.getOnetimeKey(guid1, networkId);
        assert.notEqual(response1,null,"Onetime key not generated");
        
        //read back onetime key for guid
        let response2 = await keyGenerator.getOnetimeKey(guid1, networkId);
        assert.notEqual(response2,null,"Onetime key not read");
        assert.equal(response1.address,response2.address,"Onetime key address is wrong");
        assert.equal(response1.publicKey,response2.publicKey,"Onetime key is wrong");
        assert.equal(response1.networkId,response2.networkId,"NetworkId is wrong");                
    });
});