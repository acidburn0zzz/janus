import * as express from 'express';
import * as Constants from 'ind-common/build/common/constants';
import { Utils } from 'ind-common/build/common/utils';
import {
    OneTimeAddressRequest, OneTimeAddressResponse, OneTimeAddressData, DecryptDataRequest, DecryptDataResponse,
    EncryptDataRequest, EncryptDataResponse, GrantAccessRequest, GrantAccessResponse, PostTransactionRequest, PostTransactionResponse
} from 'ind-common/build/common/models';

import { AddressObfuscatorOptions, AddressObfuscator } from 'ind-hdwallet/build/script/addressobfuscator';

import { SmartContractService, SendTransactionProperties, GrantAccessProperties } from 'ind-hdwallet/build/services/smart-contract-service';

const router = express.Router();

let options: AddressObfuscatorOptions = {
    blockchainProvider: "http://forcefield01.uksouth.cloudapp.azure.com:8545",
    contractsPath: "c:\\Forcefield\\Privy\\Contracts\\build",
    abiPath: "c:\\Forcefield\\Privy\\Contracts\\abi",
    oracleServiceUri: "uri",
    vaultServiceUri: "vault"
};

const addressObfuscator = new AddressObfuscator(options);

router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render('index', {
        title: 'Indirection service reference implementation'
    });
});

router.post('/getOTAddress', async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    let responseData = new OneTimeAddressResponse();

    try {
        let requestData = new OneTimeAddressRequest();

            requestData.message = req.body.message;
            requestData.signature = req.body.signature;
            requestData.messageObject = JSON.parse(req.body.message);

            responseData = addressObfuscator.getOnetimeAddress(requestData);

    }
    catch (error) {

        responseData.error = Constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

router.post('/decryptData', async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    let responseData;

    try {
        responseData = new DecryptDataResponse();

        let requestData = new DecryptDataRequest();
        requestData.message = req.body.message;
        requestData.signature = req.body.signature;
        requestData.messageObject = JSON.parse(req.body.message);

        responseData = addressObfuscator.decryptData(requestData);
    }
    catch (error) {
        responseData.error = Constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

router.post('/encryptData', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let responseData;

    try {
        responseData = new EncryptDataResponse();

        let requestData = new EncryptDataRequest();
        requestData.message = req.body.message;
        requestData.signature = req.body.signature;
        requestData.messageObject = JSON.parse(req.body.message);

        responseData = addressObfuscator.encryptData(requestData);
    }
    catch (error) {
        responseData.error = Constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

router.post('/grantAccess', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let responseData;

    try {
        responseData = new GrantAccessResponse();

        let requestData = new GrantAccessRequest();
        requestData.message = req.body.message;
        requestData.signature = req.body.signature;
        requestData.otherInfo = JSON.parse(req.body.otherInfo);

        responseData = await addressObfuscator.grantAccess(requestData, new GrantAccessProperties());
    }
    catch (error) {
        responseData.error = Constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

router.post('/postTransaction', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let responseData = new PostTransactionResponse({});

    try {
        let requestData = new PostTransactionRequest({});
        requestData.data = req.body.data;
        requestData.signature = req.body.signature;
        requestData.transactionInfo = JSON.parse(req.body.transactionInfo);

        responseData = await addressObfuscator.postTransaction(requestData, new SendTransactionProperties());
    }
    catch (error) {
        responseData.error = Constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

export = router;