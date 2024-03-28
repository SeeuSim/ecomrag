import base64
import boto3
import logging
import json
import os
import requests

# grab environment variables

logger = logging.getLogger()

runtime = boto3.client("sagemaker-runtime")
s3 = boto3.client("s3")

bucket_name = "ecomragdev"
bucket_path = ""

dtypes = {
    "Id": "stringValue",
    "Model": "stringValue",
    "Source": "stringValue",
    "Description": "stringValue",
}


def fetch_image_bytes(src):
    res = requests.get(src)
    if res.ok:
        b = res.content
        img_b64 = base64.b64encode(b)
        img_b64_s = img_b64.decode("utf-8")
        return img_b64_s
    print("An error occurred: " + json.dumps(res.text))
    return None


def lambda_handler(event, context):
    """
    TO Test with SQS
    """
    print("Received event: " + json.dumps(event, indent=2))

    data = event["messageAttributes"]

    id = data["Id"][dtypes["Id"]]
    model = data["Model"][dtypes["Model"]]

    payload = {
        "Id": id,
        "Model": model,
    }

    if "Source" in data:
        # Image Embedding
        source = data["Source"][dtypes["Model"]]
        img_b64_s = fetch_image_bytes(source)
        payload = {**payload, "Payload": img_b64_s, "Content-Type": "image"}
    elif "Description" in data:
        # Product Description Embedding
        description = data["Description"][dtypes["Description"]]
        payload = {**payload, "Payload": description, "Content-Type": "text/plain"}

    else:
        print("Invalid payload")
        return

    json_data = json.dumps(payload)
    fkey = f"{id}-{model}-.json"
    # Write the JSON string to a file
    with open(fkey, "w") as json_file:
        json_file.write(json_data)

    res = s3.put_object(Body=fkey, Bucket=bucket_name, Key=f"{bucket_path}/{fkey}")

    if "ETag" in res:
        response = runtime.invoke_endpoint_async(
            EndpointName="",
            ContentType="application/json",
            Accept="application/json",
            InputLocation=f"s3://{bucket_name}/{bucket_path}/{fkey}",  # Dump JSON to S3
        )
        if "InferenceId" not in response:
            print(response)
            return
        return {"StatusCode": 200}
    else:
        print(res)
        return
