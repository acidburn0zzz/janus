pragma solidity ^0.4.17;

/// @title DelegateProxy - Generic proxy contract allows to execute all transactions applying the code of a master contract.
contract DelegateProxy {

    address masterCopy;
    /// @dev Constructor function sets address of master copy contract.
    /// @param _masterCopy Master copy address to perform the delegatecall
    function DelegateProxy(address _masterCopy) public {
        //require(_masterCopy == 0);
        masterCopy = _masterCopy;
    }
    
    /// @dev Fallback function forwards all transactions and returns all received return data.
    function() public payable {
        delegatedFwd(masterCopy, msg.data);
    }
    function delegatedFwd(address _dst, bytes _calldata) internal {
        assembly {
            switch extcodesize(_dst) case 0 { revert(0, 0) }
            let len := 4096
            let result := delegatecall(sub(gas, 10000), _dst, add(_calldata, 0x20), mload(_calldata), 0, len)
            switch result case 0 { invalid() }
            return (0, len)
            
            // switch extcodesize(_dst) case 0 { revert(0, 0) }
            // let success := delegatecall(not(0), _dst, add(_calldata, 0x20), mload(_calldata), 0, 0)
            // switch success case 0 { revert(0, returndatasize()) }
            // default { return(0, returndatasize()) }
            
            // let masterCopy := and(sload(0), 0xffffffffffffffffffffffffffffffffffffffff)
            // calldatacopy(0, 0, calldatasize())
            // let success := delegatecall(not(0), masterCopy, 0, calldatasize(), 0, 0)
            // returndatacopy(0, 0, returndatasize())
            // switch success
            // case 0 { invalid() } //revert(0, returndatasize()) }
            // default { return(0, returndatasize()) }
        }
    }
}

