resource "aws_sagemaker_endpoint_configuration" "async_caption_config" {
  name = "async-caption-config"

  production_variants {
    variant_name  = "variant-1"
    model_name    = aws_sagemaker_model.async_image_caption.name
    instance_type = "ml.t3.medium"
  }

  async_inference_config {
    output_config {
      s3_output_path = "s3://${var.model_s3_bucket}/models/caption/outputs"

      notification_config {
        success_topic = ""
        error_topic   = ""
      }
    }
  }
}

resource "aws_sagemaker_endpoint_configuration" "async_embed_config" {
  name = "async-embed-config"

  production_variants {
    variant_name  = "variant-1"
    model_name    = aws_sagemaker_model.async_image_embed.name
    instance_type = "ml.t3.medium"
  }

  async_inference_config {
    output_config {
      s3_output_path = "s3://${var.model_s3_bucket}/models/embed/outputs"

      notification_config {
        success_topic = var.model_success_topic
        error_topic   = var.model_failure_topic
      }
    }
  }
}
