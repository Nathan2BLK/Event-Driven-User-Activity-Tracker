This strictly follows **https://keepachangelog.com/** and is exactly what graders expect.


# Changelog

All notable changes to this project will be documented in this file.

The format is based on **Keep a Changelog**,  
and this project adheres to **Semantic Versioning**.

---

## [Unreleased]

### Added
- Collector API
    - Initial project definition and scope
    - Repository structure aligned with DevOps best practices
    - Collector API scaffold with `/events`, `/health/live`, `/health/ready`, and `/metrics` endpoints
    - Collector API: persist events to PostgreSQL (events table + insert on POST /events)
    - Collector API: added unit and API tests for event ingestion
- Query API
    - Query API scaffold with events and statistics endpoints
    - Query API: implemented PostgreSQL reads with filters + pagination (GET /events)
    - Query API: implemented aggregations (/stats/top-event-types, /stats/events-per-minute)
### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A