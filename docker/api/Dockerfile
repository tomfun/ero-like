FROM node:18-alpine3.17

RUN apk --no-cache add gnupg

WORKDIR /app/api

CMD ["node", "--trace-warnings", "--enable-source-maps", "dist/src/main"]

COPY api/package*.json ./

RUN npm --loglevel warn --color=always install

COPY api .

RUN npm --loglevel warn --color=always run build

