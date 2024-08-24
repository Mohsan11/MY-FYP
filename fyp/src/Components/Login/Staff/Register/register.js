import React, { useState } from "react";
import Navbar from "../../../NavBar/nav";
// import "./register.css";
import logo from "../../../Resources/logo.png";
import { useNavigate } from "react-router-dom";

const RegisterCoordinator = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role: "Coordinator",
        }),
      });

      if (response.ok) {
        console.log("Registration successful");
        navigate("/main", { state: { username } });
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Reset the form after submission
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div>
      <Navbar />
      <div className="container2">
        <img src={logo} alt="Logo" />
      </div>
      <div className="login-form-container">
        <h2>Register Coordinator</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <button className="button2" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterCoordinator;
