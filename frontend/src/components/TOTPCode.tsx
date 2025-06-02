import { useRef } from "react";

export default function TOTPCode() {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = value;

    if (value.length === 1 && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!paste) return;
    for (let i = 0; i < 6; i++) {
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = paste[i] || "";
      }
    }
    const lastIdx = Math.min(paste.length, 6) - 1;
    if (lastIdx >= 0) {
      inputsRef.current[lastIdx]?.focus();
    }
  };

  return (
    <div id="otpInputs">
      {[...Array(6)].map((_, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="otp-box"
          ref={el => { inputsRef.current[idx] = el; }}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          onPaste={idx === 0 ? handlePaste : undefined}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}