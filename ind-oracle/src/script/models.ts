import { Party } from "ind-common";

export class Response {    
  error: string;
  status: boolean;
}

export class GrantAccessData {
  marketplaceAddress: string;
  factoryAddress: string;
  contractId: number;
  myParty: Party;
  parties: Array<Party>;
  constructor(fields: Partial<GrantAccessData> & {}) {
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

