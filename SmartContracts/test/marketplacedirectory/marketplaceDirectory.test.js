const MarketplaceDirectoryAbi = artifacts.require('./MarketplaceDirectory.sol')

contract('MarketplaceDirectory', function(accounts) {

    // Defaults
    const defaultConsortiumName = "ForceField ETRM Registry";
    const defaultConsortiumHash = web3.sha3(defaultConsortiumName);
    const defaultAccount = accounts[0];

    const companyA = "Company A";
    const companyAWallet = accounts[1];
    const companyB = "Company B";
    const companyBWallet = accounts[2];
    const memberA1 = "Member A1";
    const memberA1Wallet = accounts[3];
    const memberA2 = "Member A2";
    const memberA2Wallet = accounts[4];

    const wallet1 = accounts[5];
    const wallet2 = accounts[6];

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

            var result = await MarketplaceDirectory.updateParticipant(startOfYear, endOfYear, companyA, companyAWallet);

            assert.isNotNull(result);
            assert.isNotNull(result.tx);
        })

        it ('should NOT be possible to add a new particpant from unknown parent', async() => { 

            // TODO: Expected exception as helper function
            try {
                var result = await MarketplaceDirectory.updateParticipant(startOfYear, endOfYear, companyA, companyAWallet, { from: companyAWallet });
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

            var participantDetails = await MarketplaceDirectory.participant(companyA);
            
            assert.strictEqual(5, participantDetails.length);
            assert.strictEqual(defaultConsortiumHash, participantDetails[0]);
            assert.strictEqual(startOfYear, participantDetails[1].toNumber());
            assert.strictEqual(endOfYear, participantDetails[2].toNumber());
            assert.strictEqual(companyA, participantDetails[3]);
            assert.strictEqual(companyAWallet, participantDetails[4]);
        })

        it ('should be possible to update an existing participant', async() => { 

            var result = await MarketplaceDirectory.updateParticipant(midpointOfYear, endOfYear, companyA, companyAWallet);
            
            assert.isNotNull(result);
            assert.isNotNull(result.tx);

            var participantDetails = await MarketplaceDirectory.participant(companyA);
            
            assert.strictEqual(5, participantDetails.length);
            assert.strictEqual(defaultConsortiumHash, participantDetails[0]);
            assert.strictEqual(midpointOfYear, participantDetails[1].toNumber());
            assert.strictEqual(endOfYear, participantDetails[2].toNumber());
            assert.strictEqual(companyA, participantDetails[3]);
            assert.strictEqual(companyAWallet, participantDetails[4]);
        })

        it ('should be possible to update an existing participant with a new wallet address', async() => { 

            var result = await MarketplaceDirectory.updateParticipant(startOfYear, endOfYear, companyA, wallet1);
            
            assert.isNotNull(result);
            assert.isNotNull(result.tx);

            var participantDetails = await MarketplaceDirectory.participant(companyA);
            
            assert.strictEqual(5, participantDetails.length);
            assert.strictEqual(defaultConsortiumHash, participantDetails[0]);
            assert.strictEqual(startOfYear, participantDetails[1].toNumber());
            assert.strictEqual(endOfYear, participantDetails[2].toNumber());
            assert.strictEqual(companyA, participantDetails[3]);
            assert.strictEqual(wallet1, participantDetails[4]);
        })

        it ('should be possible to add a new participant from an added parent', async() => { 

            var result = await MarketplaceDirectory.updateParticipant(startOfYear, endOfYear, companyB, companyBWallet, { from: companyAWallet });
            
            assert.isNotNull(result);
            assert.isNotNull(result.tx);

            var participantDetails = await MarketplaceDirectory.participant(companyB);

            // console.log(participantDetails);
            // var hashedB = web3.sha3(companyB);
            // var hashedA = web3.sha3(companyA);

            // console.log("Company A: " + companyA);
            // console.log("Company A Wallet: " + companyAWallet);
            // console.log("Company A Hashed: " + hashedA);

            // console.log("Company B: " + companyB);
            // console.log("Company B Wallet: " + companyBWallet);
            // console.log("Company B Hashed: " + hashedB);

            assert.strictEqual(5, participantDetails.length);
            assert.strictEqual(web3.sha3(companyA), participantDetails[0]);
            assert.strictEqual(startOfYear, participantDetails[1].toNumber());
            assert.strictEqual(endOfYear, participantDetails[2].toNumber());
            assert.strictEqual(companyB, participantDetails[3]);
            assert.strictEqual(companyBWallet, participantDetails[4]);
        })
        

        // it ('should be possible to add a same participant under a different parent', async() => { 

        //     var result = await MarketplaceDirectory.updateParticipant(startOfYear, endOfYear, companyB, companyBWallet);

        //     assert.isNotNull(result);
        //     assert.isNotNull(result.tx);
        // })
    })
})