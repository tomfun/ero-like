FROM node:16 as artifacts

WORKDIR /app

COPY my-vue3-app/package*.json ./

RUN npm --loglevel warn --color=always install

COPY my-vue3-app .

RUN npm --loglevel warn --color=always run build


FROM nginx

COPY docker/nginx/conf.d_default.conf /etc/nginx/templates/default.conf.template
ENV NGINX_REVERSE_PROXY_API=api:3000

COPY --from=artifacts /app/dist/index.html /usr/share/nginx/html/50x.html
COPY --from=artifacts /app/dist/ /usr/share/nginx/html
