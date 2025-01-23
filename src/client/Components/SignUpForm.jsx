import React, { useState } from "react";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Sign-up failed");
        return;
      }

      const { token } = await response.json();
      sessionStorage.setItem("token", token); // Store JWT in sessionStorage
      alert("Sign-up successful! You're now logged in.");
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label>
        Username:
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />
      </label>
      <br />
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
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpForm;
