import { IDirectoryProvider } from "../interfaces/idirectory-provider";

export class FileDirectoryProvider implements IDirectoryProvider {
    //private addressMap: Map<string,string>;
    private keyMap: Map<string,Map<string,string>>;

    constructor() {
        //this.addressMap = new Map<string,string>();
        this.keyMap = new Map<string,Map<string,string>>();
    }

    public async addCompanyKey(companyName:string, keyName:string, key:string) {
        if(companyName) {
            let keys = this.keyMap.get(companyName);
            if(!keys) {
                keys = new Map<string,string>();
                this.keyMap.set(companyName, keys);
            }
            keys.set(keyName, key);
        }
    }

    // public async getCompanyAddress(companyName:string): Promise<string> {
    //     if(companyName && this.addressMap.has(companyName))
    //         return this.addressMap.get(companyName);
    //     return null;
    // }

    public async getCompanyKey(companyName:string, keyName:string): Promise<string> {
        if(companyName && this.keyMap.has(companyName)) {
            let keys = this.keyMap.get(companyName);
            if(keys.has(keyName))
                return keys.get(keyName);
        }
        return null;
    }
}