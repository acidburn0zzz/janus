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

describe('Hdwallet tests', () => {
    var agentSevice;
    let companyName = "Mercuria";
    let nodeUrl = "http://localhost:22001";
    let networkId = "1";

    before(function () {
        this.timeout(0);
        var fn = mochaAsyncBeforeHook(async () => {
            //add init here
        });
        return fn();
    });

    // it('Get Onetime keys', async function () {
    //     this.timeout(0);
    //     //console.log("Get Onetime keys");
    // });

});