locals {
  repository = "beyond-the-arc"

  # Each deployment environment, the id of its branch policy (imported, never created
  # here) and its variables. Secrets stay out: their values would land in the state.
  environments = {
    Production = { branch_policy_id = 68199675 }
    build      = { branch_policy_id = 68248639 }
  }
  environment_variables = {
    FRONTEND_URL        = "https://beyondthearc.app"
    NEXT_PUBLIC_API_URL = "https://beyondthearc.app/api"
  }
  repository_variables = {
    DEPLOY_ENABLED       = "true"
    GHCR_CLEANUP_ENABLED = "true"
    SONAR_ENABLED        = "true"
  }
  variables = merge([
    for environment in keys(local.environments) : {
      for name, value in local.environment_variables :
      "${environment}/${name}" => { environment = environment, name = name, value = value }
    }
  ]...)
}

resource "github_repository" "this" {
  name         = local.repository
  description  = "Basketball federation management platform"
  homepage_url = "https://beyondthearc.app"
  visibility   = "public"

  has_issues      = true
  has_projects    = true
  has_wiki        = true
  has_discussions = false
  has_downloads   = false

  allow_merge_commit          = true
  allow_squash_merge          = true
  allow_rebase_merge          = true
  allow_auto_merge            = false
  allow_update_branch         = false
  delete_branch_on_merge      = false
  web_commit_signoff_required = false
  merge_commit_title          = "MERGE_MESSAGE"
  merge_commit_message        = "PR_TITLE"
  squash_merge_commit_title   = "COMMIT_OR_PR_TITLE"
  squash_merge_commit_message = "COMMIT_MESSAGES"

  vulnerability_alerts = false

  lifecycle {
    prevent_destroy = true
    # The REST API hides the merge settings from a read-only token, so Terraform reads
    # them as false and empty. The values above are the real ones, as GraphQL returns
    # them. Remove this ignore_changes the day this stack has a write token.
    ignore_changes = [
      allow_merge_commit,
      allow_squash_merge,
      allow_rebase_merge,
      merge_commit_title,
      merge_commit_message,
      squash_merge_commit_title,
      squash_merge_commit_message,
      # Provider-only setting, not a GitHub one: an import leaves it unset.
      ignore_vulnerability_alerts_during_read,
    ]
  }
}

resource "github_repository_ruleset" "main" {
  name        = "main protection"
  repository  = github_repository.this.name
  target      = "branch"
  enforcement = "active"

  conditions {
    ref_name {
      include = ["refs/heads/main"]
      exclude = []
    }
  }

  rules {
    deletion         = true
    non_fast_forward = true

    pull_request {
      required_approving_review_count   = 0
      dismiss_stale_reviews_on_push     = false
      require_code_owner_review         = false
      require_last_push_approval        = false
      required_review_thread_resolution = false
      allowed_merge_methods             = ["merge", "squash", "rebase"]
    }

    # `gate` is the one required check, and only the GitHub Actions app may report it.
    required_status_checks {
      strict_required_status_checks_policy = false
      do_not_enforce_on_create             = false

      required_check {
        context        = "gate"
        integration_id = 15368
      }
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "github_repository_environment" "this" {
  for_each = local.environments

  repository        = github_repository.this.name
  environment       = each.key
  can_admins_bypass = false

  deployment_branch_policy {
    protected_branches     = false
    custom_branch_policies = true
  }
}

# Each environment deploys from main only.
resource "github_repository_environment_deployment_policy" "main" {
  for_each = local.environments

  repository     = github_repository.this.name
  environment    = github_repository_environment.this[each.key].environment
  branch_pattern = "main"
}

resource "github_actions_environment_variable" "this" {
  for_each = local.variables

  repository    = github_repository.this.name
  environment   = github_repository_environment.this[each.value.environment].environment
  variable_name = each.value.name
  value         = each.value.value
}

resource "github_actions_variable" "this" {
  for_each = local.repository_variables

  repository    = github_repository.this.name
  variable_name = each.key
  value         = each.value
}
