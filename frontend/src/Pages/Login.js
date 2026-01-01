// src/Pages/Login.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(""); // reset previous error

  const success = await login(email, password); // wait for login to finish
  if (!success) setError("Invalid email or password"); // show error message
};

  return (
    <div className="container py-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center text-danger mb-4">Login</h2>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input 
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="btn btn-danger w-100">Login</button>
      </form>

      <p className="mt-3 text-center text-muted">
        Admin: admin@restaurant.com / admin123 <br />
        Customer: customer@restaurant.com / cust123
      </p>
    </div>
  );
}

export default Login;