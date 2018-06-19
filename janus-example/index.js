var Web3 = require("web3");
var janus = require("janus");
var guid = require("guid-typescript");
const http = require("http");


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


const app = http.createServer(async (request, response) => {
    if(!request.url.endsWith("/")) {
        response.end();
        return;
    }

    let txnRef = guid.Guid.create().toString();  
    console.log("Requesting onetimeKeys for txnRef", txnRef);
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Requesting onetimeKeys for txnRef: " + txnRef);
   
    await hdwallet1.requestOnetimeKeys(txnRef, networkId, [companyName1,companyName2,companyName1,companyName2], (res) => {
        console.log("Final Response Message received", JSON.stringify(res));
        response.write("\nFinal Response Message received \n");
        response.write(JSON.stringify(res));
        response.end();
    });

    //response.end();
});
app.listen(process.env.PORT || '5000');


console.log("End of script");


