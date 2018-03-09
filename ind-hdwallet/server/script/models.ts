import * as constants from './constants';


/*
    Object data passed by the indirection oracle when it is requesting a one time address
    message: JSON string in the following shape
    {
        "guid": "0x1234",
        "companyName": "Acme inc",
        "signerName": "John Smith"
    }
*/

export type OneTimeAddressMessage = { guid: string; companyName: string; signerName: string };

export class OneTimeAddressRequest {
    public guid: string;
    public message: string;
    public signature: string;
}

/**
 * one time address response object returned by the wallet service
 */
export class OneTimeAddressResponse {
    public error: string;
    public OTAddress: string;
    public bitcorePublicKey: string;
    public encryptedSymmetricKey: string;

    constructor() {
        this.error = constants.OK;
        this.OTAddress = "0x00";
        this.bitcorePublicKey = "0x00";
    }
}

export class OneTimeAddressData {
    OTAddress: string;
    walletPath: string;
    bitcorePublicKey: any;
    encryptedSymmetricKey: string;
    signerName: string;
    signerCompany: string;
    guid: string;

    constructor(otaddress: string, walletPath: string, bitcorePublicKey: any,
        signerName: string, signerCompany: string, guid: string) {

        this.OTAddress = otaddress;
        this.walletPath = walletPath;
        this.bitcorePublicKey = bitcorePublicKey;
        this.signerName = signerName;
        this.signerCompany = signerCompany;
        this.guid = guid;
    }
}

/**
 * request data sent to decrypt a set of data fields
    message is a JSON string expected in the following shape
    {
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
export type DataMessage = { keys: KeyFields[]; data: {} };

export class DecryptDataRequest {
    public guid: string;
    public message: string;
    public signature: string;
}

export class DecryptDataResponse {
    public error: string;
    public guid: string;
    public data: object;

    constructor(guid: string) {
        this.error = constants.OK;
        this.guid = guid;
        this.data = {};
    }
}

/**
 * request data sent to encrypt a set of data fields
    message is a JSON string expected in the following shape
    {
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

export class EncryptDataRequest {
    public guid: string;
    public message: string;
    public signature: string;
}

export class EncryptDataResponse {
    public error: string;
    public guid: string;
    public data: object;

    constructor(guid: string) {
        this.error = constants.OK;
        this.guid = guid;
        this.data = {};
    }
}

/**
 * Models for Granting access to a third party
 */
export class GrantAccessRequest {
    public guid: string;
    public accessibleSymmetricKey: string;
    public partyBitcorePublicKey: string;
    public message: string;
    public signature: string;

    constructor(guid: string) {
        this.guid = guid;
    }
}

export class GrantAccessResponse {
    public error: string;
    public guid: string;
    public partyEncryptedSymmetricKey: string;

    constructor(guid: string) {
        this.guid = guid;
        this.error = "OK";
    }
}