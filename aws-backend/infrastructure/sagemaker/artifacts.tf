resource "aws_s3_object" "async_caption_model_data" {
  bucket = var.model_s3_bucket
  key    = var.async_caption_model_data
  source = "../../sm-ep-async-image-caption/git-base-async.tar.gz"

  etag = filemd5("../../sm-ep-async-image-caption/git-base-async.tar.gz")
}

resource "aws_s3_object" "async_embed_model_data" {
  bucket = var.model_s3_bucket
  key    = var.async_embed_model_data
  source = " ../../sm-ep-async-embed-image/clip-vit-base-patch32-async.tar.gz"

  etag = filemd5(" ../../sm-ep-async-embed-image/clip-vit-base-patch32-async.tar.gz")
}
