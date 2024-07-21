import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Resources/logo.png";
import "./student.css";

const Student = () => {
  const [year, setYear] = useState("FA20");
  const [program, setProgram] = useState("BCS");
  const [suffix, setSuffix] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rollNumber = `${year}-${program}-${suffix}`;

    try {
      const response = await fetch("http://localhost:4000/api/students/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roll_number: rollNumber,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Store student data in local storage
      localStorage.setItem("studentData", JSON.stringify(data.student));

      // Redirect to dashboard upon successful login
      navigate("/studentdashboard");
    } catch (error) {
      console.error("Login error:", error.message);
      setError("Invalid credentials. Please try again.");

      // Clear error after 5 seconds
      setTimeout(() => {
        setError("");
      }, 5000); // 5000 milliseconds = 5 seconds
    }
  };

  const handleInputChange = () => {
    setError("");
  };

  return (
    <div className="stud_Container">
      <div className="container2">
        <img src={logo} alt="Logo" />
      </div>
      <form className="container3" onSubmit={handleSubmit}>
        <div className="content">
          <div className="content_">
            MUST/{year}-{program}-{suffix}/AJK
          </div>
        </div>
        <div className="holder">
          <label className="login-label" htmlFor="rollNo">
            RollNo
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onFocus={handleInputChange} // Clear error on focus
          >
            <option value="FA20">FA20</option>
            <option value="FA21">FA21</option>
            <option value="FA22">FA22</option>
            <option value="FA23">FA23</option>
          </select>
          <select
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            onFocus={handleInputChange} // Clear error on focus
          >
            <option value="BCS">BCS</option>
            <option value="BIT">BIT</option>
          </select>
          <input
            type="text"
            id="suffix"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            onFocus={handleInputChange} // Clear error on focus
            placeholder="080"
            required
          />
        </div>
        <div className="holder">
          <label className="login-label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={handleInputChange} // Clear error on focus
            placeholder="Password"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="button1" type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Student;
