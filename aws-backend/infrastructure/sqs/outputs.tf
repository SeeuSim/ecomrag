output "sqs_caption_queue_arn" {
  value = aws_sqs_queue.caption_queue.arn
}

output "sqs_embed_queue_arn" {
  value = aws_sqs_queue.embed_queue.arn
}