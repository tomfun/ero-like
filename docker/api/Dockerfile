FROM node:18.15-alpine3.17

RUN apk --no-cache add gnupg

WORKDIR /app/api

CMD ["node", "--trace-warnings", "--enable-source-maps", "dist/main"]

COPY api/package*.json ./
COPY client-sdk /app/client-sdk
COPY client-config /app/client-config

RUN npm --loglevel warn --color=always install && \
    mkdir /app/client-config/node_modules && \
    cd /app/client-config/ && \
    ln -sv ../../client-sdk /app/client-config/node_modules/ero-like-sdk

COPY api .

RUN npm --loglevel warn --color=always run build

ARG VERSION=n/a
ENV VERSION ${VERSION}
