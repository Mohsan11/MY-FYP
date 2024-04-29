import React, { useState } from "react";
import Navbar from "../../NavBar/nav.js";
import "./coordinator.css";
import logo from "../../Resources/logo.png";
import { useHistory } from "react-router-dom";

const Coordinator = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        // Optionally, redirect to another page on successful login
        console.log("Login successful");
      } else {
        // Handle login failure, display error message, etc.
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Reset the form after submission
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <Navbar />
      <div className="container2">
        <img src={logo} alt="Logo"></img>
      </div>
      <div className="login-form-container">
        <h2>Coordinator Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button className="button2" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Coordinator;
