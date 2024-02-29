aws sagemaker-runtime invoke-endpoint \
  --endpoint-name ecomrag-img-caption-2024-02-29-07-44-23-035 \
  --content-type "image/jpeg" \
  --accept "application/json" \
  --body fileb://$1 \
  /dev/stderr