FROM quay.io/ukhomeofficedigital/asl-base

USER 0

RUN apk upgrade --no-cache && \
    apk add aws-cli ca-certificates postgresql16-client jq bash --no-cache

USER 999

WORKDIR /app

COPY --chown=app:app ./scripts ./

ENTRYPOINT tail -f /dev/null
