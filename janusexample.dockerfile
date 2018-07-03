FROM node:8.9.3

WORKDIR .
ADD ./janus/package.json /janus/
WORKDIR janus
RUN npm install

ADD ./example/janus-client/package.json /janus-client/
WORKDIR ../janus-client
RUN npm install

COPY ./janus /janus/
WORKDIR ../janus
RUN npm run build

COPY ./example/janus-client /janus-client/
WORKDIR ../

EXPOSE 4000-4999

CMD ["/jdata/start.sh" ]
