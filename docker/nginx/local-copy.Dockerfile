FROM nginx

COPY docker/nginx/conf.d_default.conf /etc/nginx/templates/default.conf.template
COPY docker/nginx/conf.d_default.conf /etc/nginx/templates/default.conf.template2
ENV NGINX_REVERSE_PROXY_API=api:3000

COPY my-vue3-app/dist/index.html /usr/share/nginx/html/50x.html
COPY my-vue3-app/dist/           /usr/share/nginx/html
