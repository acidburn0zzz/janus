import * as express from 'express';
import * as indCommon from 'ind-common';
import { AddressObfuscator } from 'ind-hdwallet';

const router = express.Router();
const addressObfuscator = new AddressObfuscator.AddressObfuscator();

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

export = router;