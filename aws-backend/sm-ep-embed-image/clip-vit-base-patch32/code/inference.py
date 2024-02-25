import logging
from io import BytesIO
from typing import Any

import numpy as np
import torch
from PIL import Image
from sagemaker_inference import encoder
from transformers import CLIPModel, CLIPProcessor, CLIPTokenizer

logger = logging.getLogger()

class CLIPEmbedder:
    def __init__(self, model_dir: str, **kwargs: Any) -> None:
        self.device = (
            torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
        )
        logger.info(f"Using device: {self.device}")

        self.model = CLIPModel.from_pretrained(model_dir).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(model_dir)
        self.tokenizer = CLIPTokenizer.from_pretrained(model_dir)

    def get_single_text_embedding(self, text: str):
        inputs = self.tokenizer(text, return_tensors="pt")
        text_embeddings = self.model.get_text_features(**inputs)
        # convert the embeddings to numpy array
        embedding_as_np = text_embeddings.to(self.device).detach().numpy()
        return embedding_as_np.squeeze()

    def get_single_image_embedding(self, image: Image):
        image = self.processor(text=None, images=image, return_tensors="pt")[
            "pixel_values"
        ].to(self.device)
        embedding = self.model.get_image_features(image)
        # convert the embeddings to numpy array
        embedding_as_np = embedding.to(self.device).detach().numpy()
        return embedding_as_np.squeeze()


def model_fn(model_dir: str) -> CLIPEmbedder:
    try:
        return CLIPEmbedder(model_dir)
    except Exception:
        logging.exception(f"Failed to load model from: {model_dir}")
        raise


def transform_fn(
    model: CLIPEmbedder, data: bytes, content_type: bytes, accept_type: bytes
):
    encode_output = lambda v: encoder.encode(v, accept_type)
    try:
        if content_type == "text/plain":
            data = data.decode("utf-8")
            embedding = model.get_single_text_embedding(data)
            output = {"Embedding": embedding, "Length": len(embedding)}
            return encode_output(output)

        data = BytesIO(data)
        img = Image.open(data)
        embedding = model.get_single_image_embedding(img)
        output = {"Embedding": embedding, "Length": len(embedding)}
        return encode_output(output)
    except Exception:
        logging.error("An error occurred in processing the data")
        raise