import React, { useEffect, useState } from "react";

export default function App() {
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:3001/hello")
      .then((r) => r.json())
      .then((j) => setMsg(j.message))
      .catch(() => setMsg("Backend not running"));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>GameBox</h1>
      <p>{msg}</p>
    </div>
  );
}
