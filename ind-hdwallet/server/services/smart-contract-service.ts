import ethers = require('ethers');

const ethersUtils = ethers.utils;
const walletObject = ethers.Wallet;

const Web3 = require("web3");
const solc = require("solc");
const Tx = require('ethereumjs-tx');

var config = require('../../config/hd-wallet.config');

let contract: JSON = require('../../contracts/ContractInterface');

export class sendTransactionProperties {
    factoryAddress: string;
    methodName: string;
    parameters: string[];
    symmetricKeyIndex: number;
    OneTimeAddress: string;
    signingWallet: ethers.Wallet;
}

export class SmartContractService {

    private web3: any;

    constructor() {
        this.getWeb3();
    }

    private getWeb3() {
        this.web3 = new Web3(Web3.givenProvider || config.provider);
    }

    public sendTransaction(transactionProperties: sendTransactionProperties) {

        //get accessible symmetric key for each party
        //getAccessibleSymmetricKeyForParty(address partyAddress, uint symKeyIndex) view public returns (string)

        let privateKey = new Buffer(transactionProperties.signingWallet.privateKey, 'hex');

        let encondedCall: string = this.web3.eth.abi.encodeFunctionCall({
            name: transactionProperties.methodName,
            type: 'function',
            inputs: [{
                type: 'address',
                name: 'partyAddress'
            }, {
                type: 'uint',
                name: 'symKeyIndex'
                }]
        }, [transactionProperties.OneTimeAddress, transactionProperties.symmetricKeyIndex]);

        var rawTx = {
            gasPrice: '0x09184e72a000',
            gasLimit: '0x2710',
            to: '0x0000000000000000000000000000000000000000',
            value: '0x00',
            data: encondedCall
        }

        var tx = new Tx(rawTx);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();

        // console.log(serializedTx.toString('hex'));
        // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

        this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .on('receipt', console.log);

         // see eth.getTransactionReceipt() for details


    }
}
