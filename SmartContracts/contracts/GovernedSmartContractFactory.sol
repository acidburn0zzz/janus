pragma solidity ^0.4.17;

contract GovernedSmartContractFactory {
    uint nextTokenNumber;
    address public oracleAddress;
    mapping(bytes32 => address) public contracts;
    
    modifier onlyOracle() {
        require(msg.sender == oracleAddress);
        _;
    }
    
    modifier onlyContractOwner(string guid) {
        require(msg.sender == contracts[keccak256(guid)]);
        _;
    }

    function buyToken() public returns (uint) {
        return nextTokenNumber++;
    }
}
