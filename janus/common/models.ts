export class OnetimeKey {
    networkId:string;
    address:string;
    publicKey:string;

    constructor(fields: Partial<OnetimeKey> & {}) {
        Object.assign(this, fields);
    }
}

export enum MessageType { Unassigned, "OnetimeKeyRequest", "OnetimeKeyResponse" }

export class Message {
    type:MessageType;
    payload:string;
    signature:string;

    constructor(fields: Partial<Message> & {}) {
        Object.assign(this, fields);
    }
}

export class OnetimeKeyRequest {
    transactionId:string;
    networkId:string;
    sender:string;
    recepient:string;

    constructor(fields: Partial<OnetimeKeyRequest> & {}) {
        Object.assign(this, fields);
    }
}

export class OnetimeKeyResponse {
    transactionId:string;
    networkId:string;
    sender:string;
    onetimeKey:OnetimeKey;

    constructor(fields: Partial<OnetimeKeyResponse> & {}) {
        Object.assign(this, fields);
    }
}


