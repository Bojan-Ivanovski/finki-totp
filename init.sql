CREATE DATABASE finki_totp;

\connect finki_totp;

CREATE TABLE users (
    google_id VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE secrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),   
    title VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) NOT NULL REFERENCES users(google_id),
    otp_secret VARCHAR(255) NOT NULL
);
