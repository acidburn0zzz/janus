pragma solidity ^0.4.17;

contract ContractInterface {

    function updateParty(uint8 observerPartyIndex, address partyAddress, string companyName, string pCommonFieldsSymKey, string pPaymentFieldsSymKey) public;
    function getAccessibleSymmetricKeyForParty(address partyAddress, uint symKeyIndex) view public returns (string);
    function getGuid() view public returns (string);
}
