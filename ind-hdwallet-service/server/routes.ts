import * as express from 'express';
import * as Constants from '../../types/ind-common/common/constants';
import { Utils } from '../../types/ind-common/common/utils';
import {
    OneTimeAddressRequest, OneTimeAddressResponse, OneTimeAddressData, DecryptDataRequest, DecryptDataResponse,
    EncryptDataRequest, EncryptDataResponse, GrantAccessRequest, GrantAccessResponse, PostTransactionRequest, PostTransactionResponse
} from '../../types/ind-common/common/models';

import { AddressObfuscatorOptions, AddressObfuscator } from 'ind-hdwallet';

const router = express.Router();

let options: AddressObfuscatorOptions = {
    blockchainProvider: "http://forcefield01.uksouth.cloudapp.azure.com:8545",
    contractsPath: "c:\\Forcefield\\Privy\\Contracts\\build",
    oracleServiceUri: "uri",
    vaultServiceUri: "vault"
};

const addressObfuscator = new AddressObfuscator.AddressObfuscator(options);

router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render('index', {
        title: 'Indirection service reference implementation'
    });
});

router.post('/getOTAddress', async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    let responseData = new indCommon.OneTimeAddressResponse();

    try {
        let requestData = new indCommon.OneTimeAddressRequest();

            requestData.message = req.body.message;
            requestData.signature = req.body.signature;
            requestData.messageObject = JSON.parse(req.body.message);

            responseData = addressObfuscator.getOnetimeAddress(requestData);

    }
    catch (error) {

        responseData.error = indCommon.Constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

router.post('/decryptData', async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    let responseData;

    try {
        responseData = new indCommon.DecryptDataResponse();

        let requestData = new indCommon.DecryptDataRequest();
        requestData.message = req.body.message;
        requestData.signature = req.body.signature;
        requestData.messageObject = JSON.parse(req.body.message);

        responseData = addressObfuscator.decryptData(requestData);
    }
    catch (error) {
        responseData.error = indCommon.Constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

router.post('/encryptData', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let responseData;

    try {
        responseData = new indCommon.EncryptDataResponse();

        let requestData = new indCommon.EncryptDataRequest();
        requestData.message = req.body.message;
        requestData.signature = req.body.signature;
        requestData.messageObject = JSON.parse(req.body.message);

        responseData = addressObfuscator.encryptData(requestData);
    }
    catch (error) {
        responseData.error = indCommon.Constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

router.post('/grantAccess', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let responseData;

    try {
        responseData = new indCommon.GrantAccessResponse();

        let requestData = new indCommon.GrantAccessRequest();
        requestData.message = req.body.message;
        requestData.signature = req.body.signature;
        requestData.messageObject = JSON.parse(req.body.message);

        responseData = addressObfuscator.grantAccess(requestData);
    }
    catch (error) {
        responseData.error = indCommon.Constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

router.post('/postTransaction', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let responseData = new indCommon.PostTransactionResponse();

    try {
        let requestData = new indCommon.PostTransactionRequest();
        requestData.data = req.body.data;
        requestData.signature = req.body.signature;
        requestData.otherInfo = JSON.parse(req.body.otherInfo);

        responseData = addressObfuscator.postTransaction(requestData);
    }
    catch (error) {
        responseData.error = indCommon.Constants.errorRequestObjectParseFailed + " " + error;
    }
});

export = router;