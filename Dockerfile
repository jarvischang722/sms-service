FROM node:10.15.0-jessie-slim

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY src src/
COPY package.json .
COPY support/pm2.json ./support/pm2.json

RUN apt-get update \
    && apt-get -y install git \
    && npm install -g pm2 \
    && yarn install

EXPOSE 7901

CMD ["pm2-docker", "pm2.json"]
