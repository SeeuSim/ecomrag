data "aws_iam_policy_document" "async_caption_trigger" {
  statement {
    effect    = "Allow"
    actions   = ["sagemaker:InvokeEndpoint", "sagemaker:InvokeEndpointAsync"]
    resources = [var.async_caption_endpoint_arn]
  }
}

resource "aws_iam_policy" "async_caption_trigger" {
  name   = "allow-put-caption-ep"
  policy = data.aws_iam_policy_document.async_caption_trigger.json
}

data "aws_iam_policy_document" "async_embed_trigger" {
  statement {
    effect    = "Allow"
    actions   = ["sagemaker:InvokeEndpoint", "sagemaker:InvokeEndpointAsync"]
    resources = [var.async_embed_endpoint_arn]
  }
}

resource "aws_iam_policy" "async_embed_trigger" {
  name   = "allow-put-embed-ep"
  policy = data.aws_iam_policy_document.async_embed_trigger.json
}

# Success Handler
resource "aws_iam_role" "model_success_handler" {
  name = "model-success-handler"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

# Failure Handler
resource "aws_iam_role" "model_failure_handler" {
  name = "model-failure-handler"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}


# SQS Caption Handler
resource "aws_iam_role" "sqs_caption_handler" {
  name = "sqs-caption-handler"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "allow_sqs_caption_exec_sm" {
  role       = aws_iam_role.sqs_caption_handler.name
  policy_arn = aws_iam_policy.async_caption_trigger.arn
}

# SQS Embed Handler
resource "aws_iam_role" "sqs_embed_handler" {
  name = "sqs-embed-handler"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "allow_sqs_embed_exec_sm" {
  role       = aws_iam_role.sqs_embed_handler.name
  policy_arn = aws_iam_policy.async_embed_trigger.arn
}

# Service Role Attachments
resource "aws_iam_policy_attachment" "lambda_sqs" {
  name       = "allow-lambda-sqs"
  roles      = [aws_iam_role.sqs_caption_handler.name, aws_iam_role.sqs_embed_handler.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}

resource "aws_iam_policy_attachment" "lambda_exec_role" {
  name = "lambda-basic-exec"
  roles = [
    aws_iam_role.model_failure_handler.name,
    aws_iam_role.model_success_handler.name,
    aws_iam_role.sqs_caption_handler.name,
    aws_iam_role.sqs_embed_handler.name,
  ]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# S3 Upload
data "aws_iam_policy_document" "model_bucket_put" {
  statement {
    effect  = "Allow"
    actions = ["s3:PutObject"]
    resources = [
      "arn:aws:s3:::${var.model_io_bucket}/models/*"
    ]
  }
}

data "aws_iam_policy_document" "model_bucket_read_delete" {
  statement {
    effect  = "Allow"
    actions = ["s3:GetObject", "s3:DeleteObject"]
    resources = [
      "arn:aws:s3:::${var.model_io_bucket}/models/*"
    ]
  }
}

resource "aws_iam_policy" "write_bucket_resources" {
  name   = "create-bucket-resources"
  policy = data.aws_iam_policy_document.model_bucket_put.json
}

resource "aws_iam_policy" "read_delete_bucket_resources" {
  name   = "read-delete-bucket-resources"
  policy = data.aws_iam_policy_document.model_bucket_read_delete.json
}

resource "aws_iam_policy_attachment" "allow_put_object" {
  name = "add-s3-putobject"
  roles = [
    aws_iam_role.sqs_caption_handler.name,
    aws_iam_role.sqs_embed_handler.name,
  ]
  policy_arn = aws_iam_policy.write_bucket_resources.arn
}

resource "aws_iam_policy_attachment" "allow_read_delete" {
  name = "add-s3-read-delete"
  roles = [
    aws_iam_role.model_success_handler.name
  ]
  policy_arn = aws_iam_policy.read_delete_bucket_resources.arn
}