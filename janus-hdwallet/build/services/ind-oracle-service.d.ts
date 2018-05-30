export declare class IndirectionOracleService {
    private static _instance;
    private constructor();
    static instance(): IndirectionOracleService;
    register(companyName: string, url: string): void;
    unRegister(companyName: string): void;
}
