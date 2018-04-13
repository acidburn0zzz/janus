import { SmartContractService } from './smartcontract.service';
import { Contract, utils, Wallet, Provider, providers } from "ethers";
import * as constants from './constants';
import { error } from 'util';
import { IHttpService, HttpService, Party, PartyType, CreateTransactionRequest, WalletRegistrationRequest, WalletUnRegistrationRequest } from 'ind-common';

export class IndClient {
	marketplaceAddress: string;
	tradeFactoryAddress: string;
	agentUrl: string;
	oracleUrl: string;
	smartContractService: SmartContractService;
	httpService: IHttpService;

	constructor(marketplaceAddress, tradeFactoryAddress, agentUrl, oracleUrl, httpService?: IHttpService) {
		console.log("In client constructor");
		this.marketplaceAddress = marketplaceAddress;
		this.tradeFactoryAddress = tradeFactoryAddress;
		this.agentUrl = agentUrl;
		this.oracleUrl = oracleUrl;
		this.httpService = httpService || new HttpService();
		this.smartContractService = new SmartContractService(this.httpService);
		console.log("In client constructor, completed");
	}
	
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

    async createTrade(myParty: Party, otherParty: Party, tradeDate: Date, product: string, qty: number, price: number, paymentTerm: string) {//marketplaceAddress: string, factoryAddress: string, myParty: Party, parties: Array<Party>, signature: string) {
		let transactionHashes = [];
		let tradeNumber:number;
		let status = false;
		let error;
		let validationError = this.validateConfig();
		if(!validationError) {
			let resp = await this.smartContractService.createTrade(this.marketplaceAddress, this.tradeFactoryAddress, this.oracleUrl, myParty, otherParty, null, null);
			console.log("createTrade resp", resp);
			if(resp["status"] && resp["tradeNumber"]) {
				transactionHashes.push(resp["transactionHash"]);
				tradeNumber = Number(resp["tradeNumber"]);
				let updateResp = await this.smartContractService.updateTrade(tradeNumber, tradeDate, product, qty, price, paymentTerm);
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
		return {tradeNumber:tradeNumber, transactionHashes:transactionHashes, status:status, error:error};			
	}

	async updateParty(contractId: number, myParty: Party, parties: Array<Party>) {
		let transactionHashes = [];
		let status = false;
		let error;
		let validationError = this.validateConfig();
		if(!validationError) {
			let resp = await this.smartContractService.grantAccessToContract(this.marketplaceAddress, this.tradeFactoryAddress, this.oracleUrl, contractId, myParty, parties);
			status = resp["status"];
			transactionHashes = resp["transactionHashes"];
			error = resp["error"];
		} else {
			error = validationError;
		}
		return {transactionHashes:transactionHashes, status:status, error:error};
	}

	async updateTrade(tradeNumber: number, tradeDate: Date, product: string, qty: number, price: number, paymentTerm: string) {//marketplaceAddress: string, factoryAddress: string, myParty: Party, parties: Array<Party>, signature: string) {
		let transactionHashes = [];
		let status = false;
		let error;
		let validationError = this.validateConfig();
		if(!validationError) {
			let resp = await this.smartContractService.updateTrade(tradeNumber, tradeDate, product, qty, price, paymentTerm);
			status = resp["status"];
			transactionHashes = resp["transactionHashes"];
			error = resp["error"];
		} else {
			error = validationError;
		}
		return {transactionHashes:transactionHashes, status:status, error:error};
	}

	async verifyIdentity(marketplaceAddress: string, factoryAddress: string, contractId: number, partyOTA: string, role: PartyType, signature: string) {
		//inputs: mktplace address, factory address, contractId, onetime key, role of that OTA, signature


		//return party;
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