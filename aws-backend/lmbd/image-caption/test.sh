#!/bin/bash

if [[ -z "$1" ]]; then
  echo "Usage: test.sh @/path/to/file"
fi

curl --request POST \
  --data-binary $1 \
  --header "Content-Type: image/jpeg" \
  --header "Accept: application/json" \
  https://rqxkfrryz3dtnnwy4pjeyd44ye0wilkz.lambda-url.us-east-1.on.aws/
