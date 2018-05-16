pragma solidity ^0.4.17;

contract ContractInterface {

    mapping(uint=>uint8[]) public SYMKEY_LIST;

    function updateParty(uint8 observerPartyIndex, address partyAddress, string companyName, string pSymKey1, string pSymKey2) public;
    function getAccessibleSymmetricKeyForParty(address partyAddress, uint symKeyIndex) view public returns (string);
    function getGuid() view public returns (string);
}
