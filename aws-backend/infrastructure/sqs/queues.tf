resource "aws_sqs_queue" "caption_queue" {
  name                      = "CaptionQueue"
  message_retention_seconds = 60
  receive_wait_time_seconds = 20
}
resource "aws_sqs_queue" "embed_queue" {
  name                      = "EmbedQueue"
  message_retention_seconds = 60
  receive_wait_time_seconds = 20
}