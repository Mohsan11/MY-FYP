import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addcourse.css';

const AddCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
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

    axios.get('http://localhost:4000/api/semester/all').then(response => {
      setSemesters(response.data);
    }).catch(error => {
      console.error("Error fetching semesters:", error);
    });
  }, []);

  const handleSave = async () => {
    try {
      const courseResponse = await axios.post('http://localhost:4000/api/courses', {
        name: courseName,
        code: courseCode,
        program_id: selectedProgram
      });

      // In the original code, a new semester is created, but now we are selecting from existing ones
      setResponseMessage("Course added successfully!");
      setResponseType('success');
     
      // Clear input fields on successful save
      setCourseName('');
      setCourseCode('');
      setSelectedProgram('');
      setSelectedSemester('');
      setSelectedSession('');
      setTimeout(() => {
        setResponseMessage("");
      setResponseType('');
      }, 5000);

    } catch (error) {
      console.error("Error saving course:", error);
      setResponseMessage("Failed to add Course. Please try again.");
      setResponseType('error');
      setTimeout(() => {
        setResponseMessage("");
      setResponseType('');
      }, 5000);
    }
  };

  const handleCancel = () => {
    // Clear input fields on cancel
    setCourseName('');
    setCourseCode('');
    setSelectedProgram('');
    setSelectedSemester('');
    setSelectedSession('');
    setResponseMessage('');
    setResponseType('');
  };

  return (
    <div className='CourseContainer'>
      <h2 className="heading">Add Course</h2>
      <div className='lp'>
        <label>Name:</label>
        <input className="input" type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
      </div>
      <div className='lp'>
        <label>Code:</label>
        <input className="input" type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
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
      <div className='lp'>
        <label>Select Semester:</label>
        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
          <option value="" disabled>Select Semester</option>
          {semesters.map(semester => (
            <option key={semester.id} value={semester.id}>{semester.name} - {semester.number} - {semester.term}</option>
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

export default AddCourse;
