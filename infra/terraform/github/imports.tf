# Everything in this stack exists already: Terraform adopts it, never creates it.
import {
  to = github_repository.this
  id = "beyond-the-arc"
}

import {
  to = github_repository_ruleset.main
  id = "beyond-the-arc:13517786"
}

import {
  for_each = local.environments
  to       = github_repository_environment.this[each.key]
  id       = "beyond-the-arc:${each.key}"
}

import {
  for_each = local.environments
  to       = github_repository_environment_deployment_policy.main[each.key]
  id       = "beyond-the-arc:${each.key}:${each.value.branch_policy_id}"
}

import {
  for_each = local.variables
  to       = github_actions_environment_variable.this[each.key]
  id       = "beyond-the-arc:${each.value.environment}:${each.value.name}"
}

import {
  for_each = local.repository_variables
  to       = github_actions_variable.this[each.key]
  id       = "beyond-the-arc:${each.key}"
}
