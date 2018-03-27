import { SymmetricKeyEncryption } from './symmetrickey-encryption';
import { AsymmetricKeyEncryption } from './asymmetrickey-encryption';
import { Contract, utils, Wallet, Provider, providers, Interface } from "ethers";
import { AgentService } from './agent.service';
import { IHttpService } from './ihttp.service';
import { Guid } from "guid-typescript";

let factoryJson: any = require('../../contracts/FactoryInterface.json');
let contractJson: any = require('../../contracts/ContractInterface.json');
let marketplaceDirectoryJson: any = require('../../contracts/MarketplaceDirectoryInterface.json');

import { Party, PartyType, CreateTransactionRequest, CreateTransactionResponse, GrantAccessRequest, GrantAccessResponse } from './models';
import * as constants from './constants';


export class SmartContractService {
  oracleWallet: Wallet;
  provider: Provider;
  agentService: AgentService;
  httpService: IHttpService;

  constructor(provider: Provider, wallet: Wallet, agentService: AgentService, httpService: IHttpService) {
    this.provider = provider;
    this.oracleWallet = wallet;
    this.agentService = agentService;
    this.httpService = httpService;
  }

  private async getOTKey(guid: string, companyName: string, hdWalletUrl: any) : Promise<any> {
    let signingMessage = {
      guid: guid,
      companyName: companyName };

    let signingMessageStr = JSON.stringify(signingMessage,null,4);
    let msgSignature = this.oracleWallet.signMessage(signingMessageStr);
    let OTKeyRequest = {
      message: signingMessageStr,
      signature: msgSignature
    };

    let response: any = await this.httpService.RaiseHttpRequest(hdWalletUrl.host, hdWalletUrl.port, constants.OTKeyPath, constants.OTKeyMethod, OTKeyRequest);
  
    if(response && response.OTAddress) {
      await this.sendEtherToAddress(response.OTAddress);
    }
    return response;
  }

  private async getEncryptedSymmetricKeyForParty(guid: string, contractAddress: string, encryptedSymmetricKey: string, partyCompanyName: string,
    partyOTAddress: string, partyBitcorePublicKey: string, hdWalletUrl: any): Promise<any> {

    var signingMessage = {
      guid: guid,
      contractAddress: contractAddress,
      accessibleSymmetricKey: encryptedSymmetricKey,
      companyName: partyCompanyName,
      partyOTAddress: partyOTAddress,
      partyBitcorePublicKey: partyBitcorePublicKey,
    };

    let signingMessageStr = JSON.stringify(signingMessage,null,4);
    let msgSignature = this.oracleWallet.signMessage(signingMessageStr);
    let grantAccessRequest = {
      message: signingMessageStr,
      signature: msgSignature
    };

    let response: any = await this.httpService.RaiseHttpRequest(hdWalletUrl.host, hdWalletUrl.port, constants.GrantAccessPath, constants.GrantAccessMethod, grantAccessRequest);
    
    return response;
  }

  private async sendEtherToAddress(address: any) {
    let balance = await this.provider.getBalance(address);
    if(!balance || balance.lt(utils.parseEther('0.05'))) {
      var amount = utils.parseEther('0.1');
      var tx = await this.oracleWallet.send(address, amount, { gasLimit: utils.bigNumberify("50000") });
      console.log("tx", tx);
      //var confirmedTxn = await this.provider.waitForTransaction(tx.hash, 20000);
    }
  }

  private factoryContract(factoryAddress: string) {
    let factory = new Contract(factoryAddress, factoryJson.abi, this.oracleWallet);
    return factory;
  }

  async createTransaction(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    let response: CreateTransactionResponse;

    try{
        //prepare transaction to post to block chain
        let messageObject = request.message;           
        let callingParty = request.message.myParty;
        console.log("callingParty", callingParty);
        let otherParty = request.message.otherParty;
        console.log("otherParty", otherParty);
        response = new CreateTransactionResponse({});

        let buyer: Party;
        let seller: Party;
        if(callingParty.partyType == PartyType.Buyer) {
          buyer = callingParty;
          seller = otherParty;
        } else {
          buyer = otherParty;
          seller = callingParty;
        }
 		
        let buyerAddress: string; 
        let buyerCompanyName: string;
        let buyerCommonFieldsEncSymKey: string;
        let buyerPaymentFieldsEncSymKey: string;
        let sellerAddress: string;
        let sellerCompanyName: string;
        let sellerCommonFieldsEncSymKey: string;
        let sellerPaymentFieldsEncSymKey: string;
        let guid: string = Guid.create().toString();
        console.log("guid", guid);

        let asymEngine: AsymmetricKeyEncryption = new AsymmetricKeyEncryption();
        let symEngine: SymmetricKeyEncryption = new SymmetricKeyEncryption();

        //Getting new symmetric keys
        let commonFieldsSymKey: string = symEngine.generateSymKey();
        let paymentFieldsSymKey: string = symEngine.generateSymKey();
        console.log("Common Sym Key:", commonFieldsSymKey);
        console.log("Payment Sym Key:", paymentFieldsSymKey);
        
        //verify signature and permission
        if(!this.verifySignature(request.message, request.signature))
        {
          response.status = false;
          response.error = "Invalid signature";
          return response;
        }
        if(buyer) {
          //Getting onetime key for buyer
          let buyerPartyHDWalletUrl = await this.agentService.getWalletAgentUrl(buyer.companyName);
          console.log("buyerPartyHDWalletUrl", buyerPartyHDWalletUrl);
          let buyerPartyOTKey = await this.getOTKey(guid, buyer.companyName, buyerPartyHDWalletUrl);
          console.log("buyerPartyOTKey", buyerPartyOTKey);
          buyerAddress = buyerPartyOTKey.OTAddress         
          buyerCompanyName = symEngine.encrypt(buyer.companyName, commonFieldsSymKey);
          //Encrypt the symmetric keys 
          buyerCommonFieldsEncSymKey = "0x" + asymEngine.encrypt(commonFieldsSymKey, buyerPartyOTKey.bitcorePublicKey);
          console.log("Common Enc Sym Key:", buyerCommonFieldsEncSymKey);
          buyerPaymentFieldsEncSymKey = "0x" + asymEngine.encrypt(paymentFieldsSymKey, buyerPartyOTKey.bitcorePublicKey);
          console.log("Payment Enc Sym Key:", buyerPaymentFieldsEncSymKey);
        }
        if(seller) {
          //Getting onetime key for seller
          let sellerPartyHDWalletUrl = await this.agentService.getWalletAgentUrl(seller.companyName);
          console.log("sellerPartyHDWalletUrl", sellerPartyHDWalletUrl);
          let sellerPartyOTKey = await this.getOTKey(guid, seller.companyName, sellerPartyHDWalletUrl);
          console.log("sellerPartyOTKey", sellerPartyOTKey);
          sellerAddress = sellerPartyOTKey.OTAddress         
          sellerCompanyName = symEngine.encrypt(seller.companyName, commonFieldsSymKey);
          //Encrypt the symmetric keys 
          sellerCommonFieldsEncSymKey = "0x" + asymEngine.encrypt(commonFieldsSymKey, sellerPartyOTKey.bitcorePublicKey);
          console.log("Common Enc Sym Key:", sellerCommonFieldsEncSymKey);
          sellerPaymentFieldsEncSymKey = "0x" + asymEngine.encrypt(paymentFieldsSymKey, sellerPartyOTKey.bitcorePublicKey);
          console.log("Payment Enc Sym Key:", sellerPaymentFieldsEncSymKey);
        }
        //Create transaction from factory
        let overrideOptions = {
           gasLimit: 2000000,
        };
        let factory: Contract = this.factoryContract(request.message.factoryAddress);
        console.log(guid, buyerAddress, buyerCompanyName, buyerCommonFieldsEncSymKey, buyerPaymentFieldsEncSymKey,
          sellerAddress, sellerCompanyName, sellerCommonFieldsEncSymKey, sellerPaymentFieldsEncSymKey, overrideOptions);
        let tx = await factory.createTransaction(guid, buyerAddress, buyerCompanyName, buyerCommonFieldsEncSymKey, buyerPaymentFieldsEncSymKey,
          sellerAddress, sellerCompanyName, sellerCommonFieldsEncSymKey, sellerPaymentFieldsEncSymKey, overrideOptions);

        console.log("tx", tx.hash);
        let confirmedTxn = await this.provider.waitForTransaction(tx.hash, 20000);
        let receipt = await this.provider.getTransactionReceipt(confirmedTxn.hash);
        response.transactionHash = [tx.hash];
        console.log(receipt.logs);
        console.log("CreateTransaction confirmedTxn", confirmedTxn, "receipt", receipt);
        let contractId = 0;
        if (receipt && receipt.status) {
          response.status = true;
          if(receipt.logs && receipt.logs[0]) {
            console.log("logs[0]",receipt.logs[0]);
            let iface = new Interface(factoryJson.abi);
            let ContractCreatedEvent = iface.events.ContractCreated();
            let result = ContractCreatedEvent.parse(receipt.logs[0].topics, receipt.logs[0].data);
            console.log("result", result);
            contractId = result['tokenNumber'].toNumber();
          }
        } else {
          response.status = false;          
        }
        response.contractId = contractId;
    }
    catch (error) {
        console.log("Error", error);
        response.error = error.toString();
    }
    return response;
  }

  async grantAccessToContract(request: GrantAccessRequest): Promise<GrantAccessResponse> {
    let response: GrantAccessResponse;

    try{
      //prepare transaction to post to block chain
      let messageObject = request.message;           
      response = new GrantAccessResponse({status:false, transactionHashes:[]});
      
      if(!this.verifySignature(request.message, request.signature))
      {
          response.error = "Invalid signature";
          return response;
      }
      let contractAddress: string;
      let contract: Contract;
      let guid: string;

      console.log("creating factoryContract");
      let factory: Contract = this.factoryContract(request.message.factoryAddress);
      if(factory) {
        let addresses = await factory.getContract(request.message.contractId);
        if(addresses && addresses[0])
          contractAddress = addresses[0];
      }
      console.log("contractAddress", contractAddress);

      if(contractAddress)
        contract = new Contract(contractAddress, contractJson.abi, this.oracleWallet);
      
      console.log("created tradeContract");
      if(!contract) {
        response.error = "Contract no found";
        return response;
      }
      
      guid = await contract.getGuid();
      let asymEngine: AsymmetricKeyEncryption = new AsymmetricKeyEncryption();
      let symEngine: SymmetricKeyEncryption = new SymmetricKeyEncryption();

      let callingPartyHDWalletUrl = await this.agentService.getWalletAgentUrl(request.message.myParty.companyName);
      console.log("callingPartyHDWalletUrl", callingPartyHDWalletUrl);
      let callingPartyOTKey = await this.getOTKey(guid, request.message.myParty.companyName, callingPartyHDWalletUrl);
      console.log("callingPartyOTKey", callingPartyOTKey);

      let encryptedSymmetricKey;
      encryptedSymmetricKey = await contract.getAccessibleSymmetricKeyForParty(callingPartyOTKey.OTAddress, 0);

      console.log("encryptedSymmetricKey", encryptedSymmetricKey);

      for (var iParties = 0; iParties < request.message.parties.length; iParties++) {
          let party: Party = request.message.parties[iParties];
          console.log("Party being added:", party);
        let partyHDWalletUrl = await this.agentService.getWalletAgentUrl(party.companyName);
        console.log("partyHDWalletUrl", partyHDWalletUrl);
        let partyOTKey = await this.getOTKey(guid, party.companyName, partyHDWalletUrl); // Get from other hd wallets

        console.log("party OTkey", partyOTKey);

        let accessResp = await this.getEncryptedSymmetricKeyForParty(guid, contractAddress, encryptedSymmetricKey, party.companyName,
                                                                    partyOTKey.OTAddress, partyOTKey.bitcorePublicKey,
                                                                    callingPartyHDWalletUrl);
        
        if(accessResp && accessResp["error"] != 'OK') {
          response.error = accessResp["error"];
          return response;
        }
        let partyEncryptedSymmetricKeys = [accessResp["partyEncryptedSymmetricKey"], ""];
        let partyEncryptedCompanyName = accessResp["partyEncryptedCompanyName"];
        console.log("partyEncryptedSymmetricKeys", partyEncryptedSymmetricKeys); 
        console.log("partyEncryptedCompanyName", partyEncryptedCompanyName); 
        if(!partyEncryptedCompanyName)
          partyEncryptedCompanyName = party.companyName;
        let txn = await contract.updateParty(party.partyType, partyOTKey.OTAddress, partyEncryptedCompanyName, partyEncryptedSymmetricKeys[0], partyEncryptedSymmetricKeys[1]);

        let confirmedTxn = await this.provider.waitForTransaction(txn.hash, 20000);
        let receipt = await this.provider.getTransactionReceipt(confirmedTxn.hash);
        console.log("updateParty confirmedTxn", confirmedTxn, "receipt", receipt);
        response.transactionHashes.push(txn.hash);
      }
      response.status = true;
    }
    catch (error) {
        console.log(error);
        response.error = error.toString();
    }
    return response;
  }

  private verifySignature(message: object, signature: string) : boolean {    
    try {
      let messageString: string = JSON.stringify(message,null,4);
      //verify the original message was signed by the party
      //let signerAddress: string = this.oracleWallet.verifyMessage(message, signature);

      //TODO: verify permission of the address from the smart contract
        
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}