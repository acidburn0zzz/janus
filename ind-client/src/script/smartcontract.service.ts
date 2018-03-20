declare var require: any
declare const Buffer
import { Contract, utils, Wallet, Provider, providers, Interface } from "ethers";
import { HttpUtil } from './http-util';
import { Guid } from "guid-typescript";
const Web3 = require('web3');
import * as ethUtil from 'ethereumjs-util';

let factoryJson: any = require('../../contracts/FactoryInterface.json');
let contractJson: any = require('../../contracts/ContractInterface.json');
let marketplaceDirectoryJson: any = require('../../contracts/MarketplaceDirectoryInterface.json');

import { Party, PartyType, TransactionData, CreateTransactionRequest, CreateTransactionResponse, GrantAccessData, GrantAccessRequest, GrantAccessResponse } from './models';
import * as constants from './constants';
import { CreateTransactionPath } from "./constants";

declare var web3: any;

// function globalWeb3(): any {
//   // return the global native browser window object
//   if (typeof (web3) != 'undefined')
//     return web3;
//   else {
//     return { notFound: true };
//   }
// }

// function getDefaultAccount() {
//   return new Promise(function (resolve, reject) {
//     if (typeof (web3) == 'undefined')
//       resolve('');
//     else
//       web3.eth.getAccounts((err, acc) => {
//         resolve(acc[0]);
//       });
//   });
// }

export class SmartContractService {
  
  // private internalSign(message: string, account : string): any {
  //   let localWeb3 = globalWeb3();
  //   let hexEncoded = ethUtil.bufferToHex(new Buffer(message, 'utf8'));
  //   console.log("hexEncoded", hexEncoded);
  //   return new Promise(function (resolve, reject) {
  //     localWeb3.personal.sign(hexEncoded, account, function (error, result) {
  //       if (error !== null) {
  //         console.log("Error while signing", error);
  //         return reject(error);
  //       }
  //       resolve(result);
  //     });
  //   });
  // }

  async createTrade(marketplaceAddress: string, tradeFactoryAddress: string, oracleUrl: string, myParty: Party, otherParty: Party, signingMessage: any, signature: string): Promise<any> {
    let response;
    try{      
      //prepare transaction to send to oracle
      if(!signingMessage && !signature) {
        signingMessage = new TransactionData({});
        signingMessage.marketplaceAddress = marketplaceAddress;
        signingMessage.factoryAddress = tradeFactoryAddress;
        signingMessage.myParty = myParty;
        signingMessage.otherParty = otherParty;
    
        // var unsignedData = JSON.stringify(signingMessage,null,4);
        // let userAccount = await getDefaultAccount();
        // if(!userAccount)
        //  throw new Error(constants.errorInvalidUserAccount);
        // signature = await this.internalSign(unsignedData, String(userAccount));
      }
      let request = new CreateTransactionRequest({
        message: signingMessage,
        signature: signature
      });
  
      let urlParts: string[] = oracleUrl.split(':');
      let host: string = urlParts[0];
      let port: number = Number(urlParts[1]);
      let resp: CreateTransactionResponse = await HttpUtil.RaiseHttpRequest(host, String(port), constants.CreateTransactionPath, constants.CreateTransactionMethod, request);
      response = {tradeNumber:resp.contractId,transactionhash:resp.transactionHash,status:resp.status,error:resp.error};      
    }
    catch (error) {
      console.log(error);
      //throw error;
      response = {status:false,error:error};
    }
    return response;
  }

  async grantAccessToContract(marketplaceAddress: string, tradeFactoryAddress: string, oracleUrl: string, contractId: number, myParty: Party, otherParties: Array<Party>): Promise<any> {
    let response;

    try{
      //prepare transaction to send to oracle
      let signingMessage = new GrantAccessData({});
      signingMessage.marketplaceAddress = marketplaceAddress;
      signingMessage.factoryAddress = tradeFactoryAddress;
      signingMessage.contractId = contractId;
      signingMessage.myParty = myParty;
      signingMessage.parties = otherParties;
      let signature = "";
  
      // let unsignedData = JSON.stringify(signingMessage,null,4);
      // let userAccount = await getDefaultAccount();
      // if(!userAccount)
      //   throw new Error(constants.errorInvalidUserAccount);
      // signature = await this.internalSign(unsignedData, String(userAccount));
      let request = new GrantAccessRequest({
        message: signingMessage,
        signature: signature
      });
  
      let urlParts: string[] = oracleUrl.split(':');
      let host: string = urlParts[0];
      let port: number = Number(urlParts[1]);
      let resp: GrantAccessResponse = await HttpUtil.RaiseHttpRequest(host, String(port), constants.GrantAccessPath, constants.GrantAccessMethod, request);
      console.log(resp);
      response = {transactionHash:resp.transactionHash,status:resp.status,error:resp.error};      
    }
    catch (error) {
      console.log(error);
      //throw error;
      response = {status:false,error:error};
    }
    return response;
  }

  async updateTrade(tradeNumber: number, tradeDate: Date, product: string, qty: number, price: number, paymentTerm: string): Promise<any> {
    let response;
    try{      
      //prepare transaction to send to hd wallet
      //console.log(resp);
      //response = {transactionHash:resp.transactionHash,status:resp.status,error:resp.error};
      response = {status:true,transactionHashes:["1234567890"]};      
    }
    catch (error) {
      console.log(error);
      //throw error;
      response = {status:false,error:error};
    }
    return response;
  }


}