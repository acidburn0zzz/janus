import * as express from 'express';
import * as models from './script/models'
import * as obfuscatorService from './script/addressobfuscator';
import * as utils from './script/utils';
import * as constants from './script/constants';

const router = express.Router();
const addressObfuscator = new obfuscatorService.AddressObfuscator();

router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render('index', {
        title: 'Indirection service reference implementation'
    });
});

router.post('/getOTAddress', async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    let responseData = new models.OneTimeAddressResponse();

    try {
            let requestData = new models.OneTimeAddressRequest();

            requestData.message = req.body.message;
            requestData.signature = req.body.signature;
            requestData.messageObject = JSON.parse(req.body.message);

            responseData = addressObfuscator.getOnetimeAddress(requestData);

    }
    catch (error) {

        responseData.error = constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

router.post('/decryptData', async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    let responseData;

    try {
        responseData = new models.DecryptDataResponse();

        let requestData = new models.DecryptDataRequest();
        requestData.message = req.body.message;
        requestData.signature = req.body.signature;
        requestData.messageObject = JSON.parse(req.body.message);

        responseData = addressObfuscator.decryptData(requestData);
    }
    catch (error) {
        responseData.error = constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

router.post('/encryptData', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let responseData;

    try {
        responseData = new models.EncryptDataResponse();

        let requestData = new models.EncryptDataRequest();
        requestData.message = req.body.message;
        requestData.signature = req.body.signature;
        requestData.messageObject = JSON.parse(req.body.message);

        responseData = addressObfuscator.encryptData(requestData);
    }
    catch (error) {
        responseData.error = constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

router.post('/grantAccess', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let responseData;

    try {
        responseData = new models.GrantAccessResponse();

        let requestData = new models.GrantAccessRequest();
        requestData.message = req.body.message;
        requestData.signature = req.body.signature;
        requestData.messageObject = JSON.parse(req.body.message);

        responseData = addressObfuscator.grantAccess(requestData);
    }
    catch (error) {
        responseData.error = constants.errorRequestObjectParseFailed + " " + error;
    }

    res.send(responseData);
});

export = router;