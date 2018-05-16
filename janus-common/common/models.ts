import * as constants from './constants';
import * as commonTypes from './common-types';

export class BaseData {    
  timestamp: number;
}

export class BaseRequest {
    public message: string;
    public signature: string;
    marketPlaceRegistryAddress: string;
}

export class BaseResponse {
    public guid: string;
    public error: string;
    status: boolean;

    constructor(guid: string = "") {
        this.guid = guid;
        this.error = constants.OK;
    }
}

/*
    Object data passed by the indirection oracle when it is requesting a one time address
    message: JSON string in the following shape
    {
        "guid": "0x1234",
        "companyName": "Acme inc",
        "signerName": "John Smith"
    }
*/

export enum PartyType { Unassigned, Buyer, Seller, Broker }

export class PartyOTAddress {
    message: string;
    OTAddress: string;
    bitcorePublicKey: string;
}

export class Party {
    partyType: PartyType;
    partyAddress: string;
    companyName: string;
    constructor(fields: Partial<Party> & {}) {
        Object.assign(this, fields);
    }
}

export class OneTimeAddressRequest extends BaseRequest {
    public messageObject: commonTypes.BaseMessageObject; 
}

/**
 * one time address response object returned by the wallet service
 */
export class OneTimeAddressResponse extends BaseResponse {
    public OTAddress: string;
    public bitcorePublicKey: string;
    public encryptedSymmetricKey: string;

    constructor(guid: string = "") {
        super(guid);

        this.OTAddress = "0x00";
        this.bitcorePublicKey = "0x00";
    }
}

export class OneTimeAddressData {
    OTAddress: string;
    walletPath: string;
    bitcorePublicKey: any;
    encryptedSymmetricKey: string;
    signerCompany: string;
    guid: string;

    constructor(otaddress: string, walletPath: string, bitcorePublicKey: any,
                signerCompany: string, guid: string) {

        this.OTAddress = otaddress;
        this.walletPath = walletPath;
        this.bitcorePublicKey = bitcorePublicKey;
        this.signerCompany = signerCompany;
        this.guid = guid;
    }
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


export class DecryptDataRequest extends BaseRequest {
    public messageObject: commonTypes.DecryptDataRequestMessage;
}

export class DecryptDataResponse extends BaseResponse {
    public data: object;

    constructor(guid: string = "") {
        super(guid);

        this.data = {};
    }
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


export class EncryptDataRequest extends BaseRequest {
    public messageObject: commonTypes.EncryptDataRequestMessage;
}

export class EncryptDataResponse extends BaseResponse {
    public data: object;

    constructor(guid: string = "") {
        super(guid);
        this.data = {};
    }
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



export class GrantAccessRequest extends BaseRequest {
    data: {
        guid: string;
        messageHash: string;
    };
    signature: string;
    otherInfo: {
        factoryAddress: string;
        contractName: string;
        methodName: string;
        partyIndex: number,
        otherPartyIndex: number,
        partyCompanyName: string,
        otherPartyCompanyName: string,
        otherPartyBitcorePubKey: string
    };
    
}

export class GrantAccessResponse extends BaseResponse {

    public accessibleSymmetricKeys: commonTypes.EncryptedSymKeyInfo[];

    constructor(guid: string = "") {
        super(guid);

        this.error = "OK";
    }
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

export class TransactionData extends BaseData {
  guid: string;
  messageHash: string;
  businessData: Object;
  
  constructor(fields: Partial<TransactionData> & {}) {
    super();
    Object.assign(this, fields);
  }
}
export class TransactionInfo {
  marketplaceAddress: string;
  factoryAddress: string;
  contractName?: string;
  myParty?: Party;
  otherParty?: Party;
  functionList: FunctionInfo[];
  
  constructor(fields: Partial<TransactionInfo> & {}) {
    Object.assign(this, fields);
  }
}
export class FunctionInfo {
  name: string;
  params: string[];  
  constructor(fields: Partial<FunctionInfo> & {}) {
    Object.assign(this, fields);
  }
}
export class CreateTransactionRequest {
  data: TransactionData;
  signature: string;
  transactionInfo: TransactionInfo;
  constructor(fields: Partial<CreateTransactionRequest> & {}) {
    Object.assign(this, fields);
  }
}
export class CreateTransactionResponse extends BaseResponse {
  contractId: number;
  transactionHash: Array<string>;
  constructor(fields: Partial<CreateTransactionResponse> & {}) {
    super();
    Object.assign(this, fields);
  }
}

export class PostTransactionRequest extends CreateTransactionRequest {

    
}

export class PostTransactionResponse extends CreateTransactionResponse {

    constructor(fields: Partial<CreateTransactionResponse> & {}) {
        super(fields);
        Object.assign(this, fields);
    }
}


export class RegistrationData extends BaseData {
  companyName: string;
  url: string;
  constructor(fields: Partial<RegistrationData> & {}) {
    super();
    Object.assign(this, fields);
  }
}
export class WalletRegistrationRequest {
  message: RegistrationData;
  signature: string;
  constructor(fields: Partial<WalletRegistrationRequest> & {}) {
    Object.assign(this, fields);
  }
}
export class WalletRegistrationResponse extends BaseResponse {
  constructor(fields: Partial<WalletRegistrationResponse> & {}) {
    super();
    Object.assign(this, fields);
  }
}

export class UnRegistrationData extends BaseData {
  companyName: string;
  constructor(fields: Partial<RegistrationData> & {}) {
    super();
    Object.assign(this, fields);
  }
}
export class WalletUnRegistrationRequest {
  message: UnRegistrationData;
  signature: string;
  constructor(fields: Partial<WalletUnRegistrationRequest> & {}) {
    Object.assign(this, fields);
  }
}
export class WalletUnRegistrationResponse extends BaseResponse {
  constructor(fields: Partial<WalletUnRegistrationResponse> & {}) {
    super();
    Object.assign(this, fields);
  }
}

export class MeterSummaryData extends BaseData {
  companyName: string;
  factoryAddress: string;
  constructor(fields: Partial<MeterSummaryData> & {}) {
    super();
    Object.assign(this, fields);
  }
}
export class MeterSummaryRequest {
  message: MeterSummaryData;
  signature: string;
  constructor(fields: Partial<MeterSummaryRequest> & {}) {
    Object.assign(this, fields);
  }
}
export class MeterSummaryResponse extends BaseResponse {
  result: any;
  constructor(fields: Partial<MeterSummaryResponse> & {}) {
    super();
    Object.assign(this, fields);
  }
}