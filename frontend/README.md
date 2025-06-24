# 🎨 Frontend – React (Vite) TOTP Web App

This folder contains the **React** frontend for FINKI-TOTP.

---

## Features

- Modern UI for managing TOTP secrets
- Google OAuth2 login flow
- QR code display for easy setup
- Dark/light mode toggle
- API integration with FastAPI backend

---

## Screenshots

<!-- Place your screenshots in a `screenshots/` folder at the root or inside `frontend/` and reference them here. -->
| Login Page                      | Dashboard                           | Add Secret Modal                          | TOTP Verification                 |
| ------------------------------- | ----------------------------------- | ----------------------------------------- | --------------------------------- |
| ![Login](../screenshots/login.png) | ![Dashboard](../screenshots/dashboard.png) | ![Add Secret](../screenshots/add_secret.png) | ![Verify](../screenshots/verify.png) |

> _Replace the above image links with your actual screenshots. You can take screenshots of:_
> - The login page (`/`)
> - The dashboard after login (`/app`)
> - The modal for adding a new secret
> - The TOTP verification form

---

## Project Structure

| File/Folder     | Purpose                          |
| --------------- | -------------------------------- |
| `src/`          | React source code                |
| `nginx.conf`    | Nginx config for production      |
| `Dockerfile`    | Containerization                 |
| `.env`          | Frontend environment variables   |

---

## Environment Variables

- `VITE_BACKEND_APP_URL` – URL to backend API (e.g., `/api`)

---

## How it Works

- **Login:** Users authenticate via Google OAuth2.  
  _Screenshot suggestion: login page with "Sign in with Google" button._
- **Dashboard:** After login, users see their TOTP secrets, can generate new ones, and view QR codes.  
  _Screenshot suggestion: dashboard with secrets list and QR codes._
- **Add Secret:** Users can add a new TOTP secret via a modal dialog.  
  _Screenshot suggestion: add secret modal open._
- **Verify TOTP:** Users can enter a secret and a code to verify if the TOTP is valid.  
  _Screenshot suggestion: verification form with result._

---

## Customization

- **Styling:** All styles are in `src/styles/`.
- **Routing:** See `src/App.tsx` for route definitions.
- **API Calls:** All backend communication is in `src/api/index.ts`.

---

## Notes

- Make sure your backend is running and accessible at the URL specified in `VITE_BACKEND_APP_URL`.
- For production, the app is served via Nginx (see `nginx.conf`).

---

## Contributing

Feel free to open issues or PRs for improvements!

---
