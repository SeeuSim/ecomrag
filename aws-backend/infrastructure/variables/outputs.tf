output "inference_model_image" {
  value = "${var.inference_model_image_acct}.dkr.ecr.${var.inference_model_image_region}.amazonaws.com/huggingface-pytorch-inference:${var.inference_model_pytorch_version}-transformers${var.inference_model_transformers_version}-cpu-py${var.inference_model_py_version}-ubuntu${var.inference_model_ubuntu_version}"
}