FROM node:8.9.3

WORKDIR .
ADD ./janus-common/package.json /janus-common/
WORKDIR janus-common
RUN npm install
ADD ./janus-contracts/package.json /janus-contracts/
WORKDIR ../janus-contracts
RUN npm install
ADD ./janus-setup/package.json /janus-setup/
WORKDIR ../janus-setup
RUN npm install

COPY ./janus-common /janus-common/
WORKDIR ../janus-common
RUN npm run build

COPY ./janus-contracts /janus-contracts/
WORKDIR ../janus-contracts
RUN npm run build

COPY ./janus-setup /janus-setup/
WORKDIR ../janus-setup

#ENTRYPOINT [ "node ./build/compiled.js" ]
ENTRYPOINT [ "npm", "start" ]
