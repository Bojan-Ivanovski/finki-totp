import { useRef, useState } from "react";
import { verifyOTP } from "../api";

export default function TOTPVerifyForm({ secret }: { secret: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<string | null>(null);

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const code = inputRef.current!.value;
      const res = await verifyOTP(secret, code);
      setResult(res.success ? "✅ Valid" : "❌ Invalid");
    }}>
      <input ref={inputRef} placeholder="Enter OTP" maxLength={6} required />
      <button type="submit">Verify</button>
      {result && <span>{result}</span>}
    </form>
  );
}