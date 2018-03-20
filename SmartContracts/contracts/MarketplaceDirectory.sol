pragma solidity ^0.4.17;

import "./MarketplaceDirectoryInterface.sol";

contract MarketplaceDirectory is MarketplaceDirectoryInterface {
    address public consortiumAddress;
    bytes32 public consortiumNameHash = keccak256("ForceField ETRM Registry");
    
    struct Participant {
        bytes32 parent;
        uint effectiveDate;
        uint terminationDate;
        string name;
        address walletAddress;
    }
    
    mapping(address => bytes32) public participantNames;
    mapping(bytes32 => Participant) public participants;
    
    modifier onlyConsortium() {
        require(msg.sender == consortiumAddress);
        _;
    }
    
    modifier onlyParent(string participantName) {
        require(callerName() != 0);
        require(participants[keccak256(participantName)].parent == 0 || participants[keccak256(participantName)].parent == participantNames[msg.sender]);
        _;
    }
    
    function MarketplaceDirectory() public {
        consortiumAddress = msg.sender;
        participantNames[msg.sender] = consortiumNameHash;
    }
    
    function callerName() public constant returns (bytes32) {
        return participantNames[msg.sender];
    }
    
    function participant(string participantName) public constant returns (bytes32 parent, uint effectiveDate , uint terminationDate, string name, address walletAddress) {
        var p = participants[keccak256(participantName)];
        return (p.parent, p.effectiveDate, p.terminationDate, p.name, p.walletAddress);
    }
    
    function updateParticipant(uint effectiveDate, uint terminationDate, string participantName, address participantWalletAddress) public onlyParent(participantName) {
        require(effectiveDate > 0);
        require(terminationDate > 0);
        require(participantWalletAddress != 0);

        // TODO support multiple entries for a participant under different companies
        // TODO avoid name collision by creating hierarchy of name
        var parent = callerName();
        var name = keccak256(participantName); // name = parent + keccak256(participantName);

        var oldAddress = participants[name].walletAddress;
        if (address(oldAddress) != 0) { 
            delete participantNames[participantWalletAddress];
        }

        participantNames[participantWalletAddress] = name;
        participants[name] = Participant(
            {parent: parent, effectiveDate : effectiveDate, terminationDate: terminationDate, name: participantName, walletAddress: participantWalletAddress});

        ParticipantUpdated(name, participantName, effectiveDate, terminationDate);
    } 

    event ParticipantUpdated(bytes32 indexed nameHash, string name, uint effectiveDate , uint terminationDate);
}
