# ------------------------------------------------------
# SSM Parameter Store — Application Secrets
# ECS task definition references these at container start
# Values are passed via Terraform variables (from GitHub Secrets)
# ------------------------------------------------------

resource "aws_ssm_parameter" "database_url" {
  name  = "/${var.project_name}/database-url"
  type  = "SecureString"
  value = var.database_url

  tags = {
    Name = "${var.project_name}-database-url"
  }
}

resource "aws_ssm_parameter" "jwt_secret" {
  name  = "/${var.project_name}/jwt-secret"
  type  = "SecureString"
  value = var.jwt_secret

  tags = {
    Name = "${var.project_name}-jwt-secret"
  }
}
