import * as constants from './constants';

export class BaseRequest {
    public message: string;
    public signature: string;
}

export class BaseResponse {
    public guid: string;
    public error: string;

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

export interface BaseMessageObject { guid: string; companyName: string; };

export class OneTimeAddressRequest extends BaseRequest {
    public messageObject: BaseMessageObject; 
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

export type KeyFields = { key: string; fields: string[] };
export interface DecryptDataRequestMessage extends BaseMessageObject { keys: KeyFields[]; data: {} };

export class DecryptDataRequest extends BaseRequest {
    public messageObject: DecryptDataRequestMessage;
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
export interface EncryptDataRequestMessage extends BaseMessageObject { keys: KeyFields[]; data: {} };

export class EncryptDataRequest extends BaseRequest {
    public messageObject: EncryptDataRequestMessage;
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
        "guid": "1234",
        "accessibleSymmetricKey": "",
        "partyOTAddress": "",
        "partyBitcorePublicKey": "",
        "contractAddress": "",
        "companyName": ""
    }
 */

export interface GrantAccessRequestMessage extends BaseMessageObject  {
                                            accessibleSymmetricKey: string,
                                            partyOTAddress: string,
                                            partyBitcorePublicKey: string,
                                            contractAddress: string,
                                        };

export class GrantAccessRequest extends BaseRequest {

    public messageObject: GrantAccessRequestMessage;
}

export class GrantAccessResponse extends BaseResponse {

    public partyEncryptedSymmetricKey: string;

    constructor(guid: string = "") {
        super(guid);

        this.error = "OK";
    }
}