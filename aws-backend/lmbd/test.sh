#!/bin/bash

if [[ -z "$1" ]]; then
  echo "Usage: test.sh @/path/to/file"
  exit(1)
fi

curl --request POST \
  --data-binary $1 \
  --header "Content-Type: image/jpeg" \
  --header "Accept: application/json" \
  https://p7ha6srl2uoykkk2ofcgggucsy0kiikq.lambda-url.us-east-1.on.aws