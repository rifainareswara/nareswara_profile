# Deploying HTML Using Docker

Docker is an excellent way to containerize and deploy HTML websites. Here's a comprehensive guide to deploying an HTML site using Docker:

## Basic Docker Deployment

### 1. Create a Dockerfile

Create a file named `Dockerfile` in your project directory:

```dockerfile
FROM nginx:alpine

COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

This uses the lightweight Nginx Alpine image, copies your HTML files into the correct directory, exposes port 80, and starts Nginx.

### 2. Build the Docker Image

```bash
docker build -t my-html-website .
```

### 3. Run the Container

```bash
docker run -d -p 8080:80 my-html-website
```

Your website will now be accessible at http://localhost:8080

## Advanced Docker Configuration

### Custom Nginx Configuration

1. Create a custom Nginx configuration file `nginx.conf`:

```
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Add custom headers, caching, etc.
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
}
```

2. Update your Dockerfile:

```dockerfile
FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Deploying to Production

### 1. Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3'

services:
  website:
    build: .
    ports:
      - "80:80"
    restart: always
```

Run with:
```bash
docker-compose up -d
```

### 2. Deploying to Cloud Providers

#### AWS Elastic Container Service (ECS)

1. Push your Docker image to Amazon ECR:
```bash
aws ecr create-repository --repository-name my-html-website
aws ecr get-login-password | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.<region>.amazonaws.com
docker tag my-html-website:latest <your-aws-account-id>.dkr.ecr.<region>.amazonaws.com/my-html-website:latest
docker push <your-aws-account-id>.dkr.ecr.<region>.amazonaws.com/my-html-website:latest
```

2. Create an ECS cluster and service using the AWS Console or CLI

#### Google Cloud Run

1. Push to Google Container Registry:
```bash
gcloud auth configure-docker
docker tag my-html-website:latest gcr.io/<project-id>/my-html-website:latest
docker push gcr.io/<project-id>/my-html-website:latest
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy --image gcr.io/<project-id>/my-html-website:latest --platform managed
```

### 3. Using Docker Swarm or Kubernetes

For high-availability deployments, consider Docker Swarm or Kubernetes:

```bash
# Initialize Docker Swarm
docker swarm init

# Deploy as a service
docker service create --name my-website --publish 80:80 my-html-website
```

## Performance Optimization

1. Use multi-stage builds to reduce image size:

```dockerfile
FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Add environment variables for configuration:

```dockerfile
ENV API_URL=https://api.example.com
```

Would you like me to elaborate on any specific aspect of Docker deployment for your HTML site?