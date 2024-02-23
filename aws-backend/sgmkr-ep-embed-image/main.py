import base64
import io
import json
import logging

from numpy import ndarray
from PIL import Image
from transformers import AutoImageProcessor, AutoModel

logger = logging.getLogger()

# model_name = "google/vit-base-patch16-224-in21k"
# model_name = "google/vit-large-patch16-384"  # Finetuned on 384x384 images
model_path = "./model"
feature_extractor = AutoImageProcessor.from_pretrained(model_path)
model = AutoModel.from_pretrained(model_path)


def extract_embeddings(image):
    image_pp = feature_extractor(image, return_tensors="pt")
    features = model(**image_pp).last_hidden_state[:, 0].detach().numpy()
    return features.squeeze()


def lambda_handler(request, _context):
    """
    Given a payload with a base64 encoded image in the "content" key,
    decodes it and computes an image embedding of length 1024, using
    the Google ViT-Large model finetuned on 384x384 dimension images.

    :params:
        request: dict
            The request payload. Contains the following keys:
                "content": str
                    The image payload, encoded as base64.

    :returns:
        dict
            The result payload, including the following keys:
                "StatusCode": int
                    The HTTP Status Code for the request.
                "Embedding": list[int]
                    The embeddings, an array of length 1024.
    """
    try:
        file_content = base64.b64decode(request["content"])
    except KeyError:
        logger.error("[main] Invalid payload")
        return {"StatusCode": 400}
    try:
        image = Image.open(io.BytesIO(file_content))
    except Exception as e:
        logger.error("[main] Error writing file")
        return {"StatusCode": 500}
    embeddings = extract_embeddings(image)

    if type(embeddings) != ndarray:
        logger.error(
            "[main] Unknown return type of function: Expected: {expected}, Got: {actual}".format(
                expected=ndarray, actual=type(embeddings)
            )
        )

        return {"StatusCode": 500}

    elif embeddings.shape != (1024,):
        logger.error(
            "[main] Expected embeddings shape of (1024,), got: {shape}".format(
                embeddings.shape
            )
        )

        return {"StatusCode": 500}

    return {"StatusCode": 200, "Embedding": json.dumps(str(list(embeddings)))}


"""
# local testing

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        exit(1)

    _path = sys.argv[1]
    with open(_path, "rb") as f:
        b = f.read()
        img = base64.b64encode(b)
        payload = {"content": img}
    print(lambda_handler(payload, None))

"""
