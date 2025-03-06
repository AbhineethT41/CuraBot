# CuraBot Deployment Guide

This guide explains how to build, run, and deploy the CuraBot application using Docker.

## 1. Local Setup

### 1.1 Build the Docker Image

The project includes a multi-stage Dockerfile that builds both the frontend and backend into a single container:

```bash
# From the project root directory
docker build -t curabot:latest .
```

### 1.2 Configuration & Environment Variables

Create a `.env` file in the project root with your environment variables. You can use the `.env.example` file as a template:

```bash
# Copy the example file and edit it with your values
cp .env.example .env
```

Important environment variables include:
- `PORT`: The port on which the server will run (default: 8000)
- `NODE_ENV`: Set to "production" for production deployment
- `JWT_SECRET_KEY`: Secret key for JWT authentication
- `GROQ_API_KEY`: API key for Groq integration
- And any other API keys or configuration needed by your application

### 1.3 Run the Docker Container Locally

```bash
# Run the container with your environment variables
docker run --env-file .env -p 8000:8000 curabot:latest
```

Visit `http://localhost:8000` in your browser to access the application.

## 2. Cloud Deployment

### 2.1 Installing CLI Tools

Ensure you have the following tools installed:
- Docker
- Google Cloud CLI
- Terraform

```bash
# Install Google Cloud CLI
# Windows: https://cloud.google.com/sdk/docs/install-sdk

# Install Terraform
# Windows: https://developer.hashicorp.com/terraform/install
```

### 2.2 Authentication and Permissions

```bash
# Select boot41 project and asia-south1 region
gcloud init
gcloud auth configure-docker asia-south1-docker.pkg.dev
gcloud auth application-default login
terraform init
```

### 2.3 Building and Pushing the Docker Image

```bash
# Build the Docker image with the Google Cloud tag
docker build . -t asia-south1-docker.pkg.dev/boot41/a3/curabot

# Push the Docker image to Google Cloud
docker push asia-south1-docker.pkg.dev/boot41/a3/curabot
```

### 2.4 Setup "Infra as Code" for Google Cloud Run

Create a `cloudrun.tf` file in the `etc/deploy` directory. You can use the sample from [Boot41/sample-fse](https://github.com/Boot41/sample-fse/tree/main/etc/deploy) as a reference.

Create a `terraform.tfvars` file with your settings:

```hcl
project_id = "boot41"
region     = "asia-south1"
service_name = "curabot"
image_name = "asia-south1-docker.pkg.dev/boot41/a3/curabot"
container_port = 8000
env_vars = {
  NODE_ENV = "production"
  PORT     = "8000"
  # Add other environment variables here
}
```

### 2.5 Apply and Deploy

```bash
# Initialize Terraform (if not done already)
terraform init

# Apply the Terraform configuration
terraform apply
```

If successful, Terraform will output the service URL, e.g., `https://curabot-mha4s7stfa-el.a.run.app`

### 2.6 Update & Deploy Latest Version

To deploy a new version:

```bash
# Rebuild the image
docker build . -t asia-south1-docker.pkg.dev/boot41/a3/curabot

# Push the image to Container Repo
docker push asia-south1-docker.pkg.dev/boot41/a3/curabot

# Apply the latest version
terraform apply
```

## 3. Production Checklist

Ensure the following before deploying to production:

1. **Environment Variables**: All sensitive information should be stored in environment variables, not hardcoded.
2. **Strong Passwords**: Use strong, unique passwords for any authentication systems.
3. **API Security**: Ensure all API endpoints are properly authenticated.
4. **Error Handling**: Proper error handling and logging are in place.
5. **Performance**: The application is optimized for performance.
6. **Testing**: All features have been thoroughly tested.

## 4. Troubleshooting

If you encounter issues:

1. Check the container logs:
   ```bash
   docker logs <container_id>
   ```

2. Verify environment variables are correctly set.

3. Ensure the frontend is correctly built and the backend can serve it.

4. Check network connectivity and firewall settings if deploying to the cloud.
