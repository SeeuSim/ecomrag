# Caption Trigger
data "aws_iam_policy_document" "async_caption_trigger" {
  statement {
    effect    = "Allow"
    actions   = ["sagemaker:InvokeEndpoint"]
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

resource "aws_iam_policy_attachment" "allow_caption_exec" {
  name       = "allow-invoke-caption-ep"
  roles      = [aws_iam_role.async_caption_trigger_exec.name]
  policy_arn = aws_iam_policy.async_caption_trigger.arn
}
resource "aws_iam_policy_attachment" "allow_caption_lmbd_exec" {
  name       = "allow-invoke-caption-ep-exec"
  roles      = [aws_iam_role.async_caption_trigger_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_iam_policy_attachment" "allow_caption_queue_sub" {
  name       = "allow-caption-queue-sub"
  roles      = [aws_iam_role.async_caption_trigger_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}

# Embed Trigger
data "aws_iam_policy_document" "async_embed_trigger" {
  statement {
    effect    = "Allow"
    actions   = ["sagemaker:InvokeEndpoint"]
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

resource "aws_iam_policy_attachment" "allow_embed_exec" {
  name       = "allow-invoke-caption-ep"
  roles      = [aws_iam_role.async_embed_trigger_exec.name]
  policy_arn = aws_iam_policy.async_embed_trigger.arn
}
resource "aws_iam_policy_attachment" "allow_embed_lmbd_exec" {
  name       = "allow-invoke-caption-ep-exec"
  roles      = [aws_iam_role.async_caption_trigger_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_iam_policy_attachment" "allow_embed_queue_sub" {
  name       = "allow-embed-queue-sub"
  roles      = [aws_iam_role.async_embed_trigger_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
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

resource "aws_iam_policy_attachment" "allow_success_lmbd_exec" {
  name       = "allow-success-lmbd-exec"
  roles      = [aws_iam_role.model_success_handler.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
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

resource "aws_iam_policy_attachment" "allow_sns_invoke_success" {
  name       = "allow-sns-invoke-success"
  roles      = [aws_iam_role.model_success_handler.name]
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

resource "aws_iam_policy_attachment" "allow_failure_lmbd_exec" {
  name       = "allow-failure-lmbd-exec"
  roles      = [aws_iam_role.model_failure_handler.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
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

resource "aws_iam_policy_attachment" "allow_sns_invoke_failure" {
  name       = "allow-sns-invoke-failure"
  roles      = [aws_iam_role.model_failure_handler.name]
  policy_arn = aws_iam_policy.allow_sns_invoke_failure.arn
}
