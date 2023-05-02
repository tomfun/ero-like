FROM node:18.15-alpine3.17

RUN apk --no-cache add gnupg

WORKDIR /ero-like/api

CMD ["node", "--trace-warnings", "--enable-source-maps", "dist/main"]

COPY api/package*.json ./
COPY client-sdk /ero-like/client-sdk
COPY client-config /ero-like/client-config

RUN npm --loglevel warn --color=always install && \
    mkdir /ero-like/client-config/node_modules && \
    cd /ero-like/client-config/ && \
    ln -sv ../../client-sdk /ero-like/client-config/node_modules/ero-like-sdk

COPY api .

RUN npm --loglevel warn --color=always run build

ARG VERSION=n/a
ENV VERSION ${VERSION}
