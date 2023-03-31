FROM node:18.15-alpine3.17

RUN apk --no-cache add gnupg

ADD --chmod=0711 https://github.com/maxcnunes/waitforit/releases/download/v2.4.1/waitforit-linux_amd64 /usr/local/bin/waitforit

WORKDIR /app/api

CMD ["node", "--trace-warnings", "--enable-source-maps", "dist/main"]

COPY api/package*.json ./
COPY client-sdk /app/client-sdk
COPY client-config /app/client-config

RUN npm --loglevel warn --color=always install --legacy-peer-deps && \
    mkdir /app/client-config/node_modules && \
    cd /app/client-config/ && \
    ln -sv ../../client-sdk /app/client-config/node_modules/ero-like-sdk

COPY api .

RUN npm --loglevel warn --color=always run build

