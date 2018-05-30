import { SendTransactionPropertiesInterface, GrantAccessPropertiesInterface } from '@manosamy/janus-common/build/interfaces/smart-contract-service-interface';
import { OneTimeAddressRequest, OneTimeAddressResponse, DecryptDataRequest, DecryptDataResponse, EncryptDataRequest, EncryptDataResponse, GrantAccessRequest, GrantAccessResponse, PostTransactionRequest, PostTransactionResponse } from '@manosamy/janus-common/build/common/models';
export interface AddressObfuscatorOptions {
    oracleServiceUri: string;
    vaultServiceUri: string;
    contractsPath: string;
    abiPath: string;
    blockchainProvider: string;
}
export declare class AddressObfuscator {
    private walletCache;
    private secureEnclave;
    private smartContractService;
    private eventEmitter;
    constructor(options: AddressObfuscatorOptions);
    /**
     * for a given guid, this method returns a one time address generated using a HD wallet. If the address
     already exists in the cache, the existing address is returned
     * @param request
     */
    getOnetimeAddress(request: OneTimeAddressRequest): OneTimeAddressResponse;
    /**
     * decrypts the data using the wallet that the request guid id associated with
     * @param request
     */
    decryptData(request: DecryptDataRequest): DecryptDataResponse;
    /**
     * For a given set of data, this method encrypts the data using the symmetric key passed in the request
     * @param request
     */
    encryptData(request: EncryptDataRequest): EncryptDataResponse;
    /**
     *
     * @param request
     */
    grantAccess(request: GrantAccessRequest, grantAccessProperties: GrantAccessPropertiesInterface): Promise<GrantAccessResponse>;
    postTransaction(request: PostTransactionRequest, postTxnProperties: SendTransactionPropertiesInterface): Promise<PostTransactionResponse>;
    /**
     * gets the hd wallet address path using the next index in the sequence
     */
    private getNextAddressPath();
    /**
     * This method returns the mnemonic string used in the hd wallet for a specific requesting entity
     The mnemonic should have a secure vault from which to read.
     * @param companyName
     */
    private getMnemonic(companyName);
    /**
     * for a given company name and wallet path, this method returns the deterministic wallet
     * @param companyName
     * @param walletPath
     */
    private getWallet(companyName, walletPath);
    /**
     * for a given message and signature, this method returns the public address
     pf the wallet that was used to sign this message
     * @param message
     * @param signature
     */
    private verifyPayload(message, signature);
}
