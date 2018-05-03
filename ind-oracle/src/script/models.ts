import { Party} from "ind-common";

export class BaseData {    
  timestamp: number;
}

export class Response {    
  error: string;
  status: boolean;
}

export class GrantAccessToContractData extends BaseData {
  marketplaceAddress: string;
  factoryAddress: string;
  contractId: number;
  myParty: Party;
  parties: Array<Party>;
  constructor(fields: Partial<GrantAccessToContractData> & {}) {
    super();
    Object.assign(this, fields);
  }
}
export class GrantAccessToContractRequest {
  message: GrantAccessToContractData;
  signature: string;
  constructor(fields: Partial<GrantAccessToContractRequest> & {}) {
    Object.assign(this, fields);
  }
}
export class GrantAccessToContractResponse extends Response {
  transactionHashes: Array<string>;
  constructor(fields: Partial<GrantAccessToContractResponse> & {}) {
    super();
    Object.assign(this, fields);
  }
}

