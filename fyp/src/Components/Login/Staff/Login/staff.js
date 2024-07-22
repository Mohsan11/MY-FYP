import React, { useState } from "react";
import "./staff.css";
import logo from "../../../Resources/logo.png";
import { useNavigate } from "react-router-dom";

const Staff = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user.id,
            username: data.user.username,
            role: data.user.role,
            email: data.user.email,
          })
        );
        console.log("Login successful");

        // Redirect based on user role
        if (data.user.role === "Coordinator") {
          navigate("/coordinator", {
            state: {
              name: data.user.username,
              id: data.user.id,
              role: data.user.role,
              email: data.user.email
            },
          });
        } else if (data.user.role === "Teacher") {
          navigate("/teacherDashboard", {
            state: {
              name: data.user.username,
              id: data.user.id,
              role: data.user.role,
              email: data.user.email
            },
          });
        } else {
          console.error("Unsupported role:", data.user.role);
          setError("Unsupported role. Please contact support.");
        }
      } else {
        setError(data.message || "Login failed. Invalid credentials!");
        console.error("Login failed:", data.message || "Unknown error");
      }
    } catch (error) {
      setError("Login failed. Invalid credentials!"); 
      console.error("Error:", error);
      setTimeout(() => {
        setError("")
      }, 5000);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <div className="container2">
        <img src={logo} alt="Logo" />
      </div>
      <div className="login-form-container">
        <h2>Staff Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input style={{width: '80%'}}
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="center">
          <button className="button2" type="submit">
            Login
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Staff;
