import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("dark-mode") === "1");

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", dark);
    localStorage.setItem("dark-mode", dark ? "1" : "0");
  }, [dark]);

  return (
    <button className="dark-toggle" onClick={() => setDark((d) => !d)}>
      {dark ? 
        <span className="material-symbols-outlined">
          lightbulb
        </span>
      : 
        <span className="material-symbols-outlined">
          light_off
        </span>
      }
    </button>
  );
}