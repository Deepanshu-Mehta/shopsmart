terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.80.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

# ------------------------------------------------------
# S3 Bucket for Terraform State
# (Versioning, Encryption, Public Access Blocked)
# ------------------------------------------------------

resource "aws_s3_bucket" "tfstate" {
  bucket = "shopsmart-tfstate-buildwithdp-xyz"

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name        = "shopsmart-terraform-state"
    Environment = "management"
  }
}

resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "tfstate" {
  bucket                  = aws_s3_bucket.tfstate.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ------------------------------------------------------
# DynamoDB Table for State Locking
# ------------------------------------------------------

resource "aws_dynamodb_table" "tflock" {
  name         = "shopsmart-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "shopsmart-terraform-locks"
    Environment = "management"
  }
}

# ------------------------------------------------------
# ACM Certificate (must be in us-east-1 for CloudFront)
# ------------------------------------------------------

resource "aws_acm_certificate" "main" {
  provider          = aws.us_east_1
  domain_name       = "buildwithdp.xyz"
  subject_alternative_names = ["*.buildwithdp.xyz"]
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "shopsmart-cert"
  }
}

# This resource blocks until the certificate is validated.
# During `terraform apply`, add the CNAME records shown in
# the output to your GoDaddy DNS panel, then wait.
resource "aws_acm_certificate_validation" "main" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.main.arn
}

# ------------------------------------------------------
# Outputs
# ------------------------------------------------------

output "s3_bucket_name" {
  description = "S3 bucket for Terraform state"
  value       = aws_s3_bucket.tfstate.id
}

output "dynamodb_table_name" {
  description = "DynamoDB table for state locking"
  value       = aws_dynamodb_table.tflock.name
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN (use in main Terraform)"
  value       = aws_acm_certificate_validation.main.certificate_arn
}

output "acm_validation_records" {
  description = "Add these CNAME records to GoDaddy DNS"
  value = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  }
}
