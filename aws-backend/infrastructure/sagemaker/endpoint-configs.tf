resource "aws_sagemaker_endpoint_configuration" "async_caption_config" {
  name = "async-caption-config"

  production_variants {
    variant_name           = "variant-1"
    model_name             = aws_sagemaker_model.async_image_caption.name
    instance_type          = "ml.t2.medium"
    initial_instance_count = 1
  }

  async_inference_config {
    output_config {
      s3_output_path = "s3://${var.model_s3_bucket}/models/caption/outputs"

      notification_config {
        success_topic = var.success_topic_arn
        error_topic   = var.failure_topic_arn
      }
    }
  }
}

resource "aws_sagemaker_endpoint_configuration" "async_embed_config" {
  name = "async-embed-config"

  production_variants {
    variant_name           = "variant-1"
    model_name             = aws_sagemaker_model.async_image_embed.name
    instance_type          = "ml.t2.medium"
    initial_instance_count = 1
  }

  async_inference_config {
    output_config {
      s3_output_path = "s3://${var.model_s3_bucket}/models/embed/outputs"

      notification_config {
        success_topic = var.success_topic_arn
        error_topic   = var.failure_topic_arn
      }
    }
  }
}
