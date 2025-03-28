#!/bin/bash
REACT_REDUX_PATH="$(find . | grep ./node_modules/*/node_modules/react-redux/package.json)"
REACT_PATH="$(find . | grep ./node_modules/*/node_modules/react/package.json)"
REACT_ROUTER_PATH="$(find . | grep ./node_modules/*/node_modules/react-router/package.json)"

if [ ! -z $REACT_PATH ]; then
  echo $REACT_PATH
  echo "Found multiple versions of react, run npm dedupe"
  exit 1
fi

if [ ! -z $REACT_REDUX_PATH ]; then
  echo $REACT_REDUX_PATH
  echo "Found multiple versions of react-redux, run npm dedupe"
  exit 1
fi

if [ ! -z $REACT_ROUTER_PATH ]; then
  echo $REACT_ROUTER_PATH
  echo "Found multiple versions of react-router, remove package-lock.json and node_modules directory and re-install"
  exit 1
fi

exit 0
