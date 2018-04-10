declare var require: any
declare const Buffer
import { Contract, utils, Wallet, Provider, providers, Interface } from "ethers";
import { IHttpService, Party, PartyType, TransactionData, CreateTransactionRequest, CreateTransactionResponse, 
  GrantAccessData, GrantAccessRequest, GrantAccessResponse } from 'ind-common';
import { Guid } from "guid-typescript";
const Web3 = require('web3');

let factoryJson: any = require('../../contracts/FactoryInterface.json');
let contractJson: any = require('../../contracts/ContractInterface.json');
let marketplaceDirectoryJson: any = require('../../contracts/MarketplaceDirectoryInterface.json');

import * as constants from './constants';
import { CreateTransactionPath } from "./constants";

declare var web3: any;

export class SmartContractService {
  
  httpService: IHttpService;
  
  constructor(httpService: IHttpService) {
    this.httpService = httpService;
  }

  async createTrade(oracleUrl: string, request: CreateTransactionRequest): Promise<any> {
    let response;
    try{  
      let urlParts: string[] = oracleUrl.split(':');
      let host: string = urlParts[0];
      let port: number = Number(urlParts[1]);
      let resp: CreateTransactionResponse = await this.httpService.RaiseHttpRequest(host, String(port), constants.CreateTransactionPath, constants.CreateTransactionMethod, request);
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
      // let signingMessage = new GrantAccessData({});
      // signingMessage.marketplaceAddress = marketplaceAddress;
      // signingMessage.factoryAddress = tradeFactoryAddress;
      // signingMessage.contractId = contractId;
      // signingMessage.myParty = myParty;
      // signingMessage.parties = otherParties;
      // let signature = "";
  
      // let unsignedData = JSON.stringify(signingMessage,null,4);
      // let userAccount = await getDefaultAccount();
      // if(!userAccount)
      //   throw new Error(constants.errorInvalidUserAccount);
      // signature = await this.internalSign(unsignedData, String(userAccount));
      // let request = new GrantAccessRequest({
      //   message: signingMessage,
      //   signature: signature
      // });
  
      // let urlParts: string[] = oracleUrl.split(':');
      // let host: string = urlParts[0];
      // let port: number = Number(urlParts[1]);
      // let resp: GrantAccessResponse = await this.httpService.RaiseHttpRequest(host, String(port), constants.GrantAccessPath, constants.GrantAccessMethod, request);
      // console.log(resp);
      // response = {transactionHash:resp.transactionHash,status:resp.status,error:resp.error}; 
      response = {status:true,transactionHashes:["1234567890"]};     
    }
    catch (error) {
      console.log(error);
      //throw error;
      response = {status:false,error:error};
    }
    return response;
  }

  async updateTrade(agentUrl: string, request: CreateTransactionRequest): Promise<any> {
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