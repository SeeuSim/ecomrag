import base64
import boto3
import logging
import json
import os

# grab environment variables

logger = logging.getLogger()


def lambda_handler(event, context):
    """
    To Test with SQS
    """
    print("Received event: " + json.dumps(event, indent=2))

    # # Lambda will encode file binary, decode for raw bytes
    # if "isBase64Encoded" in event and event["isBase64Encoded"]:
    #     body = base64.b64decode(event['body'])
    # else:
    #     body = event['body']

    # response = runtime.invoke_endpoint(EndpointName=ENDPOINT_NAME,
    #                                    ContentType=event["headers"].get("content-type", "image/jpeg"),
    #                                    Body=body)

    # # print("Received response: {response}".format(response=response))
    # data = response['Body']
    # data = data.read()

    # if type(data) == bytes:
    #     data = data.decode('utf-8') # JSON string

    # return json.loads(data)
