
resource "aws_sagemaker_model" "async_image_embed" {
  name               = "async-image-embed"
  execution_role_arn = aws_iam_role.model_exec_role.arn

  container {
    image          = var.inference_model_image
    model_data_url = "s3://${var.model_s3_bucket}/${var.async_embed_model_data}"
    environment = {
      HF_TASK                       = "image-classification"
      SAGEMAKER_REGION              = var.region
      SAGEMAKER_CONTAINER_LOG_LEVEL = 20
    }
  }
}

resource "aws_sagemaker_model" "async_image_caption" {
  name               = "async-image-caption"
  execution_role_arn = aws_iam_role.model_exec_role.arn

  container {
    image          = var.inference_model_image
    model_data_url = "s3://${var.model_s3_bucket}/${var.async_caption_model_data}"
    environment = {
      HF_TASK                       = "image-to-text"
      SAGEMAKER_REGION              = var.region
      SAGEMAKER_CONTAINER_LOG_LEVEL = 20
    }
  }
}
