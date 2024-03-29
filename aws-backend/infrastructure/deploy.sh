if [[ -z "$1" ]]; then
  echo "Usage: deploy.sh <ENV>"
  exit 1
fi

terraform init -var $1/$1.tfvars -backend-config $1/$1.backendconfig

terraform fmt --recursive

if [[ -z "$2" ]]; then
  terraform apply -var-file $1/$1.tfvars
else
  terraform apply -var-file $1/$1.tfvars -auto-approve
fi
