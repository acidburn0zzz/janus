pragma solidity ^0.4.17;

import "./GovernedSmartContract.sol";
import "./TradeInterface.sol";
import "./TradeFactory.sol";

contract Trade is GovernedSmartContract, TradeInterface {
    
    uint8[] ALL_FIELDS = [uint8(Field.unassigned), uint8(Field.tradeDate), uint8(Field.product), uint8(Field.qty), 
        uint8(Field.price), uint8(Field.buyer), uint8(Field.seller)];
    
    uint8[] signatureRequiredParties = [uint8(Party.Buyer), uint8(Party.Seller)];

    uint public tradeNumber;
    TradeFactory public tradeFactory;

	uint public tradeIsActive;

	modifier onlyIfTradeIsActive() {
		require(tradeIsActive == 1);

		_;
	}

    function initialize(TradeFactory pFactory, 
            address pOracleAddress, uint pTradeNumber) {
        require(createdOn == 0);
        tradeNumber = pTradeNumber;
        createdOn = now;
        tradeFactory = pFactory;
        oracleAddress = pOracleAddress;
		tradeIsActive = 1;
    }
    
    function updateData(string symmetricKey, string pTradeDate, string pProduct, 
            string pQty, string pPrice, string pBuyer, string pSeller) onlyByPartiesToTheTransaction(symmetricKey) onlyIfTradeIsActive { //
        var symmetricKeyHash = keccak256(symmetricKey);
        updateField(symmetricKeyHash, uint8(Field.tradeDate), pTradeDate);
        updateField(symmetricKeyHash, uint8(Field.product), pProduct);
        updateField(symmetricKeyHash, uint8(Field.qty), pQty);
        updateField(symmetricKeyHash, uint8(Field.price), pPrice);
        updateField(symmetricKeyHash, uint8(Field.buyer), pBuyer);
        updateField(symmetricKeyHash, uint8(Field.seller), pSeller);
        resetSignatures();
        tradeFactory.RaiseTradeFieldUpdated(tradeNumber);
    }

    function updateParty(Party partyType, address partyAddress, string companyName, string accessibleSymKey) onlyOracle onlyIfTradeIsActive {
        assignOTAddressToParty(uint8(partyType), partyAddress);
        grantSymmetricKeyAccessToParty(partyAddress, accessibleSymKey);
        grantFieldAccessToSymmetricKey(accessibleSymKey, ALL_FIELDS);
        if(partyType == Party.Buyer)
            fields[uint8(Field.buyer)].field[keccak256(Field.buyer)] = EncryptedValue({lastUpdated: now, value: companyName});
        if(partyType == Party.Seller)
            fields[uint8(Field.seller)].field[keccak256(Field.seller)] = EncryptedValue({lastUpdated: now, value: companyName});
        tradeFactory.RaiseTradePartyUpdated(tradeNumber,uint(partyType), partyAddress);
    }
    
    function accept(string symmetricKey, string signerKey) onlyByPartiesToTheTransaction(symmetricKey) onlyIfTradeIsActive {
        acceptInternal(symmetricKey, signerKey);
        tradeFactory.RaiseTradeFieldUpdated(tradeNumber);
    }

	function cancel(string symmetricKey) onlyByPartiesToTheTransaction(symmetricKey) {
		
		bool allSigned = hasAllPartiesSigned(signatureRequiredParties);

		if(!allSigned){ 
			tradeIsActive = 0;
			tradeFactory.RaiseTradeFieldUpdated(tradeNumber);
		}
	}
    
    function resetSignatures() internal {
        resetSignature(uint8(Party.Buyer));
        resetSignature(uint8(Party.Seller));
    }
}
