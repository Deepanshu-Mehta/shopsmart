variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "shopsmart"
}

variable "aws_region" {
  description = "AWS region for infrastructure"
  type        = string
  default     = "ap-south-1"
}

variable "domain_name" {
  description = "Root domain name"
  type        = string
  default     = "buildwithdp.xyz"
}

variable "database_url" {
  description = "PostgreSQL connection string (Neon)"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 5001
}

variable "cpu" {
  description = "Fargate task CPU units (256 = 0.25 vCPU)"
  type        = number
  default     = 256
}

variable "memory" {
  description = "Fargate task memory in MB"
  type        = number
  default     = 512
}
