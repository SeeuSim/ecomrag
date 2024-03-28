output "caption_queue_arn" {
  value = aws_sqs_queue.async_caption_queue.arn
}

output "embed_queue_arn" {
  value = aws_sqs_queue.async_embed_queue.arn
}


