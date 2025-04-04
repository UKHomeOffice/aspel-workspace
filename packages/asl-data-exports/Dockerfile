# syntax=docker/dockerfile:1.2

FROM quay.io/ukhomeofficedigital/asl-base:v22.14.0 as builder

ARG MODULE_PATHS

WORKDIR /app

COPY . /app

RUN --mount=type=secret,id=token \
    --mount=type=secret,id=github_token \
    ART_AUTH_TOKEN=`cat /run/secrets/token` \
    GITHUB_AUTH_TOKEN=`cat /run/secrets/github_token` \
    npm ci --omit=optional --omit=dev --ignore-scripts --loglevel=verbose

FROM quay.io/ukhomeofficedigital/asl-base:v22.14.0

RUN apk upgrade --no-cache

COPY --from=builder /app /app

USER 999

CMD ["node", "packages/asl-data-exports/index.js"]
