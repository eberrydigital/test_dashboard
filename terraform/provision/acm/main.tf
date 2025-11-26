provider "aws" {
  alias  = "use1"
  region = "us-east-1"
}

# Request certificate in us-east-1
resource "aws_acm_certificate" "cert" {
  provider          = aws.use1
  domain_name       = var.domain_name
  validation_method = "DNS"
  tags              = var.tags

  lifecycle {
    create_before_destroy = true
  }
}

# Create DNS validation record
resource "aws_route53_record" "validation" {
  zone_id = var.hosted_zone_id
  name    = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_name
  type    = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_type
  ttl     = 60
  records = [tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_value]
}

# Validate certificate
resource "aws_acm_certificate_validation" "validation" {
  provider                = aws.use1
  certificate_arn        = aws_acm_certificate.cert.arn
  validation_record_fqdns = [aws_route53_record.validation.fqdn]
}