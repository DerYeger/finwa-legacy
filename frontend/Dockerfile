FROM node:16.1.0-alpine AS BUILDER

WORKDIR /usr/app

COPY . .

RUN npm install &&\
    npm run build --prod

FROM nginx:1.20.0-alpine

COPY --from=BUILDER /usr/app/dist/finwa-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/nginx /etc/nginx
