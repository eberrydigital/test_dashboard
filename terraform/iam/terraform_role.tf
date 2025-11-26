resource "aws_iam_role" "terraform_role" {
  name               = "TestDashboardTerraformExecutionRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = { Federated = local.oicd_arn },
        Action   = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringEquals = { "app.terraform.io:aud" = "aws.workload.identity" },
          StringLike   = { "app.terraform.io:sub" : "organization:eberry:project:Strawberry:workspace:${local.provision_workspace}:run_phase:*" }
        }
      }
    ]
  })
  tags = local.tags
}

data "aws_iam_policy_document" "terraform_policy_data" {
  statement {
    sid     = "S3Full"
    actions = [
      "s3:*"
    ]
    resources = ["*"]
  }

  statement {
    sid     = "CloudFrontFull"
    actions = [
      "cloudfront:*"
    ]
    resources = ["*"]
  }

  statement {
    sid     = "ACMFull"
    actions = [
      "acm:*"
    ]
    resources = ["*"]
  }

  statement {
    sid = "Route53Read"
    actions = [
      "route53:GetHostedZone",
      "route53:ListHostedZones",
      "route53:ListResourceRecordSets",
      "route53:ListQueryLoggingConfigs"
    ]
    resources = ["*"]
  }

  statement {
    sid = "Route53Change"
    actions = [
      "route53:ChangeResourceRecordSets"
    ]
    resources = [
      "arn:aws:route53:::hostedzone/Z3J9J9XOPIQJD0"
    ]
  }

  statement {
    sid     = "Route53List"
    actions = [
      "route53:ListHostedZones",
      "route53:ListResourceRecordSets"
    ]
    resources = ["*"]
  }

  statement {
    sid     = "IAMPassRole"
    actions = [
      "iam:PassRole"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "terraform_policy" {
  name        = "TestDashboardTerraformExecutionPolicy"
  path        = "/"
  description = "Policy for Terraform Cloud to manage AWS resources for Test Dashboard"
  policy      = data.aws_iam_policy_document.terraform_policy_data.json
}

resource "aws_iam_role_policy_attachment" "terraform_policy_attachment" {
  role       = aws_iam_role.terraform_role.name
  policy_arn = aws_iam_policy.terraform_policy.arn
}

output "terraform_role_arn" {
  value = aws_iam_role.terraform_role.arn
}

output "terraform_policy_arn" {
  value = aws_iam_policy.terraform_policy.arn
}
