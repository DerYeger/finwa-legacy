FROM node:14.16.1-alpine AS BUILDER

WORKDIR /usr/app

COPY . .

RUN npm install &&\
    npm run build --prod

FROM nginx:1.19.10-alpine

COPY --from=BUILDER /usr/app/dist/finwa-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/nginx /etc/nginx
