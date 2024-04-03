import base64
import json
import os
import re
from datetime import UTC, datetime

import boto3
import urllib3

http = urllib3.PoolManager()

ENDPOINT_NAME = os.environ.get("SM_EP_NAME", "")

runtime = boto3.client("sagemaker-runtime")
s3 = boto3.client("s3")

bucket_name = "ecomragdev"
bucket_path = "models/caption/inputs"
schema = {
    "Records": [
        {
            "body": "Caption",
            "messageAttributes": {
                "Model": {
                    "stringValue": "shopifyProductImage",
                },
                "Id": {
                    "stringValue": "30263993827422",
                },
                "Source": {
                    "stringValue": "https://cdn.shopify.com/s/files/1/0561/5399/7406/products/90e0be2e-413e-4a57-9173-de32679614fe-Min.jpg?v=1707274529",
                },
            },
        }
    ]
}


def fetch_image_bytes(src):
    res = http.request("GET", src)
    if res.status >= 200 and res.status < 300:
        b = res.data
        img_b64 = base64.b64encode(b)
        img_b64_s = img_b64.decode("utf-8")
        return (img_b64_s, None)
    print("An error occurred: " + json.dumps(res.text))
    return (None, res.text)


def handle_event(event):
    if "messageAttributes" not in event:
        return {"StatusCode": 401, "Message": "Wrong format"}
    event = event["messageAttributes"]
    if type(event) != dict:
        event = json.loads(event)

    id = event["Id"]["stringValue"]
    model = event["Model"]["stringValue"]
    env = event["Environment"]["stringValue"]

    payload = {
        "Id": id,
        "Model": model,
        "Environment": env
    }

    if (
        not str(model).startswith("shopifyProduct")
        or re.match(r"^\d+$", str(id)) == None
    ):
        return {"StatusCode": 401, "Message": "Invalid Payload"}

    if "Source" in event:
        source = event["Source"]["stringValue"]
        img_b64_s, err = fetch_image_bytes(source)
        if img_b64_s is None:
            return {"StatusCode": 500, "Cause": err}
        payload = {**payload, "Payload": img_b64_s, "Content-Type": "image"}
    else:
        return {"StatusCode": 401, "Message": "Invalid Payload"}

    fkey = f"{id}-{model}-{datetime.now(UTC).strftime('%Y-%m-%dT%H:%M:%S')}.json"

    json_data = json.dumps(payload)
    try:
        res = s3.put_object(
            Body=json_data, Bucket=bucket_name, Key=f"{bucket_path}/{fkey}"
        )

        if "ETag" in res:
            response = runtime.invoke_endpoint_async(
                EndpointName=ENDPOINT_NAME,
                ContentType="application/json",
                Accept="application/json",
                InputLocation=f"s3://{bucket_name}/{bucket_path}/{fkey}",  # Dump JSON to S3
            )
            if "InferenceId" not in response:
                return {"StatusCode": 500, **response}
            return {"StatusCode": 200, **response}
        else:
            return {"StatusCode": 500, **res}
    except Exception:
        return {"StatusCode": 500, **res}


def lambda_handler(event, context):
    """ """
    if "Records" not in event:
        return {"StatusCode": 401}
    events = event["Records"]

    results = list(map(handle_event, events))

    print(
        json.dumps(
            {
                "Successes": list(
                    filter(
                        lambda v: "StatusCode" in v and v["StatusCode"] == 200, results
                    )
                ),
                "Errors": list(
                    filter(
                        lambda x: "StatusCode" not in x or x["StatusCode"] != 200,
                        results,
                    )
                ),
            }
        )
    )

    return {"StatusCode": 200}
