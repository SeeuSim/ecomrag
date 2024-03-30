import base64
import json
import logging
from io import BytesIO
from typing import Any

import torch
from PIL import Image
from sagemaker_inference import encoder
from transformers import AutoModelForCausalLM, AutoProcessor

logger = logging.getLogger()

# model = "microsoft/git-base"


class GitBaseImageCaptioner:
    def __init__(self, model_dir: str, **kwargs: Any) -> None:
        self.device = (
            torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
        )
        logger.info(f"Using device: {self.device}")

        self.processor = AutoProcessor.from_pretrained(model_dir)
        self.model = AutoModelForCausalLM.from_pretrained(model_dir).to(self.device)

    def get_single_image_caption(self, image: Image):
        pixel_values = self.processor(images=image, return_tensors="pt").pixel_values
        generated_ids = self.model.generate(pixel_values=pixel_values, max_length=50)
        caption = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[
            0
        ]
        return caption


def model_fn(model_dir: str) -> GitBaseImageCaptioner:
    try:
        return GitBaseImageCaptioner(model_dir)
    except Exception:
        logging.exception(f"Failed to load model from: {model_dir}")
        raise


def transform_fn(
    model: GitBaseImageCaptioner, data: bytes, content_type: bytes, accept_type: bytes
):
    encode_output = lambda v: encoder.encode(v, accept_type)
    try:
        body = json.loads(data)

        # Image Processing
        payload = body["Payload"]
        img_bytes = base64.b64decode(payload)
        data = BytesIO(img_bytes)
        img = Image.open(data)
        caption = model.get_single_image_caption(img)
        
        output = {
            "Id": body.get("Id", ""),
            "Model": body.get("Model", ""),
            # Model Output
            "Result": {
                "Caption": caption,
                "Length": len(caption) if type(caption) == str else 0,
            },
        }
        return encode_output(output)
    except Exception:
        logging.error("An error occurred in processing the data")
        raise
