import { useEffect, useState } from "react";
import SecretItem from "./SecretItem";
import { removeSecret } from "../api";

export default function SecretList({ secrets, refreshSecrets }: { secrets: any[], refreshSecrets: () => void }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const [seconds, setSeconds] = useState(() => {
    const now = Date.now();
    return 30 - (Math.floor(now / 1000) % 30);
  });

  useEffect(() => {
    // Calculate ms until next 30s boundary
    const now = Date.now();
    const secondsNow = Math.floor(now / 1000);
    const msToNext30 = (30 - (secondsNow % 30)) * 1000 - (now % 1000);

    // Refresh at the next 30s boundary, then every 30s
    const timeout = setTimeout(() => {
      refreshSecrets();
      const interval = setInterval(refreshSecrets, 30000);
      return () => clearInterval(interval);
    }, msToNext30);

    return () => clearTimeout(timeout);
  }, [refreshSecrets]);

  useEffect(() => {
    const updateSeconds = () => {
      const now = Date.now();
      setSeconds(30 - (Math.floor(now / 1000) % 30));
    };
    updateSeconds();
    const interval = setInterval(updateSeconds, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!secrets.length) return <p>No secrets yet.</p>;
  return (
    <ul className="secret-list">
      {secrets.map((s, idx) => (
        <SecretItem
          key={s.id}
          secret={s}
          idx={idx}
          seconds={seconds}
          onDelete={async () => {
            await removeSecret(s.id);
            refreshSecrets();
          }}
        />
      ))}
    </ul>
  );
}
