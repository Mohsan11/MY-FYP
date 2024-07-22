import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddStudent = () => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  
  // For success and error messages
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  // Fetch programs on component mount
  useEffect(() => {
    axios.get('http://localhost:4000/api/programs/all')
      .then(response => setPrograms(response.data))
      .catch(error => console.error('Error fetching programs:', error));
  }, []);

  // Fetch all sessions on component mount
  useEffect(() => {
    axios.get('http://localhost:4000/api/session/all')
      .then(response => {
        setSessions(response.data); // Set all sessions initially
      })
      .catch(error => console.error('Error fetching sessions:', error));
  }, []);

  // Fetch all semesters on component mount
  useEffect(() => {
    axios.get('http://localhost:4000/api/semester/all')
      .then(response => {
        setSemesters(response.data); // Set all semesters initially
      })
      .catch(error => console.error('Error fetching semesters:', error));
  }, []);

  // Filter sessions based on selected program
  useEffect(() => {
    if (selectedProgram) {
      const filteredSessions = sessions.filter(session => session.program_id === parseInt(selectedProgram));
      setSessions(filteredSessions);
      setSelectedSession(""); // Clear session selection when program changes
      setSelectedSemester(""); // Clear semester selection when program changes
    } else {
      // Fetch all sessions again if no program is selected
      axios.get('http://localhost:4000/api/session/all')
        .then(response => setSessions(response.data))
        .catch(error => console.error('Error fetching sessions:', error));
    }
  }, [selectedProgram]);

  // Filter semesters based on selected session
  useEffect(() => {
    if (selectedSession) {
      const filteredSemesters = semesters.filter(semester => semester.session_id === parseInt(selectedSession));
      setSemesters(filteredSemesters);
    } else {
      // Fetch all semesters again if no session is selected
      axios.get('http://localhost:4000/api/semester/all')
        .then(response => setSemesters(response.data))
        .catch(error => console.error('Error fetching semesters:', error));
    }
  }, [selectedSession]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/students", {
        roll_number: rollNumber,
        student_name: name,
        password,
        email,
        program_id: selectedProgram,
        session_id: selectedSession,
        semester_id: selectedSemester
      });
      setTimeout(() => {
        setMessage("Student added successfully!");
        setMessageType("success"); // Set message type to success
      }, 5000);
      // Clear form fields
      setName("");
      setRollNumber("");
      setPassword("");
      setEmail("");
      setSelectedProgram("");
      setSelectedSession("");
      setSelectedSemester("");
    } catch (error) {
      console.error("Error adding student:", error);
      setTimeout(() => {
        setMessage("Failed to add student.");
        setMessageType("error"); // Set message type to error
      }, 5000);
    }
  };

  const handleRollNumberChange = (e) => {
    setRollNumber(e.target.value.toUpperCase()); // Convert roll number to uppercase
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value.toLowerCase()); 
  };
  return (
    <div className="student-form-container lp">
      <h3>Add Student</h3>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Student Roll Number</label>
          <input
            className='lp'
            type="text"
            value={rollNumber}
            onChange={handleRollNumberChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Student Name</label>
          <input
            className='lp'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            className='lp'
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className='lp'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label> Select Program</label>
          <select
            className='lp'
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
          >
            <option value="">Select Program</option>
            {programs.map(program => (
              <option key={program.id} value={program.id}>{program.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Select Session</label>
          <select
            className='lp'
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            disabled={!selectedProgram} // Disable if no program is selected
          >
            <option value="">Select Session</option>
            {sessions.map(session => (
              <option key={session.id} value={session.id}>{session.start_year} - {session.end_year}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Select Semester</label>
          <select
            className='lp'
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            disabled={!selectedSession} // Disable if no session is selected
          >
            <option value="">Select Semester</option>
            {semesters.map(semester => (
              <option key={semester.id} value={semester.id}>{semester.name} - {semester.number}</option>
            ))}
          </select>
        </div>
        <div className="button-group rp">
          <button className='button save-button' type="submit">Save</button>
          <button
            className='button cancel-button'
            type="button"
            onClick={() => {
              setName("");
              setRollNumber("");
              setPassword("");
              setEmail("");
              setSelectedProgram("");
              setSelectedSession("");
              setSelectedSemester("");
            }}
          >
            Cancel
          </button>
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

export default AddStudent;
