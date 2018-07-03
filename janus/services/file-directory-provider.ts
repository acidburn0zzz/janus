import { IDirectoryProvider } from "../interfaces/idirectory-provider";
import { Utils } from "../services/utils";
var fs = require('fs');
const utils = new Utils();
//const file = "directory.json";

export class FileDirectoryProvider implements IDirectoryProvider {
    //private addressMap: Map<string,string>;
    private keyMap: Map<string,Map<string,string>>;

    constructor(directoryFilePath: string) {
        //this.addressMap = new Map<string,string>();
        this.keyMap = new Map<string,Map<string,string>>();
        this.loadDirectoryFromFile(directoryFilePath);
    }

    private loadDirectoryFromFile(directoryFilePath: string) {
        let contents: any;
        console.log("filePath", directoryFilePath);
        if(fs.existsSync(directoryFilePath)) {
            contents = fs.readFileSync(directoryFilePath, 'utf8');
        }
        console.log("contents", contents);
        if(contents) {
            const fileEntries = JSON.parse(contents);            
            Object.keys(fileEntries).forEach(key => {
                this.keyMap.set(key, utils.objToMap(fileEntries[key]));
            });
        }
        console.log("keyMap", this.keyMap);
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