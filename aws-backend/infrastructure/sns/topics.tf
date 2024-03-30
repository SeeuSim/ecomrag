resource "aws_sns_topic" "model_success_topic" {
  name = "async-model-success"
}
resource "aws_sns_topic" "model_failure_topic" {
  name = "async-model-failure"
}

resource "aws_sns_topic" "embed_topic" {
  name = "queue-embed-job"
}

resource "aws_sns_topic" "caption_topic" {
  name = "queue-caption-job"
}