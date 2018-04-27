//import * as indCommon from 'ind-common';
import {
    SmartContractServiceInterface, SendTransactionPropertiesInterface,
    GrantAccessPropertiesInterface
} from 'ind-common/build/interfaces/smart-contract-service-interface';
import { EncryptedSymKeyInfo } from 'ind-common/build/common/common-types';
import { Utils } from 'ind-common/build/common/utils';
import {
    OneTimeAddressRequest, OneTimeAddressResponse, OneTimeAddressData, DecryptDataRequest, DecryptDataResponse,
    EncryptDataRequest, EncryptDataResponse, GrantAccessRequest, GrantAccessResponse, PostTransactionRequest, PostTransactionResponse
} from 'ind-common/build/common/models';

import * as Constants from 'ind-common/build/common/constants';

import { AsymmetricKeyEncryption } from 'ind-common/build/common/asymmetrickey-encryption';
import { SymmetricKeyEncryption } from 'ind-common/build/common/symmetrickey-encryption';

import ethers = require('ethers');

import * as cachingService from '../services/wallet-caching-service';
import * as vaultService from '../services/secure-enclave-service';
import { SmartContractEventEmitter } from './smartContractEventEmitter';
import { SmartContractService } from '../services/smart-contract-service';

const ethersUtils = ethers.utils;
const walletObject = ethers.Wallet;
const providers = ethers.providers;
const utils = new Utils();

let addressIndex: number = -1;

export interface AddressObfuscatorOptions {
    oracleServiceUri: string;
    vaultServiceUri: string;
    contractsPath: string;
    abiPath: string;
    blockchainProvider: string;
}

/*
    For a given GUID, this class generates a one time deterministic wallet. The generated one time wallet
    will be cached using the WalletCaching Service
*/
export class AddressObfuscator {

    private walletCache: cachingService.WalletCachingService;
    private secureEnclave: vaultService.SecureEnclaveService; 
    private smartContractService: SmartContractServiceInterface;
    private eventEmitter: SmartContractEventEmitter;

    constructor(options: AddressObfuscatorOptions) {
        this.walletCache = new cachingService.WalletCachingService();
        this.secureEnclave = new vaultService.SecureEnclaveService();

        if (options.contractsPath.length == 0 || options.abiPath.length == 0 || options.blockchainProvider.length == 0 ||
            options.oracleServiceUri.length == 0 || options.vaultServiceUri.length == 0)
            throw Constants.errorObfuscatorOptionsEmpty;

        this.smartContractService = SmartContractService.getInstance(options.contractsPath, options.abiPath, options.blockchainProvider);
    }


    /**
     * for a given guid, this method returns a one time address generated using a HD wallet. If the address
     already exists in the cache, the existing address is returned
     * @param request
     */
    public getOnetimeAddress(request: OneTimeAddressRequest): OneTimeAddressResponse {

        let response = new OneTimeAddressResponse(request.messageObject.guid);

        try {

            //verify if the signature on the message matches
            let verifiedAddress: string = this.verifyPayload(request.message, request.signature);
            if (verifiedAddress === Constants.errorInvalidSignature) {

                response.error = Constants.errorInvalidSignature;
                return response;
            }

            let otaData = this.walletCache.getOneTimeAddress(request.messageObject.guid);
            if (otaData == null) { 

                //we did not find the OTA. So lets create a new one
                let walletPath: string = this.getNextAddressPath();

                //Create a new wallet object from a given mnemonic.
                var wallet = walletObject.fromMnemonic(this.getMnemonic(request.messageObject.companyName), walletPath);
                var bitcorePublicKey = utils.bitcorePublicKey(wallet.privateKey);

                otaData = new OneTimeAddressData(wallet.address, walletPath, bitcorePublicKey,
                    request.messageObject.companyName, request.messageObject.guid);

                this.walletCache.saveOneTimeAddress(otaData);
            }

            response.OTAddress = otaData.OTAddress.toLowerCase();
            response.bitcorePublicKey = otaData.bitcorePublicKey;
            response.encryptedSymmetricKey = otaData.encryptedSymmetricKey;
        }
        catch (error) {
            console.log(error);

            //something bombed. return error
            response.error = Constants.errorOTAGenFailed + ": " + error;
        }

        return response;
       
    }

    /**
     * decrypts the data using the wallet that the request guid id associated with
     * @param request
     */
    public decryptData(request: DecryptDataRequest): DecryptDataResponse {

        let response = new DecryptDataResponse(request.messageObject.guid);

        try {
            //get the otadata object for the specified guid
            let otaData = this.walletCache.getOneTimeAddress(request.messageObject.guid);

            if (otaData == null) {
                response.error = Constants.errorRequestOtaFailed;
                return response;
            }

            //verify the message signature and get the public address of the signer
            let verifiedAddress: string = this.verifyPayload(request.message, request.signature);
            if (verifiedAddress === Constants.errorInvalidSignature) {

                response.error = Constants.errorInvalidSignature;
                return response;
            }

            let asymEncryp: AsymmetricKeyEncryption = new AsymmetricKeyEncryption();
            let symEncryp: SymmetricKeyEncryption = new SymmetricKeyEncryption();
            let wallet = this.getWallet(otaData.signerCompany, otaData.walletPath);

            //decrypt the data that is in the message object
            request.messageObject.keys.forEach(element => {
                console.log("key = ", element.key);

                //decrypt the symmetric key here
                let decryptedSymmetricKey: string = asymEncryp.decrypt(element.key, wallet.privateKey);

                element.fields.forEach(field => {
                    console.log(field, "=", request.messageObject.data[field]);

                    //decrypt the data using the decrypted symmetric key here
                    response.data[field] = symEncryp.decrypt(request.messageObject.data[field], decryptedSymmetricKey);
                });
            });

        }
        catch (error) {
            utils.writeFormattedMessage("Error while decrypting data", error);

            //something bombed. return error
            response.error = Constants.errorDecryptionFailed + ": " + error;
        }

        return response;
    }

    /**
     * For a given set of data, this method encrypts the data using the symmetric key passed in the request
     * @param request
     */
    public encryptData(request: EncryptDataRequest): EncryptDataResponse {

        let response = new EncryptDataResponse(request.messageObject.guid);

        try {
            //get the otadata object for the specified guid
            let otaData = this.walletCache.getOneTimeAddress(request.messageObject.guid);

            if (otaData == null) {
                response.error = Constants.errorRequestOtaFailed;
                return response;
            }

            //verify the message signature and get the public address of the signer
            let verifiedAddress: string = this.verifyPayload(request.message, request.signature);
            if (verifiedAddress === Constants.errorInvalidSignature) {

                response.error = Constants.errorInvalidSignature;
                return response;
            }

            let asymEncryp: AsymmetricKeyEncryption = new AsymmetricKeyEncryption();
            let symEncryp: SymmetricKeyEncryption = new SymmetricKeyEncryption();
            let wallet = this.getWallet(otaData.signerCompany, otaData.walletPath);

            //encrypt the data that is in the message object
            request.messageObject.keys.forEach(element => {
                console.log("key = ", element.key);

                //decrypt the symmetric key here
                let decryptedSymmetricKey: string = asymEncryp.decrypt(element.key, wallet.privateKey);

                element.fields.forEach(field => {
                    console.log(field, "=", request.messageObject.data[field]);

                    //encrypt the data using the decrypted symmetric key here
                    response.data[field] = symEncryp.encrypt(request.messageObject.data[field], decryptedSymmetricKey);
                });
            });

        }
        catch (error) {
            utils.writeFormattedMessage("Error while encrypting data", error);

            response.error = Constants.errorEncryptionFailed + ": " + error;
        }

        return response;
    }

    /**
     * 
     * @param request
     */
    public async grantAccess(request: GrantAccessRequest,
                        grantAccessProperties: GrantAccessPropertiesInterface ): Promise<GrantAccessResponse> {

        utils.writeFormattedMessage("Inside grantAccess", grantAccessProperties);

        let response = new GrantAccessResponse(request.data.guid);

        try {
                //verify the message signature and get the public address of the signer
                let verifiedAddress: string = this.verifyPayload(JSON.stringify(request.data), request.signature);
                if (verifiedAddress === Constants.errorInvalidSignature) {

                    response.error = Constants.errorInvalidSignature;
                    return response;
                }

                // check the message hash
                let utf8Bytes = ethersUtils.toUtf8Bytes(JSON.stringify(request.otherInfo));
                let messageHash = ethersUtils.keccak256(utf8Bytes);

                if (messageHash != request.data.messageHash) {
                    response.error = Constants.errorInvalidHash;
                    return response;
                }

                //get the otadata object for the specified guid
                let otaData: OneTimeAddressData = this.walletCache.getOneTimeAddress(request.data.guid);

                if (otaData == null) {
                    response.error = Constants.errorRequestOtaFailed;
                    return response;
                }

                grantAccessProperties.guid = request.data.guid;
                grantAccessProperties.factoryAddress = request.otherInfo.factoryAddress;
                grantAccessProperties.methodName = request.otherInfo.methodName;
                grantAccessProperties.contractName = request.otherInfo.contractName;
                grantAccessProperties.partyIndex = request.otherInfo.partyIndex;
                grantAccessProperties.otherPartyIndex = request.otherInfo.otherPartyIndex;
                grantAccessProperties.partyCompanyName = request.otherInfo.partyCompanyName;
                grantAccessProperties.otherPartyCompanyName = request.otherInfo.otherPartyCompanyName;
                //grantAccessProperties.oneTimeAddress = otaData.OTAddress;
                grantAccessProperties.signingWallet = this.getWallet(otaData.signerCompany, otaData.walletPath);

                response.accessibleSymmetricKeys = (await this.smartContractService.grantAccess(grantAccessProperties)) as EncryptedSymKeyInfo[];
        }
        catch (error) {
            utils.writeFormattedMessage("Error while granting access", error);

            response.error = Constants.errorEncryptionFailed + ": " + error;
        }

        return response;
    }

    public async postTransaction(request: PostTransactionRequest, postTxnProperties: SendTransactionPropertiesInterface): Promise<PostTransactionResponse> {

        let response = new PostTransactionResponse(request.data.guid);

        try {
            //verify the message signature and get the public address of the signer
            let verifiedAddress: string = this.verifyPayload(JSON.stringify(request.data), request.signature);
                if (verifiedAddress === Constants.errorInvalidSignature) {

                    response.error = Constants.errorInvalidSignature;
                    return response;
                }

                // check the message hash
                let utf8Bytes = ethersUtils.toUtf8Bytes(JSON.stringify(request.otherInfo));
                let messageHash = ethersUtils.keccak256(utf8Bytes);

                if (messageHash != request.data.messageHash) {
                    response.error = Constants.errorInvalidHash;
                    return response;
                }

                //get the otadata object for the specified guid
                let otaData: OneTimeAddressData = this.walletCache.getOneTimeAddress(request.data.guid);

                if (otaData == null) {
                    response.error = Constants.errorRequestOtaFailed;
                    return response;
                }

                for (var property in request.data) {
                    if (request.data.hasOwnProperty(property)) {
                        if (property == "guid" || property == "messageHash")
                            continue;

                        postTxnProperties.data[property] = request.data[property];
                    }
                }

                request.otherInfo.functionList.forEach(async fn => {

                    postTxnProperties.guid = request.data.guid;
                    postTxnProperties.factoryAddress = request.otherInfo.factoryAddress;
                    postTxnProperties.methodName = fn;
                    postTxnProperties.contractName = request.otherInfo.contractName;
                    //postTxnProperties.oneTimeAddress = "0xac39b311dceb2a4b2f5d8461c1cdaf756f4f7ae9";
                    postTxnProperties.oneTimeAddress = otaData.OTAddress;
                    postTxnProperties.symmetricKeyIndex = request.otherInfo.functionArgs[fn][0];
                    postTxnProperties.signingWallet = this.getWallet(otaData.signerCompany, otaData.walletPath);
                    postTxnProperties.parameters = request.otherInfo.functionArgs[fn].slice(1);

                    let txnReceipt = await this.smartContractService.sendTransaction(postTxnProperties);

                    response.txnReceipts.push({
                        name: fn,
                        txnReceipt: txnReceipt
                    });

                    utils.writeFormattedMessage("Transaction receipt for " + fn, response.txnReceipts);
                });
        }
        catch (error) {

            utils.writeFormattedMessage("Error inside postTransaction", error);
            response.error = Constants.errorPostTransaction;
        }

        return response;
    }

    //private methods

    /**
     * gets the hd wallet address path using the next index in the sequence
     */
    private getNextAddressPath(): string {
        //Increment the address index
        addressIndex = addressIndex + 1;

        //return the hd wallet path to the new index
        return "m/44'/60'/0'/0/" + addressIndex;
    }

    /**
     * This method returns the mnemonic string used in the hd wallet for a specific requesting entity
     The mnemonic should have a secure vault from which to read.
     * @param companyName
     */
    private getMnemonic(companyName: string): string {

        return this.secureEnclave.getMnemonic(companyName);
    }

    /**
     * for a given company name and wallet path, this method returns the deterministic wallet
     * @param companyName
     * @param walletPath
     */
    private getWallet(companyName: string, walletPath: string): ethers.Wallet {

        var wallet = walletObject.fromMnemonic(this.getMnemonic(companyName), walletPath);

        return wallet;        
    }
    /**
     * for a given message and signature, this method returns the public address
     pf the wallet that was used to sign this message
     * @param message
     * @param signature
     */
    private verifyPayload(message: string, signature: string): string {

        try {

            //verify the original message was signed by the party
            let signerAddress: string = walletObject.verifyMessage(message, signature);

            //TODO: verify permission of the address from the smart contract


            //return the signer address
            return signerAddress;
        } catch (error) {

            console.log(error);

            //something bombed. return error
            return Constants.errorInvalidSignature;
        }
    }
  
}