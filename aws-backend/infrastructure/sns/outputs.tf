output "success_topic_arn" {
  value = aws_sns_topic.model_success_topic.arn
}

output "failure_topic_arn" {
  value = aws_sns_topic.model_failure_topic.arn
}