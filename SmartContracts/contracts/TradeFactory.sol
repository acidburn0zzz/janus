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
    
    function createTransaction(string pGuid, uint8 pParty1Type, address pParty1Address, string pParty1CompanyName, string pParty1CommonFieldsSymKey, string pParty1PaymentFieldsSymKey,
        uint8 pParty2Type, address pParty2Address, string pParty2CompanyName, string pParty2CommonFieldsSymKey, string pParty2PaymentFieldsSymKey
        ) public onlyOracle returns (uint)  {
        //var tradeProxy = address(new DelegateProxy(refTrade));
        //var tokenNumber = buyToken();
        TradeInterface trade = TradeInterface(address(new DelegateProxy(refTrade)));
        trade.initialize(this, pGuid, oracleAddress, buyToken());
        trade.updateParty(pParty1Type, pParty1Address, pParty1CompanyName, pParty1CommonFieldsSymKey, pParty1PaymentFieldsSymKey);
        trade.updateParty(pParty2Type, pParty2Address, pParty2CompanyName, pParty2CommonFieldsSymKey, pParty2PaymentFieldsSymKey);
        contracts[trade.tradeNumber()] = address(trade);//tradeProxy;
        ContractCreated(trade.tradeNumber(), pGuid);
        return trade.tradeNumber();
    }
    
    function raiseContractFieldUpdated(uint tokenNumber, string guid) public onlyContractOwner(tokenNumber) {
        ContractFieldUpdated(tokenNumber, guid);
    }

    function raiseContractPartyUpdated(uint tokenNumber, string guid, uint partyType, address partyAddress) public onlyContractOwner(tokenNumber) {
        ContractPartyUpdated(tokenNumber,guid,partyType,partyAddress);
    }
    
    event ContractCreated(uint indexed tokenNumber, string indexed guid);
    event ContractFieldUpdated(uint indexed tokenNumber, string indexed guid);
    event ContractPartyUpdated(uint indexed tokenNumber, string indexed guid, uint partyType, address partyAddress);
}
