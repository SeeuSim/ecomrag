resource "aws_sagemaker_endpoint" "async_image_caption" {
  name                 = "async-caption-endpoint"
  endpoint_config_name = aws_sagemaker_endpoint_configuration.async_caption_config.name
}

resource "aws_sagemaker_endpoint" "async_image_embed" {
  name                 = "async-embed-endpoint"
  endpoint_config_name = aws_sagemaker_endpoint_configuration.async_embed_config.name
}