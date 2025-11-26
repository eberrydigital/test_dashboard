variable "service_name" { type = string }
variable "environment"  { type = string }
variable "tags"         { type = map(string) }

variable "bucket_domain" { type = string }
variable "bucket_arn"    { type = string }
variable "bucket_name"   { type = string }

variable "custom_domain" { type = string }
variable "acm_cert_arn"  { type = string }
