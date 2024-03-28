output "sns_model_success_topic" {
  value = aws_sns_topic.model_success_topic.arn
}

output "sns_model_failure_topic" {
  value = aws_sns_topic.model_failure_topic.arn
}
