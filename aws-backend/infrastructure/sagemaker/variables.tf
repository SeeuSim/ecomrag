variable "region" {
  type = string
}

variable "inference_model_image" {
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

variable "model_success_topic" {
  type = string
}

variable "model_failure_topic" {
  type = string
}
