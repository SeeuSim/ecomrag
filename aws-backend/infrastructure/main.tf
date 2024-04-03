module "variables" {
  source = "./variables"

  inference_model_image_acct           = var.inference_model_image_acct
  inference_model_image_region         = var.inference_model_image_region
  inference_model_py_version           = var.inference_model_py_version
  inference_model_transformers_version = var.inference_model_transformers_version
  inference_model_pytorch_version      = var.inference_model_pytorch_version
  inference_model_ubuntu_version       = var.inference_model_ubuntu_version
}

module "sns" {
  source = "./sns"
}

module "sqs" {
  source = "./sqs"
}

module "sagemaker" {
  source = "./sagemaker"

  region = var.region

  inference_model_image = module.variables.inference_model_image

  async_caption_model_data = var.async_caption_model_data
  async_embed_model_data   = var.async_embed_model_data
  model_s3_bucket          = var.model_s3_bucket

  success_topic_arn = module.sns.success_topic_arn
  failure_topic_arn = module.sns.failure_topic_arn

  depends_on = [module.variables, module.sns]
}

module "lambda" {
  source                      = "./lambda"
  account_id                  = var.account_id
  async_caption_endpoint_arn  = module.sagemaker.async_caption_endpoint_arn
  async_embed_endpoint_arn    = module.sagemaker.async_embed_endpoint_arn
  async_caption_endpoint_name = module.sagemaker.async_caption_endpoint_name
  async_embed_endpoint_name   = module.sagemaker.async_embed_endpoint_name
  sns_failure_topic           = module.sns.failure_topic_arn
  sns_success_topic           = module.sns.success_topic_arn
  sqs_caption_queue_arn       = module.sqs.sqs_caption_queue_arn
  sqs_embed_queue_arn         = module.sqs.sqs_embed_queue_arn
  backend_ep_dev              = var.backend_ep_dev
  backend_ep_prod             = var.backend_ep_prod
  model_io_bucket             = var.model_s3_bucket
  depends_on                  = [module.sagemaker, module.sns, module.sqs]
}
