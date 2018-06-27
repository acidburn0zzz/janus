var Web3 = require("web3");
var janus = require("janus");
var guid = require("guid-typescript");
const http = require("http");
var util = require("./util");

var janusTestJson = require("./SmartContracts/build/contracts/JanusTest.json");
var nodeUrl = "http://localhost:22001";
let networkId = "1";

let companyName1 = "Mercuria";
let companyName2 = "Shell";

var hdwallet1;
var hdwallet2;
var web3;

if(nodeUrl)
    web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));

console.log("NodeUrl:", nodeUrl);
console.log("Connected to node:",web3.currentProvider.isConnected());

setTimeout(async () => {
    let fileDirectoryProvider = new janus.FileDirectoryProvider();
    
    //For Comapny1
    let mnemonic1 = "buyer try humor into improve thrive fruit funny skate velvet vanish live";  
    let shhMessageProvider1 = new janus.ShhMessageProvider(web3, null);
    console.log("shhMessageProvider1_key:", shhMessageProvider1.getPublicKey());
    await fileDirectoryProvider.addCompanyKey(companyName1,"shhKey",shhMessageProvider1.getPublicKey());    
    let fileStorageProvider1 = new janus.FileStorageProvider();
    let privateKey1 = "0x6281cbb32d9b47407932af4214c9aa75e37bb8c58dbdde82b31745ed89ea3f13";
    let simpleSigner1 = new janus.SimpleSigner(web3, privateKey1);

    hdwallet1 = new janus.Hdwallet(companyName1, mnemonic1, nodeUrl,
        fileDirectoryProvider, shhMessageProvider1, fileStorageProvider1, simpleSigner1);
    console.log("Hdwallet1 initialized");

    //For company2
    let mnemonic2 = "radar blur cabbage chef fix engine embark joy scheme fiction master release";
    let shhMessageProvider2 = new janus.ShhMessageProvider(web3, null);
    console.log("shhMessageProvider2_key:", shhMessageProvider2.getPublicKey());
    await fileDirectoryProvider.addCompanyKey(companyName2,"shhKey",shhMessageProvider2.getPublicKey());
    let fileStorageProvider2 = new janus.FileStorageProvider();
    let privateKey2 = "0x588687850ac469e944ae1aa601f18f1a91797a0c974905c6f34473be6ebd7a76";
    let simpleSigner2 = new janus.SimpleSigner(web3, privateKey2);

    hdwallet2 = new janus.Hdwallet(companyName2, mnemonic2, nodeUrl,
        fileDirectoryProvider, shhMessageProvider2, fileStorageProvider2, simpleSigner2);
    console.log("Hdwallet2 initialized");
    
});

var contractAddress;
var txnRef;

const app = http.createServer(async (request, response) => {
    if(!request.url.endsWith("/")) {
        response.end();
        return;
    }

    txnRef = guid.Guid.create().toString();  
    console.log("Requesting onetimeKeys for txnRef:", txnRef);
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Requesting onetimeKeys for txnRef: " + txnRef);
   
    await hdwallet1.requestOnetimeKeys(txnRef, networkId, [companyName1,companyName2], async (res) => {
        console.log("OTA Response Message received", JSON.stringify(res));
        response.write("\nOTA Response Message received \n");
        response.write(JSON.stringify(res));
        
        let company1Address;
        let company2Address;
        for(let i = 0; i<res.partyKeyMap.length;i++) {
            let keyMapItem = res.partyKeyMap[i];
            if(keyMapItem && keyMapItem.onetimeKey) {
                if(keyMapItem.partyName == companyName1)
                    company1Address = keyMapItem.onetimeKey.address;
                else if(keyMapItem.partyName == companyName2)
                    company2Address = keyMapItem.onetimeKey.address;
            }
        }
        console.log("Args:", [txnRef,company1Address, company2Address]);
        let tx = util.createDeployTransaction(janusTestJson["abi"], janusTestJson["bytecode"], [txnRef,company1Address, company2Address]);
        let txResp = await hdwallet1.postTransaction(txnRef, networkId, tx);
        console.log(txResp);
        response.write("\nTx response\n");
        response.write(txResp);
        setTimeout(async ()=>{
            let txReceipt = await web3.eth.getTransactionReceipt(txResp);
            contractAddress = txReceipt.contractAddress;
            console.log("contractAddress:", contractAddress);
            response.write("\nContractAddress\n");
            response.write(contractAddress);
            await updateContract(request, response);
            // response.write("\nContractAddress\n");
            // response.write(contractAddress);
            // response.end();
        }, 2000);
        //response.end();
    });

    // let result = web3.eth.accounts;
    // console.log("Accounts", JSON.stringify(result));
    // response.write("\nAccounts \n");
    // response.write(JSON.stringify(result));
    
    //let amount = web3.toWei(0.00005,"ether");
    //Let tx = {to: web3.eth.accounts[0], value: web3.toBigNumber(amount).toNumber(), gasLimit: 50000};
    //let tx = {to: web3.eth.accounts[0], value: amount, gasLimit: 50000};
    //let signedTx = await hdwallet1.signTransaction(txnRef, networkId, tx);
    //console.log(signedTx);
    //response.write("\nSigned Tx \n");
    //response.write(signedTx);

    //response.end();
});
app.listen(process.env.PORT || '4000');

var updateContract = async (request, response) => {
    console.log("Requesting update tx");
    let tx = util.createUpdateTransaction(contractAddress, janusTestJson["abi"], "setValue", [5]);
    let txResp = await hdwallet2.postTransaction(txnRef, networkId, tx);
    console.log("Update Tx response:",txResp);
    response.write("\nUpdate Tx response\n");
    response.write(txResp);
    console.log("Update Transaction",web3.eth.getTransaction(txResp));
    setTimeout(async ()=>{
        let txReceipt = await web3.eth.getTransactionReceipt(txResp);
        contractAddress = txReceipt.contractAddress;
        console.log("Update Tx response:",txReceipt);
        response.write("\nUpdate Tx completed\n");
        response.end();
    }, 2000);
    //response.end();
};

console.log("End of script");


