FROM node:8.9.3

WORKDIR .
ADD ./janus-common/package.json /janus-common/
WORKDIR janus-common
RUN npm install
ADD ./janus-contracts/package.json /janus-contracts/
WORKDIR ../janus-contracts
RUN npm install
ADD ./janus-hdwallet/package.json /janus-hdwallet/
WORKDIR ../janus-hdwallet
RUN npm install
ADD ./janus-hdwallet-service/package.json /janus-hdwallet-service/
WORKDIR ../janus-hdwallet-service
RUN npm install

COPY ./janus-common /janus-common/
WORKDIR ../janus-common
RUN npm run build

COPY ./janus-contracts /janus-contracts/
WORKDIR ../janus-contracts
RUN npm run build

COPY ./janus-hdwallet /janus-hdwallet/
WORKDIR ../janus-hdwallet
RUN npm run build

COPY ./janus-hdwallet-service /janus-hdwallet-service/
WORKDIR ../janus-hdwallet-service
RUN npm run build

EXPOSE 4000

#ENTRYPOINT [ "node ./build/compiled.js" ]
ENTRYPOINT [ "npm", "start" ]
