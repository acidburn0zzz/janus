pragma solidity ^0.4.17;

import "./TradeFactory.sol";

contract TradeInterface {

    enum Party { Unassigned, Buyer, Seller, Broker}
    enum Field { unassigned, tradeDate, product, qty, price, buyer, seller, paymentTerm}

    function initialize(TradeFactory pFactory, string pGuid, address pOracleAddress, uint pTradeNumber);
    function updateData(bytes32 pCommonFieldsSymKeyHash, string pTradeDate, string pProduct, 
            string pQty, string pPrice, string pBuyer, string pSeller);
    function updatePaymentInfo(bytes32 pPaymentFieldsSymKeyHash, string pPaymentTerm);
    function updateParty(uint8 observerPartyIndex, address partyAddress, string companyName, string pCommonFieldsSymKey, string pPaymentFieldsSymKey);
    function accept(bytes32 symmetricKeyHash, string signerKey);
    function cancel(bytes32 symmetricKeyHash);
}
