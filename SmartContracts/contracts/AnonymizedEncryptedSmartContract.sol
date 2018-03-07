pragma solidity ^0.4.17;

contract AnonymizedEncryptedSmartContract {

    // //stores an encrypted value along with timestamp of when it was last updated    
    // struct EncryptedValue {
    //     uint lastUpdated;
    //     string value;
    // }
    
    //Stores several encrypted copies of the same data in a map
    struct EncryptedField {
        uint lastUpdated;
        // //Symmetric key => Value 
        // mapping(bytes32=> EncryptedValue) field;
        string value;
    }
    
    //Field Index -> Field values
    mapping(uint=>EncryptedField) public fields;
    
    //Party index -> One time addresses
    mapping(uint => address) public partyOTAddresses;
    
    //partyOTAddress -> [symkey1, symkey2, symkey3]
    mapping(address => string[]) public accessibleSymmetricKeysByUser;
    
    //symmetricKey => signerAddress => signature
    mapping(bytes32=>mapping(address=>uint)) public signatures;
    mapping(bytes32=>mapping(address=>string)) public signer;
    
    //symmetric key -> List of fields it has access to
    mapping(bytes32=>uint8[]) public accessibleFieldsBySymKey;
    
    string public guid;

    modifier onlyByPartiesToTheTransaction(bytes32 symmetricKeyHash) {
        string[] accessibleKeys = accessibleSymmetricKeysByUser[msg.sender];
        bool hasAccess = false;
        for(uint i=0;i<accessibleKeys.length;i++) {
            if(symmetricKeyHash == keccak256(accessibleKeys[i])) {
                hasAccess = true;
                break;
            }
        }
        if(!hasAccess)
            revert;
            
        _;    
    }

    function canEditField(bytes32 symmetricKeyHash, uint8 fieldEnumIndex) public returns (bool) {
        uint8[] accessibleFields = accessibleFieldsBySymKey[symmetricKeyHash];
        for(uint8 i=0;i<accessibleFields.length;i++) {
            if(fieldEnumIndex == accessibleFields[i]) {
                return true;
            }
        }
        return false;
    }
    
    //function getFieldValues(bytes32 symmetricKeyHash, uint8 pFieldName) public view returns (uint lastUpdated, string value) {
    function getFieldValues(uint8 pFieldName) public view returns (uint lastUpdated, string value) {
        //(lastUpdated, value)= (fields[pFieldName].lastUpdated, fields[pFieldName].field[keccak256(pFieldName)].value);
        (lastUpdated, value)= (fields[pFieldName].lastUpdated, fields[pFieldName].value);
    }

    function updateField(bytes32 symmetricKeyHash, uint8 pFieldName, string pEncryptedValue) internal {
        if(canEditField(symmetricKeyHash, pFieldName)) {
            fields[pFieldName].lastUpdated = now;
            //fields[pFieldName].field[keccak256(pFieldName)] = EncryptedValue({lastUpdated: now, value: pEncryptedValue});
            fields[pFieldName].value = pEncryptedValue;
        }
    }
    
    function assignOTAddressToParty(uint8 partyType, address partyAddress) internal {
        partyOTAddresses[partyType] = partyAddress;
    }
    
    function grantSymmetricKeyAccessToParty(address partyAddress, string accessibleSymKey ) internal {
        accessibleSymmetricKeysByUser[partyAddress].push(accessibleSymKey);
    }
    
    function grantFieldAccessToSymmetricKey(string accessibleSymKey, uint8[] fieldEnumIndices) internal  {
        if(accessibleFieldsBySymKey[keccak256(accessibleSymKey)].length < (fieldEnumIndices.length - 1)) {
            for(uint i=1;i< fieldEnumIndices.length;i++)
                accessibleFieldsBySymKey[keccak256(accessibleSymKey)].push(fieldEnumIndices[i]);
        }
    }
    
    function acceptInternal(bytes32 symmetricKeyHash, string signerKey) public onlyByPartiesToTheTransaction(symmetricKeyHash) {
        signatures[symmetricKeyHash][msg.sender] = now;
        signer[symmetricKeyHash][msg.sender] = signerKey;
    }

    function hasAllPartiesSigned(uint8[] requiredParties) public returns (bool) {
        for(uint i=0;i<requiredParties.length;i++) {
            address party = partyOTAddresses[uint(requiredParties[i])];
			//get the symmetric key for the Party
			var symKeys = accessibleSymmetricKeysByUser[party];

            if(signatures[keccak256(symKeys[0])][party] == 0)
             return false;
        }
        return true;
    }
    
    function resetSignature(uint8 partyEnumIndex) internal {
        address party = partyOTAddresses[partyEnumIndex];
        var symmetricKeys = accessibleSymmetricKeysByUser[party];
        for(uint i=0;i<symmetricKeys.length;i++) {
            signatures[keccak256(symmetricKeys[i])][party] = 0;
        }
    }
}

