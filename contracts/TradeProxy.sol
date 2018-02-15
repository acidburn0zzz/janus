pragma solidity ^0.4.17;

import "./DelegateProxy.sol";

contract TradeProxy is DelegateProxy {
    // After compiling contract, below address is replaced in the bytecode by the real trade contract address
    address constant trade = 0x3c33129719d96644b29ebcfb8775f5e1aac73f3b; // checksumed to silence warning

    /*
    * @dev Forwards all calls to target
    */
    function() payable {
        delegatedFwd(trade, msg.data);
    }
}
