import * as indCommon from 'ind-common';

import * as cachingService from '../services/wallet-caching-service';
import * as vaultService from '../services/secure-enclave-service';
import ethers = require('ethers');

const walletObject = ethers.Wallet;
const providers = ethers.providers;

let utils = new indCommon.Utils();

let addressIndex: number = -1;

/*
    For a given GUID, this class generates a one time deterministic wallet. The generated one time wallet
    will be cached using the WalletCaching Service
*/
export class AddressObfuscator {

    private walletCache: cachingService.WalletCachingService;
    private secureEnclave: vaultService.SecureEnclaveService; 

    constructor() {
        this.walletCache = new cachingService.WalletCachingService();
        this.secureEnclave = new vaultService.SecureEnclaveService();
    }

    /**
     * for a given guid, this method returns a one time address generated using a HD wallet. If the address
     already exists in the cache, the existing address is returned
     * @param request
     */
    public getOnetimeAddress(request: indCommon.OneTimeAddressRequest): indCommon.OneTimeAddressResponse {

        let response = new indCommon.OneTimeAddressResponse(request.messageObject.guid);

        try {

            //verify if the signature on the message matches
            let verifiedAddress: string = this.verifyPayload(request.message, request.signature);
            if (verifiedAddress === indCommon.Constants.errorInvalidSignature) {

                response.error = indCommon.Constants.errorInvalidSignature;
                return response;
            }

            let otaData = this.walletCache.getOneTimeAddress(request.messageObject.guid);
            if (otaData == null) { 

                //we did not find the OTA. So lets create a new one
                let walletPath: string = this.getNextAddressPath();

                //Create a new wallet object from a given mnemonic.
                var wallet = walletObject.fromMnemonic(this.getMnemonic(request.messageObject.companyName), walletPath);
                var bitcorePublicKey = utils.bitcorePublicKey(wallet.privateKey);

                otaData = new indCommon.OneTimeAddressData(wallet.address, walletPath, bitcorePublicKey,
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
            response.error = indCommon.Constants.errorOTAGenFailed + ": " + error;
        }

        return response;
       
    }

    /**
     * decrypts the data using the wallet that the request guid id associated with
     * @param request
     */
    public decryptData(request: indCommon.DecryptDataRequest): indCommon.DecryptDataResponse {

        let response = new indCommon.DecryptDataResponse(request.messageObject.guid);

        try {
            //get the otadata object for the specified guid
            let otaData = this.walletCache.getOneTimeAddress(request.messageObject.guid);

            if (otaData == null) {
                response.error = indCommon.Constants.errorRequestOtaFailed;
                return response;
            }

            //verify the message signature and get the public address of the signer
            let verifiedAddress: string = this.verifyPayload(request.message, request.signature);
            if (verifiedAddress === indCommon.Constants.errorInvalidSignature) {

                response.error = indCommon.Constants.errorInvalidSignature;
                return response;
            }

            let asymEncryp: indCommon.AsymmetricKeyEncryption = new indCommon.AsymmetricKeyEncryption();
            let symEncryp: indCommon.SymmetricKeyEncryption = new indCommon.SymmetricKeyEncryption();
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
            response.error = indCommon.Constants.errorDecryptionFailed + ": " + error;
        }

        return response;
    }

    /**
     * For a given set of data, this method encrypts the data using the symmetric key passed in the request
     * @param request
     */
    public encryptData(request: indCommon.EncryptDataRequest): indCommon.EncryptDataResponse {

        let response = new indCommon.EncryptDataResponse(request.messageObject.guid);

        try {
            //get the otadata object for the specified guid
            let otaData = this.walletCache.getOneTimeAddress(request.messageObject.guid);

            if (otaData == null) {
                response.error = indCommon.Constants.errorRequestOtaFailed;
                return response;
            }

            //verify the message signature and get the public address of the signer
            let verifiedAddress: string = this.verifyPayload(request.message, request.signature);
            if (verifiedAddress === indCommon.Constants.errorInvalidSignature) {

                response.error = indCommon.Constants.errorInvalidSignature;
                return response;
            }

            let asymEncryp: indCommon.AsymmetricKeyEncryption = new indCommon.AsymmetricKeyEncryption();
            let symEncryp: indCommon.SymmetricKeyEncryption = new indCommon.SymmetricKeyEncryption();
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

            response.error = indCommon.Constants.errorEncryptionFailed + ": " + error;
        }

        return response;
    }

    /**
     * 
     * @param request
     */
    public grantAccess(request: indCommon.GrantAccessRequest): indCommon.GrantAccessResponse {

        let response = new indCommon.GrantAccessResponse(request.messageObject.guid);

        try {
                //get the otadata object for the specified guid
            let otaData = this.walletCache.getOneTimeAddress(request.messageObject.guid);

                if (otaData == null) {
                    response.error = indCommon.Constants.errorRequestOtaFailed;
                    return response;
                }

                //verify the message signature and get the public address of the signer
                let verifiedAddress: string = this.verifyPayload(request.message, request.signature);
                if (verifiedAddress === indCommon.Constants.errorInvalidSignature) {

                    response.error = indCommon.Constants.errorInvalidSignature;
                    return response;
                }

                let asymEngine: indCommon.AsymmetricKeyEncryption = new indCommon.AsymmetricKeyEncryption();
                let symEngine: indCommon.SymmetricKeyEncryption = new indCommon.SymmetricKeyEncryption();
                let wallet = this.getWallet(otaData.signerCompany, otaData.walletPath);

                //decrypt the symmetric key
                let decryptedSymmetricKey: string = asymEngine.decrypt(String(request.messageObject.accessibleSymmetricKey).substring(2), wallet.privateKey);
                response.partyEncryptedSymmetricKey = "0x" + asymEngine.encrypt(decryptedSymmetricKey, request.messageObject.partyBitcorePublicKey);
        }
        catch (error) {
            utils.writeFormattedMessage("Error while granting access", error);

            response.error = indCommon.Constants.errorEncryptionFailed + ": " + error;
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
            return indCommon.Constants.errorInvalidSignature;
        }
    }
}