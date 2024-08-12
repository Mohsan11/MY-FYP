import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addsemester.css';

const AddSemester = () => {
  const [semesterName, setSemesterName] = useState('');
  const [semesterNumber, setSemesterNumber] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    const fetchSessionsAndPrograms = async () => {
      try {
        const sessionsResponse = await axios.get('http://localhost:4000/api/session/all');
        const programsResponse = await axios.get('http://localhost:4000/api/programs/all');
        
        const sessionsWithProgramNames = sessionsResponse.data.map(session => {
          const program = programsResponse.data.find(prog => prog.id === session.program_id);
          return {
            ...session,
            programName: program ? program.name : 'Unknown Program',
          };
        });

        setSessions(sessionsWithProgramNames);
      } catch (error) {
        console.error("Error fetching sessions and programs:", error);
      }
    };

    fetchSessionsAndPrograms();
  }, []);

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:4000/api/semester', {
        name: semesterName,
        number: semesterNumber,
        session_id: selectedSession,
      });

      setResponseMessage("Semester added successfully!");
      setResponseType('success');

      // Clear input fields on successful save
      setSemesterName('');
      setSemesterNumber('');
      setSelectedSession('');
      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 5000);
    } catch (error) {
      console.error("Error saving semester:", error);
      setResponseMessage("Failed to add Semester. Please try again.");
      setResponseType('error');
      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 5000);
    }
  };

  const handleCancel = () => {
    // Clear input fields on cancel
    setSemesterName('');
    setSemesterNumber('');
    setSelectedSession('');
    setResponseMessage('');
    setResponseType('');
  };

  return (
    <div className='SemesterContainer'>
      <h2 className="heading">Add Semester</h2>
      <div className='lp'>
        <label>Name:</label>
        <input className="input" type="text" value={semesterName} placeholder='Fall 2020' onChange={(e) => setSemesterName(e.target.value)} />
      </div>
      <div className='lp'>
        <label>Number:</label>
        <input className="input" type="number" placeholder='1' value={semesterNumber} onChange={(e) => setSemesterNumber(e.target.value)} />
      </div>
      <div className='lp'>
        <label>Select Session:</label>
        <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
          <option value="" disabled>Select Session</option>
          {sessions.map(session => (
            <option key={session.id} value={session.id}>
              {session.programName} ({session.start_year} - {session.end_year})
            </option>
          ))}
        </select>
      </div>
      <div className='rp button-group'>
        <button className='button save-button' onClick={handleSave}>Save</button>
        <button className='button cancel-button' onClick={handleCancel}>Cancel</button>
      </div>
      <div>
        <p className={`message ${responseType}`}>{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddSemester;
