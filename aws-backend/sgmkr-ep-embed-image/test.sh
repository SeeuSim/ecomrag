#!/bin/bash
docker run --platform linux/amd64 -d -v ~/.aws-lambda-rie:/aws-lambda -p 9000:8080 \
    --entrypoint /aws-lambda/aws-lambda-rie \
    docker-image:test \
        /usr/local/bin/python -m awslambdaric main.lambda_handler

test="$(cat /Users/seeusim/Downloads/photo_2023-04-30\ 22.43.27.jpeg | base64)"

curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d "{\"content\":\"$test\"}"
