'use strict';

var util = require('util');
var janus = require("../../janus.js");
//const janus_utils = new janus.Utils();
/*
 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  requestOnetimeKeys: requestOnetimeKeys,
  getOnetimeKeys: getOnetimeKeys,
  signTransaction: signTransaction,
  postTransaction: postTransaction
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
async function requestOnetimeKeys(req, res) {
  //console.log("params", req.swagger.params);
  let txnRef = req.swagger.params.body.value.txnRef;
  let networkId = req.swagger.params.body.value.networkId;
  let parties = req.swagger.params.body.value.parties;
  console.log("request data:", {txnRef: txnRef, networkId: networkId, parties: parties});

  await janus.janusInstance.requestOnetimeKeys(txnRef, networkId, parties, null);
  
  // this sends back a JSON response
  res.json({status: "Success"});
}

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
async function getOnetimeKeys(req, res) {
  //console.log("params", req.swagger.params);
  let txnRef = req.swagger.params.body.value.txnRef;
  let networkId = req.swagger.params.body.value.networkId;
  console.log("request data:", {txnRef: txnRef, networkId: networkId});
  let hasAllKeys = false;
  let otaResponse;
  while(!hasAllKeys) { 
    console.log("waiting..");   
    otaResponse = await janus.janusInstance.getOnetimeKeys(txnRef, networkId);
    if(!otaResponse) {
      otaResponse = {error: "Unknown txnRef"};
      break;
    }
    hasAllKeys = janus.utils.checkIfKeyMapHasAllKeys(otaResponse.partyKeyMap);  
    if(!hasAllKeys)
      await janus.utils.sleep(500);
  }
  console.log("otaResponse", otaResponse);

  // this sends back a JSON response
  res.json(otaResponse);
}

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
async function signTransaction(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  //console.log("params", req.swagger.params);
  let txnRef = req.swagger.params.body.value.txnRef;
  let networkId = req.swagger.params.body.value.networkId;
  let txn = req.swagger.params.body.value.txn;
  console.log("Request data:", {txnRef: txnRef, networkId: networkId, txn: txn});
  
  let response = await janus.janusInstance.signTransaction(txnRef, networkId, txn);
  console.log("SignedTx", response);

  // this sends back a JSON response
  res.json({signedTx: signedTx});
}

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
async function postTransaction(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  //console.log("params", req.swagger.params);
  let txnRef = req.swagger.params.body.value.txnRef;
  let networkId = req.swagger.params.body.value.networkId;
  let txn = req.swagger.params.body.value.txn;
  console.log("Request data:", {txnRef: txnRef, networkId: networkId, txn: txn});
  let receipt;
  let txResponse;
  let txHash = await janus.janusInstance.postTransaction(txnRef, networkId, txn);
  //let txHash = "0x81c0c71215217a1117ef8ed53aecfe3bcad5a38f85cecf9d361b4aed9db05a25";
  console.log("TxHash", txHash);
  if(txHash) {
    receipt = await janus.janusInstance.getTransactionReceipt(txHash);
  }
  if(!receipt)
    txResponse = {error: "Failed to get receipt"}
  else if(receipt["error"])
    txResponse = receipt;
  else {
    txResponse = {contractAddress: receipt["contractAddress"], transactionHash: txHash}
  }
  console.log("TxResponse", txResponse);

  // this sends back a JSON response
  res.json(txResponse);
}
