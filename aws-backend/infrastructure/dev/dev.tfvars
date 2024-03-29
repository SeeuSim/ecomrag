account_id = 058264360377
region     = "us-east-1"

# The docker images for the Sagemaker Model Inference
inference_model_image_acct           = "763104351884"
inference_model_image_region         = "us-east-1"
inference_model_py_version           = "39"
inference_model_transformers_version = "4.26"
inference_model_pytorch_version      = "1.13"
inference_model_ubuntu_version       = "20.04"

model_s3_bucket          = "ecomragdev"
async_embed_model_data   = "models/clip-vit-base-patch32-async.tar.gz"
async_caption_model_data = "models/git-base-async.tar.gz"

backend_ep = "ecomrag--development.gadget.app/batch-update/add-inference-result"
