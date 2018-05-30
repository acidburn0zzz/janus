FROM node:8.9.3

WORKDIR .
ADD ./janus-common/package.json /janus-common/
WORKDIR janus-common
RUN npm install
ADD ./janus-contracts/package.json /janus-contracts/
WORKDIR ../janus-contracts
RUN npm install
ADD ./janus-oracle/package.json /janus-oracle/
WORKDIR ../janus-oracle
RUN npm install
ADD ./janus-oracle-service/package.json /janus-oracle-service/
WORKDIR ../janus-oracle-service
RUN npm install

COPY ./janus-common /janus-common/
WORKDIR ../janus-common
RUN npm run build

COPY ./janus-contracts /janus-contracts/
WORKDIR ../janus-contracts
RUN npm run build

COPY ./janus-oracle /janus-oracle/
WORKDIR ../janus-oracle
RUN npm run build

COPY ./janus-oracle-service /janus-oracle-service/
WORKDIR ../janus-oracle-service
RUN npm run build

EXPOSE 8000

#ENTRYPOINT [ "node", "./build/compiled.js" ]
ENTRYPOINT [ "npm", "start" ]
