import base64
from io import BytesIO
import json
import logging
import torch

from PIL import Image as PILImage
from typing import Any
from sagemaker_inference import encoder
from transformers import AutoModel, AutoImageProcessor


class ImageEmbedder:
    def __init__(self, model_dir: str, **kwargs: Any) -> None:
        self.device = (
            torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
        )
        logging.info(f"Using device: {self.device}")

        self.tokenizer = AutoImageProcessor.from_pretrained(model_dir)
        self.model = AutoModel.from_pretrained(model_dir)
        self.model = self.model.to(self.device)

    def __call__(self, image: PILImage):
        image_pp = self.tokenizer(image, return_tensors="pt")
        features = self.model(**image_pp).last_hidden_state[:, 0].detach().numpy()
        return features.squeeze()


def model_fn(model_dir: str) -> ImageEmbedder:
    try:
        return ImageEmbedder(model_dir)
    except Exception:
        logging.exception(f"Failed to load model from: {model_dir}")
        raise


def _load_image(image_bytes: bytes):
    return PILImage.open(BytesIO(image_bytes)).convert("RGB")


def transform_fn(
    image_embedder: ImageEmbedder, input_data: bytes, content_type: str, accept: str
) -> bytes:
    try:
        image = _load_image(input_data)
    except KeyError:
        logging.exception("Invalid params: {params}".format(params=input_data))
        raise
    except Exception:
        logging.exception("Error occurred when loading/decoding")
        raise
    
    model_output = image_embedder(image)
    output = {"Embeddings": model_output}
    return encoder.encode(output, accept)
