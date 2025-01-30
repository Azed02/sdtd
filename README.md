# Navier Equations Solver with Kafka, Terraform, Ansible, and GitHub Actions

This project is designed to solve Navier equations by creating a distributed system. It uses Terraform and Ansible to set up a Kubernetes cluster and leverages Kafka for data production and consumption. The project integrates GitHub Actions for CI/CD and uses Argo CD for monitoring.

## Features

- **Producer**: Generates random parameters for Navier equations.
- **Consumer**: Processes the parameters, solves the equations, and generates graphical outputs.
- **Cluster Setup**: Automated using Terraform and Ansible.
- **Monitoring**: Argo CD to monitor the cluster state.
- **Scalable Design**: Built on Kubernetes with Kafka for efficient data handling.

## Quick Start Guide

### Update Configuration Files

You need to update the following files with your specific details:

- **Bucket Name**:
  - `app/express-backend/index.js`
  - `k8s_setup/roles/kubernetes/files/kafka_consumer.py`
  - `terraform/res.tf`

- **DockerHub User and Repository Name**:
  - `app/manifest/backend-deployment.yaml`
  - `app/manifest/frontend-deployment.yaml`

### GitHub Actions Variables

The provided GitHub Actions workflow requires the following secrets to be defined in your repository's settings:

- **DOCKER_USERNAME**: DockerHub username, used for logging in and tagging images.
- **DOCKER_PASSWORD**: DockerHub password, used for authentication during login.
- **SSH_SECRET**: Private SSH key used by Ansible to access the servers.
- **GCP_CRED**: Base64-encoded Google Cloud Platform credentials file, required for authentication with GCP services.
- **TF_PUB**: Public SSH key used for the Terraform deployment.

These variables ensure that the CI/CD pipeline functions as intended, handling Docker image builds, security scans, and deployments automatically.

### Setting Up the Cluster

Once the cluster is deployed, run these commands on the **master node**:

```bash
mkdir -p ~/.kube
sudo cp -i /etc/kubernetes/admin.conf ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
kubectl get pods
kubectl get services
```

Check the external port for the front-end pod and access the website at:

```
http://<public-ip-address>:<port>
```

## Project Overview

### Code Structure

- `.github`: Contains GitHub Actions workflows for CI/CD.
- `app`: Contains the front-end and back-end code, along with their Dockerfiles and Kubernetes deployment/service files in the `manifest` directory.
- `k8s_setup`: Contains Kubernetes configuration files.
  - `roles/apps`: Configurations for Kafka, Argo CD, front-end, and back-end.
  - `roles/kubernetes`: Master and worker node configurations.
- `terraform`: Contains Terraform configuration files.

## Tips for Easy Access and Modifications

- **Python Scripts**:
  - Producer and consumer scripts are located in:  
    `k8s_setup/roles/kubernetes/files`.  
    Feel free to modify these as needed.
  
- **Producer Frequency**:
  - The producer script runs every 15 seconds by default. To adjust this, modify the `producer pod definition` at:  
    `k8s_setup/roles/apps/templates/kafka-automation.yaml.j2`.  
    Update the `sleep` function in the arguments.

## Monitoring

This project integrates **Argo CD** to monitor the state of the Kubernetes cluster. Use the Argo CD UI to track deployments and configurations.

to see argocd 
```bash
kubectl get pods -n argoccd
```

**Prometheus** is used to get different information about how our pods are running and we use **Grafana** to display it.
We also have **ELK** to manage our logs.

Finnaly **AlertManager** is already installed but no alarm are setup by default.

Those are running on the monitoring namespace, to see them you can : 
```bash
kubectl get pods -o wide --namespace=monitoring
```


Prometheus: Accessible at http://<public-ip-address>:30000 \
Grafana: Accessible at http://<public-ip-address>:31000 \
AlertManager: Accessible at http://<public-ip-address>:32000

Enjoy working with this project and feel free to enhance its capabilities!
