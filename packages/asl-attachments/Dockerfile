# syntax=docker/dockerfile:1.2

FROM quay.io/ukhomeofficedigital/asl-base:v22.14.0 as builder

ARG MODULE_PATHS

WORKDIR /build

COPY packages /build/packages

WORKDIR /app

COPY .npmrc /app/.npmrc
COPY package-lock.json /app/package-lock.json
COPY package.json /app/package.json

RUN for path in $MODULE_PATHS; do \
        mkdir -p /app/$path; \
        cp -r /build/$path/* /app/$path; \
    done

RUN ls /app/packages

RUN --mount=type=secret,id=token \
    --mount=type=secret,id=github_token \
    ART_AUTH_TOKEN=`cat /run/secrets/token` \
    GITHUB_AUTH_TOKEN=`cat /run/secrets/github_token` \
    npm update npm \
    npm ci --omit=dev --ignore-scripts --loglevel=verbose

FROM quay.io/ukhomeofficedigital/asl-base:v22.14.0

RUN apk upgrade --no-cache

COPY --from=builder /app /app

USER 999

CMD ["node", "packages/asl-attachments/index.js"]
