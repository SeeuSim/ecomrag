resource "aws_sns_topic" "model_success_topic" {
  name = "async-model-success"
}
resource "aws_sns_topic" "model_failure_topic" {
  name = "async-model-failure"
}