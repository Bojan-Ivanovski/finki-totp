import { useEffect, useState, useCallback, useRef } from "react";
import { getSecrets, logout, verifyOTP, generateSecret } from "../api";
import { useNavigate } from "react-router-dom";
import SecretList from "../components/SecretList";
import AddSecretModal from "../components/AddSecretModal";
import DarkModeToggle from "../components/DarkModeToggle";
import TOTPCode from "../components/TOTPCode";

export default function Dashboard() {
  const secretRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [secrets, setSecrets] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [showAdd, setShowAdd] = useState(false);
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchSecrets = useCallback(() => {
    getSecrets()
      .then((data) => setSecrets(data.secrets || []))
      .catch(() => {
        navigate("/", { replace: true });
      });
  }, [navigate]);

  useEffect(() => {
    fetchSecrets();
  }, []);

  return (
    <div className="main-dashboard">
      <DarkModeToggle />
      <div className="dashboard" style={{ marginBottom: "50px" }}>
        <form
          id="generate-totp-form"
          onSubmit={async (e) => {
        e.preventDefault();
        const res = await generateSecret();
        setGeneratedSecret(res.value);
        setQrCode(res.qr);
          }}
        >
          <h2>Generate TOTP Secret</h2>
          <button type="submit" className="verify-button">Generate</button>
          {generatedSecret && (
        <>
          <h3>{generatedSecret}</h3>
          {qrCode && <img
              src={`data:image/png;base64,${qrCode}`}
              alt="QR Code"
              style={{ width: "100%", height: "auto" }}
            />}
        </>
          )}
        </form>
      </div>
      <div className="dashboard" style={{ marginBottom: "50px" }}>
        <form id="verify-totp-form" onSubmit={async (e) => {
              e.preventDefault();
              const res = await verifyOTP(secretRef.current!.value, code);
              setResult(res.success ? "✅ Valid" : "❌ Invalid");
        }}>
          <h2>Verify TOTP</h2>
          <input maxLength={16} minLength={16} type="text" id="verify-secret" name="secret" required placeholder="Enter secret" ref={secretRef} aria-required/>
          <TOTPCode setCode={setCode} />
          <button type="submit" className="verify-button">Verify</button>
          <div id="verifyResult">{result}</div>
        </form>
      </div>
      <div className="dashboard">
        <button className="logout-button" onClick={logout}>
          <span className="material-symbols-outlined">
            logout
          </span>
        </button>
        <h2 style={{ marginBottom: 20 }}>Your TOTP Secrets</h2>
        <SecretList secrets={secrets} refreshSecrets={fetchSecrets} />
      </div>
      <button className="fab" onClick={() => setShowAdd(true)}>+</button>
      <AddSecretModal open={showAdd} onClose={() => setShowAdd(false)} refreshSecrets={fetchSecrets}/>
    </div>
  );
}