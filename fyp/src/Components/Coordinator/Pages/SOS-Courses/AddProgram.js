import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './addprogram.css';

const AddProgram = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/api/programs_sessions", {
        program: { name, code },
        session: { start_year: startYear, end_year: endYear }
      });

      setMessage("Program and session saved successfully!");
      setMessageType("success");

      setName("");
      setCode("");
      setStartYear("");
      setEndYear("");
    } catch (error) {
      setMessage("Error saving program and session");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    }
  };

  const handleCancel = () => {
    setName("");
    setCode("");
    setStartYear("");
    setEndYear("");
  };

  return (
    <div className="pg-container">
      <h3 className="heading">Add Program</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="label">Name</div>
          <input width={100}
            className="input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="label">Code</div>
          <input
            className="input"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <h3 className="subheading">Session</h3>
        <div className="form-group">
          <div className="label">Start Year</div>
          <input
            className="input"
            type="text"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="label">End Year</div>
          <input
            className="input"
            type="text"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button className="button save-button" type="submit">Save</button>
          <button className="button cancel-button" type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddProgram;
