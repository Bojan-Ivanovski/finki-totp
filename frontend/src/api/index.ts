const VITE_BACKEND_APP_URL = import.meta.env.VITE_BACKEND_APP_URL || "";
const VITE_FRONTEND_APP_URL = import.meta.env.VITE_FRONTEND_APP_URL || "";

export async function getSecrets() {
  const res = await fetch(`${VITE_BACKEND_APP_URL}/get_secret`, { credentials: "include" });
  const temp = await res.json();
  return temp
}

export async function generateSecret() {
  const res = await fetch(`${VITE_BACKEND_APP_URL}/generate_secret`, {
    method: "GET",
    credentials: "include",
  });
  return await res.json();
}

export async function addSecret(secretName: string, secretValue: string) {
  const res = await fetch(`${VITE_BACKEND_APP_URL}/add_secret`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secretName, secretValue }),
  });
  return await res.json();
}

export async function removeSecret(secretId: string) {
  await fetch(`${VITE_BACKEND_APP_URL}/remove_secret`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secretId }),
  });
}

export async function verifyOTP(secret: string, code: string) {
  try {
    const res = await fetch(`${VITE_BACKEND_APP_URL}/verify_otp`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, code }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
}

export function logout() {
  fetch(`${VITE_BACKEND_APP_URL}/logout?redirect=${VITE_FRONTEND_APP_URL}`, {
    credentials: "include",
    method: "GET",
  }).then(() => {
    window.location.href = "/";
  }).catch((error) => {
    console.error("Logout failed:", error);
    window.location.href = "/";
  });
}
