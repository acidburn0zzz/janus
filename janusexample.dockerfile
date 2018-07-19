FROM node:8.9.3

WORKDIR .
ADD ./janus/package.json /janus/
WORKDIR janus
RUN npm install

ADD ./janus-service/package.json /janus-service/
WORKDIR ../janus-service
RUN npm install

ADD ./example/janus-client/package.json /janus-client/
WORKDIR ../janus-client
RUN npm install

COPY ./janus /janus/
WORKDIR ../janus
RUN npm run build

COPY ./janus-service /janus-service/
COPY ./example/janus-client /janus-client/
WORKDIR ../

EXPOSE 10000-10999

CMD ["/config/start.sh" ]
