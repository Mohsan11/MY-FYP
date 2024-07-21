import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCLO = () => {
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [cloName, setCloName] = useState('');
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    axios.get('http://localhost:4000/api/courses/all').then(response => {
      setCourses(response.data);
    }).catch(error => {
      console.error("Error fetching courses:", error);
    });

    axios.get('http://localhost:4000/api/session/all').then(response => {
      setSessions(response.data);
    }).catch(error => {
      console.error("Error fetching sessions:", error);
    });
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/clo', {
        description,
        course_id: courseId,
        session_id: sessionId,
        clo_name: cloName
      });

      setResponseMessage("CLO added successfully!");
      setResponseType('success');
      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);

      // Clear input fields on successful save
      setDescription('');
      setCourseId('');
      setSessionId('');
      setCloName('');
    } catch (error) {
      console.error("Error saving CLO:", error);
      setResponseMessage("Failed to add CLO. Please try again.");
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
    setCourseId('');
    setSessionId('');
    setCloName('');
    setResponseMessage('');
    setResponseType('');
  };

  return (
    <div className='CLOContainer'>
      <h2 className="heading">Add CLO</h2>
      <div className='lp'>
        <label>CLO Name:</label>
        <input className="input" type="text" value={cloName} onChange={(e) => setCloName(e.target.value)} />
      </div>
      <div className='lp'>
        <label>Description:</label>
        <input className="input" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className='lp'>
        <label>Select Course:</label>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="" disabled>Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>
      <div className='lp'>
        <label>Select Session:</label>
        <select value={sessionId} onChange={(e) => setSessionId(e.target.value)}>
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

export default AddCLO;
