# ------------------------------------------------------
# ECS Task Execution Role
# Used by the ECS agent to pull images and read secrets
# Follows Principle of Least Privilege
# ------------------------------------------------------

data "aws_iam_policy_document" "ecs_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_execution" {
  name               = "${var.project_name}-ecs-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json

  tags = {
    Name = "${var.project_name}-ecs-execution-role"
  }
}

data "aws_iam_policy_document" "ecs_execution" {
  # ECR: get authorization token (required for any ECR pull)
  statement {
    sid       = "ECRAuth"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  # ECR: pull images from this specific repository only
  statement {
    sid = "ECRPull"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage"
    ]
    resources = [aws_ecr_repository.main.arn]
  }

  # SSM: read only the specific parameters this service needs
  statement {
    sid     = "SSMRead"
    actions = ["ssm:GetParameters"]
    resources = [
      aws_ssm_parameter.database_url.arn,
      aws_ssm_parameter.jwt_secret.arn
    ]
  }

  # CloudWatch: write logs to this specific log group only
  statement {
    sid = "CloudWatchLogs"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["${aws_cloudwatch_log_group.ecs.arn}:*"]
  }
}

resource "aws_iam_role_policy" "ecs_execution" {
  name   = "${var.project_name}-ecs-execution-policy"
  role   = aws_iam_role.ecs_execution.id
  policy = data.aws_iam_policy_document.ecs_execution.json
}

# ------------------------------------------------------
# ECS Task Role
# Used by the running container at runtime
# Empty: this app does not call AWS services directly
# ------------------------------------------------------

resource "aws_iam_role" "ecs_task" {
  name               = "${var.project_name}-ecs-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json

  tags = {
    Name = "${var.project_name}-ecs-task-role"
  }
}
