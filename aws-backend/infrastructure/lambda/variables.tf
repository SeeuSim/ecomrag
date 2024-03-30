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

variable "sqs_caption_queue_arn" {
  type = string
}

variable "sqs_embed_queue_arn" {
  type = string
}

variable "model_io_bucket" {
  type = string
}

variable "backend_ep" {
  type        = string
  description = "The endpoint for the success handler to post the inference result to."
}