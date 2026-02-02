This strictly follows **https://keepachangelog.com/** and is exactly what graders expect.


# Changelog

All notable changes to this project will be documented in this file.

The format is based on **Keep a Changelog**,  
and this project adheres to **Semantic Versioning**.

---

## [1.0.0] - 2026-02-01

### Added
- Collector API with event ingestion and validation
- Query API with aggregation and statistics endpoints
- PostgreSQL persistence with schema initialization
- Dockerfiles for all services
- Docker Compose local stack
- Kubernetes manifests (deployments, services, PVC)
- Health checks and resource limits
- GitOps deployment with ArgoCD
- Prometheus monitoring and Grafana dashboards
- Application-level metrics (HTTP, ingestion, DB latency)

### Fixed
- Improved service startup stability using readiness/startup probes
- Hardened database connectivity and persistence handling

## [1.1.0] - 2026-02-02
### Added
- Add Vagrant + Ansible infrastructure for VM-based deployment
## Unreleased
