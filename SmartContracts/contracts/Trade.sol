pragma solidity ^0.4.17;

import "./GovernedSmartContract.sol";
import "./TradeInterface.sol";
import "./FactoryInterface.sol";

contract Trade is GovernedSmartContract, TradeInterface {
    
    uint8[] COMMON_FIELDS = [uint8(Field.unassigned), uint8(Field.tradeDate), uint8(Field.product), uint8(Field.qty), 
        uint8(Field.price), uint8(Field.buyer), uint8(Field.seller), uint8(Field.broker)];

    uint8[] PAYMENT_FIELDS = [uint8(Field.unassigned), uint8(Field.paymentTerm)];
    
    uint8[] signatureRequiredParties = [uint8(Party.Buyer), uint8(Party.Seller)];

    uint public tradeNumber;
    FactoryInterface public tradeFactory;

	uint public tradeIsActive;

	modifier onlyIfTradeIsActive() {
		require(tradeIsActive == 1);

		_;
	}

    function Trade() public {
    }
    
    function initialize(FactoryInterface pFactory, string pGuid,
            address pOracleAddress, uint pTradeNumber) public {
        require(createdOn == 0);
		guid = pGuid;
        tradeNumber = pTradeNumber;
        createdOn = now;
        tradeFactory = pFactory;
        oracleAddress = pOracleAddress;
		tradeIsActive = 1;
    }
    
    function updateData(bytes32 pCommonFieldsSymKeyHash, string pTradeDate, string pProduct, 
            string pQty, string pPrice) public onlyByPartiesToTheTransaction(pCommonFieldsSymKeyHash) onlyIfTradeIsActive { //
        updateField(pCommonFieldsSymKeyHash, uint8(Field.tradeDate), pTradeDate);
        updateField(pCommonFieldsSymKeyHash, uint8(Field.product), pProduct);
        updateField(pCommonFieldsSymKeyHash, uint8(Field.qty), pQty);
        updateField(pCommonFieldsSymKeyHash, uint8(Field.price), pPrice);
        resetSignatures();
        tradeFactory.raiseContractFieldUpdated(tradeNumber);
    }
    
    function updatePaymentInfo(bytes32 pPaymentFieldsSymKeyHash, string pPaymentTerm) public onlyByPartiesToTheTransaction(pPaymentFieldsSymKeyHash) onlyIfTradeIsActive { //
        updateField(pPaymentFieldsSymKeyHash, uint8(Field.paymentTerm), pPaymentTerm);
        resetSignatures();
        tradeFactory.raiseContractFieldUpdated(tradeNumber);
    }
    
    function updateParty(uint8 observerPartyIndex, address partyAddress, string companyName, string pCommonFieldsSymKey, string pPaymentFieldsSymKey) public onlyIfTradeIsActive { //onlyOracle
        assignOTAddressToParty(observerPartyIndex, partyAddress);
        if(keccak256(pCommonFieldsSymKey) != keccak256("")) {
            grantSymmetricKeyAccessToParty(partyAddress, pCommonFieldsSymKey);
            grantFieldAccessToSymmetricKey(pCommonFieldsSymKey, COMMON_FIELDS);
        }
        if(keccak256(pPaymentFieldsSymKey) != keccak256("")) {
            grantSymmetricKeyAccessToParty(partyAddress, pPaymentFieldsSymKey);
            grantFieldAccessToSymmetricKey(pPaymentFieldsSymKey, PAYMENT_FIELDS);
        }
        if(observerPartyIndex == uint8(Party.Buyer)) {
            //fields[uint8(Field.buyer)].field[keccak256(Field.buyer)] = EncryptedValue({lastUpdated: now, value: companyName});
            fields[uint8(Field.buyer)].value = companyName;
            fields[uint8(Field.buyer)].lastUpdated = now;
        } else if(observerPartyIndex == uint8(Party.Seller)) {
            //fields[uint8(Field.seller)].field[keccak256(Field.seller)] = EncryptedValue({lastUpdated: now, value: companyName});
            fields[uint8(Field.seller)].value = companyName;
            fields[uint8(Field.seller)].lastUpdated = now;
        } else if(observerPartyIndex == uint8(Party.Broker)) {
            //fields[uint8(Field.broker)].field[keccak256(Field.broker)] = EncryptedValue({lastUpdated: now, value: companyName});
            fields[uint8(Field.broker)].value = companyName;
            fields[uint8(Field.broker)].lastUpdated = now;
        }
        //tradeFactory.raiseContractPartyUpdated(tradeNumber, observerPartyIndex, partyAddress);
    }
    
    function getAccessibleSymmetricKeyForParty(address partyAddress, uint symKeyIndex) view public returns (string) {
        return accessibleSymmetricKeysByUser[partyAddress][symKeyIndex];
    }
    
    function getGuid() view public returns (string) {
        return guid;
    }
    
    function accept(bytes32 symmetricKeyHash, string signerKey) public onlyByPartiesToTheTransaction(symmetricKeyHash) onlyIfTradeIsActive {
        acceptInternal(symmetricKeyHash, signerKey);
        tradeFactory.raiseContractFieldUpdated(tradeNumber);
    }

	function cancel(bytes32 symmetricKeyHash) public onlyByPartiesToTheTransaction(symmetricKeyHash) {
		
		bool allSigned = hasAllPartiesSigned(signatureRequiredParties);

		if(!allSigned){ 
			tradeIsActive = 0;
			tradeFactory.raiseContractFieldUpdated(tradeNumber);
		}
	}
    
    function resetSignatures() internal {
        resetSignature(uint8(Party.Buyer));
        resetSignature(uint8(Party.Seller));
    }
}
