# Janus

Steps to run sample application to demonstrate janus hdwallet

1. Get source code:
Clone repository 
Checkout "quorum" branch.

2. Setup and run Quorum network:
Follow steps from ./example/quorum-docker-Nnodes/Readme.md to setup and run quorum network in docker

3. Build janus-example:

Change to ./example/janus-client/SmartContracts directory
truffle compile

Change to top level directory
docker build -f janusexample.dockerfile -t janus-client .

4. Configure janus-example:

Change to ./example/janus-client/JNnodes directory

Edit the `ips` variable in *setup.sh* to list two or more IP addresses on the Docker network that will host hdwallet services:
ips=("10.0.0.2" "10.0.0.3" "10.0.0.4")

Edit the `nodeIps` variable in *setup.sh* to list IP addresses on which node is running on the Docker network. Provide one node IP for each of the hdwallet instances configured above.
nodeIps=("10.0.0.11" "10.0.0.12" "10.0.0.13")

Edit the `companyNames` variables in *setup.sh* to list the company names corresponding to hdwallet configured above.
companyNames=("Bob_comp" "Alise_comp" "Tom Comp")

Run setup file in terminal window
./setup.sh

Edit janusconfig.json file in each of the jdata_* folder to specify unique mnemonic for the hdwallet service.

5. Start hdwallet services:

Change to ./example/janus-client/JNnodes directory
docker-compose up -d

6. Running script

#TODO:
#Provide steps to run scripts that will request onetime keys, deploy a test contract and update its data.