import { useState } from "react";

export default function SecretItem({
  secret,
  idx,
  seconds = 30,
  onDelete,
}: {
  secret: { [key: string]: any };// eslint-disable-line @typescript-eslint/no-explicit-any
  idx: number;
  seconds: number;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="dropdown" id={secret.id}>
      <div
        className="dropdown-header"
        onClick={() => setExpanded((v) => !v)}
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <i className="material-symbols-outlined trash-icon" onClick={(e) => { e.stopPropagation(); onDelete(); }}>delete_sweep</i>
        <span style={{textAlign: "center", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{secret.title}</span>
        <span className="material-symbols-outlined">
          {expanded ? "keyboard_double_arrow_down" : "keyboard_double_arrow_right"}
        </span>
      </div>
      {expanded && (
        <>
          <div className="dropdown-content-main" style={{ marginTop: 8}}>
            <span>{secret.value}</span>
            <span
              className="totp-timer"
              id={`timer${idx + 1}`}
              style={{ marginLeft: 18, fontSize: 15, color: "#888", display: "flex", alignItems: "center" }}
            >
              <i className="material-symbols-outlined" style={{ marginRight: 4 }}>timer</i>
              <span id={`timer-value${idx + 1}`}>{seconds}</span>s
            </span>
          </div>
          <div
            className="dropdown-content-main"
            style={{
              flexDirection: "column",
              alignItems: "center",
              padding: 16,
              display: "flex",
            }}
          >
            <img
              src={`data:image/png;base64,${secret.qr}`}
              alt="QR Code"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </>
      )}
    </div>
  );
}