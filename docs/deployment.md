# Local deployment (Docker Compose)
## Prerequisites
- Docker Desktop installed and running
- A .env file at the repository root containing your DB/app variables (same contract as K8s)

Typical .env keys:
- POSTGRES_HOST
- POSTGRES_PORT
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD
- COLLECTOR_PORT
- QUERY_PORT

## Start the stack
From the repository root:
```bash
cd infra/docker-compose
docker compose --env-file ../../.env up -d --build
```
## Verify containers
```bash
docker compose ps
docker compose logs -f --tail=100
```

## Smoke test (end-to-end)
Collector health:
```bash
curl http://localhost:3000/health/live
curl http://localhost:3000/health/ready
```


Insert an event:
```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{"userId":"u_local","sessionId":"s_local","eventType":"PAGE_VIEW"}'
  ```


Query it back:
```bash
curl "http://localhost:3001/events?userId=u_local&limit=10"
curl "http://localhost:3001/stats/top-event-types?limit=5"
```

## Stop & clean
Stop containers:
```bash
docker compose down
```
Stop + remove volumes (⚠️ deletes DB data):
```bash
docker compose down -v
```

# Kubernetes local deployment (Minikube)
Prerequisites
- kubectl
- minikube
- Docker Desktop (recommended with Minikube on Windows)
## Start Minikube
```bash
minikube start
```

## Build images into Minikube (important)

Kubernetes needs container images. For local dev, we build directly into Minikube’s Docker daemon:
```bash
eval $(minikube -p minikube docker-env)
docker build -t event-tracker/collector-api:dev ./apps/collector-api
docker build -t event-tracker/query-api:dev ./apps/query-api
```
## Deploy base stack
Apply the base manifests:
```bash
kubectl apply -f k8s/base
```

## Verify rollout
```bash
kubectl -n event-tracker get pods
kubectl -n event-tracker get svc
kubectl -n event-tracker get pvc
```
Expected:
- collector, query, postgres pods are Running/Ready
- postgres-pvc is Bound
- query Service is NodePort (e.g. 30081)

## Access Query API (NodePort)
```bash
minikube ip
```


Then:
```bash
curl http://<minikube-ip>:30081/health/live
curl http://<minikube-ip>:30081/events?limit=5
```

## Insert events via Collector API (ClusterIP)

Collector is internal (ClusterIP), so use port-forward:
```bash
kubectl -n event-tracker port-forward svc/collector 3000:3000
```

Then:
```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{"userId":"u_k8s","sessionId":"s_k8s","eventType":"PAGE_VIEW"}'
```

Validate from Query:
```bash
curl "http://<minikube-ip>:30081/events?userId=u_k8s&limit=10"
```
# GitOps deployment with ArgoCD (how it works + how to operate it)
# Concept: GitOps reconciliation

ArgoCD implements a reconciliation loop:

1. You define the desired state in Git (Kubernetes YAML manifests).

2. ArgoCD continuously compares:
    - Git desired state vs Cluster live state

3. If there is drift:

    - ArgoCD applies the Git state (self-heal)

4. If something is removed from Git:

    - ArgoCD prunes it from the cluster (if enabled)

Result: Git becomes the single source of truth.

## Install ArgoCD in the cluster
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd get pods -w
```
Wait until ArgoCD pods are Ready.

## Access the ArgoCD UI

Port-forward the API server:
```bash
kubectl -n argocd port-forward svc/argocd-server 8080:443
```

Open:
- https://localhost:8080

Get initial admin password:
```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d && echo
  ```


Login:
- username: admin
- password: output of the command

## Deploy the ArgoCD Application (GitOps definition)

This repository includes an ArgoCD Application manifest (example):
- k8s/argocd/event-tracker-app.yaml

Apply it:
```bash
kubectl apply -f k8s/argocd/event-tracker-app.yaml
kubectl -n argocd get applications
kubectl -n argocd describe application event-tracker
```
Expected:
- Sync Status: Synced

- Health Status: Healthy

![argocd UI](image\argocd_gitops.png)

## What ArgoCD is syncing here
The Application points to:
- repoURL: your GitHub repo
- targetRevision: main
- path: k8s/base
- destination namespace: event-tracker
- sync policy:
    - automated.prune: true
    - automated.selfHeal: true

So:
- Any change you merge into main under k8s/base gets deployed automatically.
- Manual kubectl changes get reverted (drift correction).

## Practical workflow with GitOps
Do not apply base manifests manually once GitOps is enabled. Instead:
1. Edit manifests in Git (k8s/base)
2. Commit + PR + merge
3. ArgoCD syncs automatically

**Validate:**
```bash
kubectl -n event-tracker get pods
kubectl -n argocd get applications
```
## If you need to stop GitOps temporarily
In ArgoCD UI:
- Disable Auto-Sync for the application
(or **remove syncPolicy.automated** in the Application manifest)

This is useful if you want to test manual changes without ArgoCD reverting them.

# Vagrant + Ansible deployment (exam requirement)

This project includes a full Infrastructure-as-Code setup using Vagrant and Ansible.

## Prerequisites
- VirtualBox
- Vagrant
- Ansible

## Start the environment
```bash
vagrant up
```

# Prometheus + Grafana (how it works + how to validate)
## Observability architecture
- Both APIs expose Prometheus metrics at GET /metrics
- Prometheus scrapes those endpoints periodically.
- Grafana queries Prometheus as a datasource.
- Dashboards visualize:
    - RPS (requests/sec)
    - p95 latency
    - ingestion throughput
    - DB query latency

## Deploy Prometheus
If you keep monitoring in **k8s/monitoring**:
```bash
kubectl apply -f k8s/monitoring
```

Verify:
```bash
kubectl -n event-tracker rollout status deploy/prometheus --timeout=120s
kubectl -n event-tracker get pods -l app=prometheus
kubectl -n event-tracker get svc prometheus
```
Access Prometheus UI (NodePort example 30090):
```bash
minikube ip
```
Open:
- **http://minikube-ip:30090**
Validate scraping:
- Prometheus UI → Status → Targets
- collector-api and query-api must be UP

Hard check from inside the cluster:
```bash
kubectl -n event-tracker exec -it deploy/prometheus -- wget -qO- http://collector:3000/metrics | head
kubectl -n event-tracker exec -it deploy/prometheus -- wget -qO- http://query:3001/metrics | head
```

## Deploy Grafana
```bash
kubectl apply -f k8s/monitoring/grafana
kubectl -n event-tracker rollout status deploy/grafana --timeout=120s
kubectl -n event-tracker get svc grafana
```
Access Grafana (NodePort example 30030):
```bash
minikube ip
```

Open:
- http://minikube-ip:30030

Login (dev defaults):
- user: admin
- password: admin

Grafana is provisioned to:
- use Prometheus datasource: http://prometheus:9090
- load dashboards from ConfigMaps (no manual clicks required)

## Generate traffic so dashboards show data

Port-forward collector:
```bash
kubectl -n event-tracker port-forward svc/collector 3000:3000
```
Generate ingestion events:
```bash
for i in $(seq 1 50); do
  curl -s -X POST http://localhost:3000/events \
    -H "Content-Type: application/json" \
    -d '{"userId":"u_dash","sessionId":"s_dash","eventType":"PAGE_VIEW"}' >/dev/null
done
```
Hit query endpoints:
```bash
curl "http://<minikube-ip>:30081/events?userId=u_dash&limit=10" >/dev/null
curl "http://<minikube-ip>:30081/stats/top-event-types?limit=5" >/dev/null
```
Now check Grafana dashboard panels: curves should move.

# Troubleshooting quick guide
## Pods not Ready / CrashLoopBackOff
```bash
kubectl -n event-tracker get pods
kubectl -n event-tracker describe pod <pod>
kubectl -n event-tracker logs <pod> --tail=200
```

## PVC stuck Pending
```bash
kubectl -n event-tracker get pvc
kubectl get storageclass
```

## Prometheus target DOWN
- Check service DNS from inside Prometheus:
```bash
kubectl -n event-tracker exec -it deploy/prometheus -- wget -qO- http://collector:3000/metrics | head
```
## Grafana shows “Datasource unreachable”
- Check Prometheus service:
```bash
kubectl -n event-tracker exec -it deploy/grafana -- wget -qO- http://prometheus:9090/-/ready
```
