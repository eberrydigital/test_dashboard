variable "service_name" { type = string }
variable "environment" { type = string }
variable "aws_region" {type = string }
variable "tags" { type = map(string) }

locals { bucket_name = "${var.service_name}-${var.environment}-${var.aws_region}" }

output "bucket_name" { value = aws_s3_bucket.app_bucket.bucket }
output "bucket_arn"  { value = aws_s3_bucket.app_bucket.arn }

