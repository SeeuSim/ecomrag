import boto3
import json
import os
import urllib3

http = urllib3.PoolManager()

BACKEND_UPDATE_EP_DEV = os.environ.get("BACKEND_EP_DEV", "")
BACKEND_UPDATE_EP_PROD = os.environ.get("BACKEND_EP_PROD", "")

s3 = boto3.client("s3")


def get_field(model, val):
    if model == "shopifyProduct":
        return "descriptionEmbedding"
    if model == "shopifyProductImage":
        if type(val) == str:
            return "imageDescription"
        return "imageDescriptionEmbedding"


event_schema = {
    "EventSource": "aws:sns",
    "EventVersion": "1.0",
    "EventSubscriptionArn": "arn:aws:sns:us-east-1:...",
    "Sns": {
        "Type": "Notification",
        "MessageId": "",
        "TopicArn": "arn:aws:sns:us-east-1:...",
        "Subject": None,
        "Message": {  # JSON String, need to dump first
            "awsRegion": "us-east-1",
            "eventTime": "2024-03-29T03:48:05.077Z",
            "receivedTime": "2024-03-29T03:48:04.279Z",
            "invocationStatus": "Completed",
            "requestParameters": {
                "accept": "application/json",
                "contentType": "application/json",
                "endpointName": "async-embed-endpoint",
                "inputLocation": "s3://{BucketName}/{Key}",
            },
            "responseParameters": {
                "contentType": "application/json",
                "outputLocation": "s3://{BucketName}/{Key}",
            },
            "inferenceId": "",
            "eventVersion": "1.0",
            "eventSource": "aws:sagemaker",
            "eventName": "InferenceResult",
        },
        "Timestamp": "2024-03-29T03:48:05.145Z",
        "SignatureVersion": "1",
        "Signature": "",
        "SigningCertUrl": "",
        "UnsubscribeUrl": "",
        "MessageAttributes": {},
    },
}


def get_payload(s3_loc):
    try:
        s3_loc = s3_loc.replace("s3://", "")
        bucket, path = s3_loc.split("/", 1)
        res = s3.get_object(Bucket=bucket, Key=path)
        body = res["Body"]
        data = body.read()
        payload = json.loads(data)
        return payload
    except Exception as e:
        raise Exception(f"Error retrieving `s3://{s3_loc}`, {e}")


def delete_payload(s3_loc: str):
    try:
        s3_loc = s3_loc.replace("s3://", "")
        bucket, path = s3_loc.split("/", 1)
        s3.delete_object(Bucket=bucket, Key=path)
    except Exception as e:
        raise Exception(f"Error deleting `s3://{s3_loc}`, {e}")


def process_event(event):
    if "Sns" not in event:
        return {"StatusCode": 401, "Reason": "Wrong Params"}
    sns_payload = event["Sns"]
    if "Message" not in sns_payload:
        return {"StatusCode": 401, "Reason": "No Message"}
    message = sns_payload["Message"]
    try:
        message = json.loads(message)
        if (
            "invocationStatus" not in message
            or message["invocationStatus"] != "Completed"
        ):
            return {"StatusCode": 500, "Reason": sns_payload["Message"]}

        if "requestParameters" in message:
            req_params = message["requestParameters"]
            # Delete Input Loc
            if "inputLocation" in req_params:
                inp_loc = req_params["inputLocation"]
                delete_payload(inp_loc)

        result = {}

        if "responseParameters" in message:
            # Process and delete output loc
            res_params = message["responseParameters"]
            if "outputLocation" in res_params:
                out_loc = res_params["outputLocation"]
                result = {**result, **get_payload(out_loc)}
                delete_payload(out_loc)

        # Process result and post to Gadget
        id = result["Id"]
        model = result["Model"]
        env = result["Environment"]
        res = result["Result"]
        if "Embedding" in res:
            val = res["Embedding"]
        elif "Caption" in res:
            val = res["Caption"]

        field = get_field(model, val)

        req_payload = {"id": id, "model": model, "value": val, "field": field}
        endpoint = BACKEND_UPDATE_EP_DEV if env == 'development' else BACKEND_UPDATE_EP_PROD
        request = http.request(
            "POST",
            endpoint,
            body=json.dumps({
                "isBatch": False,
                "payload": req_payload,
            }),
            headers={"Content-Type": "application/json"},
        )
        if request.status > 299:
            return {"StatusCode": request.status, **request}
        return {"StatusCode": 200, **req_payload}
    except Exception as e:
        return {"StatusCode": 500, "Reason": e}


def lambda_handler(event, context):
    """
    To Test with SNS
    """
    if len(BACKEND_UPDATE_EP_DEV) == 0:
        print("Backend endpoint not configured")
        return {"StatusCode": 500, "Message": "Backend endpoint not configured."}

    if "Records" not in event:
        return {"StatusCode": 401}
    inv_results = event["Records"]

    proc_results = list(map(process_event, inv_results))

    successes = list(
        filter(lambda x: x["StatusCode"] >= 200 and x["StatusCode"] < 300, proc_results)
    )
    failures = list(
        filter(lambda x: x["StatusCode"] >= 300 or x["StatusCode"] < 200, proc_results)
    )

    print("Processed successfully: " + json.dumps(successes))
    print("Processing errors: " + f"{failures}")

    return {"Successes": successes, "Failures": failures}
