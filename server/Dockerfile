## Build stage
FROM node:20
WORKDIR /app
COPY package*.json .

## Install bun
FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY src ./src
COPY public ./public

RUN bun install

## Run stage
COPY . .
EXPOSE 5500
CMD ["bun","server.js"]