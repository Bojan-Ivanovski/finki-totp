import LoginButton from "../components/LoginButton";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Home() {
  return (
    <>
      <DarkModeToggle />
      <div className="home-content">
        <div className="hero-left">
          <h1>
            <i className="material-symbols-outlined">
              encrypted
            </i>
            <div style={{display: "flex", flexDirection: "column"}}>
              <span style={{ color: "#1976d2" }}>Finki</span> 
              <span>TOTP</span>
            </div>
          </h1>
          <p style={{ fontWeight: 500, marginTop: "1.5rem" }}>
            Modern, Secure, and Simple<br />
            <span style={{ fontWeight: 400, fontSize: "1rem" }}>
              Store your secrets and generate TOTP codes with confidence.
            </span>
          </p>
        </div>
        <div className="hero-right">
          <div className="hero-links">
            <a
              href="https://github.com/Bojan-Ivanovski/finki-totp"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-link"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{verticalAlign: "middle", marginRight: 4}}><path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"/></svg>
              Repository
            </a>
            <a
              href="https://github.com/Bojan-Ivanovski/finki-totp#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-link"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{verticalAlign: "middle", marginRight: 4}}><path fill="currentColor" d="M19 2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 18H8V4h11zm-2-8h-7v2h7zm0-4h-7v2h7z"/></svg>
              Documentation
            </a>
          </div>
          <LoginButton />
        </div>
      </div>
    </>
  );
}