import base64
import boto3
import logging
import json
import os
import urllib3


def process_event(event):
    event = {
        "Records": [
            {
                "EventSource": "aws:sns",
                "EventVersion": "1.0",
                "EventSubscriptionArn": "arn:aws:sns:us-east-1:058264360377:async-model-success:de45de0b-be5f-42a4-8e94-8007db259ca5",
                "Sns": {
                    "Type": "Notification",
                    "MessageId": "35841ea0-745d-50c6-b523-402048683c9f",
                    "TopicArn": "arn:aws:sns:us-east-1:058264360377:async-model-success",
                    "Subject": None,
                    "Message": '{"awsRegion":"us-east-1","eventTime":"2024-03-29T03:48:05.077Z","receivedTime":"2024-03-29T03:48:04.279Z","invocationStatus":"Completed","requestParameters":{"accept":"application/json","contentType":"application/json","endpointName":"async-embed-endpoint","inputLocation":"s3://ecomragdev/models/embed/inputs/30258695110750-shopifyProductImage-2024-03-29 03:48:03.json"},"responseParameters":{"contentType":"application/json","outputLocation":"s3://ecomragdev/models/embed/outputs/dd334eb2-0276-4107-972a-280e0eecfd30.out"},"inferenceId":"03a98604-cf1f-44d1-b9c4-801dcbbe792b","eventVersion":"1.0","eventSource":"aws:sagemaker","eventName":"InferenceResult"}',
                    "Timestamp": "2024-03-29T03:48:05.145Z",
                    "SignatureVersion": "1",
                    "Signature": "rDXlRGECX1AQed+Wm7U51mQ+PFSC/k015rQCE3CWMQooVtZ24LT2POgWHuHUrLxnUpt5vipD9+8vw2cUmF3WvSYsG4mw/YptVt06LOCkH4uBJ+TrgdLKtsgetHgt2hkPmt/yLnUQ8SlopXMjz4TwubSOf4q59HQrAMZX7VzOaqN5KnV0y+ruJ2M/hT9yc0qhXf2/bNCZpWw3PgodP1Mq0vzB3uJQFa/lcDFpvN6hTLrFk1rvqtcR/vVXTOERvzRxrRGsGODy6zqyHmUXhIKuK2UOiqZRrf/GbcsMlE6ONArir4EcdqIDU/Rq6jlua3ZekzBU4a7xvstOdCZjgftJQQ==",
                    "SigningCertUrl": "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-60eadc530605d63b8e62a523676ef735.pem",
                    "UnsubscribeUrl": "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:058264360377:async-model-success:de45de0b-be5f-42a4-8e94-8007db259ca5",
                    "MessageAttributes": {},
                },
            }
        ]
    }


def lambda_handler(event, context):
    """
    To Test with SNS
    """
    if "Records" not in event:
        return {"StatusCode": 401}
    results = event["Records"]

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
