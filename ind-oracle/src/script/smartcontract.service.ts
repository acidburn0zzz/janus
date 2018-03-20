import { SymmetricKeyEncryption } from './symmetrickey-encryption';
import { AsymmetricKeyEncryption } from './asymmetrickey-encryption';
import { Contract, utils, Wallet, Provider, providers, Interface } from "ethers";
import { AgentService } from './agent.service';
import { HttpUtil } from './http-util';
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

  constructor(provider: Provider, wallet: Wallet, agentService: AgentService) {
    this.provider = provider;
    this.oracleWallet = wallet;
    this.agentService = agentService;
  }

  private async getOTKey(refId: string, companyName: string, hdWalletUrl: any) : Promise<any> {
    let signingMessage = {
      refId: refId,
      companyName: companyName };

    let signingMessageStr = JSON.stringify(signingMessage,null,4);
    let msgSignature = this.oracleWallet.signMessage(signingMessageStr);
    let OTKeyRequest = {
      message: signingMessageStr,
      signature: msgSignature
    };

    let response: any = await HttpUtil.RaiseHttpRequest(hdWalletUrl.host, hdWalletUrl.port, constants.OTKeyPath, constants.OTKeyMethod, OTKeyRequest);
  
    if(response && response.OTAddress) {
      await this.sendEtherToAddress(response.OTAddress);
    }
    return response;
  }

  private async getEncryptedSymmetricKeyForParty(request: GrantAccessRequest, guid: string, contractId: number, 
    partyOTAddress: string, partyBitcorePublicKey: string, hdWalletUrl: any): Promise<any> {

    var grantAccessRequest = {
      message: request.message,
      signature: request.signature,
      contractAddress: contractId,
      partyOTAddress: partyOTAddress,
      partyBitcorePublicKey: partyBitcorePublicKey,
    };

    let response: any = await HttpUtil.RaiseHttpRequest(hdWalletUrl.host, hdWalletUrl.port, constants.GrantAccessMethod, constants.GrantAccessPath, grantAccessRequest);
    
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
        if (receipt.status) {
          response.status = true;
          if(receipt.logs[0]) {
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
        
        // var SolidityCoder = require("web3/lib/solidity/coder.js");
        
        // // You might want to put the following in a loop to handle all logs in this receipt.
        // var log = receipt.logs[0];
        // var event = null;
        
        // for (var i = 0; i < abi.length; i++) {
        //   var item = abi[i];
        //   if (item.type != "event") continue;
        //   var signature = item.name + "(" + item.inputs.map(function(input) {return input.type;}).join(",") + ")";
        //   var hash = web3.sha3(signature);
        //   if (hash == log.topics[0]) {
        //     event = item;
        //     break;
        //   }
        // }
        
        // if (event != null) {
        //   var inputs = event.inputs.map(function(input) {return input.type;});
        //   var data = SolidityCoder.decodeParams(inputs, log.data.replace("0x", ""));
        //   // Do something with the data. Depends on the log and what you're using the data for.
        // }
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
      response = new GrantAccessResponse({});
      
      if(!this.verifySignature(request.message, request.signature))
      {
          response.error = "Invalid signature";
          return response;
      }
      let contractAddress: string;
      let contract: Contract;
      let guid: string;

      let factory: Contract = this.factoryContract(request.message.factoryAddress);
      if(factory)
        contractAddress = await factory.getContract(request.message.contractId);

      if(contractAddress)
        contract = new Contract(contractAddress, contractJson.abi, this.oracleWallet);
      
      if(!contract) {
        response.error = "Contract no found";
        return response;
      }
      
      guid = await contract.getGuid();
      let asymEngine: AsymmetricKeyEncryption = new AsymmetricKeyEncryption();
      let symEngine: SymmetricKeyEncryption = new SymmetricKeyEncryption();

      let callingPartyHDWalletUrl = this.agentService.getWalletAgentUrl(request.message.myParty.companyName);
      console.log("callingPartyHDWalletUrl", callingPartyHDWalletUrl);
      let callingPartyOTKey = await this.getOTKey(guid, request.message.myParty.companyName, callingPartyHDWalletUrl);
      console.log("callingPartyOTKey", callingPartyOTKey);

      let encryptedSymmetricKey;
      encryptedSymmetricKey = await contract.getAccessibleSymmetricKeyForParty(callingPartyOTKey.OTAddress, 0);

      console.log("encryptedSymmetricKey", encryptedSymmetricKey);
      //callingPartyHDWalletUrl.path = hdWalletGrantAccessUrl.path;
      //callingPartyHDWalletUrl.method = hdWalletGrantAccessUrl.method;

      for (var iParties = 0; iParties < request.message.parties.length; iParties++) {
          let party: Party = request.message.parties[iParties];
          console.log("Party being added:", party);
        let partyHDWalletUrl = this.agentService.getWalletAgentUrl(party.companyName);
        console.log("partyHDWalletUrl", partyHDWalletUrl);
        let partyOTKey = await this.getOTKey(guid, party.companyName, partyHDWalletUrl); // Get from other hd wallets

        console.log("party OTkey", partyOTKey);

        let accessResp = await this.getEncryptedSymmetricKeyForParty(request, guid, request.message.contractId,
                                                                    partyOTKey.OTAddress, partyOTKey.bitcorePublicKey,
                                                                    callingPartyHDWalletUrl);
        
        if(accessResp && accessResp["error"]) {
          response.error = accessResp["error"];
          return response;
        }
        let partyEncryptedSymmetricKeys = accessResp["encryptedSymmetricKeys"];
        let partyEncryptedCompanyName = accessResp["encryptedCompanyName"];
        console.log("partyEncryptedSymmetricKeys", partyEncryptedSymmetricKeys); 
        console.log("partyEncryptedCompanyName", partyEncryptedSymmetricKeys); 
        let txn = await contract.updateParty(party.partyType, partyOTKey.OTAddress, partyEncryptedCompanyName, partyEncryptedSymmetricKeys[0], partyEncryptedSymmetricKeys[1]);

        let confirmedTxn = await this.provider.waitForTransaction(txn.hash, 20000);
        let receipt = await this.provider.getTransactionReceipt(confirmedTxn.hash);
        console.log("updateParty confirmedTxn", confirmedTxn, "receipt", receipt);
        response.transactionHash.push(txn.hash);
      }
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