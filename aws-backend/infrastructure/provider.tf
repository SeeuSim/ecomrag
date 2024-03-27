terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.42.0"
    }
  }
}

terraform {
  backend "s3" {
    encrypt = true
    region  = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}