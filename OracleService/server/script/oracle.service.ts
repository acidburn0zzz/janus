import * as fs from 'fs';
//import { } from './models';
import { IndOracle, GrantAccessRequest } from 'ind-oracle';
import { Party, CreateTransactionRequest, WalletRegistrationRequest, WalletUnRegistrationRequest, 
  MeterSummaryRequest, MeterSummaryResponse} from 'ind-common';
var oracle: IndOracle;
let oraclePrivateKey = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
var nodeUrl = "http://forcefield01.uksouth.cloudapp.azure.com:8545";
var networkChainId = 11997;
var networkName = "something";

export class OracleService {

  private _usage: Map<string, Map<string, number>>;
  
  private countUsage(feature: string, companyName: string) {
    let companyInfo: Map<string, number> = this._usage.get(feature);
    if(!companyInfo) {
      companyInfo = new Map<string, number>();
      this._usage.set(feature, companyInfo);
    }
    companyInfo.set(companyName, +(companyInfo.get(companyName) || 0) + 1);
  }

  private getUsage(feature: string, companyName: string) {
    let companyInfo: Map<string, number> = this._usage.get(feature);
    if(companyInfo)
      return Number(companyInfo.get(companyName));
    return 0;
  }

  constructor() {
    console.log("Before oracle creation");
    oracle = new IndOracle(nodeUrl, networkChainId, oraclePrivateKey);
    this._usage = new Map<string, Map<string, number>>();
    console.log("After oracle creation");
  }

  async registerWalletAgent(request: WalletRegistrationRequest) {
		return await oracle.registerWalletAgent(request);
  }

  async unRegisterWalletAgent(request: WalletUnRegistrationRequest) {
		return await oracle.unRegisterWalletAgent(request);
  }

  async createTransaction(request: CreateTransactionRequest) {
    var caller: Party = request.otherInfo.myParty;
    var response = await oracle.createTransaction(request);
    if(response && response.status == true) {
      var contractId: number = response.contractId;
      console.log("Created contractId", contractId);
      this.countUsage(request.otherInfo.factoryAddress, caller.companyName);
    }
    console.log("response", response);
    return response;
  }

  async grantAccessToContract(request: GrantAccessRequest) {
		return await oracle.grantAccessToContract(request);
  }

  getMeterSummary(request: MeterSummaryRequest) {
    //TODO: verify signature
    var response = new MeterSummaryResponse({});
    if(request.message && request.message.companyName) {
      response.result = this.getUsage(request.message.factoryAddress, request.message.companyName);
      response.status = true;
    } else {
      response.status = false;
      response.error = "Company name not provided";
    }
		return response;
  }
}
