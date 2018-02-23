pragma solidity ^0.4.17;

import "./TradeProxy.sol";
import "./TradeInterface.sol";
import "./GovernedSmartContractFactory.sol";
import "./FactoryInterface.sol";

contract TradeFactory is GovernedSmartContractFactory, FactoryInterface {
    function nextTradeNumber() view public returns (uint) {
        return nextTokenNumber;
    }
    
    function trades(uint tradeNumber) view public returns(address) {
        return contracts[tradeNumber];
    }

    function TradeFactory() {
        oracleAddress = msg.sender;
        nextTokenNumber = 1001;
    }
    
    function CreateTransaction(string pGuid) onlyOracle returns (uint)  {
        var tradeProxy = address(new TradeProxy());
        var tradeNumber = buyToken();
        TradeInterface(tradeProxy).initialize(this, pGuid, oracleAddress, tradeNumber);
        contracts[tradeNumber] = tradeProxy;
        TradeCreated(tradeNumber);
        return tradeNumber;
    }
    
    function RaiseTradeFieldUpdated(uint tradeNumber) onlyContractOwner(tradeNumber) {
        TradeFieldUpdated(tradeNumber);
    }

    function RaiseTradePartyUpdated(uint tradeNumber,uint partyType, address partyAddress) onlyContractOwner(tradeNumber) {
        TradePartyUpdated(tradeNumber,partyType,partyAddress);
    }
    
    event TradeCreated(uint indexed tradeNumber);
    event TradeFieldUpdated(uint indexed tradeNumber);
    event TradePartyUpdated(uint indexed tradeNumber, uint partyType, address partyAddress);
}
