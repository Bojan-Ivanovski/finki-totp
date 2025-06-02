const VITE_BACKEND_APP_URL = import.meta.env.VITE_BACKEND_APP_URL || "";
const VITE_FRONTEND_APP_URL = import.meta.env.VITE_FRONTEND_APP_URL || "";

export default function LoginButton() {
  return (
    <a className="google-btn" href={`${VITE_BACKEND_APP_URL}/login?redirect=${VITE_FRONTEND_APP_URL}/app`}>
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={22} style={{marginRight:8}} />
      Sign in with Google
    </a>
  );
}