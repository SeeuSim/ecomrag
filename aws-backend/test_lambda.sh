#!/bin/bash

if [[ -z "$1" ]]; then 
  echo "Expected usage: test_lambda.sh <IMAGE_ABSOLUTE_PATH>"
fi

test=$(cat $filename | base64)

aws lambda invoke --function-name ecomrag-lmbd-img-embed \
  --cli-binary-format raw-in-base64-out \
  --payload "{
    \"content\": \"$test\"
  }" \
  response.json