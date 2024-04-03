variable "statebucket" {
  type    = string
  default = "ecomragdev"
}

variable "account_id" {
  type = number
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "inference_model_image_acct" {
  type = string
}
variable "inference_model_image_region" {
  type = string
}
variable "inference_model_py_version" {
  type = string
}
variable "inference_model_transformers_version" {
  type = string
}
variable "inference_model_pytorch_version" {
  type = string
}
variable "inference_model_ubuntu_version" {
  type = string
}

variable "model_s3_bucket" {
  type = string
}
variable "async_embed_model_data" {
  type = string
}
variable "async_caption_model_data" {
  type = string
}

variable "backend_ep_dev" {
  type        = string
  description = "The endpoint for the success handler to post the inference result to."
}
variable "backend_ep_prod" {
  type        = string
  description = "The endpoint for the success handler to post the inference result to."
}

