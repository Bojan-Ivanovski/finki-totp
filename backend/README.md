# 🛡️ Backend – FastAPI TOTP Service

This folder contains the **FastAPI** backend for the FINKI-TOTP project.

## Features

- **Google OAuth2** authentication  
- **Per-user secret storage** (PostgreSQL)  
- **TOTP generation & verification** ([RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238), custom implementation)  
- **RESTful API** for frontend integration  
- **QR code** provisioning for authenticator apps  


---

## Main Files

| File           | Purpose                                 |
| -------------- | --------------------------------------- |
| `main.py`      | FastAPI app, routes, OAuth2 logic       |
| `otp.py`       | Custom TOTP implementation (RFC 6238)   |
| `database.py`  | DB connection & models                  |
| `requirements.txt` | Python dependencies                 |
| `Dockerfile`   | Containerization                        |

---

## Environment Variables

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` – Google OAuth2 credentials
- `SECRET_KEY` – Secret key for session management
- `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` – PostgreSQL connection

---


## API Endpoints

| Method | Endpoint              | Description                                         | Auth Required |
|--------|-----------------------|-----------------------------------------------------|--------------|
| GET    | `/api/login`          | Start Google OAuth2 login                           | No           |
| GET    | `/api/logout`         | Logout user and clear session                       | Yes          |
| GET    | `/api/auth`           | Google OAuth2 callback, sets session                | No           |
| GET    | `/api/get_secret`     | Get all user secrets & current TOTP codes           | Yes          |
| POST   | `/api/add_secret`     | Add a new TOTP secret for the user                  | Yes          |
| POST   | `/api/remove_secret`  | Remove a secret by ID                               | Yes          |
| POST   | `/api/verify_otp`     | Verify a TOTP code for a secret                     | Yes          |
| GET    | `/api/generate_secret`| Generate a new random TOTP secret & QR code         | Yes          |

---

## How TOTP Works (RFC 6238)

The TOTP logic is implemented in `otp.py` and follows RFC 6238:

This backend implements the [Time-based One-Time Password (TOTP)](https://datatracker.ietf.org/doc/html/rfc6238) algorithm, which is widely used for two-factor authentication (2FA).  
TOTP codes are generated using a shared secret and the current time, ensuring that codes are valid only for a short window (typically 30 seconds).

**Key steps in the implementation:**
- The secret is stored per user (base32 encoded).
- The code is generated using HMAC-SHA256, the current time, and dynamic truncation.
- The backend provides endpoints for generating, verifying, and managing TOTP secrets.

---

## Implementation Details

#### 1. Initialization

- **secret**: The shared secret, base32 encoded (as used by most authenticator apps).
- **time_step**: The time window in seconds (default: 30s).
- **digits**: Number of digits in the OTP code (default: 6).

#### 2. HMAC Calculation  
  - HMAC-SHA256 is used with the secret and a time-based counter.
#### 3. Dynamic Truncation  
  - The offset is determined from the last nibble of the HMAC hash, and a 6-digit code is generated.
#### 4. Multiple Windows 
  - The backend generates OTPs for the previous, current, and next time window to account for clock skew.
#### 5. QR Code Generation  
  - The backend can generate an [otpauth URI](https://github.com/google/google-authenticator/wiki/Key-Uri-Format) and a QR code for easy setup in authenticator apps.

---

## Usage Example

```python
otp = OTP(secret="BASE32SECRET")
past, current, future = otp.generate_otp()
print("Current OTP:", current)
qr_base64 = OTP.generate_qr_code("BASE32SECRET", "user@example.com")

```

---

## References

- [RFC 6238: TOTP: Time-Based One-Time Password Algorithm](https://datatracker.ietf.org/doc/html/rfc6238)
- [RFC 4226: HOTP: An HMAC-Based One-Time Password Algorithm](https://datatracker.ietf.org/doc/html/rfc4226)