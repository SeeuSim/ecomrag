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
  name       = "allow-invoke-caption-ep"
  roles      = [aws_iam_role.async_caption_trigger_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_iam_policy_attachment" "allow_caption_queue_sub" {
  name       = "allow-caption-queue-sub"
  roles      = [aws_iam_role.async_caption_trigger_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
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
  name       = "allow-invoke-caption-ep"
  roles      = [aws_iam_role.async_caption_trigger_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_iam_policy_attachment" "allow_embed_queue_sub" {
  name       = "allow-embed-queue-sub"
  roles      = [aws_iam_role.async_embed_trigger_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}