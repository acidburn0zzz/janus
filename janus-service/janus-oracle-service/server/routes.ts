import * as express from 'express';
import { OracleService } from './script/oracle.service';
import { GrantAccessToContractRequest, GrantAccessToContractResponse} from '@manosamy/janus-oracle';
import { Party, CreateTransactionRequest, CreateTransactionResponse, MeterSummaryRequest, MeterSummaryResponse, 
  WalletRegistrationRequest, WalletRegistrationResponse, WalletUnRegistrationRequest, WalletUnRegistrationResponse } from '@manosamy/janus-common';
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
  createTransactionRequest.transactionInfo = req.body.transactionInfo;
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
  let grantAccessToContractRequest = new GrantAccessToContractRequest({});
  console.log("body", req.body);
  grantAccessToContractRequest.message = req.body.message;
  grantAccessToContractRequest.signature = req.body.signature;
  console.log("grantAccessToContractRequest", grantAccessToContractRequest);
  if(!oracle)
    oracle = new OracleService();
  var response: GrantAccessToContractResponse;
  try {
    response = await oracle.grantAccessToContract(grantAccessToContractRequest);
  } catch (error) {
    response = new GrantAccessToContractResponse({status: false});
    response.error = "ERROR: " + error;
    console.log(error)
  }
  console.log(new Date(), "response", response);
  res.send(response);
});

router.post('/getMeterSummary', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let meterSummaryRequest = new MeterSummaryRequest({});
  console.log("body", req.body);
  meterSummaryRequest.message = req.body.message;
  meterSummaryRequest.signature = req.body.signature;
  console.log("meterSummaryRequest", meterSummaryRequest);
  if(!oracle)
    oracle = new OracleService();
  var response: MeterSummaryResponse;
  try {
    response = await oracle.getMeterSummary(meterSummaryRequest);
  } catch (error) {
    response = new MeterSummaryResponse({status: false});
    response.error = "ERROR: " + error;
    console.log(error)
  }
  console.log(new Date(), "response", response);
  res.send(response);
});

export = router;