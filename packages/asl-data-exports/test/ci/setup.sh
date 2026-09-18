#!/bin/sh

set -eu

echo "[ci] preparing asl-data-exports test dependencies"

export S3_REGION="${S3_REGION:-eu-west-2}"
export S3_BUCKET="${S3_BUCKET:-asl-dev}"
export S3_ACCESS_KEY="${S3_ACCESS_KEY:-test}"
export S3_SECRET="${S3_SECRET:-test}"
export S3_LOCALSTACK_URL="${S3_LOCALSTACK_URL:-http://localstack:4566}"
export LOCALSTACK_HEALTH_TIMEOUT_SECONDS="${LOCALSTACK_HEALTH_TIMEOUT_SECONDS:-120}"

echo "[ci] using LocalStack endpoint: ${S3_LOCALSTACK_URL}"
echo "[ci] ensuring S3 bucket exists: ${S3_BUCKET}"

node ./packages/asl-data-exports/test/ci/wait-for-localstack.js
node ./packages/asl-data-exports/test/ci/ensure-s3-bucket.js

echo "[ci] LocalStack setup complete"


