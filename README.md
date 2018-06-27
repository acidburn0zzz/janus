# Janus

Steps to run sample application to demonstrate janus hdwallet

1. Get source code
Clone repository 
Checkout "quorum" branch.

2. Setup and run quorum network in docker
Follow steps from ./quorum-docker-Nnodes/Readme.md

3. Run janus-example 

Change to ./janus directory

npm install
npm run build

change to ./janus-example directory

npm start

Open below url in browser
http://localhost:4000

This will initiate a request for onetime keys and once received, will display them on browser.