# Event-Driven User Activity Tracker

## Overview

This project is an **event-driven user activity tracking platform** designed to collect, store, query, and observe application events in a cloud-native environment.

It is built as part of a DevOps graduation project and demonstrates the full software delivery lifecycle:
- application development
- automated testing
- containerization
- continuous integration
- Kubernetes deployment
- GitOps with ArgoCD
- monitoring with Prometheus and Grafana

The system is composed of multiple stateless services backed by a PostgreSQL database and deployed using declarative infrastructure.

---

## Architecture

High-level architecture:

- **Collector API**
  - Ingests user activity events
  - Persists events to PostgreSQL
- **Query API**
  - Exposes filtered queries and aggregations over stored events
- **PostgreSQL**
  - Central persistent datastore
- **Kubernetes**
  - Orchestrates services and storage
- **Prometheus & Grafana**
  - Observability and monitoring
- **ArgoCD**
  - GitOps-based deployment

A detailed architecture diagram will be added in `docs/`.

---

## Technologies Used

- Node.js / Express
- PostgreSQL
- Docker & Docker Compose
- Kubernetes (Minikube)
- GitHub Actions (CI)
- ArgoCD (GitOps)
- Prometheus & Grafana

---

## Repository Structure

```text
event-tracker/
├── apps/                # Application source code
├── infra/               # Local infrastructure (Docker Compose, DB init)
├── k8s/                 # Kubernetes manifests (declarative)
├── .github/workflows/   # CI pipelines
├── docs/                # Architecture and documentation
├── README.md
└── CHANGELOG.md
```

---
## Development Status
This project is currently under active development.

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes and milestones.

## Query performance analysis

Query performance was validated using PostgreSQL `EXPLAIN ANALYZE` to ensure
appropriate execution plans depending on query patterns.

### Global aggregation (event distribution)
For global aggregation queries such as:

```sql
SELECT event_type, COUNT(*)
FROM events
GROUP BY event_type
ORDER BY COUNT(*) DESC
LIMIT 10;
```
PostgreSQL performs a Sequential Scan, which is expected since the query
requires reading the full dataset to compute accurate aggregates.
![Sequential Scan](docs\explain-analyze-top-event-types.png)

### Filtered read queries
For filtered read queries such as:

```sql
SELECT *
FROM events
WHERE user_id = 'u1'
ORDER BY timestamp DESC
LIMIT 50;
```
PostgreSQL uses an Index Scan, demonstrating that indexes are correctly
leveraged for selective queries.
![Index Scan](docs\explain-events-userid.png)


---
## Author

**Nathan De Blecker**
Data Scientist / Data Engineer

---
## License
This project is provided for educational purposes.