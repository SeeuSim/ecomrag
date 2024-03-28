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

variable "success_topic_arn" {
  type = string
}

variable "failure_topic_arn" {
  type = string
}
