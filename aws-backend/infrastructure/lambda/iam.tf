# Caption Trigger
data "aws_iam_policy_document" "async_caption_trigger" {
  statement {
    effect    = "Allow"
    actions   = ["sagemaker:InvokeEndpoint", "sagemaker:InvokeEndpointAsync"]
    resources = [var.async_caption_endpoint_arn]
  }
}

resource "aws_iam_policy" "async_caption_trigger" {
  name   = "allow-invoke-caption-ep"
  policy = data.aws_iam_policy_document.async_caption_trigger.json
}

resource "aws_iam_role" "async_caption_trigger_exec" {
  name = "async-caption-trigger-exec"
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

resource "aws_iam_role_policy_attachment" "allow_caption_exec_sm" {
  role       = aws_iam_role.async_caption_trigger_exec.name
  policy_arn = aws_iam_policy.async_caption_trigger.arn
}

resource "aws_iam_role_policy_attachment" "allow_caption_queue_sub" {
  role       = aws_iam_role.async_caption_trigger_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}

# Embed Trigger
data "aws_iam_policy_document" "async_embed_trigger" {
  statement {
    effect    = "Allow"
    actions   = ["sagemaker:InvokeEndpoint", "sagemaker:InvokeEndpointAsync"]
    resources = [var.async_embed_endpoint_arn]
  }
}

resource "aws_iam_policy" "async_embed_trigger" {
  name   = "allow-invoke-embed-ep"
  policy = data.aws_iam_policy_document.async_embed_trigger.json
}

resource "aws_iam_role" "async_embed_trigger_exec" {
  name = "async-embed-trigger-exec"
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

resource "aws_iam_role_policy_attachment" "allow_embed_exec" {
  role       = aws_iam_role.async_embed_trigger_exec.name
  policy_arn = aws_iam_policy.async_embed_trigger.arn
}

resource "aws_iam_role_policy_attachment" "allow_embed_queue_sub" {
  role       = aws_iam_role.async_embed_trigger_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
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
    aws_iam_role.async_caption_trigger_exec.name,
    aws_iam_role.async_embed_trigger_exec.name,
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

resource "aws_iam_policy" "allow_sns_invoke_success" {
  name = "AllowSNSInvokeSuccess"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "FunctionWithSnsSuccess",
        "Condition" : {
          "ArnLike" : {
            "AWS:SourceArn" : "${var.sns_success_topic}"
          }
        },
        "Action" : ["lambda:InvokeFunction"],
        "Resource" : "${aws_lambda_function.model_success_handler.arn}",
        "Effect" : "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "allow_sns_invoke_success" {
  role       = aws_iam_role.model_success_handler.name
  policy_arn = aws_iam_policy.allow_sns_invoke_success.arn
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

resource "aws_iam_policy" "allow_sns_invoke_failure" {
  name = "AllowSNSInvokeFailure"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "FunctionWithSnsFailure",
        "Condition" : {
          "ArnLike" : {
            "AWS:SourceArn" : "${var.sns_failure_topic}"
          }
        },
        "Action" : ["lambda:InvokeFunction"],
        "Resource" : "${aws_lambda_function.model_failure_handler.arn}",
        "Effect" : "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "allow_sns_invoke_failure" {
  role       = aws_iam_role.model_failure_handler.name
  policy_arn = aws_iam_policy.allow_sns_invoke_failure.arn
}

resource "aws_iam_policy_attachment" "lambda_exec_role" {
  name = "lambda-basic-exec"
  roles = [
    aws_iam_role.async_caption_trigger_exec.name,
    aws_iam_role.async_embed_trigger_exec.name,
    aws_iam_role.model_failure_handler.name,
    aws_iam_role.model_success_handler.name
  ]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy_attachment" "lambda_sqs_role" {
  name = "lambda-sqs"
  roles = [
    aws_iam_role.async_caption_trigger_exec.name,
    aws_iam_role.async_embed_trigger_exec.name
  ]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}
