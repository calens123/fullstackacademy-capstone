import React, { useState } from "react";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Login failed");
        return;
      }

      const { token } = await response.json();
      sessionStorage.setItem("token", token); // Store JWT in sessionStorage
      alert("Login successful!");
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label>
        Email:
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
      </label>
      <br />
      <button type="submit">Log In</button>
    </form>
  );
};

export default LoginForm;
