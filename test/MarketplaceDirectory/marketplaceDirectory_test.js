const MarketplaceDirectoryAbi = artifacts.require('./MarketplaceDirectory.sol')

contract('MarketplaceDirectory', function(accounts) {

    // Defaults
    const defaultConsortiumName = "ForceField ETRM Registry";
    const defaultConsortiumHash = web3.sha3(defaultConsortiumName);
    const defaultAccount = accounts[0];

    const participant1 = accounts[1];
    const participant2 = accounts[2];
    const participant3 = accounts[3];

    const startOfYear = 1514808000;
    const endOfYear = 1546257600;

    it ('should be possible to create a new MarketplaceDirectory', async() => { 

        MarketplaceDirectory = await MarketplaceDirectoryAbi.new({ from: defaultAccount });
        assert.isNotNull(MarketplaceDirectory);
    })

    describe("Initial state", function() {

        beforeEach(async () => {

            MarketplaceDirectory = await MarketplaceDirectoryAbi.new({ from: defaultAccount });
            assert.isNotNull(MarketplaceDirectory);
        })

        it ('should have the sender as default consortium address', async() => { 

            var consortiumAddress = await MarketplaceDirectory.consortiumAddress();
            assert.strictEqual(defaultAccount, consortiumAddress);
        })

        it ('should have the sender as default participant in the directory', async() => { 

            var consortiumHash = await MarketplaceDirectory.consortiumNameHash();
            assert.strictEqual(defaultConsortiumHash, consortiumHash);

            var callerName = await MarketplaceDirectory.callerName();
            assert.strictEqual(defaultConsortiumHash, callerName);

            var participantDetails = await MarketplaceDirectory.participant(defaultConsortiumName);
            assert.strictEqual(5, participantDetails.length);
        })
    })
    
    describe("Directory functions", function() {

        before(async () => {

            MarketplaceDirectory = await MarketplaceDirectoryAbi.new({ from: defaultAccount });
            assert.isNotNull(MarketplaceDirectory);
        })

        it ('should be possible to add a new participant by parent', async() => { 

            var name = "ForceField participant 1";
            var result = await MarketplaceDirectory.updateParticipant(startOfYear, endOfYear, name, participant1);
            assert.isNotNull(result);
            assert.isNotNull(result.tx);
        })

    })
})