test=$(cat /Users/seeusim/Downloads/photo_2023-04-30\ 22.43.27.jpeg | base64)

aws lambda invoke --function-name ecomrag-lmbd-img-embed \
  --cli-binary-format raw-in-base64-out \
  --payload "{
    \"content\": \"$test\"
  }" \
  response.json