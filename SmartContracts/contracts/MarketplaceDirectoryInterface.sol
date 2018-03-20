pragma solidity ^0.4.17;

contract MarketplaceDirectoryInterface {
    
    function callerName() public constant returns (bytes32);
    function participant(string pName) public constant returns (bytes32 parent, uint effDate, uint termDate, string name, address walletAddress);
    function updateParticipant(uint pEffDate, uint pTermDate, string pName, address pWalletAddress) public;

    event ParticipantUpdated(bytes32 indexed namehash, string name, uint effDate, uint termDate);
}