var Web3 = require("web3");
var TradeJson = require("@manosamy/janus-contracts/abi/Trade.json");
var TradeFactoryJson = require("@manosamy/janus-contracts/abi/TradeFactory.json");
var MarketplaceDirectoryJson = require("@manosamy/janus-contracts/abi/MarketplaceDirectory.json");

var oraclePrivateKey = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
var nodeUrl = "http://forcefield01.uksouth.cloudapp.azure.com:8545";
//var networkChainId = 11997;

var web3 = new Web3(nodeUrl);

if(web3) {
    //console.log(web3);
    var account = web3.eth.accounts.privateKeyToAccount(oraclePrivateKey);
    console.log(account);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    console.log(web3.eth.defaultAccount);

    var tradeContract = new web3.eth.Contract(TradeJson.abi);
    //var refTrade = tradeContract.new({from:account.address, data:TradeJson.bytecode, gas: 3000000}, function(e, trade) {
    tradeContract.deploy({
        data:TradeJson.bytecode
    })
    .send({
        from: account.address,
        gas: 4100000,
        gasPrice: '0'
    })
    .then(function(trade){
        console.log("Trade Contract mined! Address: " + trade.options.address);
        
        var tradeFactoryContract = new web3.eth.Contract(TradeFactoryJson.abi);
        tradeFactoryContract.deploy({
            data:TradeFactoryJson.bytecode,
            arguments: [trade.options.address]
        })
        .send({
            from: account.address,
            gas: 3000000,
            gasPrice: '0'
        })
        .then(function(factory){
            console.log("Factory Contract mined! Address: " + factory.options.address);
        });
    });    
    // .estimateGas(function(err, gas){
    //     console.log(gas);
    // });
}

console.log("End of script");


