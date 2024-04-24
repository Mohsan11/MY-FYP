import React, { useState } from "react";
import Navbar from "../../../NavBar/nav";
import "./register.css";
import logo from "../../../Resources/logo.png";
const Coordinator = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [Confirmpassword, setConfirmPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
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
        <h2>Register Coordinator</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="Confirmpassword">Confirm Password:</label>
            <input
              type="password"
              id="Confirmpassword"
              name="Confirmpassword"
              value={Confirmpassword}
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
export default Coordinator;
