variable "async_caption_endpoint_arn" {
  type = string
}

variable "async_embed_endpoint_arn" {
  type = string
}

variable "async_caption_endpoint_name" {
  type = string
}

variable "async_embed_endpoint_name" {
  type = string
}

variable "account_id" {
  type = string
}

variable "sns_success_topic" {
  type = string
}

variable "sns_failure_topic" {
  type = string
}

variable "sns_caption_topic" {
  type = string
}

variable "sns_embed_topic" {
  type = string
}

variable "model_io_bucket" {
  type = string
}

variable "backend_ep" {
  type        = string
  description = "The endpoint for the success handler to post the inference result to."
}