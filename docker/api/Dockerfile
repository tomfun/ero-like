FROM node:18-alpine3.17

RUN apk --no-cache add gnupg

WORKDIR /app/api

CMD ["node", "--trace-warnings", "--enable-source-maps", "dist/main"]

COPY api/package*.json ./
COPY client-sdk /app/client-sdk
COPY client-config /app/client-config

RUN npm --loglevel warn --color=always install --force

COPY api .

RUN npm --loglevel warn --color=always run build

