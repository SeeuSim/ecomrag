resource "aws_sqs_queue" "async_caption_queue" {
  name                        = "CaptionQueue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
}

resource "aws_sqs_queue" "async_embed_queue" {
  name                        = "EmbedQueue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
}
