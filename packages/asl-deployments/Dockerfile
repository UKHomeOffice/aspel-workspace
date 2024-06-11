# syntax=docker/dockerfile:1.2

FROM node:16

WORKDIR /app

COPY .npmrc /app/.npmrc
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY .env /app/.env

RUN --mount=type=secret,id=token \
    --mount=type=secret,id=github_token \
    ART_AUTH_TOKEN=`cat /run/secrets/token` \
    GITHUB_AUTH_TOKEN=`cat /run/secrets/github_token` \
    npm ci

RUN rm /app/.npmrc

ENTRYPOINT bash
