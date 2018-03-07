pragma solidity ^0.4.17;

import "./DelegateProxy.sol";
import "./TradeInterface.sol";
import "./GovernedSmartContractFactory.sol";
import "./FactoryInterface.sol";

contract TradeFactory is GovernedSmartContractFactory, FactoryInterface {
    address public refTrade;
    function nextTradeNumber() view public returns (uint) {
        return nextTokenNumber;
    }
    
    function getContract(uint tokenNumber) view public returns(address) {
        return contracts[tokenNumber];
    }

    function TradeFactory(address pRefTrade) public {
        oracleAddress = msg.sender;
        nextTokenNumber = 1001;
        refTrade = pRefTrade;
    }
    
    function createTransaction(string pGuid, address pBuyerAddress, string pBuyerCompanyName, string pBuyerCommonFieldsSymKey, string pBuyerPaymentFieldsSymKey,
        address pSellerAddress, string pSellerCompanyName, string pSellerCommonFieldsSymKey, string pSellerPaymentFieldsSymKey
        ) public onlyOracle returns (uint)  {
        var tradeProxy = address(new DelegateProxy(refTrade));
        var tokenNumber = buyToken();
        var trade = TradeInterface(tradeProxy);
        trade.initialize(this, pGuid, oracleAddress, tokenNumber);
        trade.updateParty(1, pBuyerAddress, pBuyerCompanyName, pBuyerCommonFieldsSymKey, pBuyerPaymentFieldsSymKey);
        trade.updateParty(2, pSellerAddress, pSellerCompanyName, pSellerCommonFieldsSymKey, pSellerPaymentFieldsSymKey);
        contracts[tokenNumber] = tradeProxy;
        ContractCreated(tokenNumber);
        return tokenNumber;
    }
    
    function raiseContractFieldUpdated(uint tokenNumber) public onlyContractOwner(tokenNumber) {
        ContractFieldUpdated(tokenNumber);
    }

    function raiseContractPartyUpdated(uint tokenNumber, uint partyType, address partyAddress) public onlyContractOwner(tokenNumber) {
        ContractPartyUpdated(tokenNumber,partyType,partyAddress);
    }
    
    event ContractCreated(uint indexed tokenNumber);
    event ContractFieldUpdated(uint indexed tokenNumber);
    event ContractPartyUpdated(uint indexed tokenNumber, uint partyType, address partyAddress);
}
