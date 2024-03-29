data "archive_file" "async_embed_trigger" {
  type = "zip"

  source_dir  = "../lmbd/async-trigger-embed-image"
  output_path = "../outputs/lmbd-async-embed-trigger.zip"
}

resource "aws_lambda_function" "async_embed_trigger" {
  function_name    = "SQS-Trigger-Embed"
  role             = aws_iam_role.async_embed_trigger_exec.arn
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

resource "aws_lambda_event_source_mapping" "embed_trigger" {
  event_source_arn = var.sqs_embed_queue
  function_name    = aws_lambda_function.async_embed_trigger.function_name
}

data "archive_file" "async_caption_trigger" {
  type = "zip"

  source_dir  = "../lmbd/async-trigger-image-caption"
  output_path = "../outputs/lmbd-async-caption-trigger.zip"
}

resource "aws_lambda_function" "async_caption_trigger" {
  function_name    = "SQS-Trigger-Caption"
  role             = aws_iam_role.async_caption_trigger_exec.arn
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

resource "aws_lambda_event_source_mapping" "caption_trigger" {
  event_source_arn = var.sqs_caption_queue
  function_name    = aws_lambda_function.async_caption_trigger.function_name
}

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
}