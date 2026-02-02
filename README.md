# Event Tracker Platform

A cloud-native event tracking platform built with microservices, PostgreSQL, Kubernetes, GitOps, and full observability.

This project demonstrates an end-to-end modern backend architecture, from API design and persistence to CI/CD, Kubernetes orchestration, GitOps, and monitoring.

---

## Architecture Overview

The platform is composed of three main services:

- **Collector API**  
  Receives and validates incoming events and persists them into PostgreSQL.

- **Query API**  
  Exposes read-only endpoints to retrieve events and aggregated statistics.

- **PostgreSQL**  
  Persistent storage layer with schema initialization and durable volumes.

The system is deployed on Kubernetes and managed via GitOps using ArgoCD.  
Observability is provided through Prometheus metrics and Grafana dashboards.

---

## Docker images (Docker Hub)

Prebuilt images are published to Docker Hub:

- Collector API: `nathan2blk/event-tracker-collector:1.0.0`
- Query API: `nathan2blk/event-tracker-query:1.0.0`

---

## High-Level Architecture

**Request flow:**
1. Clients send events to the Collector API
2. Collector validates and stores events in PostgreSQL
3. Query API reads from PostgreSQL to serve analytics endpoints
4. Prometheus scrapes metrics from both APIs
5. Grafana visualizes metrics (latency, throughput, ingestion rate)
6. ArgoCD continuously reconciles cluster state from Git

---

## Technology Stack

| Layer | Technologies |
|----|----|
| APIs | Node.js, Express |
| Database | PostgreSQL |
| Containerization | Docker |
| Orchestration | Kubernetes (Minikube) |
| GitOps | ArgoCD |
| CI | GitHub Actions |
| Monitoring | Prometheus, Grafana |
| Metrics | prom-client |
| Configuration | ConfigMaps, Secrets |
| Persistence | PersistentVolumeClaims |

---

## Repository Structure

```text
.
├── apps/
│   ├── collector-api/
│   └── query-api/
├── infra/
│   └── db/
│   └── docker-compose/
├── k8s/
│   ├── base/
│   ├── monitoring/
│   │   ├── prometheus/
│   │   └── grafana/
│   └── argocd/
├── iac/
│   ├── playbooks/
│   ├── templates/
├── docs/
│   ├── image/
│   ├── gitops.md
│   ├── deployment.md
│   └── definition-of-done.md
├── .github/workflows/
├── CHANGELOG.md
└── README.md
```
## APIs
### Collector API
- POST /events — ingest an event
- GET /health/live
- GET /health/ready
- GET /metrics

### Query API
- GET /events
- GET /stats/top-event-types
- GET /health/live
- GET /health/ready
- GET /metrics

### API documentation (Swagger)

- Collector API docs: `http://localhost:3000/docs`
- Query API docs: `http://localhost:3001/docs`

Raw OpenAPI specs:
- `GET /openapi.yaml`


explain-analyze-top-event-types
![top-event-explain-analyze](docs/image/explain-analyze-top-event-types.png)

explain-events-userid![top-event-explain-analyze](docs/image/explain-events-userid.png)

---
## Kubernetes Deployment
- Each service runs in its own Deployment
- Services use ClusterIP for internal communication
- PostgreSQL uses a PersistentVolumeClaim for durable storage
- Resource requests and limits are defined for stability
- Startup, readiness, and liveness probes are configured

## GitOps (ArgoCD)
The cluster state is fully managed by Git using ArgoCD:

- Git is the single source of truth
- Automatic reconciliation with self-healing enabled
- Drift detection and correction
- Declarative deployment of all Kubernetes resources

## Observability
### Metrics
The platform exposes Prometheus metrics including:
- HTTP request count and latency
- Event ingestion rate by event type
- Database query latency per query

### Dashboards
Grafana provides dashboards for:
- Requests per second
- p95 latency
- Ingestion throughput
- Database performance


## Local Deployment and testing
You have multiple ways to deploy and test the app and monitoring feature, follow [this page](docs\deployment.md) for all the details
##  Release Management
This project follows:
- Semantic Versioning
- Conventional Commits
- CHANGELOG-driven releases

Current version: v1.0.0

## Author

Nathan DE BLECKER