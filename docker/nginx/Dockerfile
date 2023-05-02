FROM node:18.15-alpine3.17 as artifacts

WORKDIR /app/frontend

RUN npm -G install npm

COPY frontend/package*.json ./

COPY client-sdk /app/client-sdk
COPY client-config /app/client-config

RUN npm --loglevel warn --color=always install && \
    rm /app/client-*/.eslintrc.* && \
    mkdir /app/client-config/node_modules && \
    ls -lA /app/client-config/node_modules && \
    cd /app/client-config/ && \
    ln -sv ../../client-sdk /app/client-config/node_modules/ero-like-sdk

COPY frontend .

RUN npm --loglevel warn --color=always run build


FROM nginx

COPY docker/nginx/conf.d_default.conf /etc/nginx/templates/default.conf.template
ENV NGINX_REVERSE_PROXY_API=api:3000

COPY --from=artifacts /app/frontend/dist/index.html /usr/share/nginx/html/50x.html
COPY --from=artifacts /app/frontend/dist/ /usr/share/nginx/html
