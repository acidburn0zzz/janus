pragma solidity ^0.4.17;

import "./AnonymizedEncryptedSmartContract.sol";

contract GovernedSmartContract is AnonymizedEncryptedSmartContract {

    address public oracleAddress;
    uint public createdOn;

    modifier onlyOracle() {
        require(msg.sender == oracleAddress);
        _;
    }
}
