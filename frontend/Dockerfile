FROM node:14.15.5-alpine AS BUILDER

WORKDIR /usr/app

COPY . .

RUN npm install &&\
    npm run build --prod

FROM nginx:1.19.7-alpine

COPY --from=BUILDER /usr/app/dist/finwa-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/nginx /etc/nginx
