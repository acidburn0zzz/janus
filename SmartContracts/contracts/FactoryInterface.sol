pragma solidity ^0.4.17;

contract FactoryInterface {
    function CreateTransaction(string pGuid) returns (uint);
}