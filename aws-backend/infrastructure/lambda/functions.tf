# Put Embed Payload
data "archive_file" "async_embed_trigger" {
  type = "zip"

  source_dir  = "../lmbd/async-embed-trigger"
  output_path = "../outputs/async-embed-trigger.zip"
}

resource "aws_lambda_function" "async_embed_trigger" {
  function_name    = "SNS-Embed-Trigger"
  role             = aws_iam_role.async_embed_trigger_exec.arn #
  filename         = data.archive_file.async_embed_trigger.output_path
  handler          = "lambda_handler.lambda_handler"
  runtime          = "python3.11"
  source_code_hash = data.archive_file.async_embed_trigger.output_base64sha256

  environment {
    variables = {
      "SM_EP_NAME" = "${var.async_embed_endpoint_name}"
    }
  }
}

# Put Caption Payload
data "archive_file" "async_caption_trigger" {
  type = "zip"

  source_dir  = "../lmbd/async-caption-trigger"
  output_path = "../outputs/async-caption-trigger.zip"
}

resource "aws_lambda_function" "async_caption_trigger" {
  function_name    = "SNS-Caption-Trigger"
  role             = aws_iam_role.async_caption_trigger_exec.arn #
  filename         = data.archive_file.async_caption_trigger.output_path
  handler          = "lambda_handler.lambda_handler"
  runtime          = "python3.11"
  source_code_hash = data.archive_file.async_caption_trigger.output_base64sha256

  environment {
    variables = {
      "SM_EP_NAME" = "${var.async_caption_endpoint_name}"
    }
  }
}

# Model Failure
data "archive_file" "model_failure_handler" {
  type = "zip"

  source_dir  = "../lmbd/failure-result-handler"
  output_path = "../outputs/lmbd-failure-result-handler.zip"
}

resource "aws_lambda_function" "model_failure_handler" {
  function_name    = "SNS-Subscribe-Errors"
  role             = aws_iam_role.model_failure_handler.arn
  filename         = data.archive_file.model_failure_handler.output_path
  handler          = "lambda_handler.lambda_handler"
  runtime          = "python3.11"
  source_code_hash = data.archive_file.model_failure_handler.output_base64sha256
}

# Model Success
data "archive_file" "model_success_handler" {
  type = "zip"

  source_dir  = "../lmbd/success-result-handler"
  output_path = "../outputs/lmbd-success-result-handler.zip"
}

resource "aws_lambda_function" "model_success_handler" {
  function_name    = "SNS-Subscribe-Results"
  role             = aws_iam_role.model_success_handler.arn
  filename         = data.archive_file.model_success_handler.output_path
  handler          = "lambda_handler.lambda_handler"
  runtime          = "python3.11"
  source_code_hash = data.archive_file.model_success_handler.output_base64sha256

  environment {
    variables = {
      "BACKEND_EP" = var.backend_ep
    }
  }
}

# SNS Subscriptions Caption
resource "aws_sns_topic_subscription" "caption_sub" {
  topic_arn = var.sns_caption_topic
  protocol  = "lambda"
  endpoint  = aws_lambda_function.async_caption_trigger.arn
}

resource "aws_lambda_permission" "caption_sub" {
  statement_id  = "AllowSubscriptionToSNS"
  count         = 1
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.async_caption_trigger.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.sns_caption_topic
}

# SNS Subscriptions Embed
resource "aws_sns_topic_subscription" "embed_sub" {
  topic_arn = var.sns_embed_topic
  protocol  = "lambda"
  endpoint  = aws_lambda_function.async_embed_trigger.arn
}

resource "aws_lambda_permission" "embed_sub" {
  statement_id  = "AllowSubscriptionToSNS"
  count         = 1
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.async_embed_trigger.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.sns_embed_topic
}

# SNS Subscriptions Success
resource "aws_sns_topic_subscription" "success_sub" {
  topic_arn = var.sns_success_topic
  protocol  = "lambda"
  endpoint  = aws_lambda_function.model_success_handler.arn
}

resource "aws_lambda_permission" "success" {
  count         = 1
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.model_success_handler.function_name
  principal     = "sns.amazonaws.com"
  statement_id  = "AllowSubscriptionToSNS"
  source_arn    = var.sns_success_topic
}

# SNS Subscriptions Failure
resource "aws_sns_topic_subscription" "failure_sub" {
  topic_arn = var.sns_failure_topic
  protocol  = "lambda"
  endpoint  = aws_lambda_function.model_failure_handler.arn
}

resource "aws_lambda_permission" "failure" {
  count         = 1
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.model_failure_handler.function_name
  principal     = "sns.amazonaws.com"
  statement_id  = "AllowSubscriptionToSNS"
  source_arn    = var.sns_failure_topic
}

# Bucket Notifications - For setting up other behavior
resource "aws_s3_bucket" "model_bucket" {
  bucket = var.model_io_bucket
}