import { SymmetricKeyEncryption } from './symmetrickey-encryption';
import { AsymmetricKeyEncryption } from './asymmetrickey-encryption';
import { Contract, utils, Wallet, Provider, providers } from "ethers";
import { AgentService } from './agent.service';
import { HttpUtil } from './http-util';

let factoryJson: any = require('../contracts/FactoryInterface.json');
let marketplaceDirectoryJson: any = require('../contracts/MarketplaceDirectoryInterface.json');

import { Party, PartyType } from './models';
import * as constants from './constants';


export class SmartContractService {
  //factory: Contract;
  //marketplaceDirectory: Contract;
  oracleWallet: Wallet;
  provider: Provider;
  agentService: AgentService;

  constructor(provider: Provider, wallet: Wallet, agentService: AgentService) {
    this.provider = provider;
    this.oracleWallet = wallet;
    this.agentService = agentService;
  }

  private async getOTKey(refId: string, signerCompany: string, signerName: string, hdWalletUrl: any) : Promise<any> {
    let signingMessage = {
      refId: refId,
      signerCompany: signerCompany,
      signerName: signerName };

    let msgSignature = this.oracleWallet.signMessage(signingMessage);
    let OTKeyRequest = {
      message: signingMessage,
      signature: msgSignature
    };

    let response: any = await HttpUtil.RaiseHttpRequest(hdWalletUrl.host, hdWalletUrl.port, constants.OTKeyPath, constants.OTKeyPath, OTKeyRequest);
  
    // var address =response.OTAddress;
    // var amount = utils.parseEther('0.1');
    // var tx = await this.oracleWallet.send(address, amount, { gasLimit: utils.bigNumberify("50000") });
    // console.log("tx",tx);
    // var confirmedTxn = await this.provider.waitForTransaction(tx.hash, 20000);
    return response;
  }

  // async createParcel(request: CreateParcelRequest): Promise<CreateParcelResponse> {
  //   let response: CreateParcelResponse;

  //   try{
  //       //prepare transaction to post to block chain
  //       var provider = this.forceFieldProvider();
  //       let messageObject = request.message;           
  //       let callingParty = request.message["myParty"];
  //       console.log("callingParty", callingParty);
  //       let parties: any[] = request.message["parties"];
  //       console.log("parties", parties);
  //       response = new CreateParcelResponse();
        
  //       if(!this.verifyPayload(request.message, request.signature))
  //       {
  //           response.error = "Invalid signature";
  //           return response;
  //       }
  //       var nextParcelId = await this.parcelFactory.nextParcelId();
  //       console.log("nextParcelId", nextParcelId);
  //       let parcelId: number = parseInt(nextParcelId.toString());
  //       console.log("parcelId", parcelId);
  //       var callingPartyHDWalletUrl = HDWALLET_URLS[callingParty.companyName];
  //       console.log("callingPartyHDWalletUrl", callingPartyHDWalletUrl);
  //       var callingPartyOTKey = await this.getOTKey(parseInt(parcelId.toString()), callingParty.companyName, callingPartyHDWalletUrl);
  //       callingParty.partyOTAddress = callingPartyOTKey;
  //       console.log("callingPartyOTKey", callingPartyOTKey);

  //       var wallet = new Wallet(oraclePrivateKey, provider);
        
  //       let asymEngine: AsymmetricKeyEncryption = new AsymmetricKeyEncryption();
  //       let symEngine: SymmetricKeyEncryption = new SymmetricKeyEncryption();

  //       let headerSymmetricKey: string = symEngine.generateSymKey();
  //       let qualitySymmetricKey: string = symEngine.generateSymKey();
  //       let quantitySymmetricKey: string = symEngine.generateSymKey();
        
  //       //Encrypt the symmetric key 
  //       console.log("Header Sym Key:", headerSymmetricKey);
  //       let headerEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(headerSymmetricKey, callingParty.partyOTAddress.bitcorePublicKey);
  //       console.log("Header Enc Sym Key:", headerEncryptedSymmetricKey);
  //       console.log("Quality Sym Key:", qualitySymmetricKey);
  //       let qualityEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(qualitySymmetricKey, callingParty.partyOTAddress.bitcorePublicKey);
  //       console.log("Quality Enc Sym Key:", qualityEncryptedSymmetricKey);
  //       console.log("Quantity Sym Key:", quantitySymmetricKey);
  //       let quantityEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(quantitySymmetricKey, callingParty.partyOTAddress.bitcorePublicKey);
  //       console.log("Quantity Enc Sym Key:", quantityEncryptedSymmetricKey);

  //       let overrideOptions = {
  //           gasLimit: 4500000,
  //       };
            
  //       let tx = await this.parcelFactory.CreateParcel(overrideOptions);

  //       console.log("tx", tx);
  //       let confirmedTxn = await wallet.provider.waitForTransaction(tx.hash, 20000);
  //       let receipt = await wallet.provider.getTransactionReceipt(confirmedTxn.hash);
  //       response.transactionHash = tx.hash;
  //       console.log("createParcel confirmedTxn", confirmedTxn, "receipt", receipt);
  //       if (receipt.status) {

  //         let encryptedCompanyName = symEngine.encrypt(callingParty.companyName,headerSymmetricKey);
  //         let parcelAddress = await this.parcelFactory.parcels(utils.bigNumberify(parcelId));
  //         console.log("parcelAddress", parcelAddress);
  //         let parcelContract = new Contract(parcelAddress[0], parcelJson.abi, wallet);
  //         tx = await parcelContract.updateParty(callingParty.partyType, callingPartyOTKey.OTAddress, encryptedCompanyName,
  //           headerEncryptedSymmetricKey, qualityEncryptedSymmetricKey, quantityEncryptedSymmetricKey, overrideOptions);
  //         confirmedTxn = await provider.waitForTransaction(tx.hash, 20000);
  //         receipt = await provider.getTransactionReceipt(confirmedTxn.hash);
  //         //update parties
  //         console.log("updateParty confirmedTxn", confirmedTxn, "receipt", receipt);

  //         console.log("updatinng parties", parties);
  //         if(parties) {
  //           for (let iParties = 0; iParties < parties.length; iParties++) {
  //             let partyHDWalletUrl = HDWALLET_URLS[parties[iParties].companyName];
  //             console.log("partyHDWalletUrl", partyHDWalletUrl);
  //             let partyOTKey = await this.getOTKey(parseInt(parcelId.toString()), parties[iParties].companyName, partyHDWalletUrl); // Get from other hd wallets
  //             parties[iParties].partyOTAddress = partyOTKey;
              
  //             console.log("Header Sym Key:", headerSymmetricKey);
  //             let partyHeaderEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(headerSymmetricKey, partyOTKey.bitcorePublicKey);
  //             console.log("Header Enc Sym Key:", partyHeaderEncryptedSymmetricKey);
  //             console.log("Quality Sym Key:", qualitySymmetricKey);
  //             let partyQualityEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(qualitySymmetricKey, partyOTKey.bitcorePublicKey);
  //             console.log("Quality Enc Sym Key:", partyQualityEncryptedSymmetricKey);
  //             console.log("Quantity Sym Key:", quantitySymmetricKey);
  //             let partyQuantityEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(quantitySymmetricKey, partyOTKey.bitcorePublicKey);
  //             console.log("Quantity Enc Sym Key:", partyQuantityEncryptedSymmetricKey);
      
  //             let partyEncryptedCompanyName = symEngine.encrypt(parties[iParties].companyName, headerSymmetricKey);
  //             if(parties[iParties].partyType == ParcelPartyType.InspectionCompany)
  //               tx = await parcelContract.updateParty(parties[iParties].partyType, partyOTKey.OTAddress, partyEncryptedCompanyName,
  //                 partyHeaderEncryptedSymmetricKey, partyQualityEncryptedSymmetricKey, "", overrideOptions);
  //             else if(parties[iParties].partyType == ParcelPartyType.ShippingCompany)
  //               tx = await parcelContract.updateParty(parties[iParties].partyType, partyOTKey.OTAddress, partyEncryptedCompanyName,
  //                 partyHeaderEncryptedSymmetricKey, "", partyQuantityEncryptedSymmetricKey, overrideOptions);
  //             else if(parties[iParties].partyType == ParcelPartyType.PortAgent)
  //               tx = await parcelContract.updateParty(parties[iParties].partyType, partyOTKey.OTAddress, partyEncryptedCompanyName,
  //                 partyHeaderEncryptedSymmetricKey, "", "", overrideOptions);
  //             else
  //               tx = await parcelContract.updateParty(parties[iParties].partyType, partyOTKey.OTAddress, encryptedCompanyName,
  //                 partyHeaderEncryptedSymmetricKey, partyQualityEncryptedSymmetricKey, partyQuantityEncryptedSymmetricKey, overrideOptions);
  //             confirmedTxn = await provider.waitForTransaction(tx.hash, 20000);
  //             receipt = await provider.getTransactionReceipt(confirmedTxn.hash);
  //             //update parties
  //             console.log("updateParty confirmedTxn", confirmedTxn, "receipt", receipt);
  //           }
  //         }      
  //         response.parcelId = parseInt(parcelId.toString());
  //       } else {
  //         response.parcelId = 0;      
  //       }
  //       console.log("createNomination receipt", receipt);
  //   }
  //   catch (error) {
  //       console.log(error);
  //       response.error = error.toString();
  //   }
  //   return response;
  // }

  // async getEncryptedSymmetricKeyForParty(request: GrantAccessRequest, contractId: number, contractAddress: string, 
  //     contractType: string, partyOTAddress: string, partyBitcorePublicKey: string, hdWalletUrl: any): Promise<any> {

  //   var provider = this.forceFieldProvider();
  //   var post_data = {
  //           message: request.message,
  //           signature: request.signature,
  //           contractId: contractId,
  //           contractAddress: contractAddress,
  //           contractType: contractType,
  //           partyOTAddress: partyOTAddress,
  //           partyBitcorePublicKey: partyBitcorePublicKey,
  //           signerCompany: request.myParty.companyName
  //   };

  //   var jsonPayload = JSON.stringify(post_data);

  //   // An object of options to indicate where to post to
  //   var post_options = {
  //     host: hdWalletUrl.host,
  //     port: hdWalletUrl.port,
  //     path: hdWalletGrantAccessUrl.path,
  //     method: hdWalletGrantAccessUrl.method,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Content-Length': Buffer.byteLength(jsonPayload)
  //     }
  //   };

  //   // Set up the request
  //   var response: any = await httpRequest(post_options, jsonPayload);
  //   console.log("response from Adding party hd wallet",response);
  //   return response;
  // }

  // async updatePartyOnTrade(tradeNumber: number, party: Party, encryptedCompanyName: string, accessibleSymmetricKey: string) {
  //   console.log("calling updateParty", party, tradeNumber, accessibleSymmetricKey);
  //   var provider = this.forceFieldProvider();
  //   var wallet = new Wallet(oraclePrivateKey, provider);
  //   var tradeAddress = await this.etrmFactory.trades(utils.bigNumberify(tradeNumber));
  //   console.log("tradeAddress", tradeAddress);
  //   var tradeContract = new Contract(tradeAddress[0], tradeJson.abi, wallet);
  //   var txn = await tradeContract.updateParty(party.partyType, party.partyOTAddress.OTAddress, encryptedCompanyName, accessibleSymmetricKey, { gasLimit: utils.bigNumberify("4500000") });
  //   //var txn = await tradeContract.updateParty(party.partyType, party.partyAddress, accessibleSymmetricKey);
  //   var confirmedTxn = await provider.waitForTransaction(txn.hash, 20000);
  //   var receipt = await provider.getTransactionReceipt(confirmedTxn.hash);
  //   //update parties
  //   console.log("updateParty confirmedTxn", confirmedTxn, "receipt", receipt);
  // }
  // async updatePartyOnNom(nomId: number, party: Party, accessibleSymmetricKey: string) {
  //   console.log("calling updateParty", party, nomId, accessibleSymmetricKey);
  //   var provider = this.forceFieldProvider();
  //   var wallet = new Wallet(oraclePrivateKey, provider);
  //   var nomAddress = await this.nomFactory.Nominations(utils.bigNumberify(nomId));
  //   console.log("nomAddress", nomAddress);
  //   var nomContract = new Contract(nomAddress[0], nominationJson.abi, wallet);
  //   var txn = await nomContract.updateParty(party.partyType, party.partyOTAddress.OTAddress, accessibleSymmetricKey, { gasLimit: utils.bigNumberify("4500000") });
  //   //var txn = await tradeContract.updateParty(party.partyType, party.partyAddress, accessibleSymmetricKey);
  //   var confirmedTxn = await provider.waitForTransaction(txn.hash, 20000);
  //   var receipt = await provider.getTransactionReceipt(confirmedTxn.hash);
  //   //update parties
  //   console.log("updateParty confirmedTxn", confirmedTxn, "receipt", receipt);
  // }

  // async createTrade(callingParty: Party, parties: Array<Party>): Promise<number> {
  //   var provider = this.forceFieldProvider();
  //   //let otKeys = [];
  //   var callingPartyHDWalletUrl = HDWALLET_URLS[callingParty.companyName];
  //   console.log("callingPartyHDWalletUrl", callingPartyHDWalletUrl);
  //   var tradeNumber = await this.etrmFactory.nextTradeNumber();
  //   console.log("tradeNumber", tradeNumber.toString());
  //   var callingPartyOTKey = await this.getOTKey(parseInt(tradeNumber.toString()), callingParty.companyName, callingPartyHDWalletUrl);
  //   callingParty.partyOTAddress = callingPartyOTKey;
  //   console.log("callingPartyOTKey", callingPartyOTKey);
  //   //for (var iParties = 0; iParties < parties.length; iParties++) {
  //   //  var hdWalletUrl = HDWALLET_URLS[parties[iParties]];
  //   //  console.log("get onetime key");
  //   //  otKeys[iParties] = await getOTKey(1000, hdWalletUrl);
  //   //  //get trade's address, call updateParty and update.
  //   //}
  //   var symEngine = new SymmetricKeyEncryption();
  //   var asymEngine = new AsymmetricKeyEncryption();
  //   var symmetricKey = symEngine.generateSymKey();
  //   console.log("symmetricKey", symmetricKey);
  //   var encryptedSymmetricKey = asymEngine.encrypt(symmetricKey, callingPartyOTKey.bitcorePublicKey);
  //   console.log("encryptedSymmetricKey", encryptedSymmetricKey);
  //   var txn = await this.etrmFactory.CreateTrade({ gasLimit: utils.bigNumberify("4500000") });
  //   console.log("txn", txn);
  //   var confirmedTxn = await provider.waitForTransaction(txn.hash, 20000);
  //   var receipt = await provider.getTransactionReceipt(confirmedTxn.hash);
  //   //update parties
  //   if (receipt.status) {
  //     console.log("createTrade confirmedTxn", confirmedTxn, "receipt", receipt);
  //     console.log("******************************************************");
  //     var encryptedCompanyName = symEngine.encrypt(callingParty.companyName,symmetricKey);
  //     await this.updatePartyOnTrade(parseInt(tradeNumber.toString()), callingParty, encryptedCompanyName, "0x" + encryptedSymmetricKey);
  //     console.log("updatinng parties", parties);
  //     for (var iParties = 0; iParties < parties.length; iParties++) {
  //       var partyHDWalletUrl = HDWALLET_URLS[parties[iParties].companyName];
  //       console.log("partyHDWalletUrl", partyHDWalletUrl);
  //       var partyOTKey = await this.getOTKey(parseInt(tradeNumber.toString()), parties[iParties].companyName, partyHDWalletUrl); // Get from other hd wallets
  //       parties[iParties].partyOTAddress = partyOTKey;
  //       var partyEncryptedSymmetricKey = asymEngine.encrypt(symmetricKey, partyOTKey.bitcorePublicKey);
  //       console.log("partyEncryptedSymmetricKey", partyEncryptedSymmetricKey); 
  //       var partyEncryptedCompanyName = symEngine.encrypt(parties[iParties].companyName,symmetricKey);   
  //       await this.updatePartyOnTrade(parseInt(tradeNumber.toString()), parties[iParties], partyEncryptedCompanyName, "0x" + partyEncryptedSymmetricKey);
  //     }

  //     return parseInt(tradeNumber.toString());
  //   } else
  //     return 0;
  // }

  // async createParcel(request: CreateParcelRequest): Promise<CreateParcelResponse> {
  //   let response: CreateParcelResponse;

  //   try{
  //       //prepare transaction to post to block chain
  //       var provider = this.forceFieldProvider();
  //       let messageObject = request.message;           
  //       let callingParty = request.message["myParty"];
  //       console.log("callingParty", callingParty);
  //       let parties: any[] = request.message["parties"];
  //       console.log("parties", parties);
  //       response = new CreateParcelResponse();
        
  //       if(!this.verifyPayload(request.message, request.signature))
  //       {
  //           response.error = "Invalid signature";
  //           return response;
  //       }
  //       var nextParcelId = await this.parcelFactory.nextParcelId();
  //       console.log("nextParcelId", nextParcelId);
  //       let parcelId: number = parseInt(nextParcelId.toString());
  //       console.log("parcelId", parcelId);
  //       var callingPartyHDWalletUrl = HDWALLET_URLS[callingParty.companyName];
  //       console.log("callingPartyHDWalletUrl", callingPartyHDWalletUrl);
  //       var callingPartyOTKey = await this.getOTKey(parseInt(parcelId.toString()), callingParty.companyName, callingPartyHDWalletUrl);
  //       callingParty.partyOTAddress = callingPartyOTKey;
  //       console.log("callingPartyOTKey", callingPartyOTKey);

  //       var wallet = new Wallet(oraclePrivateKey, provider);
        
  //       let asymEngine: AsymmetricKeyEncryption = new AsymmetricKeyEncryption();
  //       let symEngine: SymmetricKeyEncryption = new SymmetricKeyEncryption();

  //       let headerSymmetricKey: string = symEngine.generateSymKey();
  //       let qualitySymmetricKey: string = symEngine.generateSymKey();
  //       let quantitySymmetricKey: string = symEngine.generateSymKey();
        
  //       //Encrypt the symmetric key 
  //       console.log("Header Sym Key:", headerSymmetricKey);
  //       let headerEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(headerSymmetricKey, callingParty.partyOTAddress.bitcorePublicKey);
  //       console.log("Header Enc Sym Key:", headerEncryptedSymmetricKey);
  //       console.log("Quality Sym Key:", qualitySymmetricKey);
  //       let qualityEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(qualitySymmetricKey, callingParty.partyOTAddress.bitcorePublicKey);
  //       console.log("Quality Enc Sym Key:", qualityEncryptedSymmetricKey);
  //       console.log("Quantity Sym Key:", quantitySymmetricKey);
  //       let quantityEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(quantitySymmetricKey, callingParty.partyOTAddress.bitcorePublicKey);
  //       console.log("Quantity Enc Sym Key:", quantityEncryptedSymmetricKey);

  //       let overrideOptions = {
  //           gasLimit: 4500000,
  //       };
            
  //       let tx = await this.parcelFactory.CreateParcel(overrideOptions);

  //       console.log("tx", tx);
  //       let confirmedTxn = await wallet.provider.waitForTransaction(tx.hash, 20000);
  //       let receipt = await wallet.provider.getTransactionReceipt(confirmedTxn.hash);
  //       response.transactionHash = tx.hash;
  //       console.log("createParcel confirmedTxn", confirmedTxn, "receipt", receipt);
  //       if (receipt.status) {

  //         let encryptedCompanyName = symEngine.encrypt(callingParty.companyName,headerSymmetricKey);
  //         let parcelAddress = await this.parcelFactory.parcels(utils.bigNumberify(parcelId));
  //         console.log("parcelAddress", parcelAddress);
  //         let parcelContract = new Contract(parcelAddress[0], parcelJson.abi, wallet);
  //         tx = await parcelContract.updateParty(callingParty.partyType, callingPartyOTKey.OTAddress, encryptedCompanyName,
  //           headerEncryptedSymmetricKey, qualityEncryptedSymmetricKey, quantityEncryptedSymmetricKey, overrideOptions);
  //         confirmedTxn = await provider.waitForTransaction(tx.hash, 20000);
  //         receipt = await provider.getTransactionReceipt(confirmedTxn.hash);
  //         //update parties
  //         console.log("updateParty confirmedTxn", confirmedTxn, "receipt", receipt);

  //         console.log("updatinng parties", parties);
  //         if(parties) {
  //           for (let iParties = 0; iParties < parties.length; iParties++) {
  //             let partyHDWalletUrl = HDWALLET_URLS[parties[iParties].companyName];
  //             console.log("partyHDWalletUrl", partyHDWalletUrl);
  //             let partyOTKey = await this.getOTKey(parseInt(parcelId.toString()), parties[iParties].companyName, partyHDWalletUrl); // Get from other hd wallets
  //             parties[iParties].partyOTAddress = partyOTKey;
              
  //             console.log("Header Sym Key:", headerSymmetricKey);
  //             let partyHeaderEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(headerSymmetricKey, partyOTKey.bitcorePublicKey);
  //             console.log("Header Enc Sym Key:", partyHeaderEncryptedSymmetricKey);
  //             console.log("Quality Sym Key:", qualitySymmetricKey);
  //             let partyQualityEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(qualitySymmetricKey, partyOTKey.bitcorePublicKey);
  //             console.log("Quality Enc Sym Key:", partyQualityEncryptedSymmetricKey);
  //             console.log("Quantity Sym Key:", quantitySymmetricKey);
  //             let partyQuantityEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(quantitySymmetricKey, partyOTKey.bitcorePublicKey);
  //             console.log("Quantity Enc Sym Key:", partyQuantityEncryptedSymmetricKey);
      
  //             let partyEncryptedCompanyName = symEngine.encrypt(parties[iParties].companyName, headerSymmetricKey);
  //             if(parties[iParties].partyType == ParcelPartyType.InspectionCompany)
  //               tx = await parcelContract.updateParty(parties[iParties].partyType, partyOTKey.OTAddress, partyEncryptedCompanyName,
  //                 partyHeaderEncryptedSymmetricKey, partyQualityEncryptedSymmetricKey, "", overrideOptions);
  //             else if(parties[iParties].partyType == ParcelPartyType.ShippingCompany)
  //               tx = await parcelContract.updateParty(parties[iParties].partyType, partyOTKey.OTAddress, partyEncryptedCompanyName,
  //                 partyHeaderEncryptedSymmetricKey, "", partyQuantityEncryptedSymmetricKey, overrideOptions);
  //             else if(parties[iParties].partyType == ParcelPartyType.PortAgent)
  //               tx = await parcelContract.updateParty(parties[iParties].partyType, partyOTKey.OTAddress, partyEncryptedCompanyName,
  //                 partyHeaderEncryptedSymmetricKey, "", "", overrideOptions);
  //             else
  //               tx = await parcelContract.updateParty(parties[iParties].partyType, partyOTKey.OTAddress, encryptedCompanyName,
  //                 partyHeaderEncryptedSymmetricKey, partyQualityEncryptedSymmetricKey, partyQuantityEncryptedSymmetricKey, overrideOptions);
  //             confirmedTxn = await provider.waitForTransaction(tx.hash, 20000);
  //             receipt = await provider.getTransactionReceipt(confirmedTxn.hash);
  //             //update parties
  //             console.log("updateParty confirmedTxn", confirmedTxn, "receipt", receipt);
  //           }
  //         }      
  //         response.parcelId = parseInt(parcelId.toString());
  //       } else {
  //         response.parcelId = 0;      
  //       }
  //       console.log("createNomination receipt", receipt);
  //   }
  //   catch (error) {
  //       console.log(error);
  //       response.error = error.toString();
  //   }
  //   return response;
  // }

  // async grantAccessToContract(request: GrantAccessRequest): Promise<GrantAccessResponse> {
  //   let response: GrantAccessResponse;

  //   try{
  //     //prepare transaction to post to block chain
  //     let provider = this.forceFieldProvider();
  //     let wallet = new Wallet(oraclePrivateKey, provider);
  //     let messageObject = request.message;           
  //     response = new GrantAccessResponse();
      
  //     if(!this.verifyPayload(request.message, request.signature))
  //     {
  //         response.error = "Invalid signature";
  //         return response;
  //     }
  //     let contractId: number = request.message["contractId"];
  //     let id: number;
  //     let contract: Contract;
  //     let tradeAddr;

  //     if (request.contractType == "Trade") {

  //         //get the trade address from the etrm factory
  //         //get the address for the Trade smart contract instance. Not trusting the address coming from the DAPP
  //         let etrmFactory = new Contract(environment.etrmFactoryAddress, etrmFactoryJson["abi"], wallet);
  //         tradeAddr = await etrmFactory.trades(request.message["contractId"]);

  //         contract = new Contract(tradeAddr[0], tradeJson.abi, wallet);

  //       id = await contract.tradeNumber();
  //     } else if (request.contractType == "Nomination") {
  //       contract = new Contract(request.contractAddress, nominationJson.abi, wallet);
  //       id = await contract.nomid();
  //     } else if (request.contractType == "Parcel") {
  //       contract = new Contract(request.contractAddress, parcelJson.abi, wallet);
  //       id = await contract.parcelId();
  //     }
  //     contractId = parseInt(id.toString());
  //     console.log("contractId", contractId);
  //     if(!contract || !contractId) {
  //       response.error = "Contract no found";
  //       return response;
  //     }
  //     response.contractId = contractId;
      
  //     let asymEngine: AsymmetricKeyEncryption = new AsymmetricKeyEncryption();
  //     let symEngine: SymmetricKeyEncryption = new SymmetricKeyEncryption();

  //     let callingPartyHDWalletUrl = HDWALLET_URLS[request.myParty.companyName];
  //     console.log("callingPartyHDWalletUrl", callingPartyHDWalletUrl);
  //     let callingPartyOTKey = await this.getOTKey(parseInt(contractId.toString()), request.myParty.companyName, callingPartyHDWalletUrl);
  //     console.log("callingPartyOTKey", callingPartyOTKey);

  //     let encryptedSymmetricKey;
  //     if (request.contractType == "Parcel") {
  //       encryptedSymmetricKey = await contract.getAccessibleSymmetricKeyForParty(callingPartyOTKey.OTAddress, 0);
  //     } else {
  //       encryptedSymmetricKey = await contract.accessibleSymmetricKeysByUser(callingPartyOTKey.OTAddress, 0);
  //     }
  //     console.log("encryptedSymmetricKey", encryptedSymmetricKey);
  //     //callingPartyHDWalletUrl.path = hdWalletGrantAccessUrl.path;
  //     //callingPartyHDWalletUrl.method = hdWalletGrantAccessUrl.method;

  //     for (var iParties = 0; iParties < request.parties.length; iParties++) {
  //         let party: Party = request.parties[iParties];
  //         console.log("Party being added:", party);
  //       let partyHDWalletUrl = HDWALLET_URLS[party.companyName];
  //       console.log("partyHDWalletUrl", partyHDWalletUrl);
  //       let partyOTKey = await this.getOTKey(parseInt(contractId.toString()), party.companyName, partyHDWalletUrl); // Get from other hd wallets

  //       console.log("party OTkey", partyOTKey);

  //       let accessResp = await this.getEncryptedSymmetricKeyForParty(request, contractId, tradeAddr[0], request.contractType,
  //                                                                   partyOTKey.OTAddress, partyOTKey.bitcorePublicKey,
  //                                                                   callingPartyHDWalletUrl);
        
  //       if(accessResp && accessResp["error"]) {
  //         response.error = accessResp["error"];
  //         return response;
  //       }
  //       let partyEncryptedSymmetricKey = accessResp["encryptedSymmetricKey"];
  //       console.log("partyEncryptedSymmetricKey", partyEncryptedSymmetricKey); 
  //       let txn;
  //       if (request.contractType == "Trade") {
  //           console.log("+");
  //           console.log("+");
  //           console.log("+");
  //           console.log("Update party details:", party.partyType, partyOTKey.OTAddress, party.companyName);
  //           txn = await contract.updateParty(party.partyType, partyOTKey.OTAddress, party.companyName, partyEncryptedSymmetricKey);
  //           console.log("+");
  //           console.log("+");
  //           console.log("+");
  //       } else if (request.contractType == "Nomination") {
  //         txn = await contract.updateParty(party.partyType, partyOTKey.OTAddress, partyEncryptedSymmetricKey);
  //       } else if (request.contractType == "Parcel") {

  //         // let partyHeaderEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(headerSymmetricKey, partyOTKey.bitcorePublicKey);
  //         // console.log("Header Enc Sym Key:", partyHeaderEncryptedSymmetricKey);
  //         // let partyQualityEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(qualitySymmetricKey, partyOTKey.bitcorePublicKey);
  //         // console.log("Quality Enc Sym Key:", partyQualityEncryptedSymmetricKey);
  //         // let partyQuantityEncryptedSymmetricKey: string = "0x" + asymEngine.encrypt(quantitySymmetricKey, partyOTKey.bitcorePublicKey);
  //         // console.log("Quantity Enc Sym Key:", partyQuantityEncryptedSymmetricKey);

  //         // let partyEncryptedCompanyName = symEngine.encrypt(parties[iParties].companyName,partyHeaderEncryptedSymmetricKey);
  //         // if(parties[iParties] == ParcelPartyType.InspectionCompany)
  //         //   tx = await parcelContract.updateParty(parties[iParties].partyType, partyOTKey.OTAddress, partyEncryptedCompanyName,
  //         //     partyHeaderEncryptedSymmetricKey, partyQualityEncryptedSymmetricKey, "", overrideOptions);
  //         // else if(parties[iParties] == ParcelPartyType.ShippingCompany)
  //         //   tx = await parcelContract.updateParty(parties[iParties].partyType, partyOTKey.OTAddress, partyEncryptedCompanyName,
  //         //     partyHeaderEncryptedSymmetricKey, "", partyQuantityEncryptedSymmetricKey, overrideOptions);
  //         // else if(parties[iParties] == ParcelPartyType.PortAgent)
  //         //   tx = await parcelContract.updateParty(parties[iParties].partyType, partyOTKey.OTAddress, partyEncryptedCompanyName,
  //         //     partyHeaderEncryptedSymmetricKey, "", "", overrideOptions);
  //         // else
  //         //   tx = await parcelContract.updateParty(parties[iParties].partyType, partyOTKey.OTAddress, encryptedCompanyName,
  //         //     partyHeaderEncryptedSymmetricKey, partyQualityEncryptedSymmetricKey, partyQuantityEncryptedSymmetricKey, overrideOptions);
  //         // confirmedTxn = await provider.waitForTransaction(tx.hash, 20000);
  //         // receipt = await provider.getTransactionReceipt(confirmedTxn.hash);
  //         // //update parties
  //         // console.log("updateParty confirmedTxn", confirmedTxn, "receipt", receipt);
  //         //txn = await contract.updateParty(party.partyType, partyOTKey.OTAddress, partyEncryptedSymmetricKey);
  //       }

  //       let confirmedTxn = await provider.waitForTransaction(txn.hash, 20000);
  //       let receipt = await provider.getTransactionReceipt(confirmedTxn.hash);
  //       console.log("updateParty confirmedTxn", confirmedTxn, "receipt", receipt);
  //       response.transactionHash.push(txn.hash);
  //     }
  //   }
  //   catch (error) {
  //       console.log(error);
  //       response.error = error.toString();
  //   }
  //   return response;
  // }

  // private verifyPayload(message: object, signature: string) : boolean {    
  //   try {
  //     let messageString: string = JSON.stringify(message,null,4);
  //     //verify the original message was signed by the party
  //     //let signerAddress: string = walletObject.verifyMessage(message, signature);

  //     //TODO: verify permission of the address from the smart contract
        
  //     return true;
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // }
}