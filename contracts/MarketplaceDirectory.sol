pragma solidity ^0.4.17;

contract MarketplaceDirectory {
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
    
    //TODO remove old address
    //TODO avoid name collision by creating hierarchy of name
    //TODO support multiple entries for a participant under different companies
    function updateParticipant(uint pEffDate, uint pTermDate, string pName, address pWalletAddress) public onlyParent(pName) {
        bytes32 parent = callerName();
        participantName[pWalletAddress] = keccak256(pName);
        participants[keccak256(pName)] = Participant(
            {parent: parent, effDate: pEffDate, termDate: pTermDate, name: pName, walletAddress: pWalletAddress});
    } 
}
