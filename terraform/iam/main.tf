terraform {
  cloud {
    organization = "eberry"

    workspaces {
      name = "test-dashboard-iam"
    }
  }

  required_version = "~>1.14.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.47.0"
    }
  }

}

variable "aws_region" {
  type        = string
  default     = "eu-west-1"
  description = "Primary AWS region for IAM resources."
}

provider "aws" {
  region = var.aws_region
}

locals {
  oicd_arn            = "arn:aws:iam::013238025643:oidc-provider/app.terraform.io"
  provision_workspace = "test-dashboard-provision"
  tags = {
    Project    = "test_dashboard"
    Stack      = "iam"
    ManagedBy  = "Terraform"
    Owner      = "QA"
  }
}

data "aws_caller_identity" "current" {}

output "caller_identity_arn" {
  value       = data.aws_caller_identity.current.arn
  description = "ARN of the identity assumed by Terraform Cloud during runs."
}