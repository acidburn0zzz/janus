

export class IndirectionOracleService {
	
	private static _instance: IndirectionOracleService

	private constructor() {
		
	}

	public static instance(): IndirectionOracleService {
		if(this._instance == null) this._instance = new IndirectionOracleService();

		return this._instance;
	}

	public register( companyName: string, url: string) {
		
	} 

    public unRegister(companyName: string) {

	}

}

