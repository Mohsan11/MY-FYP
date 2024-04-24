import React, { useState } from "react";
import Navbar from "../../NavBar/nav.js";
import "./coordinator.css";
import logo from "../../Resources/logo.png";
const Coordinator = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add your login logic here, such as sending the email and password to a server
    console.log("Email:", email);
    console.log("Password:", password);
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
