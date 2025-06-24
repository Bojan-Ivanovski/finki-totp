# ☸️ Kubernetes Deployment for FINKI-TOTP

This folder contains **Kubernetes manifests** for deploying the FINKI-TOTP stack, including the backend, frontend, and PostgreSQL database.

---

## Structure

| Folder/File      | Purpose                              |
| ---------------- | ------------------------------------ |
| `base/`          | Base manifests for all core services  |
| `ingress/`       | Ingress resource for HTTP routing     |

---

## Components

- **Backend** (`backend.yaml`): FastAPI backend deployment and service.
- **Frontend** (`frontend.yaml`): React frontend deployment and service.
- **Postgres** (`postgres.yaml`): PostgreSQL StatefulSet and service, with persistent storage.
- **ConfigMaps** (`configmaps.yaml`): Environment variables and database initialization SQL.
- **Ingress** (`ingress/ingress.yaml`): NGINX Ingress resource for routing `/api` to backend and `/` to frontend.

---

## How to Deploy

1. **Set up your Kubernetes cluster**  
   You can use [K3D](https://k3d.io/) to run a lightweight Kubernetes cluster in Docker containers:
   ```sh
   k3d cluster create finki-totp --api-port 6550 -p "1212:80@loadbalancer"
   ```

2. **Apply ConfigMaps and Secrets**  
   Make sure to create the required secrets (e.g., `finki-totp-secrets`) for sensitive environment variables:
   ```sh
   kubectl create secret generic finki-totp-secrets \
     --from-literal=DB_USERNAME=postgres \
     --from-literal=DB_PASSWORD=admin \
     --from-literal=GOOGLE_CLIENT_ID=your-google-client-id \
     --from-literal=GOOGLE_CLIENT_SECRET=your-google-client-secret \
     --from-literal=SECRET_KEY=your-secret-key
   ```
   Then apply the config maps:
   ```sh
   kubectl apply -f base/configmaps.yaml
   ```

3. **Deploy the core services**
   ```sh
   kubectl apply -f base/postgres.yaml
   kubectl apply -f base/backend.yaml
   kubectl apply -f base/frontend.yaml
   ```

4. **Set up Ingress**
   - Make sure you have an NGINX Ingress controller installed in your K3D cluster.  
     You can install it with:
     ```sh
     kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/kind/deploy.yaml
     ```
   - Apply the ingress manifest:
     ```sh
     kubectl apply -f ingress/ingress.yaml
     ```
   - Edit the `host` field in `ingress.yaml` to match your domain or use `localhost`.

5. **Access the Application**
   - The Ingress routes `/api` to the backend and `/` to the frontend.
   - With the K3D port mapping above, open your browser at [http://localhost:1212](http://localhost:1212).

---

## File Descriptions

### `base/backend.yaml`
- Deploys the backend as a Deployment and exposes it as a Service on port 7777.
- Loads environment variables from secrets and config maps.

### `base/frontend.yaml`
- Deploys the frontend as a Deployment and exposes it as a Service on port 5555.

### `base/postgres.yaml`
- Deploys PostgreSQL as a StatefulSet with persistent storage.
- Initializes the database using the SQL from the `init-sql` ConfigMap.

### `base/configmaps.yaml`
- Sets non-sensitive environment variables for the backend and database.
- Provides the database initialization SQL.

### `ingress/ingress.yaml`
- Configures HTTP routing:
  - `/api` → backend service (port 7777)
  - `/`    → frontend service (port 5555)
- Set the `host` field to your domain or local IP.

---

## Notes

- **Persistent Storage:** PostgreSQL uses a PersistentVolumeClaim for data durability.
- **Secrets:** Sensitive data (DB credentials, OAuth secrets) should always be stored in Kubernetes Secrets, not ConfigMaps.
- **Scaling:** You can increase the number of replicas for frontend/backend in their respective manifests.
- **Customization:** Update image names/tags as needed for your Docker registry.

---

## Troubleshooting

- Ensure all pods are running: `kubectl get pods`
- Check logs for errors: `kubectl logs <pod-name>`
- If using K3D, make sure your port mappings are correct (e.g., `1212:80@loadbalancer`).

---

## References

- [K3D Documentation](https://k3d.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)