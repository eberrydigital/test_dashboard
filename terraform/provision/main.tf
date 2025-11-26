terraform {
  cloud {
    organization = "eberry"

    workspaces {
      name = "test-dashboard-provision"
    }
  }

  required_version = "~>1.14.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.47.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4.0"
    }
  }
}

variable "aws_region" {
  type        = string
  default     = "eu-west-1"
  description = "Primary AWS region for resources."
}
variable "service_name" {
  type        = string
  default     = "test-dashboard"
  description = "Base name used for resources."
}
variable "environment" {
  type        = string
  default     = "dev"
  description = "Deployment environment (dev, staging, prod)."
}

provider "aws" {
  region = var.aws_region
}

locals {
  tags = {
    Project     = "test_dashboard"
    Service     = var.service_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

module "s3" {
  source       = "./s3"
  service_name = var.service_name
  environment  = var.environment
  aws_region   = var.aws_region
  tags         = local.tags
}

module "cloudfront" {
  source = "./cloudfront"

  service_name = var.service_name
  environment  = var.environment
  tags         = local.tags

  bucket_domain = module.s3.bucket_name
  bucket_arn    = module.s3.bucket_arn

  custom_domain = "test-dashboard.webinfra.eberry.digital"
  acm_cert_arn  = module.acm.acm_certificate_arn
}

module "acm" {
  source        = "./acm"
  domain_name   = "test-dashboard.webinfra.eberry.digital"
  hosted_zone_id = "Z3J9J9XOPIQJD0"
  tags          = local.tags
}


output "app_bucket_name" {
  value = module.s3.bucket_name
}
output "app_bucket_arn" {
  value = module.s3.bucket_arn
}


resource "aws_route53_record" "cdn_alias" {
  zone_id = "Z3J9J9XOPIQJD0"
  name    = "test-dashboard.webinfra.eberry.digital"
  type    = "A"

  alias {
    name                   = module.cloudfront.cloudfront_domain
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}
