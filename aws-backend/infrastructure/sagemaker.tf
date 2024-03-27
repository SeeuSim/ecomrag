data "aws_iam_policy_document" "model_exec_allow_all" {
  statement {
    actions   = ["*"]
    resources = ["*"]
  }
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

  inline_policy {
    name   = "allow-all"
    policy = data.aws_iam_policy_document.model_exec_allow_all.json
  }
}

resource "aws_sagemaker_model" "async_image_embed" {
  name               = "async-image-embed"
  execution_role_arn = ""

  container {
    image          = var.inference_model_image
    model_data_url = "${var.model_s3_bucket}${var.async_embed_model_data}"
    environment = {
      HF_TASK                       = "image-classification"
      SAGEMAKER_REGION              = var.region
      SAGEMAKER_CONTAINER_LOG_LEVEL = 20
    }
  }
}

resource "aws_sagemaker_model" "async_image_caption" {
  name               = "async-image-caption"
  execution_role_arn = ""
  container {
    image          = var.inference_model_image
    model_data_url = "${var.model_s3_bucket}${var.async_caption_model_data}"
    environment = {
      HF_TASK                       = "image-to-text"
      SAGEMAKER_REGION              = var.region
      SAGEMAKER_CONTAINER_LOG_LEVEL = 20
    }
  }
}
