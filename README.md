# 🎓 FINKI-TOTP: Secure TOTP Authenticator & CI/CD Demo

This repository contains **two integrated projects** for university coursework:

1. **FINKI-TOTP**: A secure, modern web application for managing and generating Time-based One-Time Passwords (TOTP), featuring Google OAuth2 authentication, per-user encrypted secret storage, and a stylish frontend.
2. **CI/CD & Deployment**: A demonstration of modern DevOps practices, including Dockerization, GitHub Actions CI/CD pipeline, and Kubernetes manifests for scalable deployment.

---

## 📁 Repository Structure

| Folder/File    | Description                                 |
| -------------- | ------------------------------------------- |
| `backend/`     | FastAPI backend for TOTP logic & API        |
| `frontend/`    | React (Vite) frontend web application       |
| `kubernetes/`  | Kubernetes manifests for deployment         |
| `.github/`     | GitHub Actions CI/CD workflows              |
| `init.sql`     | Postgres DB initialization script           |
| `docker-compose.yaml` | Local multi-container setup          |
| `.env`         | Environment variables (root)                |

---

## 🚀 Quick Start

1. **Clone the repository**  
   `git clone git@github.com:Bojan-Ivanovski/finki-totp.git`

2. **Set up environment variables**  
   Follow the example bellow on how to fill out the `.env`.

3. **Set up Nginx configuration**  
   Make sure the `nginx.conf` file is present at the root of the repository (or as specified in `docker-compose.yaml`).  
   This file configures Nginx to reverse proxy requests to the frontend and backend containers.  
   If you want to customize ports or proxy rules, edit `nginx.conf` accordingly.

3. **Run locally with Docker Compose**  
   ```sh
   docker-compose up --build
   ```

4. **Access the app**  
   - Frontend: [http://localhost:1212/](http://localhost:1212)
   - Backend: [http://localhost:1212/api](http://localhost:1212/api)

---

## ⚙️ Environment Variables Setup

To run the project, you need to configure several environment variables in a `.env` file at the root of the repository.  
You can use the provided `.env.example` as a template.

| Variable Name         | Description                                                                 |
|---------------------- |-----------------------------------------------------------------------------|
| `GOOGLE_CLIENT_ID`    | Google OAuth2 Client ID (from Google Cloud Console)                         |
| `GOOGLE_CLIENT_SECRET`| Google OAuth2 Client Secret (from Google Cloud Console)                     |
| `SECRET_KEY`          | Secret key for backend session signing and encryption                        |
| `DB_HOST`             | Hostname or IP address of the Postgres database (e.g. `postgres` for Docker)|
| `DB_PORT`             | Database port (default: `5432`)                                             |
| `DB_USERNAME`         | Database username (e.g. `postgres`)                                         |
| `DB_PASSWORD`         | Database password                                                           |
| `DB_NAME`             | Database name (e.g. `finki_totp`)                                           |

**Example `.env` file:**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SECRET_KEY=your-random-secret-key
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_NAME=finki_totp
```

> ⚠️ **Never commit your real secrets to version control!**  
> For Google OAuth, register your app at [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and set the correct redirect URIs.

---

## 📦 Project 1: FINKI-TOTP

A full-stack TOTP manager with:
- Google OAuth2 login
- Per-user secret storage (Postgres)
- TOTP generation/verification (RFC 6238)
- QR code provisioning
- Modern React UI

See [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md) for details.

---

## 🛠️ Project 2: CI/CD & Kubernetes

- **Dockerized** backend, frontend, and database
- **GitHub Actions** for build/test/deploy
- **Kubernetes** manifests for scalable cloud deployment

See [`kubernetes/README.md`](kubernetes/README.md) and [`.github/README.md`](.github/README.md).

---

## 📚 More

- [Backend API Reference](backend/README.md)
- [Frontend Usage Guide](frontend/README.md)
- [Kubernetes Deployment](kubernetes/README.md)

---