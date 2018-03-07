pragma solidity ^0.4.17;

contract GovernedSmartContractFactory {
    uint nextTokenNumber;
    address public oracleAddress;
    mapping(uint => address) public contracts;
    
    modifier onlyOracle() {
        require(msg.sender == oracleAddress);
        _;
    }
    
    modifier onlyContractOwner(uint tokenNumber) {
        require(msg.sender == contracts[tokenNumber]);
        _;
    }

    function buyToken() public returns (uint) {
        return nextTokenNumber++;
    }
}
