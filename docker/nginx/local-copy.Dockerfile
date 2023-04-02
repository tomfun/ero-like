FROM nginx

COPY docker/nginx/conf.d_default.conf /etc/nginx/templates/default.conf.template
ENV NGINX_REVERSE_PROXY_API=api:3000

COPY frontend/dist/index.html /usr/share/nginx/html/50x.html
COPY frontend/dist/           /usr/share/nginx/html

ARG VERSION=n/a
ENV VERSION ${VERSION}
