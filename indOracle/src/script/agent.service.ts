// const HDWALLET_URLS = {
//     "Mercuria": {
//       host: 'localhost',
//       port: '4000',
//     }, "Shell": {
//       host: 'localhost',
//       port: '5000',
//     }
//   };
import { WalletRegistrationRequest, WalletUnRegistrationRequest} from './models';
import * as constants from './constants';
var fs = require('fs');
//import * as data from '../walletAgents.json';

export class AgentService {
    WalletAgentUrls: object;

    constructor() {
        console.log("In AgentService constructor");
        //load registered urls from a file
        // fs.readFile(constants.WALLET_AGENT_REGISTRY, 'utf8', function(err, contents) {
        //     if(!err) {
        //         if(contents)
        //             this.WalletAgentUrls = JSON.parse(contents);
        //         else 
        //             this.WalletAgentUrls = {};
        //     } else {
        //         console.log("Error: Failed to load registrations", err);
        //         this.WalletAgentUrls = {};
        //     }
        //     console.log("WalletAgentUrls", this.WalletAgentUrls);
        // });
        let contents: any;
        if(fs.exists(constants.WALLET_AGENT_REGISTRY)) {
            contents = fs.readFileSync(constants.WALLET_AGENT_REGISTRY, 'utf8');
            console.log("contents:",contents);
        }
        if(contents)
            this.WalletAgentUrls = JSON.parse(contents);
        else 
            this.WalletAgentUrls = {};

        console.log("WalletAgentUrls", this.WalletAgentUrls);
        console.log("In AgentService constructor, completed");
    }

    async registerWalletAgent(request: WalletRegistrationRequest) {
        console.log("WalletAgentUrls", this.WalletAgentUrls);
		let companyName: string = request.message.companyName;
		let url: string = request.message.url;
		if (!companyName)
            throw new Error('Company name is invalid');
        if (!url)
            throw new Error('Cannot register empty url');        
        if(!this.WalletAgentUrls)
            this.WalletAgentUrls = {};

        //TODO: verify signature

        let urlParts: string[] = url.split(':');
        let host: string = urlParts[0];
        let port: number = Number(urlParts[1]);
        this.WalletAgentUrls[companyName] = { host: host, port: port};
        
        //TODO: save WalletAgentUrls to file
        console.log("WalletAgentUrls", this.WalletAgentUrls);
		return true;
    }
    
	async unRegisterWalletAgent(request: WalletUnRegistrationRequest) {
        console.log("WalletAgentUrls", this.WalletAgentUrls);
        if(!this.WalletAgentUrls)
            return false;
        let companyName: string = request.message.companyName;
		if (!companyName)
            throw new Error('Company name is invalid');

        //TODO: verify signature

        //this.WalletAgentUrls[companyName] = null;
        delete this.WalletAgentUrls[companyName];

        //TODO: save WalletAgentUrls to file
        console.log("WalletAgentUrls", this.WalletAgentUrls);
		return true;
    }

    async getWalletAgentUrl(companyName: string) {
		if (!companyName)
            throw new Error('Company name is invalid');
        if(this.WalletAgentUrls)
            return this.WalletAgentUrls[companyName];
        else
            return null;
    }
}  
