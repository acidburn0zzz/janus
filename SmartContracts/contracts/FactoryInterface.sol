pragma solidity ^0.4.17;

contract FactoryInterface {
    function createTransaction(string pGuid, uint8 pParty1Type, address pParty1Address, string pParty1CompanyName, string pParty1CommonFieldsSymKey, string pParty1PaymentFieldsSymKey,
        uint8 pParty2Type, address pParty2Address, string pParty2CompanyName, string pParty2CommonFieldsSymKey, string pParty2PaymentFieldsSymKey
        ) public returns (uint);
    //function getContract(uint tokenNumber) public view returns(address);
    function getContract(string pGuid) public view returns(address);
    function raiseContractFieldUpdated(uint tokenNumber, string guid) public;
    function raiseContractPartyUpdated(uint tokenNumber, string guid,uint partyType, address partyAddress) public;
    event ContractCreated(uint indexed tokenNumber, string indexed guid);
    event ContractFieldUpdated(uint indexed tokenNumber, string indexed guid);
    event ContractPartyUpdated(uint indexed tokenNumber, string indexed guid, uint partyType, address partyAddress);
}