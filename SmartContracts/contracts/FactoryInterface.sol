pragma solidity ^0.4.17;

contract FactoryInterface {
    function createTransaction(string pGuid, uint8 pParty1Type, address pParty1Address, string pParty1CompanyName, string pParty1CommonFieldsSymKey, string pParty1PaymentFieldsSymKey,
        uint8 pParty2Type, address pParty2Address, string pParty2CompanyName, string pParty2CommonFieldsSymKey, string pParty2PaymentFieldsSymKey
        ) public returns (uint);
    function getContract(uint tokenNumber) public view returns(address);
    function raiseContractFieldUpdated(uint tokenNumber) public;
    function raiseContractPartyUpdated(uint tokenNumber,uint partyType, address partyAddress) public;
    event ContractCreated(uint indexed tokenNumber);
    event ContractFieldUpdated(uint indexed tokenNumber);
    event ContractPartyUpdated(uint indexed tokenNumber, uint partyType, address partyAddress);
}