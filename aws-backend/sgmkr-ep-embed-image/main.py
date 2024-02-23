from transformers import AutoImageProcessor
from PIL import Image
import sys

#model = "google/vit-base-patch16-224-in21k"
model = "facebook/convnextv2-large-22k-384"

preprocessor = AutoImageProcessor.from_pretrained(model)


def get_embedding(image_path):
    try:
        image = Image.open(image_path).convert("RGB")
    except Exception as e:
        exit(1)
    
    image = image.resize((384, 384))
    tensor = preprocessor(image, return_tensors="pt")
    print(tensor['pixel_values'].shape)


def lambda_handler(request, context):
    pass


if __name__ == "__main__":
    if len(sys.argv) != 2:
        exit(1)
    
    _path = sys.argv[1]
    get_embedding(_path)

