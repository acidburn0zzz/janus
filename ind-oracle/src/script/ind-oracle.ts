import { GrantAccessRequest} from './models';
import { SmartContractService } from './smartcontract.service';
import { AgentService } from './agent.service';
import { Contract, utils, Wallet, Provider, providers } from "ethers";
import { Party, PartyType, CreateTransactionRequest, WalletRegistrationRequest, WalletUnRegistrationRequest } from "ind-common";
import * as indCommon from 'ind-common';

export class IndOracle {
	provider: Provider;
	oracleWallet: Wallet;
	nodeUrl: string;
	networkChainId: number;
	//networkName = "something";
	agentService: AgentService;
	smartContractService: SmartContractService;
	httpService: indCommon.IHttpService;

	constructor(nodeUrl: string, networkChainId: number, oraclePrivateKey: string, httpService?: indCommon.IHttpService) {
		console.log("In oracle constructor");
		console.log("nodeUrl", nodeUrl);
		console.log("networkChainId", networkChainId);
		console.log("oraclePrivateKey", oraclePrivateKey);
		this.nodeUrl = nodeUrl;
		this.networkChainId = networkChainId;
		this.provider = this.forceFieldProvider();
		console.log("provider", this.provider);
		this.oracleWallet = new Wallet(oraclePrivateKey, this.provider);
		console.log("oracleWallet", this.oracleWallet);
		this.agentService = new AgentService();
		console.log("agentService created");	
		this.httpService = httpService || new indCommon.HttpService();	
		this.smartContractService = new SmartContractService(this.provider, this.oracleWallet, this.agentService, this.httpService);
		console.log("In oracle constructor: completed");
	}
	
	forceFieldProvider(): Provider {
		var provider = new providers.JsonRpcProvider(this.nodeUrl,
		  {
			chainId: this.networkChainId//,
			//name: this.networkName
		  });
		return provider;
	}

    async registerWalletAgent(request: WalletRegistrationRequest) {
		return await this.agentService.registerWalletAgent(request);
	}

	async unRegisterWalletAgent(request: WalletUnRegistrationRequest) {
		return await this.agentService.unRegisterWalletAgent(request);
	}

	async createTransaction(request: CreateTransactionRequest) {
		return await this.smartContractService.createTransaction(request);
		//returns {contractId, error, transaction hash, status};
	}

	async grantAccessToContract(request: GrantAccessRequest) {
		return await this.smartContractService.grantAccessToContract(request);
		//returns {error, list of transaction hashes, status};
	}
}