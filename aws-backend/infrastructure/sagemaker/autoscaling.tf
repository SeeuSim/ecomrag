resource "aws_appautoscaling_target" "captioning_as_target" {
  service_namespace  = "sagemaker"
  resource_id        = "endpoint/${aws_sagemaker_endpoint.async_image_caption.name}/variant/variant-1"
  min_capacity       = 0
  max_capacity       = 5
  scalable_dimension = "sagemaker:variant:DesiredInstanceCount"
}

resource "aws_appautoscaling_target" "embedding_as_target" {
  service_namespace  = "sagemaker"
  resource_id        = "endpoint/${aws_sagemaker_endpoint.async_image_embed.name}/variant/variant-1"
  min_capacity       = 0
  max_capacity       = 5
  scalable_dimension = "sagemaker:variant:DesiredInstanceCount"
}