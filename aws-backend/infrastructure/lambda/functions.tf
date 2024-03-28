data "archive_file" "async_embed_trigger" {
  type = "zip"

  source_file = "`../lmbd/async-trigger-embed-image"
  output_path = "../outputs/lmbd-async-embed-trigger.zip"
}

resource "aws_lambda_function" "async_embed_trigger" {
  function_name = "SQS-Trigger-Embed"
  role          = aws_iam_role.async_embed_trigger_exec.arn
  filename      = data.archive_file.async_embed_trigger.output_path
  handler       = "lambda_handler.lambda_handler"
  runtime       = "python3.11"
}

resource "aws_lambda_event_source_mapping" "embed_trigger" {
  event_source_arn = var.sqs_embed_queue
  function_name    = aws_lambda_function.async_embed_trigger.function_name
}

data "archive_file" "async_caption_trigger" {
  type = "zip"

  source_file = "../lmbd/async-trigger-image-caption"
  output_path = "../outputs/lmbd-async-caption-trigger.zip"
}

resource "aws_lambda_function" "async_caption_trigger" {
  function_name = "SQS-Trigger-Caption"
  role          = aws_iam_role.async_caption_trigger_exec.arn
  filename      = data.archive_file.async_caption_trigger.output_path
  handler       = "lambda_handler.lambda_handler"
  runtime       = "python3.11"
}

resource "aws_lambda_event_source_mapping" "caption_trigger" {
  event_source_arn = var.sqs_caption_queue
  function_name    = aws_lambda_function.async_caption_trigger.function_name
}
