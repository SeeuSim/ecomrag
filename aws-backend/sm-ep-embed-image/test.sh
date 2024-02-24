#!/bin/bash

if [[ -z "$1" ]]; then 
  echo "Example Usage: test.sh <FILENAME>"
  echo "i.e. test.sh path/to/file"
  exit(1)
fi

aws sagemaker-runtime invoke-endpoint \
  --endpoint-name ecomrag-img-embed-2024-02-24-01-11-31-794 \
  --content-type "image/jpeg" \
  --accept "application/json" \
  --body fileb://$1 \
outfile
