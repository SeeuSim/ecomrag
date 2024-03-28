output "async_caption_endpoint_arn" {
  value = aws_sagemaker_endpoint.async_image_caption.arn
}

output "async_embed_endpoint_arn" {
  value = aws_sagemaker_endpoint.async_image_embed.arn
}