import * as fs from 'fs';
//import { } from './models';
import { IndOracle, Party, CreateTransactionRequest, GrantAccessRequest, WalletRegistrationRequest, WalletUnRegistrationRequest} from 'ind-oracle';
var oracle: IndOracle;
let oraclePrivateKey = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
var nodeUrl = "http://forcefield01.uksouth.cloudapp.azure.com:8545";
var networkChainId = 11997;
var networkName = "something";

export class OracleService {

  private _usage: any = {};
  
  private countUsage(feature: string, companyName: string) {
    this._usage[feature][companyName] = +(this._usage[feature][companyName] || 0) + 1;
  }

  constructor() {
    console.log("Before oracle creation");
    oracle = new IndOracle(nodeUrl, networkChainId, oraclePrivateKey);
    console.log("After oracle creation");
  }

  async registerWalletAgent(request: WalletRegistrationRequest) {
		return await oracle.registerWalletAgent(request);
  }

  async unRegisterWalletAgent(request: WalletUnRegistrationRequest) {
		return await oracle.unRegisterWalletAgent(request);
  }

  async createTransaction(request: CreateTransactionRequest) {
    var caller: Party = request.message.myParty;
    var response = await oracle.createTransaction(request);
    if(response && response.status == true) {
      var contractId: number = response.contractId;
      console.log("Created contractId", contractId);
      //this.countUsage(request.message.factoryAddress, caller.companyName);
    }
    console.log("response", response);
    return response;
  }

  async grantAccessToContract(request: GrantAccessRequest) {
		return await oracle.grantAccessToContract(request);
  }
}
