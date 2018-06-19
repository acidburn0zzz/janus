export interface IDirectoryProvider {
    addCompanyKey(companyName:string, keyName:string, publicKey:string);
    //getCompanyAddress(companyName:string): Promise<string>;
    getCompanyKey(companyName:string, keyName:string): Promise<string>;
}