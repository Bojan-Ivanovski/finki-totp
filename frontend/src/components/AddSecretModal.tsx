import { useRef } from "react";
import { addSecret } from "../api";

export default function AddSecretModal({
  open,
  onClose,
  setSecrets,
  refreshSecrets, // <-- add this prop
}: {
  open: boolean;
  onClose: () => void;
  setSecrets: any;
  refreshSecrets: () => void; // <-- add this prop type
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const secretRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  return (
    <div className="modal">
      <form
        className="modal-content"
        onSubmit={async (e) => {
          e.preventDefault();
          const name = nameRef.current!.value;
          const secret = secretRef.current!.value;
          const res = await addSecret(name, secret);
          setSecrets((prev: any[]) => [
            ...prev,
            { id: Math.random().toString(), name, secret },
          ]);
          await refreshSecrets(); // <-- call refreshSecrets after adding
          onClose();
        }}
      >
        <h2>Add Secret</h2>
        <input ref={nameRef} placeholder="Name" required />
        <input ref={secretRef} placeholder="Secret (Base32)" required />
        <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
          <button type="submit">Add</button>
          <button type="button" onClick={onClose} style={{ backgroundColor: "#f44336", color: "white" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}