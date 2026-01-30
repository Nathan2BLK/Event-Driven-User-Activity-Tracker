# Definition of Done (DoD)

This document defines the criteria that must be met for a feature, component, or release of the **Event-Driven User Activity Tracker** to be considered **done**.

The Definition of Done applies to:
- individual features
- services (collector-api, query-api)
- infrastructure changes
- releases

Its purpose is to ensure consistent quality, reproducibility, and operational readiness.

---

## 1. Source Code Quality

- Code follows the project structure and naming conventions.
- No hard-coded secrets or environment-specific values in source code.
- Configuration is externalized via environment variables.
- Linting passes with no blocking errors.
- No unused or dead code remains.

---

## 2. Testing

### 2.1 Local Testing
- All unit tests pass locally.
- All API/integration tests pass locally.
- Tests are deterministic (no reliance on external systems except declared dependencies).

### 2.2 Continuous Integration
- CI pipeline executes successfully on pull request and main branch.
- CI includes:
  - dependency installation
  - test execution
  - failure on test errors
- CI uses service containers for required dependencies (e.g. PostgreSQL).

---

## 3. Containerization

- Docker images build successfully without errors.
- Images:
  - use a reproducible build (lock files)
  - do not include unnecessary files
  - expose only required ports
- Containers start successfully using Docker Compose.
- Application configuration is provided via environment variables.

---

## 4. Kubernetes Deployment

- All Kubernetes manifests apply cleanly using `kubectl apply`.
- Deployments reach a **Ready** state without manual intervention.
- Services are reachable as intended (ClusterIP / NodePort).
- No CrashLoopBackOff or ImagePullBackOff states occur.

---

## 5. Health Checks

- Liveness probes correctly detect unhealthy containers.
- Readiness probes correctly prevent traffic before the application is ready.
- Applications recover automatically after restarts.

---

## 6. Persistence & Configuration

- PostgreSQL uses persistent storage (PVC or hostPath for local clusters).
- Data persists across pod restarts.
- Secrets are stored in Kubernetes Secrets.
- Non-secret configuration is stored in ConfigMaps.

---

## 7. Observability & Monitoring

- Applications expose Prometheus-compatible metrics.
- Prometheus successfully scrapes all services.
- Grafana dashboards exist and display:
  - request rates
  - latency (p95)
  - error rates
  - event ingestion metrics
- Dashboards load without manual reconfiguration.

---

## 8. Documentation

- [`README.md`](../README.md) includes:
  - project description
  - architecture overview
  - local run instructions
  - Kubernetes deployment instructions
  - monitoring access instructions
- [`CHANGELOG.md`](../CHANGELOG.md) is updated for each release.
- Architecture or operational notes are documented in [`/docs`](../docs/).

---

## 9. Versioning & Release

- Each release corresponds to a version entry in [`CHANGELOG.md`](../CHANGELOG.md).
- Release content matches the actual deployed state.
- Optional Git tag is created for the release version.

---

## 10. Operational Readiness

- The system can be:
  - built
  - tested
  - deployed
  - monitored
  using documented steps only.
- No manual configuration is required outside documented procedures.

---

## Final Condition

A feature or release is considered **Done** only when **all sections above are satisfied**.
