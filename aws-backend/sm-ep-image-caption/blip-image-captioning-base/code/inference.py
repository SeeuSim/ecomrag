import logging
from io import BytesIO
from typing import Any

import torch
from PIL import Image
from sagemaker_inference import encoder
from transformers import BlipProcessor, BlipForConditionalGeneration

logger = logging.getLogger()

# model = "Salesforce/blip-image-captioning-base"
class BLIPImageCaptioner:
    def __init__(self, model_dir: str, **kwargs: Any) -> None:
        self.device = (
            torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
        )
        logger.info(f"Using device: {self.device}")

        self.processor = BlipProcessor.from_pretrained(model_dir)
        self.model = BlipForConditionalGeneration.from_pretrained(
            model_dir, torch_dtype=torch.float16
        ).to(self.device)

    def get_single_image_caption(self, image: Image):
        inputs = self.processor(image, return_tensors="pt").to(
            self.device, torch.float16
        )
        out = self.model.generate(**inputs)
        caption = self.processor.decode(out[0], skip_special_tokens=True)
        return caption

def model_fn(model_dir: str) -> BLIPImageCaptioner:
    try:
        return BLIPImageCaptioner(model_dir)
    except Exception:
        logging.exception(f"Failed to load model from: {model_dir}")
        raise


def transform_fn(
    model: BLIPImageCaptioner, data: bytes, content_type: bytes, accept_type: bytes
):
    encode_output = lambda v: encoder.encode(v, accept_type)
    try:
        data = BytesIO(data)
        img = Image.open(data)
        caption = model.get_single_image_caption(img)
        output = {"Caption": caption, "Length": len(caption) if type(caption) == str else 0}
        return encode_output(output)
    except Exception:
        logging.error("An error occurred in processing the data")
        raise
