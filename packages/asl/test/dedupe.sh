#!/bin/bash
REACT_REDUX_PATH=./node_modules/@asl/*/node_modules/react-redux/package.json
REACT_PATH=./node_modules/@asl/*/node_modules/react/package.json

PATHS=($REACT_PATH $REACT_REDUX_PATH)

for i in ${PATHS[@]}; do
  FOUND="$(find . | egrep $i | wc -l)"
  if [ $FOUND -gt 0 ]; then
    exit 1
  fi
done
exit 0
