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

export class TransactionData {
  marketplaceAddress: string;
  factoryAddress: string;
  myParty: Party;
  parties: Array<Party>;
  constructor(fields: Partial<TransactionData> & {}) {
    Object.assign(this, fields);
  }
}
class TransactionRequest {    
  message: TransactionData;
  signature: string;
}
export class CreateTransactionRequest extends TransactionRequest {
  constructor(fields: Partial<CreateTransactionRequest> & {}) {
    super();
    Object.assign(this, fields);
  }
}


export class Response {    
  error: string;
  status: boolean;
}
export class CreateTransactionResponse extends Response {
  contractId: number;
  transactionHash: Array<string>;
  constructor(fields: Partial<CreateTransactionResponse> & {}) {
    super();
    Object.assign(this, fields);
  }
}


export class RegistrationData {
  companyName: string;
  url: string;
  constructor(fields: Partial<RegistrationData> & {}) {
    Object.assign(this, fields);
  }
}
class RegistrationRequest {
  message: RegistrationData;
  signature: string;
}
export class WalletRegistrationRequest extends RegistrationRequest {
  constructor(fields: Partial<WalletRegistrationRequest> & {}) {
    super();
    Object.assign(this, fields);
  }
}
export class WalletRegistrationResponse extends Response {
  constructor(fields: Partial<WalletRegistrationResponse> & {}) {
    super();
    Object.assign(this, fields);
  }
}


export class UnRegistrationData {
  companyName: string;
  constructor(fields: Partial<RegistrationData> & {}) {
    Object.assign(this, fields);
  }
}
class UnRegistrationRequest {
  message: UnRegistrationData;
  signature: string;
}
export class WalletUnRegistrationRequest extends UnRegistrationRequest {
  constructor(fields: Partial<WalletUnRegistrationRequest> & {}) {
    super();
    Object.assign(this, fields);
  }
}
export class WalletUnRegistrationResponse extends Response {
  constructor(fields: Partial<WalletUnRegistrationResponse> & {}) {
    super();
    Object.assign(this, fields);
  }
}

// export interface ICreateOTKeyRequest {
//   address: string;
//   signature: string;
//   message: string;
//   contractId: number;
// }

// export class OTKeyResponse {
//   public message: string;
//   public OTAddress: string;
//   public bitcorePublicKey: string;
//   constructor() {
//     this.message = "OK";
//     this.OTAddress = "0x00";
//     this.bitcorePublicKey = "0x00";
//   }
// }