import base64
import json
import logging
import os
from datetime import UTC, datetime

import boto3
import urllib3

http = urllib3.PoolManager()

# grab environment variables

ENDPOINT_NAME = os.environ.get("SM_EP_NAME", "")

logger = logging.getLogger()

runtime = boto3.client("sagemaker-runtime")
s3 = boto3.client("s3")

bucket_name = "ecomragdev"
bucket_path = "models/embed/inputs"

dtypes = {
    "Id": "stringValue",
    "Model": "stringValue",
    "Source": "stringValue",
    "Description": "stringValue",
}


def fetch_image_bytes(src):
    res = http.request("GET", src)
    if res.status >= 200 and res.status < 300:
        b = res.data
        img_b64 = base64.b64encode(b)
        img_b64_s = img_b64.decode("utf-8")
        return img_b64_s
    print("An error occurred: " + json.dumps(res.text))
    return None


def handle_event(event):
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
        return {"StatusCode": 401}

    fkey = f"{id}-{model}-{datetime.now(UTC).strftime('%Y-%m-%d %H:%M:%S')}.json"

    json_data = json.dumps(payload)
    # Write the JSON string to a file
    res = s3.put_object(Body=json_data, Bucket=bucket_name, Key=f"{bucket_path}/{fkey}")

    if "ETag" in res:
        response = runtime.invoke_endpoint_async(
            EndpointName=ENDPOINT_NAME,
            ContentType="application/json",
            Accept="application/json",
            InputLocation=f"s3://{bucket_name}/{bucket_path}/{fkey}",  # Dump JSON to S3
        )
        if "InferenceId" not in response:
            print(response)
            return {"StatusCode": 500, **response}
        return {"StatusCode": 200, **response}
    else:
        return {"StatusCode": 500, **response}


def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    if "Records" not in event:
        return
    data = event["Records"]
    results = []
    for _event in data:
        res = handle_event(_event)
        if res:
            results.append(res)

    return json.dumps(
        {
            "Successes": list(
                filter(lambda v: "StatusCode" in v and v["StatusCode"] == 200, results)
            ),
            "Errors": list(
                filter(
                    lambda x: "StatusCode" not in x or x["StatusCode"] != 200, results
                )
            ),
        }
    )
