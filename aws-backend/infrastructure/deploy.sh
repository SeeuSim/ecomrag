if [[ -z "$1" ]]; then
  echo "Usage: deploy.sh <ENV>"
  exit 1
fi

terraform init -var $1/$1.tfvars -backend-config $1/$1.backendconfig

terraform fmt --recursive
