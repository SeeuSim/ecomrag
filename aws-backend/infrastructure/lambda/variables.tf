variable "async_caption_endpoint_arn" {
  type = string
}

variable "async_embed_endpoint_arn" {
  type = string
}

variable "account_id" {
  type = string
}

variable "sqs_caption_queue" {
  type = string
}

variable "sqs_embed_queue" {
  type = string
}

variable "sns_success_topic" {
  type = string
}

variable "sns_failure_topic" {
  type = string
}