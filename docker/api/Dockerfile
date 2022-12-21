FROM node:18

WORKDIR /app/api

CMD npm run start:prod

COPY api/package*.json ./

RUN npm --loglevel warn --color=always install

COPY api .

RUN npm --loglevel warn --color=always run build

