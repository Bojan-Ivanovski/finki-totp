# 🎓 FINKI-TOTP: Secure TOTP Authenticator & Manager

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [TOTP Implementation](#totp-implementation)
- [Web Interface](#web-interface)
- [Google Authentication](#google-authentication)
- [Secret Storage](#secret-storage)
- [Setup & Installation](#setup--installation)
- [Usage Guide](#usage-guide)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**FINKI-TOTP** is a modern, secure, and user-friendly web application for storing, generating and verifying Time-based One-Time Passwords (TOTP), built for a school project.  
It goes beyond the basic requirements by providing:

- A stylish web interface for managing secrets and generating TOTP codes
- Google OAuth2 authentication for secure login
- Per-user secret storage
- QR code provisioning for easy setup with authenticator apps

---

## Features

| Feature                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| 🔒 TOTP Generation     | RFC 6238-compliant TOTP codes (6 digits, 30s window)                        |
| ✅ TOTP Verification   | Server-side verification of user-provided codes                              |
| 🖥️ Web Interface      | Responsive, modern UI for managing secrets and codes                         |
| 🗝️ Secret Storage     | Per-user encrypted storage of TOTP secrets                                   |
| 📷 QR Code Provision  | QR code generation for easy authenticator app setup                          |
| 🔐 Google Auth         | Secure login via Google OAuth2                                              |
| 🌗 Dark Mode           | Toggleable dark/light mode for accessibility                                |

---

## Screenshots

| Login Page | App Dashboard | Add Secret Modal | TOTP Verification |
|------------|--------------|------------------|-------------------|
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) | ![Add Secret](screenshots/add_secret.png) | ![Verify](screenshots/verify.png) |

> _Replace the above image links with your actual screenshots._

---

## Architecture

```mermaid
flowchart TD
    A[User] -- Google OAuth2 --> B[FastAPI Backend]
    B -- Serves --> C[Web UI (HTML/JS/CSS)]
    B -- Reads/Writes --> D[User Secrets JSON]
    B -- Generates --> E[TOTP Codes & QR Codes]
    C -- AJAX --> B
```

---

## API Reference

| Method | Endpoint           | Description                        | Request Body                        | Response Example                | Auth Required |
|--------|--------------------|------------------------------------|-------------------------------------|----------------------------------|--------------|
| GET    | `/`                | Main landing page                  | -                                   | HTML                            | No           |
| GET    | `/login`           | Start Google OAuth2 login          | -                                   | Redirect                        | No           |
| GET    | `/auth`            | Google OAuth2 callback             | -                                   | Redirect                        | No           |
| GET    | `/app`             | Main app dashboard                 | -                                   | HTML                            | Yes          |
| GET    | `/app/get_secret`  | Get all user secrets & TOTP codes  | -                                   | `{ secrets: [...] }`            | Yes          |
| POST   | `/add_secret`      | Add a new TOTP secret              | `{ secretName, secretValue }`       | `{}`                            | Yes          |
| POST   | `/remove_secret`   | Remove a secret by ID              | `{ secretId }`                      | `{ success, message }`          | Yes          |
| POST   | `/verify_otp`      | Verify a TOTP code for a secret    | `{ secret, code }`                  | `{ success, message }`          | Yes          |
| GET    | `/logout`          | Logout user                        | -                                   | Redirect                        | Yes          |

---

## TOTP Implementation

### What is TOTP?

TOTP (Time-based One-Time Password) is a widely used algorithm for generating short-lived, one-time codes based on a shared secret and the current time.  
It is the standard behind Google Authenticator, Microsoft Authenticator, and many 2FA systems.

### How TOTP is Implemented Here

- **Algorithm:**  
  - Follows [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238)
  - Uses HMAC-SHA1, 6 digits, 30-second time window
- **Python Implementation:**  
  - Custom `OTP` class in [`otp.py`](otp.py)
  - No external TOTP libraries used—demonstrates understanding of the algorithm

#### Key Steps

1. **Secret Handling:**  
   - User secrets are stored in base32 encoding.
   - Decoded and used as the HMAC key.

2. **Counter Calculation:**  
   - Counter = `current_unix_time // 30`

3. **HMAC Calculation:**  
   - HMAC-SHA1(secret, counter_bytes)

4. **Dynamic Truncation:**  
   - Offset from last nibble of HMAC result
   - Extracts 4 bytes, masks to 31 bits, then modulo 1,000,000

5. **Multiple Windows:**  
   - Accepts previous, current, and next 30s window for tolerance

#### Example Code

```python
# otp.py
def generate_otp(self) -> tuple[int, int]:
    current_time = int(time.time())
    # Generate for past, current, and future window
    return (
        self.generate_otp_from_timestamp(current_time - 30),
        self.generate_otp_from_timestamp(current_time),
        self.generate_otp_from_timestamp(current_time + 30),
    )
```

#### QR Code Provisioning

- Generates a QR code with the `otpauth://` URI scheme
- Can be scanned by Google Authenticator, Authy, etc.

```python
@staticmethod
def generate_qr_code(secret: str, email: str) -> str:
    img = qrcode.make(f"otpauth://totp/FINKI-TOTP:{email}?secret={secret}&issuer=FINKI-TOTP")
    # Returns base64-encoded PNG for embedding in HTML
```

---

## Web Interface

- **Modern, responsive design** using HTML, CSS, and vanilla JS
- **Dark mode** toggle (persists via `localStorage`)
- **Secret management:**  
  - Add, view, and remove TOTP secrets
  - Each secret displays:
    - Name
    - Current TOTP code (auto-refreshes every 30s)
    - QR code for authenticator setup
- **TOTP Verification:**  
  - Enter a secret and code to verify validity

> _See screenshots above for UI examples._

---

## Google Authentication

- **OAuth2 login** via Google (using `authlib`)
- **No passwords stored**—secure and user-friendly
- **Session-based authentication** using FastAPI's session middleware

---

## Secret Storage

- **Per-user storage:**  
  - Each user's secrets are stored under their Google account ID in `user_secrets.json`
- **Structure Example:**

```json
{
  "google-user-id-123": {
    "secrets": [
      {
        "id": "uuid-1",
        "name": "GitHub",
        "secret": "BASE32SECRET"
      }
    ]
  }
}
```

- **No secrets are ever sent to other users.**

---

## Setup & Installation

### Prerequisites

- Python 3.8+
- Google OAuth2 credentials (set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SECRET_KEY` in `.env`)

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the App

```bash
uvicorn main:app --reload
```

### Environment Variables (`.env`)

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SECRET_KEY=your-random-secret-key
```

---

## Usage Guide

1. **Open the app** in your browser (`http://localhost:8000`)
2. **Sign in with Google**
3. **Add a new secret** (base32, e.g., from a service you want to protect)
4. **Scan the QR code** with your authenticator app
5. **Use the generated TOTP code** for 2FA or test verification
6. **Manage your secrets** (view, remove, verify)

---

## File Structure

```
finki-totp/
│
├── main.py           # FastAPI backend, API endpoints, session management
├── otp.py            # Custom TOTP implementation & QR code generation
├── app.html          # Main web app interface
├── main.html         # Landing/login page
├── requirements.txt  # Python dependencies
├── user_secrets.json # (auto-created) User secrets storage
└── .env              # (not included) Environment variables
```

