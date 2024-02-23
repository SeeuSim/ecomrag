#!/bin/bash

if [[ -z "$1" ]]; then 
  echo "Expected usage: test_lambda.sh <IMAGE_ABSOLUTE_PATH>"
fi

docker run --platform linux/amd64 -d -v ~/.aws-lambda-rie:/aws-lambda -p 9000:8080 \
    --entrypoint /aws-lambda/aws-lambda-rie \
    docker-image:test \
        /usr/local/bin/python -m awslambdaric main.lambda_handler

test="$(cat $filename | base64)"

curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d "{\"content\":\"$test\"}"
