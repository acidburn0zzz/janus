'use strict';

var janus = require("eth-janus");
//import {ContainerBuilder, YamlFileLoader} from 'node-dependency-injection'
var ndi = require("node-dependency-injection");
const utils = new janus.Utils();
const defaultNodeUrl = "http://localhost:8545";//= "http://docker.for.mac.host.internal:22001";
const defaultNetworkId = "1";
const defaultConfigPath = "./config";
var janusInstance;
var storageProvider;
var directoryProvider;
var messageProvider_wallet;
var messageProvider_janus;
var signer;

var Janus = module.exports = {    
    janusInstance: janusInstance,
    utils: utils,

    init: () => {
        console.log("janus.init");
        const configPath = process.env['CONFIG_PATH'] || defaultConfigPath;
        console.log("configPath", configPath);
        const config = require(configPath + "/janusconfig.json");
        console.log("config", config);

        let nodeUrl = config["nodeUrl"] || defaultNodeUrl;
        let networkId = config["networkId"] || defaultNetworkId;
        let companyName = config["companyName"];
        let mnemonic = config["mnemonic"];
    
        process.env['NODE_URL'] = nodeUrl;
        process.env['NETWORK_ID'] = networkId;
        process.env['COMPANY_NAME'] = companyName;
        let container = new ndi.ContainerBuilder();
        let loader = new ndi.YamlFileLoader(container);
        
        loader.load(configPath + '/serviceconfig.yml');
        //console.log(container.definitions);
        
        //await utils.sleep(2000);
    
        storageProvider = container.get('storage_provider');
        directoryProvider = container.get('directory_provider');
        messageProvider_janus = container.get('message_provider_janus');
        messageProvider_wallet = container.get('message_provider_wallet');
        signer = container.get('signer');
    
        Janus.janusInstance = new janus.Janus(companyName, mnemonic, nodeUrl,
            directoryProvider, messageProvider_janus, storageProvider, signer);
        console.log("janus_instance created");
    },
    startHdwallet: () => {
        if(Janus.janusInstance && messageProvider_wallet) {
            Janus.janusInstance.startHdwallet(messageProvider_wallet);
            console.log("hdwallet started");
        }
    }
}