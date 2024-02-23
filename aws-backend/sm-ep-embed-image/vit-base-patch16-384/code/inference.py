import base64
from io import BytesIO
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


def _load_image(image_bytes: bytes):
    return PILImage.open(BytesIO(image_bytes)).convert("RGB")


def model_fn(model_dir: str) -> ImageEmbedder:
    try:
        return ImageEmbedder(model_dir)
    except Exception:
        logging.exception(f"Failed to load model from: {model_dir}")
        raise


def _input_fn(
        input_data: bytes,
        _content_type: str
):
    try:
        input_data = base64.b64decode(input_data)
        image = _load_image(input_data)
    except Exception:
        logging.exception("Error occurred when loading/decoding")
        raise
    return image


def _predict_fn(
    image: PILImage,
    image_embedder: ImageEmbedder
) -> bytes:
    
    model_output = image_embedder(image)
    output = {"Embeddings": model_output}
    return output


def _output_fn(
        prediction,
        accept
):
    return encoder.encode(prediction, accept)


def transform_fn(
        model: ImageEmbedder,
        data: bytes,
        content_type: bytes,
        accept_type: bytes
):
    inp = _input_fn(data, content_type)
    pred = _predict_fn(inp, model)
    out = _output_fn(pred, accept_type)
    return out
