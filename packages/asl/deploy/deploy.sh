#!/bin/bash
export KUBE_NAMESPACE=asl-dev
export KUBE_SERVER=${KUBE_SERVER}
export KUBE_TOKEN=${KUBE_TOKEN}

echo ${DRONE_DEPLOY_TO}
echo ${DRONE_COMMIT_SHA}

kd --insecure-skip-tls-verify \
  -f deploy/deployment.yaml \
  -f deploy/service.yaml \
  -f deploy/ingress.yaml \
  -f deploy/network-policy.yaml