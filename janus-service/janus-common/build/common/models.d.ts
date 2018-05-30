import * as commonTypes from './common-types';
export declare class BaseData {
    timestamp: number;
}
export declare class BaseRequest {
    message: string;
    signature: string;
    marketPlaceRegistryAddress: string;
}
export declare class BaseResponse {
    guid: string;
    error: string;
    status: boolean;
    constructor(guid?: string);
}
export declare enum PartyType {
    Unassigned = 0,
    Buyer = 1,
    Seller = 2,
    Broker = 3,
}
export declare class PartyOTAddress {
    message: string;
    OTAddress: string;
    bitcorePublicKey: string;
}
export declare class Party {
    partyType: PartyType;
    partyAddress: string;
    companyName: string;
    constructor(fields: Partial<Party> & {});
}
export declare class OneTimeAddressRequest extends BaseRequest {
    messageObject: commonTypes.BaseMessageObject;
}
/**
 * one time address response object returned by the wallet service
 */
export declare class OneTimeAddressResponse extends BaseResponse {
    OTAddress: string;
    bitcorePublicKey: string;
    encryptedSymmetricKey: string;
    constructor(guid?: string);
}
export declare class OneTimeAddressData {
    OTAddress: string;
    walletPath: string;
    bitcorePublicKey: any;
    encryptedSymmetricKey: string;
    signerCompany: string;
    guid: string;
    constructor(otaddress: string, walletPath: string, bitcorePublicKey: any, signerCompany: string, guid: string);
}
/**
 * request data sent to decrypt a set of data fields
    message is a JSON string expected in the following shape
    {
                        "guid" : "1234",
                        "keys" : [
                            { "key": "0xkey1",
                                "fields": [ "F1", "F2", "F3"] },
                                { "key": "0xkey2",
                                "fields": [ "F4", "F5", "F6"] },
                                { "key": "0xkey3",
                                "fields": [ "F7", "F8", "F9"] }
                            ],
                "data": {
                    "F1": "0x1234",
                    "F2": "0x1234",
                    "F3": "0x1234",
                    "F4": "0x1234",
                    "F5": "0x1234",
                    "F6": "0x1234",
                    "F7": "0x1234",
                    "F8": "0x1234",
                    "F9": "0x1234"
                }
    }
 */
export declare class DecryptDataRequest extends BaseRequest {
    messageObject: commonTypes.DecryptDataRequestMessage;
}
export declare class DecryptDataResponse extends BaseResponse {
    data: object;
    constructor(guid?: string);
}
/**
 * request data sent to encrypt a set of data fields
    message is a JSON string expected in the following shape
    {
                        "guid": "1234",
                        "keys" : [
                            { "key": "0xkey1",
                                "fields": [ "buyer", "seller", "price", "quantity", "uom"] },
                                { "key": "0xkey2",
                                "fields": [ "commodity", "apiGravity"] },
                            ],
                        "data": { buyer: 'Mercuria',
                          seller: 'Shell',
                          price: '55',
                          quantity: '100000',
                          uom: 'BBL',
                          commodity: 'Brent',
                          apiGravity: '38.5' }
                            }
 */
export declare class EncryptDataRequest extends BaseRequest {
    messageObject: commonTypes.EncryptDataRequestMessage;
}
export declare class EncryptDataResponse extends BaseResponse {
    data: object;
    constructor(guid?: string);
}
/**
 * Models for Granting access to a third party

    message is a JSON object with the following shape
    {
        "data": {
            "guid": "1234",
            "messageHash": ""
        },
        "signature": "0x07c5afcc235567ccc94b94f997867eeca15573ff859b053aba5ce321cf76aeb92d4822fb0007ba58b4c41b"
        "otherInfo": {
                
            }
    }
 */
export declare class GrantAccessRequest extends BaseRequest {
    data: {
        guid: string;
        messageHash: string;
    };
    signature: string;
    otherInfo: {
        factoryAddress: string;
        contractName: string;
        methodName: string;
        partyIndex: number;
        otherPartyIndex: number;
        partyCompanyName: string;
        otherPartyCompanyName: string;
        otherPartyBitcorePubKey: string;
    };
}
export declare class GrantAccessResponse extends BaseResponse {
    accessibleSymmetricKeys: commonTypes.EncryptedSymKeyInfo[];
    constructor(guid?: string);
}
/**
 *
{
    "data": {
        "guid": "5465675565",
        "messageHash": "65u56rytuy56454",
        "fields": {
            "tradeDate": "12/20/2017",
            "qty": "100000",
            "product": "WTI",
            "price": "39.6",
            "buyer": "Mercuria",
            "seller": "Shell",
        }
    },
    "signature": "0x07c5afcc235567ccc94b94f997867eeca15573ff859b053aba5ce321cf76aeb92d4822fb0007ba58b4c41b",
    "otherInfo": {
        "factoryAddress": "0x03334c41b",
        "marketplaceAddress": "0x5454565",
        "contractName": "Trade"
        "myParty": Party,
        "otherParty": Party,
        "functionList": [
                    "updateData",
                    "updatePaymentInfo"
        ],
        functionArgs: {
            "updateData": [
                        "symmetricKeyIndex",
                        "tradeDate",
                        "product",
                        "qty",
                        "price"
            ],
            "updatePaymentInfo": [
                        "symmetricKeyIndex",
                        "paymentTerm"
            ]
        }
    }
}

 */
export declare class TransactionData extends BaseData {
    guid: string;
    messageHash: string;
    businessData: Object;
    constructor(fields: Partial<TransactionData> & {});
}
export declare class TransactionInfo {
    marketplaceAddress: string;
    factoryAddress: string;
    contractName?: string;
    myParty?: Party;
    otherParty?: Party;
    functionList: FunctionInfo[];
    constructor(fields: Partial<TransactionInfo> & {});
}
export declare class FunctionInfo {
    name: string;
    params: string[];
    constructor(fields: Partial<FunctionInfo> & {});
}
export declare class CreateTransactionRequest {
    data: TransactionData;
    signature: string;
    transactionInfo: TransactionInfo;
    constructor(fields: Partial<CreateTransactionRequest> & {});
}
export declare class CreateTransactionResponse extends BaseResponse {
    contractId: number;
    transactionHash: Array<string>;
    constructor(fields: Partial<CreateTransactionResponse> & {});
}
export declare class PostTransactionRequest extends CreateTransactionRequest {
}
export declare class PostTransactionResponse extends CreateTransactionResponse {
    constructor(fields: Partial<CreateTransactionResponse> & {});
}
export declare class RegistrationData extends BaseData {
    companyName: string;
    url: string;
    constructor(fields: Partial<RegistrationData> & {});
}
export declare class WalletRegistrationRequest {
    message: RegistrationData;
    signature: string;
    constructor(fields: Partial<WalletRegistrationRequest> & {});
}
export declare class WalletRegistrationResponse extends BaseResponse {
    constructor(fields: Partial<WalletRegistrationResponse> & {});
}
export declare class UnRegistrationData extends BaseData {
    companyName: string;
    constructor(fields: Partial<RegistrationData> & {});
}
export declare class WalletUnRegistrationRequest {
    message: UnRegistrationData;
    signature: string;
    constructor(fields: Partial<WalletUnRegistrationRequest> & {});
}
export declare class WalletUnRegistrationResponse extends BaseResponse {
    constructor(fields: Partial<WalletUnRegistrationResponse> & {});
}
export declare class MeterSummaryData extends BaseData {
    companyName: string;
    factoryAddress: string;
    constructor(fields: Partial<MeterSummaryData> & {});
}
export declare class MeterSummaryRequest {
    message: MeterSummaryData;
    signature: string;
    constructor(fields: Partial<MeterSummaryRequest> & {});
}
export declare class MeterSummaryResponse extends BaseResponse {
    result: any;
    constructor(fields: Partial<MeterSummaryResponse> & {});
}
