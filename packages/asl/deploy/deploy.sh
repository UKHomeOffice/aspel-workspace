#!/bin/bash
export KUBE_NAMESPACE=asl-dev
export KUBE_SERVER=${KUBE_SERVER}
export KUBE_TOKEN=${KUBE_TOKEN}

./kd --insecure-skip-tls-verify \
  -f deployment.yaml \
  -f service.yaml \
  -f ingress.yaml
