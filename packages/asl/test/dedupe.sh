#!/bin/bash
REACT_REDUX_PATH="$(find . | grep ./node_modules/@asl/*/node_modules/react-redux/package.json)"
REACT_PATH="$(find . | grep ./node_modules/@asl/*/node_modules/react/package.json)"

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

exit 0
