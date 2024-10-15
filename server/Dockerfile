## Build stage
FROM node:20
WORKDIR /app
COPY package*.json .

## Install bun
FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
# Sau nay co muc public thi them vao sau
RUN bun install

## Run stage
COPY . .
EXPOSE 5500
CMD ["bun","server.js"]
