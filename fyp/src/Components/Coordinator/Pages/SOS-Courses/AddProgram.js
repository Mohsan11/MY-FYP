import React, { useState } from "react";
import axios from "axios";
import './addprogram.css';
import './addsemester.css';

const AddProgram = () => {
  const [name, setName] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [semesterName, setSemesterName] = useState('');
  const [semesterNumber, setSemesterNumber] = useState('');
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleStartYearChange = (e) => {
    const selectedYear = e.target.value;
    const currentYear = new Date().getFullYear();
    if (selectedYear >= currentYear - 4) {
      setStartYear(selectedYear);
      setEndYear(parseInt(selectedYear) + 4);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name || !startYear || !endYear || !semesterName || !semesterNumber) {
      setMessage("All fields must be filled.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/programs_sessions_semester/", {
        program: { name },
        session: { start_year: startYear, end_year: endYear },
        semester: { name: semesterName, number: semesterNumber }
      });

      setMessage("Program, session, and semester added successfully!");
      setMessageType("success");

      setName("");
      setStartYear("");
      setEndYear("");
      setSemesterName('');
      setSemesterNumber('');
      
      setTimeout(() => {
        setMessage("");
        setMessageType('');
      }, 5000);
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage("Failed to add Program, Session, or Semester. Please try again.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType('');
      }, 5000);
    }
  };

  const handleCancel = () => {
    setName("");
    setStartYear("");
    setEndYear("");
    setSemesterName('');
    setSemesterNumber('');
    setMessage('');
    setMessageType('');
  };

  return (
    <div className="pg-container">
      <h3 className="heading">Add Program</h3>
      <form className="form" onSubmit={handleSave}>
        <div className="form-group">
          <div className="label">Program Name</div>
          <select
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            <option value="">Select a program</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Security">Information Security</option>
            <option value="Software Engineering">Software Engineering</option>
          </select>
        </div>
        <h3 className="subheading">Session</h3>
        <div className="form-group">
          <div className="label">Start Year</div>
          <input
            className="input"
            type="number"
            value={startYear}
            onChange={handleStartYearChange}
            min={new Date().getFullYear() - 4}
            max={new Date().getFullYear() + 1 }
          />
        </div>
        <div className="form-group">
          <div className="label">End Year</div>
          <input
            className="input"
            type="number"
            value={endYear}
            readOnly
          />
        </div>
        <h3 className="heading">Add Semester</h3>
        <div className='SemesterContainer'>
          <div className='lp'>
            <label>Name:</label>
            <input className="input" type="text" value={semesterName} onChange={(e) => setSemesterName(e.target.value)} />
          </div>
          <div className='lp'>
            <label>Number:</label>
            <input className="input" type="number" value={semesterNumber} min={1} max={10} onChange={(e) => setSemesterNumber(e.target.value)} />
          </div>
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
