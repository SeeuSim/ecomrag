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

# SQS Caption Handler
data "archive_file" "sqs_caption_handler" {
  type        = "zip"
  source_dir  = "../lmbd/sqs-caption-handler"
  output_path = "../outputs/lmbd-sqs-caption-handler.zip"
}

resource "aws_lambda_function" "sqs_caption_handler" {
  function_name    = "SQS-Caption-Handler"
  role             = aws_iam_role.sqs_caption_handler.arn
  filename         = data.archive_file.sqs_caption_handler.output_path
  handler          = "lambda_handler.lambda_handler"
  runtime          = "python3.11"
  source_code_hash = data.archive_file.sqs_caption_handler.output_base64sha256

  environment {
    variables = {
      "SM_EP_NAME" = "${var.async_caption_endpoint_name}"
    }
  }
}

resource "aws_lambda_event_source_mapping" "sqs_caption_handler" {
  event_source_arn = var.sqs_caption_queue_arn
  function_name    = aws_lambda_function.sqs_caption_handler.function_name
}

# SQS Embed Handler
data "archive_file" "sqs_embed_handler" {
  type        = "zip"
  source_dir  = "../lmbd/sqs-embed-handler"
  output_path = "../outputs/lmbd-sqs-embed-handler.zip"
}

resource "aws_lambda_function" "sqs_embed_handler" {
  function_name    = "SQS-Embed-Handler"
  role             = aws_iam_role.sqs_embed_handler.arn
  filename         = data.archive_file.sqs_embed_handler.output_path
  handler          = "lambda_handler.lambda_handler"
  runtime          = "python3.11"
  source_code_hash = data.archive_file.sqs_embed_handler.output_base64sha256

  environment {
    variables = {
      "SM_EP_NAME" = "${var.async_embed_endpoint_name}"
    }
  }
}

resource "aws_lambda_event_source_mapping" "sqs_embed_handler" {
  event_source_arn = var.sqs_caption_queue_arn
  function_name    = aws_lambda_function.sqs_embed_handler.function_name
}

# Bucket Notifications - For setting up other behavior
resource "aws_s3_bucket" "model_bucket" {
  bucket = var.model_io_bucket
}