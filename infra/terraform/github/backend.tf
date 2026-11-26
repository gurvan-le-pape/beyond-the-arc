# State on Cloudflare R2 through the S3 backend. The endpoint and the credentials come
# from the environment (AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY),
# set by tf.sh. R2 is not AWS: every check that would call an AWS-only API is skipped.
terraform {
  backend "s3" {
    bucket       = "bta-terraform-state"
    key          = "github/terraform.tfstate"
    region       = "auto"
    use_lockfile = true

    use_path_style              = true
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
  }
}
