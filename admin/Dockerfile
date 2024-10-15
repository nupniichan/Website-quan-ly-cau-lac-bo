## Build stage
FROM node:20
WORKDIR /app
COPY package*.json .

## Install bun
FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY src ./
COPY public ./

RUN bun install

## Run stage
COPY . .
EXPOSE 5100
CMD [ "bun","run","dev" ]