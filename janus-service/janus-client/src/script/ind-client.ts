import { SmartContractService } from './smartcontract.service';
import { Contract, utils, Wallet, Provider, providers } from "ethers";
import * as constants from './constants';
import { error } from 'util';
import { IHttpService, HttpService, Party, PartyType, TransactionData, TransactionInfo, FunctionInfo, CreateTransactionRequest, WalletRegistrationRequest, WalletUnRegistrationRequest } from '@manosamy/janus-common';
const Web3 = require('web3');
import * as ethUtil from 'ethereumjs-util';

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

export class IndClient {
	marketplaceAddress: string;
	tradeFactoryAddress: string;
	agentUrl: string;
	oracleUrl: string;
	smartContractService: SmartContractService;
	httpService: IHttpService;

	constructor(marketplaceAddress, tradeFactoryAddress, agentUrl, oracleUrl, httpService?: IHttpService) {
		console.log("In client constructor");
		//web3 = new Web3();
		this.marketplaceAddress = marketplaceAddress;
		this.tradeFactoryAddress = tradeFactoryAddress;
		this.agentUrl = agentUrl;
		this.oracleUrl = oracleUrl;
		this.httpService = httpService || new HttpService();
		this.smartContractService = new SmartContractService(this.httpService);
		console.log("In client constructor, completed");
	}

//   private internalSign(message: string, account : string): any {
//     let localWeb3 = globalWeb3();
//     let hexEncoded = ethUtil.bufferToHex(new Buffer(message, 'utf8'));
//     console.log("hexEncoded", hexEncoded);
//     return new Promise(function (resolve, reject) {
//       localWeb3.personal.sign(hexEncoded, account, function (error, result) {
//         if (error !== null) {
//           console.log("Error while signing", error);
//           return reject(error);
//         }
//         resolve(result);
//       });
//     });
//   }
	
	setMarketplaceAddress(marketplaceAddress: string) {
		this.marketplaceAddress = marketplaceAddress;
	}
	setTradeFactoryAddress(tradeFactoryAddress: string) {
		this.tradeFactoryAddress = tradeFactoryAddress;
	}
	setAgentUrl(agentUrl: string) {
		this.agentUrl = agentUrl;
	}
	setOracleUrl(oracleUrl: string) {
		this.oracleUrl = oracleUrl;
	}

    async createTrade(guid: string, myParty: Party, otherParty: Party, tradeDate: Date, product: string, qty: number, price: number, paymentTerm: string) {//marketplaceAddress: string, factoryAddress: string, myParty: Party, parties: Array<Party>, signature: string) {
		let transactionHashes = [];
		let tradeNumber:number;
		let status = false;
		let error;
		let validationError = this.validateConfig();
		if(!validationError) {
			let request = this.buildCreateUpdateTradeRequestMsg(this.marketplaceAddress, this.tradeFactoryAddress, guid, myParty, otherParty,
				tradeDate, product, qty, price, paymentTerm);
			console.log("Request", request);

			// var unsignedData = JSON.stringify(request.data,null,4);
			// let userAccount = await getDefaultAccount();
			// if(!userAccount)
			// 	throw new Error(constants.errorInvalidUserAccount);
			// request.signature = await this.internalSign(unsignedData, String(userAccount));

			let resp = await this.smartContractService.createTrade(this.oracleUrl, request);
			console.log("createTrade resp", resp);
			if(resp["status"] && resp["tradeNumber"]) {
				transactionHashes.push(resp["transactionHash"]);
				tradeNumber = Number(resp["tradeNumber"]);
				guid = request.data.guid;
				let updateResp = await this.smartContractService.updateTrade(this.agentUrl, request);
				if(updateResp["status"])
				{
					status = true;
					transactionHashes.push(updateResp["transactionHashes"]);
				} else {
					error = updateResp["error"];
				}
			} else {
				error = resp["error"];
			}
		} else {
			error = validationError;
		}
		return {tradeNumber:tradeNumber, guid:guid, transactionHashes:transactionHashes, status:status, error:error};			
	}

	private buildCreateUpdateTradeRequestMsg(marketplaceAddress:string, tradeFactoryAddress:string, guid:string, myParty: Party, otherParty: Party, tradeDate: Date, product: string, qty: number, price: number, paymentTerm: string) {
		let data:TransactionData = new TransactionData({});
		data.timestamp = (new Date()).getTime();
		data.guid = guid;

		// data.tradeDate = tradeDate;
		// data.product = product;
		// data.qty = qty;
		// data.price = price;
		// data.paymentTerm = paymentTerm;
		data.businessData = {
            tradeDate: tradeDate,
            qty: qty,
            product: product,
            price: price,
            paymentTerm: paymentTerm,
        };

		let info:TransactionInfo = new TransactionInfo({});
		info.marketplaceAddress = marketplaceAddress;
		info.factoryAddress = tradeFactoryAddress;
		info.contractName = "Trade";
		info.myParty = myParty;
		info.otherParty = otherParty;

		let function1:FunctionInfo = new FunctionInfo({});
		function1.name = "updateData";
		function1.params = ["1", "tradeDate",
			"product", "qty", "price"];
		let function2:FunctionInfo = new FunctionInfo({});
		function2.name = "updatePaymentInfo";
		function2.params = ["2", "paymentTerm"];

		info.functionList = [function1,function2];
		let infoStr:string = JSON.stringify(info,null,4);
		let messageHash = "a34dadf";//web3.sha3(infoStr);
		data.messageHash = messageHash;
		
		let request:CreateTransactionRequest = new CreateTransactionRequest({});
		request.data = data;
		request.transactionInfo = info;

		return request;
	}

	async updateParty(guid: string, myParty: Party, parties: Array<Party>) {
		let transactionHashes = [];
		let status = false;
		let error;
		let validationError = this.validateConfig();
		if(!validationError) {
			let resp = await this.smartContractService.grantAccessToContract(this.marketplaceAddress, this.tradeFactoryAddress, this.oracleUrl, null, myParty, parties);
			status = resp["status"];
			transactionHashes = resp["transactionHashes"];
			error = resp["error"];
		} else {
			error = validationError;
		}
		return {transactionHashes:transactionHashes, status:status, error:error};
	}

	async updateTrade(guid: string, tradeNumber: number, tradeDate: Date, product: string, qty: number, price: number, paymentTerm: string) {//marketplaceAddress: string, factoryAddress: string, myParty: Party, parties: Array<Party>, signature: string) {
		let transactionHashes = [];
		let status = false;
		let error;
		let validationError = this.validateConfig();
		if(!validationError) {
			let request = this.buildCreateUpdateTradeRequestMsg(this.marketplaceAddress, this.tradeFactoryAddress, guid, null, null,
				tradeDate, product, qty, price, paymentTerm);
			// var unsignedData = JSON.stringify(request.data,null,4);
			// let userAccount = await getDefaultAccount();
			// if(!userAccount)
			// 	throw new Error(constants.errorInvalidUserAccount);
			// request.signature = await this.internalSign(unsignedData, String(userAccount));
			
			let resp = await this.smartContractService.updateTrade(this.agentUrl, request);
			status = resp["status"];
			transactionHashes = resp["transactionHashes"];
			error = resp["error"];
		} else {
			error = validationError;
		}
		return {transactionHashes:transactionHashes, status:status, error:error};
	}

	private validateConfig() {
		if(!this.marketplaceAddress)
			return constants.errorInvalidMarketplaceAddress;
		if(!this.tradeFactoryAddress)
			return constants.errorInvalidTradeFactoryAddress;
		if(!this.agentUrl)
			return constants.errorInvalidAgentUrl;
		if(!this.oracleUrl)
			return constants.errorInvalidOracleUrl;
		return null;
	}
}