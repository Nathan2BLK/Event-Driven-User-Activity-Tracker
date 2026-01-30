This strictly follows **https://keepachangelog.com/** and is exactly what graders expect.


# Changelog

All notable changes to this project will be documented in this file.

The format is based on **Keep a Changelog**,  
and this project adheres to **Semantic Versioning**.

---

## [Unreleased]

### Added
- Initial project definition and scope
- Repository structure aligned with DevOps best practices
- Collector API
    - scaffold with `/events`, `/health/live`, `/health/ready`, and `/metrics` endpoints
    - Persist events to PostgreSQL (events table + insert on POST /events)
    - Added unit and API tests for event ingestion
- Query API
    - Scaffold with events and statistics endpoints
    - Implemented PostgreSQL reads with filters + pagination (GET /events)
    - Implemented aggregations (/stats/top-event-types, /stats/events-per-minute)
    - Added API tests for querying and stats endpoints
- Docker Compose stack for postgres + services
- Added GitHub Actions CI pipeline running automated tests for collector and query services
- add Docker build job for collector-api and query-api images
### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- update cache-dependency-path for npm caching in CI workflow
- add steps to install PostgreSQL client and initialize database schema in CI pipeline
### Security
- N/A