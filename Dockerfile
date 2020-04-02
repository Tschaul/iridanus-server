FROM node:lts

ADD . /home/node/app/

ENV IRIDANUS_USE_PROXY=false

WORKDIR "/home/node/app"

RUN mkdir data
VOLUME [ "/home/node/app/data" ]

CMD ["npm","start"]

EXPOSE 8999