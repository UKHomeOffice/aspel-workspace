FROM quay.io/ukhomeofficedigital/asl-base:v1

ARG NPM_AUTH_USERNAME
ARG NPM_AUTH_TOKEN

RUN apk upgrade --no-cache

USER 999

COPY .npmrc /app/.npmrc
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci --production --no-optional --ignore-scripts
COPY . /app

RUN rm /app/.npmrc

# prime the babel cache at build time to improve deployed startup time
RUN node lib/app.js

CMD node index.js
