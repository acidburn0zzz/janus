pragma solidity ^0.4.17;

contract FactoryInterface {
    function createTransaction(string pGuid, address pBuyerAddress, string pBuyerCompanyName, string pBuyerCommonFieldsSymKey, string pBuyerPaymentFieldsSymKey,
        address pSellerAddress, string pSellerCompanyName, string pSellerCommonFieldsSymKey, string pSellerPaymentFieldsSymKey
        ) public returns (uint);
    function getContract(uint tokenNumber) public view returns(address);
    function raiseContractFieldUpdated(uint tokenNumber) public;
    function raiseContractPartyUpdated(uint tokenNumber,uint partyType, address partyAddress) public;
    event ContractCreated(uint indexed tokenNumber);
    event ContractFieldUpdated(uint indexed tokenNumber);
    event ContractPartyUpdated(uint indexed tokenNumber, uint partyType, address partyAddress);
}