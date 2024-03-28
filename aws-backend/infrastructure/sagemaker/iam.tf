data "aws_iam_policy_document" "model_exec_allow_all" {
  statement {
    actions   = ["*"]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "model_exec_allow_all" {
  name   = "model-exec-allow-all"
  policy = data.aws_iam_policy_document.model_exec_allow_all.json
}

resource "aws_iam_role" "model_exec_role" {
  name = "iam-sm-model-exec"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "sagemaker.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_policy_attachment" "model_exec_allow_all" {
  name       = aws_iam_policy.model_exec_allow_all.name
  roles      = [aws_iam_role.model_exec_role.name]
  policy_arn = aws_iam_policy.model_exec_allow_all.arn
}

resource "aws_iam_policy_attachment" "sagemaker_full_access" {
  name       = "sagemaker-full-access"
  roles      = [aws_iam_role.model_exec_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonSageMakerFullAccess"
}
