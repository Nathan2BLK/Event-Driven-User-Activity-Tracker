# GitOps with ArgoCD (Dev)

## Install ArgoCD
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd port-forward svc/argocd-server 8080:443
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo
```
Login: user admin, password from the secret.

## Sync this repository

This repo contains an ArgoCD Application manifest:
- k8s/argocd/event-tracker-app.yaml

It is configured to sync:
- repo path: k8s/base
- destination namespace: event-tracker

Apply it:
```bash
kubectl apply -f k8s/argocd/event-tracker-app.yaml
kubectl -n argocd get applications
```