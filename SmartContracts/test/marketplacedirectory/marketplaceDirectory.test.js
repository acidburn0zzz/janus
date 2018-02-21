const MarketplaceDirectoryAbi = artifacts.require('./MarketplaceDirectory.sol')

contract('MarketplaceDirectory', function(accounts) {

    // Defaults
    const defaultConsortiumName = "ForceField ETRM Registry";
    const defaultConsortiumHash = web3.sha3(defaultConsortiumName);
    const defaultAccount = accounts[0];

    const participant1 = accounts[1];
    const participant2 = accounts[2];
    const participant3 = accounts[3];

    const wallet1 = accounts[4];
    const wallet2 = accounts[5];

    const startOfYear = 1514808000;
    const midpointOfYear = 1530532800;
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

        it ('should be possible to add a new participant', async() => { 

            var name = "ForceField participant 1";
            var result = await MarketplaceDirectory.updateParticipant(startOfYear, endOfYear, name, participant1);

            assert.isNotNull(result);
            assert.isNotNull(result.tx);
        })

        it ('should NOT be possible to add a new particpant from unknown parent', async() => { 

            var name = "ForceField participant 1";

            // TODO: Expected exception as helper function
            try {
                var result = await MarketplaceDirectory.updateParticipant(startOfYear, endOfYear, name, participant1, { from: participant1 });
            }
            catch (error) {
                const invalidOpcode = error.message.search('invalid opcode') >= 0;
                const outOfGas = error.message.search('out of gas') >= 0;
                const revert = error.message.search('revert') >= 0;

                assert(invalidOpcode || outOfGas || revert);
                return;
            }

            assert.isNotNull(result);
        })

        it ('should be possible to get the new participant', async() => { 

            var name = "ForceField participant 1";
            var participantDetails = await MarketplaceDirectory.participant(name);
            
            assert.strictEqual(5, participantDetails.length);
            assert.strictEqual(defaultConsortiumHash, participantDetails[0]);
            assert.strictEqual(startOfYear, participantDetails[1].toNumber());
            assert.strictEqual(endOfYear, participantDetails[2].toNumber());
            assert.strictEqual(name, participantDetails[3]);
            assert.strictEqual(participant1, participantDetails[4]);
        })

        it ('should be possible to update an existing participant', async() => { 

            var name = "ForceField participant 1";
            var result = await MarketplaceDirectory.updateParticipant(midpointOfYear, endOfYear, name, participant1);
            
            assert.isNotNull(result);
            assert.isNotNull(result.tx);

            var participantDetails = await MarketplaceDirectory.participant(name);
            
            assert.strictEqual(5, participantDetails.length);
            assert.strictEqual(defaultConsortiumHash, participantDetails[0]);
            assert.strictEqual(midpointOfYear, participantDetails[1].toNumber());
            assert.strictEqual(endOfYear, participantDetails[2].toNumber());
            assert.strictEqual(name, participantDetails[3]);
            assert.strictEqual(participant1, participantDetails[4]);
        })

        it ('should be possible to update an existing participant with a new wallet address', async() => { 

            var name = "ForceField participant 1";
            var result = await MarketplaceDirectory.updateParticipant(startOfYear, endOfYear, name, wallet1);
            
            assert.isNotNull(result);
            assert.isNotNull(result.tx);

            var participantDetails = await MarketplaceDirectory.participant(name);
            
            assert.strictEqual(5, participantDetails.length);
            assert.strictEqual(defaultConsortiumHash, participantDetails[0]);
            assert.strictEqual(startOfYear, participantDetails[1].toNumber());
            assert.strictEqual(endOfYear, participantDetails[2].toNumber());
            assert.strictEqual(name, participantDetails[3]);
            assert.strictEqual(wallet1, participantDetails[4]);
        })

        // should be possible to add a (sub)participant
    })
})