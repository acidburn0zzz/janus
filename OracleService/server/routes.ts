import * as express from 'express';
import { OracleService } from './script/oracle.service';
import { GrantAccessRequest, GrantAccessResponse} from 'ind-oracle';
import { Party, CreateTransactionRequest, CreateTransactionResponse,  
  WalletRegistrationRequest, WalletRegistrationResponse, WalletUnRegistrationRequest, WalletUnRegistrationResponse } from 'ind-common';
var oracle: OracleService;
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render('index', {
        title: 'Project Indirection Oracle'
    });
});

router.post('/registerWalletAgent', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let registrationRequest = new WalletRegistrationRequest({});
  registrationRequest.message = req.body.message;
  registrationRequest.signature = req.body.signature;
  console.log("registrationRequest", registrationRequest);
  //console.log("body", req.body);
  if(!oracle)
    oracle = new OracleService();
  var response: WalletRegistrationResponse;
  try {
    response = await oracle.registerWalletAgent(registrationRequest);
  } catch (error) {
    response = new WalletRegistrationResponse({ status: false });
    response.error = "ERROR: " + error;
    console.log(error)
  }
  console.log(new Date(), "response", response);
  res.send(response);
});

router.post('/unRegisterWalletAgent', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let unRegistrationRequest = new WalletUnRegistrationRequest({});
  unRegistrationRequest.message = req.body.message;
  unRegistrationRequest.signature = req.body.signature;
  console.log("unRegistrationRequest", unRegistrationRequest);
  //console.log("body", req.body);
  if(!oracle)
    oracle = new OracleService();
  var response: WalletUnRegistrationResponse;
  try {
    response = await oracle.unRegisterWalletAgent(unRegistrationRequest);
  } catch (error) {
    response = new WalletUnRegistrationResponse({ status: false });
    response.error = "ERROR: " + error;
    console.log(error)
  }
  console.log(new Date(), "response", response);
  res.send(response);
});

router.post('/createTransaction', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let createTransactionRequest = new CreateTransactionRequest({});
  console.log("body", req.body);
  createTransactionRequest.data = req.body.data;
  createTransactionRequest.signature = req.body.signature;
  createTransactionRequest.otherInfo = req.body.otherInfo;
  console.log("createTransactionRequest", createTransactionRequest);
  if(!oracle)
    oracle = new OracleService();
  var response: CreateTransactionResponse;
  try {
    response = await oracle.createTransaction(createTransactionRequest);
  } catch (error) {
    response = new CreateTransactionResponse({ contractId: 0, status: false });
    response.error = "ERROR: " + error;
    console.log(error)
  }
  console.log(new Date(), "response", response);
  res.send(response);
});

router.post('/grantAccessToContract', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let grantAccessRequest = new GrantAccessRequest({});
  console.log("body", req.body);
  grantAccessRequest.message = req.body.message;
  grantAccessRequest.signature = req.body.signature;
  console.log("grantAccessRequest", grantAccessRequest);
  if(!oracle)
    oracle = new OracleService();
  var response: GrantAccessResponse;
  try {
    response = await oracle.grantAccessToContract(grantAccessRequest);
  } catch (error) {
    response = new GrantAccessResponse({status: false});
    response.error = "ERROR: " + error;
    console.log(error)
  }
  console.log(new Date(), "response", response);
  res.send(response);
});

export = router;