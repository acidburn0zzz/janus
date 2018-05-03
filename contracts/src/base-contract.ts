import { Utils } from 'ind-common/build/common/utils';

const utils = new Utils();
var fs = require('fs');
const Web3 = require("web3");

export class BaseContract {

    protected abiPath: string;
    protected provider: string;
    protected web3: any;

    constructor(abiPath: string, provider: string) {
        this.provider = provider; 
        this.abiPath = abiPath;
    }

    protected getWeb3() {
        if(!this.web3)
            this.web3 = new Web3(Web3.givenProvider || this.provider );
    }

    public loadAbi(name: string, path: string) {

        let abi = "";
        path = path + '\\' + name + '.json';

        utils.writeFormattedMessage("Inside loadAbi", path);

        if (fs.existsSync(path)) {

            var data = fs.readFileSync(path, 'utf8');
            //utils.writeFormattedMessage("Inside readFile of loadAbi", data);
            abi = data;
        }
        return abi;
    }
}