# drug-info-finder
# Drug Information Finder

A web application that provides drug safety information, side effects, and usage guidelines by leveraging the OpenFDA API. Designed for healthcare professionals and the general public, with a focus on accessibility in Africa.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [API Used](#api-used)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Docker Deployment](#docker-deployment)
- [Load Balancer Configuration (HAProxy)](#load-balancer-configuration-haproxy)
- [Testing & Verification](#testing--verification)
- [Security Hardening](#security-hardening)
- [Challenges & Solutions](#challenges--solutions)

## Project Overview

Drug Info Finder is a web app that allows users to search for drug safety data from the OpenFDA API. It includes:

- **Frontend**: HTML, CSS, JavaScript (interactive search UI)
- **Backend**: API consumption with error handling
- **Containerization**: Dockerized for easy deployment
- **Load Balancing**: HAProxy distributes traffic across two web servers (web-01, web-02)

## Features

✔ **Drug Search** – Find medications by name  
✔ **Safety Information** – Side effects, usage guidelines  
✔ **Responsive UI** – Works on mobile & desktop  
✔ **High Availability** – Load-balanced deployment

## API Used

**OpenFDA API**
- Provides drug safety and labeling data
- API url (https://api.fda.gov/drug/label.json?search=${drugName}&limit=1`)
- API key '87r7Jn92hq63wrBDkYbQDZlON32McrjI83aR8sdz'

## Prerequisites

- Docker installed ([Install Guide](https://docs.docker.com/get-docker/))
- Docker Hub account (for pushing images)
- Access to lab servers:
  - `web-01` (Web Server 1)
  - `web-02` (Web Server 2)
  - `lb-01` (HAProxy Load Balancer)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/drug-info-finder.git
cd drug-info-finder
```

### 2. Build the Docker Image

```bash
docker build -t drug-info-finder .
```

### 3. Run the App Locally

```bash
docker run -d -p 5000:80 --name drug-app drug-info-finder
```

**Access at**: http://localhost:5000

## Docker Deployment

### 1. Push Image to Docker Hub

```bash
docker tag drug-info-finder angelkibui/drug-info-finder:latest
docker push angelkibui/drug-info-finder:latest
```

### 2. Deploy on Web Servers (web-01, web-02)

Run on each server:

```bash
docker run -d -p 80:80 --name drug-app angelkibui/drug-info-finder:latest
```

**Verify**:

```bash
curl http://localhost
```

## Load Balancer Configuration (HAProxy)

### 1. Configure haproxy.cfg (on lb-01)

```conf
frontend http_front
  bind *:80
  default_backend http_back

backend http_back
  balance roundrobin
  server web1 web-01:80 check
  server web2 web-02:80 check
```

### 2. Restart HAProxy

```bash
sudo systemctl restart haproxy
```

**Verify Load Balancing**:

```bash
curl http://lb-01
```
(Repeat to see requests alternate between web-01 and web-02)

## Testing & Verification

### 1. Check Round-Robin Load Balancing

Run multiple requests:

```bash
for i in {1..5}; do curl http://lb-01; done
```
(Should alternate between web-01 and web-02)

### 2. API Response Validation

- Search for a drug (e.g., "Aspirin")
- Ensure correct side effects & safety data appear

## Security Hardening

**Avoid hardcoding API keys**: Use environment variables

```bash
docker run -d -p 80:80 -e API_KEY=your_key --name drug-app angelkibui/drug-info-finder
```

**Enable HTTPS**: Use Let's Encrypt with HAProxy/Nginx

**Firewall Rules**: Restrict access to necessary ports

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| API rate limiting | Implemented client-side caching |
| Cross-origin requests | Configured CORS headers |
| Load balancer health checks | Added HAProxy check parameter |

Youtube video: https://youtu.be/F9Jb-X-c4Fc?si=LiteHWAUbS5qewvI