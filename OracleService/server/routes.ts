import * as express from 'express';
import { OracleService } from './script/oracle.service';
import { Party, CreateTransactionRequest, CreateTransactionResponse,  
  WalletRegistrationRequest, WalletRegistrationResponse, WalletUnRegistrationRequest, WalletUnRegistrationResponse } from 'indOracle';

const router = express.Router();

router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render('index', {
        title: 'Project Indirection Oracle'
    });
});

router.post('/registerWalletAgent', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let registrationRequest = new WalletRegistrationRequest({});
  registrationRequest.message = req.body.data.message;
  registrationRequest.signature = req.body.data.signature;
  console.log("registrationRequest", registrationRequest);
  //console.log("body", req.body);
  let oracle = new OracleService();
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
  unRegistrationRequest.message = req.body.data.message;
  unRegistrationRequest.signature = req.body.data.signature;
  console.log("unRegistrationRequest", unRegistrationRequest);
  //console.log("body", req.body);
  let oracle = new OracleService();
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
  // createTransactionRequest.message.marketplaceAddress = req.body.data.marketplaceAddress;
  // createTransactionRequest.message.factoryAddress = req.body.data.factoryAddress;
  // createTransactionRequest.message.myParty = req.body.data.myParty;
  // createTransactionRequest.message.parties = req.body.data.parties;
  createTransactionRequest.message = req.body.data.message;
  createTransactionRequest.signature = req.body.data.signature;
  console.log("createTransactionRequest", createTransactionRequest);
  //console.log("body", req.body);
  let oracle = new OracleService();
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

export = router;