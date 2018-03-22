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


export class Response {    
  error: string;
  status: boolean;
}


export class TransactionData {
  marketplaceAddress: string;
  factoryAddress: string;
  myParty: Party;
  otherParty: Party;
  constructor(fields: Partial<TransactionData> & {}) {
    Object.assign(this, fields);
  }
}
export class CreateTransactionRequest {
  message: TransactionData;
  signature: string;
  constructor(fields: Partial<CreateTransactionRequest> & {}) {
    Object.assign(this, fields);
  }
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
export class WalletRegistrationRequest {
  message: RegistrationData;
  signature: string;
  constructor(fields: Partial<WalletRegistrationRequest> & {}) {
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
export class WalletUnRegistrationRequest {
  message: UnRegistrationData;
  signature: string;
  constructor(fields: Partial<WalletUnRegistrationRequest> & {}) {
    Object.assign(this, fields);
  }
}
export class WalletUnRegistrationResponse extends Response {
  constructor(fields: Partial<WalletUnRegistrationResponse> & {}) {
    super();
    Object.assign(this, fields);
  }
}


export class GrantAccessData {
  marketplaceAddress: string;
  factoryAddress: string;
  contractId: number;
  myParty: Party;
  parties: Array<Party>;
  constructor(fields: Partial<TransactionData> & {}) {
    Object.assign(this, fields);
  }
}
export class GrantAccessRequest {
  message: GrantAccessData;
  signature: string;
  constructor(fields: Partial<GrantAccessRequest> & {}) {
    Object.assign(this, fields);
  }
}
export class GrantAccessResponse extends Response {
  transactionHashes: Array<string>;
  constructor(fields: Partial<GrantAccessResponse> & {}) {
    super();
    Object.assign(this, fields);
  }
}

