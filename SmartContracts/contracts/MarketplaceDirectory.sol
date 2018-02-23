pragma solidity ^0.4.17;

import "./MarketplaceDirectoryInterface.sol";

contract MarketplaceDirectory is MarketplaceDirectoryInterface {
    address public consortiumAddress;
    bytes32 public consortiumNameHash = keccak256("ForceField ETRM Registry");
    
    struct Participant {
        bytes32 parent;
        uint effDate;
        uint termDate;
        string name;
        address walletAddress;
    }
    
    mapping(address => bytes32) public participantName;
    mapping(bytes32 => Participant) public participants;
    
    modifier onlyConsortium() {
        require(msg.sender == consortiumAddress);
        _;
    }
    
    modifier onlyParent(string pName) {
        require(callerName() != 0);
        require(participants[keccak256(pName)].parent == 0 || participants[keccak256(pName)].parent == participantName[msg.sender]);
        _;
    }
    
    function MarketplaceDirectory() public {
        consortiumAddress = msg.sender;
        participantName[msg.sender] = consortiumNameHash;
    }
    
    function callerName() public constant returns (bytes32) {
        return participantName[msg.sender];
    }
    
    function participant(string pName) public constant returns (bytes32 parent, uint effDate, uint termDate, string name, address walletAddress) {
        var p = participants[keccak256(pName)];
        return (p.parent, p.effDate, p.termDate, p.name, p.walletAddress);
    }
    
    function updateParticipant(uint pEffDate, uint pTermDate, string pName, address pWalletAddress) public onlyParent(pName) {
        require(pEffDate > 0);
        require(pTermDate > 0);
        require(pWalletAddress != 0);

        // TODO support multiple entries for a participant under different companies
        // TODO avoid name collision by creating hierarchy of name
        var parent = callerName();
        var name = keccak256(pName);

        var oldAddress = participants[name].walletAddress;
        if (address(oldAddress) != 0) { 
            delete participantName[pWalletAddress];
        }

        participantName[pWalletAddress] = name;
        participants[name] = Participant(
            {parent: parent, effDate: pEffDate, termDate: pTermDate, name: pName, walletAddress: pWalletAddress});

        ParticipantUpdated(name, pName, pEffDate, pTermDate);
    } 

    event ParticipantUpdated(bytes32 indexed namehash, string name, uint effDate, uint termDate);
}
