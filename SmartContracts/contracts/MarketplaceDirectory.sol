pragma solidity ^0.4.17;

import "./MarketplaceDirectoryInterface.sol";

contract MarketplaceDirectory is MarketplaceDirectoryInterface {
    address public consortiumAddress;
    bytes32 public consortiumNameHash = keccak256("Janus Registry");
    
    struct Participant {
        bytes32 parent;
        string parentName;
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
        bytes32 parentHash = callerName();
        require(parentHash != 0);
        bytes32 nameHash = keccak256(parentHash, participantName);
        require(participants[nameHash].parent == 0 || participants[nameHash].parent == parentHash);
        _;
    }
    
    function MarketplaceDirectory() public {
        consortiumAddress = msg.sender;
        participantNames[msg.sender] = consortiumNameHash;
    }
    
    function callerName() public constant returns (bytes32) {
        return participantNames[msg.sender];
    }
    
    function participant(string participantName, string parentName) public constant returns (bytes32 parent, uint effectiveDate , uint terminationDate, string name, address walletAddress) {
        bytes32 parentHash = keccak256(parentName);
        bytes32 nameHash = keccak256(participantName);
        Participant p = participants[keccak256(parentHash, nameHash)];
        return (p.parent, p.effectiveDate, p.terminationDate, p.name, p.walletAddress);
    }
    
    function participant(address participantWalletAddress) public constant returns (bytes32 parent, uint effectiveDate , uint terminationDate, string name, address walletAddress) {
        Participant p = participants[participantNames[participantWalletAddress]];
        return (p.parent, p.effectiveDate, p.terminationDate, p.name, p.walletAddress);
    }
    
    function isParticipantActive(string participantName, string parentName, uint asofDate) public constant returns (bool) {
        bytes32 parentHash = keccak256(parentName);
        bytes32 nameHash = keccak256(participantName);
        Participant p = participants[keccak256(parentHash, nameHash)];
        return ((p.effectiveDate == 0 || p.effectiveDate <= asofDate) && (p.terminationDate == 0 || p.terminationDate >= asofDate));
    }
    
    function isParticipantActive(address participantWalletAddress, uint asofDate) public constant returns (bool) {
        Participant p = participants[participantNames[participantWalletAddress]];
        return ((p.effectiveDate == 0 || p.effectiveDate <= asofDate) && (p.terminationDate == 0 || p.terminationDate >= asofDate));
    }

    function updateParticipant(uint effectiveDate, uint terminationDate, string participantName, address participantWalletAddress) public onlyParent(participantName) {
        //require(effectiveDate > 0);
        //require(terminationDate > 0);
        require(participantWalletAddress != 0);

        // TODO support multiple entries for a participant under different companies
        // TODO avoid name collision by creating hierarchy of name
        bytes32 parentHash = callerName();
        bytes32 nameHash = keccak256(participantName);
        bytes32 keyHash = keccak256(parentHash, nameHash);
        bytes32 accountHash = keccak256(participantWalletAddress);

        address oldAddress = participants[keyHash].walletAddress;
        if (address(oldAddress) == 0) { 
            participantNames[participantWalletAddress] = keyHash;
            participants[keyHash] = Participant(
                {parent: parentHash, parentName: participants[parentHash].name, effectiveDate : effectiveDate, terminationDate: terminationDate, name: participantName, walletAddress: participantWalletAddress});
            participants[accountHash] = Participant(
                {parent: parentHash, parentName: participants[parentHash].name, effectiveDate : effectiveDate, terminationDate: terminationDate, name: participantName, walletAddress: participantWalletAddress});
        } else {
            if (address(oldAddress) != participantWalletAddress) {
                delete participantNames[oldAddress];
                participantNames[participantWalletAddress] = keyHash;
                participants[keyHash].walletAddress = participantWalletAddress;
                delete participants[keccak256(oldAddress)];
                participants[accountHash] = Participant(
                    {parent: parentHash, parentName: participants[parentHash].name, effectiveDate : effectiveDate, terminationDate: terminationDate, name: participantName, walletAddress: participantWalletAddress});
            }
            participants[keyHash].effectiveDate = effectiveDate;
            participants[keyHash].terminationDate = terminationDate;
            participants[accountHash].effectiveDate = effectiveDate;
            participants[accountHash].terminationDate = terminationDate;
        }

        ParticipantUpdated(keyHash, participantName, participants[parentHash].name, effectiveDate, terminationDate);
    } 

    event ParticipantUpdated(bytes32 indexed keyHash, string name, string parentName, uint effectiveDate , uint terminationDate);
}
