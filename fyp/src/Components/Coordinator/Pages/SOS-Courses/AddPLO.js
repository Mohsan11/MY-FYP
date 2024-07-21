import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addplo.css';

const AddPLO = () => {
  const [description, setDescription] = useState('');
  const [ploName, setPloName] = useState('');
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    axios.get('http://localhost:4000/api/programs/all').then(response => {
      setPrograms(response.data);
    }).catch(error => {
      console.error("Error fetching programs:", error);
    });

    axios.get('http://localhost:4000/api/session/all').then(response => {
      setSessions(response.data);
    }).catch(error => {
      console.error("Error fetching sessions:", error);
    });
  }, []);

  const handleSave = async () => {
    try {
      const ploResponse = await axios.post('http://localhost:4000/api/plo', {
        description,
        program_id: selectedProgram,
        session_id: selectedSession,
        plo_name: ploName
      });

      setResponseMessage("PLO added successfully!");
      setResponseType('success');

      // Clear input fields on successful save
      setDescription('');
      setPloName('');
      setSelectedProgram('');
      setSelectedSession('');
      setTimeout(() => {
        setResponseMessage("");
      setResponseType('');
      }, 4000);
    } catch (error) {
      console.error("Error saving PLO:", error);
      setResponseMessage("Failed to add PLO. Please try again.");
      setResponseType('error');
      setTimeout(() => {
        setResponseMessage("");
      setResponseType('');
      }, 4000);
    }
  };

  const handleCancel = () => {
    // Clear input fields on cancel
    setDescription('');
    setPloName('');
    setSelectedProgram('');
    setSelectedSession('');
    setResponseMessage('');
    setResponseType('');
  };

  return (
    <div className='PLOContainer'>
      <h2 className="heading">Add PLO</h2>
      <div className='lp'>
        <label>Description:</label>
        <input className="input" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className='lp'>
        <label>PLO Name:</label>
        <input className="input" type="text" value={ploName} onChange={(e) => setPloName(e.target.value)} />
      </div>
      <div className='lp'>
        <label>Select Program:</label>
        <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
          <option value="" disabled>Select Program</option>
          {programs.map(program => (
            <option key={program.id} value={program.id}>{program.name}</option>
          ))}
        </select>
      </div>
      <div className='lp'>
        <label>Select Session:</label>
        <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
          <option value="" disabled>Select Session</option>
          {sessions.map(session => (
            <option key={session.id} value={session.id}>{session.start_year} - {session.end_year}</option>
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

export default AddPLO;
