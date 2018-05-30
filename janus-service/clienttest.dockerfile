FROM node:8.9.3

WORKDIR .
ADD ./janus-common/package.json /janus-common/
WORKDIR janus-common
RUN npm install
ADD ./janus-contracts/package.json /janus-contracts/
WORKDIR ../janus-contracts
RUN npm install
ADD ./janus-client/package.json /janus-client/
WORKDIR ../janus-client
RUN npm install

COPY ./janus-common /janus-common/
COPY ./janus-contracts /janus-contracts/
COPY ./janus-client /janus-client/

WORKDIR ../janus-common
RUN npm run build

WORKDIR ../janus-contracts
RUN npm run build

WORKDIR ../janus-client
RUN npm run build

EXPOSE 9000

#ENTRYPOINT [ "mocha ./build/tests/*.test.js" ]
ENTRYPOINT [ "npm", "test" ]
