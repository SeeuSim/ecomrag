module "sns" {
  source = "./sns"
}

module "sagemaker" {
  source = "./sagemaker"

  region = var.region

  inference_model_image = var.inference_model_image

  async_caption_model_data = var.async_caption_model_data
  async_embed_model_data   = var.async_embed_model_data
  model_s3_bucket          = var.model_s3_bucket

  model_success_topic = module.sns.sns_model_success_topic
  model_failure_topic = module.sns.sns_model_failure_topic

  depends_on = [module.sns]
}
