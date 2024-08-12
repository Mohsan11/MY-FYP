import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GenerateResults = () => {
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [results, setResults] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  // Fetch all programs on component mount
  useEffect(() => {
    axios.get('http://localhost:4000/api/programs/all')
      .then(response => setPrograms(response.data))
      .catch(error => console.error('Error fetching programs:', error));
  }, []);

  // Fetch sessions based on selected program
  useEffect(() => {
    if (selectedProgram) {
      axios.get(`http://localhost:4000/api/session/program/${selectedProgram}`)
        .then(response => setSessions(response.data))
        .catch(error => console.error('Error fetching sessions:', error));
    }
  }, [selectedProgram]);

  // Fetch semesters based on selected session
  useEffect(() => {
    if (selectedSession) {
      axios.get(`http://localhost:4000/api/semester/session/${selectedSession}`)
        .then(response => setSemesters(response.data))
        .catch(error => console.error('Error fetching semesters:', error));
    }
  }, [selectedSession]);

  // Fetch courses based on selected semester and store them
  useEffect(() => {
    if (selectedSemester) {
      axios.get(`http://localhost:4000/api/courses/semester/${selectedSemester}`)
        .then(response => setCourses(response.data))
        .catch(error => console.error('Error fetching courses:', error));
    }
  }, [selectedSemester]);

  // Fetch students based on selected program and session
  useEffect(() => {
    if (selectedProgram && selectedSession) {
      axios.get(`http://localhost:4000/api/students/${selectedProgram}/${selectedSession}`)
        .then(response => setStudents(response.data))
        .catch(error => console.error('Error fetching students:', error));
    }
  }, [selectedProgram, selectedSession]);

  // Check if the student is ready to generate results
  const handleCheckResults = () => {
    if (selectedStudent && selectedSemester) {
      axios.get(`http://localhost:4000/api/resultsDetails/final/${selectedStudent}/semester/${selectedSemester}`)
        .then(response => {
          const resultData = response.data;
          const allAssessmentsComplete = resultData.every(result => !result.message);

          if (allAssessmentsComplete) {
            setResults(resultData);
            const studentName = students.find(student => student.id === parseInt(selectedStudent))?.student_name;
            setResponseMessage(`Ready to generate results for ${studentName}`);
            setResponseType('success');
          } else {
            setResponseMessage('Some assessments are missing or not completed.');
            setResponseType('error');
          }
        })
        .catch(error => {
          console.error('Error checking results:', error);
          setResponseMessage('Error checking results.');
          setResponseType('error');
        });
    } else {
      setResponseMessage('Please select all the required fields.');
      setResponseType('error');
    }
  };

  // Save the results
  const handleSaveResults = () => {
    if (responseType === 'success') {
      axios.post('http://localhost:4000/api/api/final_results_semesters/save', {
        student_id: selectedStudent,
        program_id: selectedProgram,
        session_id: selectedSession,
        semester_id: selectedSemester,
        results
      })
        .then(() => {
          setResponseMessage('Results successfully saved!');
          setResponseType('success');
        })
        .catch(error => {
          console.error('Error saving results:', error);
          setResponseMessage('Error saving results.');
          setResponseType('error');
        });
    } else {
      setResponseMessage('Please check the results before saving.');
      setResponseType('error');
    }
  };

  return (
    <div>
      <h2>Generate Results</h2>
      
      <div>
        <label>Program:</label>
        <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)}>
          <option value="">Select Program</option>
          {programs.map(program => (
            <option key={program.id} value={program.id}>{program.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Session:</label>
        <select value={selectedSession} onChange={e => setSelectedSession(e.target.value)}>
          <option value="">Select Session</option>
          {sessions.map(session => (
            <option key={session.id} value={session.id}>{session.start_year} - {session.end_year}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Semester:</label>
        <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {semesters.map(semester => (
            <option key={semester.id} value={semester.id}>{semester.name}- {semester.number}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Student:</label>
        <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
          <option value="">Select Student</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>{student.student_name}</option>
          ))}
        </select>
      </div>
      
      <div className='button-group rp'>
        <button className='button save-button' onClick={handleCheckResults}>Check Results</button>
        <button className='button save-button' onClick={handleSaveResults}>Save Results</button>
      </div>

      {responseMessage && (
        <div className={`message ${responseType}`}>
          <p>{responseMessage}</p>
        </div>
      )}
    </div>
  );
};

export default GenerateResults;
