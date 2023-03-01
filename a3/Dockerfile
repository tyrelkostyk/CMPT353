# syntax=docker/dockerfile:1

FROM node:18-alpine

WORKDIR /a3

COPY . .

ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=password
ENV MYSQL_DATABASE=postdb

CMD ["node", "server.js"]

EXPOSE 3000
