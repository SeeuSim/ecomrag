# AWS ML Inference on Lambda

## Setup

1. Start a virtual environment using at least Python3.11:

   ```sh
   cd sgmkr-ep-embed-image && \
     python3.11 -m venv .venv
   ```

2. Activate it and run the command to cache the model binaries:

   ```sh
   source .venv/bin/activate && \
     python download_model.py
   ```

3. Run the command to build with Docker:

   ```sh
   docker build --platform linux/amd64 -t docker-image:test .
   ```

4. Run the script to test the endpoint:

   ```sh
   bash test.sh
   ```

5. Kill the process:

   ```sh
   docker ps
   # CONTAINER ID   IMAGE
   # a2d2c782aa3d   docker-image:test
   docker kill a2d2c782aa3d # replace with the actual ID
   ```

## Push to ECR

1. Run the command:

   ```sh
   aws ecr get-login-password --region $REGION | \
     docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
   ```

2. Create the repository:

   ```sh
   aws ecr create-repository \
     --repository-name $REPO \
     --region $REGION \
     --image-scanning-configuration scanOnPush=true \
     --image-tag-mutability MUTABLE
   ```

3. Get the repository URI.

4. Run the command to tag the image:

   ```sh
   docker tag docker-image:test <ECRrepositoryUri>:latest
   ```

5. Push the image:

   ```sh
   docker push <ECRrepositoryUri>:latest
   ```

6. Create or Update the Lambda Execution Role:

   ```sh
   aws iam create-role --role-name ecomrag-img-embed-exec-role \
     --assume-role-policy-document file://lambda_trust_policy.json
   ```

7. Create or Update the Lambda Function

    ```sh
    aws lambda create-function \
      --function-name ecomrag-lmbd-img-embed \
      --package-type Image \
      --code ImageUri=$ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/$REPO:latest \
      --role arn:aws:iam::$ACCOUNT_ID:role/ecomrag-img-embed-exec-role
    ```
