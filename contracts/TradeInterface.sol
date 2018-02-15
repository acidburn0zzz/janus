pragma solidity ^0.4.17;

import "./TradeFactory.sol";

contract TradeInterface {

    enum Party { Unassigned, Buyer, Seller}
    enum Field { unassigned, tradeDate, product, qty, price, buyer, seller}

    function initialize(TradeFactory pFactory, address pOracleAddress, uint pTradeNumber);
    function updateData(string symmetricKey, string pTradeDate, string pProduct, 
            string pQty, string pPrice, string pBuyer, string pSeller);
    function updateParty(Party partyType, address partyAddress, string companyName, string accessibleSymKey);
    function accept(string symmetricKey, string signerKey);
    function cancel(string symmetricKey);
}