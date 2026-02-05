import React from "react";

// Completely standalone auth page for testing
export default function StandaloneAuthPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("Sign in to PermitPath");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(`Submitted: ${email}`);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>PermitPath Auth</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>
        <button type="submit" style={{ padding: "12px", fontSize: "16px", cursor: "pointer" }}>
          Sign In
        </button>
      </form>
      <p style={{ marginTop: "20px", color: "#666" }}>
        <a href="/demo" style={{ color: "#0066cc" }}>Try Demo Mode</a>
      </p>
    </div>
  );
}