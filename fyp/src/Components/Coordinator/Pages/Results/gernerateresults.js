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
  const [cloAchievements, setCloAchievements] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/api/programs/all')
      .then(response => setPrograms(response.data))
      .catch(error => console.error('Error fetching programs:', error));
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      axios.get(`http://localhost:4000/api/session/program/${selectedProgram}`)
        .then(response => setSessions(response.data))
        .catch(error => console.error('Error fetching sessions:', error));
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedSession) {
      axios.get(`http://localhost:4000/api/semester/session/${selectedSession}`)
        .then(response => setSemesters(response.data))
        .catch(error => console.error('Error fetching semesters:', error));
    }
  }, [selectedSession]);

  useEffect(() => {
    if (selectedSemester) {
      axios.get(`http://localhost:4000/api/courses/semester/${selectedSemester}`)
        .then(response => setCourses(response.data))
        .catch(error => console.error('Error fetching courses:', error));
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedProgram && selectedSession) {
      axios.get(`http://localhost:4000/api/students/${selectedProgram}/${selectedSession}`)
        .then(response => setStudents(response.data))
        .catch(error => console.error('Error fetching students:', error));
    }
  }, [selectedProgram, selectedSession]);

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

            // Fetch CLO achievements
            axios.get(`http://localhost:4000/api/track/clo-achievements/${selectedStudent}/${selectedSemester}`)
              .then(response => {
                // Organize CLO achievements by course_id
                const cloByCourse = response.data.reduce((acc, clo) => {
                  if (!acc[clo.course_id]) {
                    acc[clo.course_id] = { passed: [], failed: [] };
                  }
                  if (clo.status === 'Passed') {
                    acc[clo.course_id].passed.push(clo.clo_name);
                  } else if (clo.status === 'Failed') {
                    acc[clo.course_id].failed.push(clo.clo_name);
                  }
                  return acc;
                }, {});
                setCloAchievements(cloByCourse);
              })
              .catch(error => {
                console.error('Error fetching CLO achievements:', error);
                setResponseMessage('Error fetching CLO achievements.');
                setResponseType('error');
              });
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

  const handleSaveResults = () => {
    if (results.length) {
      // Prepare the results with CLO information
      const resultsWithClo = results.map(result => ({
        ...result,
        clo_achieved: cloAchievements[result.course_id]?.passed.join(', ') || 'N/A',
        clo_not_achieved: cloAchievements[result.course_id]?.failed.join(', ') || 'N/A'
      }));
  
      axios.post('http://localhost:4000/api/add_final_results/results/save', {
        student_id: selectedStudent,
        program_id: selectedProgram,
        session_id: selectedSession,
        semester_id: selectedSemester,
        results: resultsWithClo
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
      setResponseMessage('No results to save.');
      setResponseType('error');
    }
  };
  
  return (
    <div className='lp'>
      <h2>Generate Results</h2>
      
      <div className='lp'>
        <label>Program:</label>
        <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)}>
          <option value="">Select Program</option>
          {programs.map(program => (
            <option key={program.id} value={program.id}>{program.name}</option>
          ))}
        </select>
      </div>
      
      <div className='lp'>
        <label>Session:</label>
        <select value={selectedSession} onChange={e => setSelectedSession(e.target.value)}>
          <option value="">Select Session</option>
          {sessions.map(session => (
            <option key={session.id} value={session.id}>{session.start_year} - {session.end_year}</option>
          ))}
        </select>
      </div>
      
      <div className='lp'>
        <label>Semester:</label>
        <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {semesters.map(semester => (
            <option key={semester.id} value={semester.id}>{semester.name}- {semester.number}</option>
          ))}
        </select>
      </div>
      
      <div className='lp'>
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

      {results.length > 0 && (
        <div className="results-table">
          <h3>Results</h3>
          {results.map(result => (
            <div key={result.course_id}>
              <h4>{result.course_name}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Assessment</th>
                    <th>Total Marks</th>
                    <th>Obtained Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {result.assessments.map(assessment => (
                    <tr key={assessment.id}>
                      <td>{assessment.name}</td>
                      <td>{assessment.total_marks}</td>
                      <td>{assessment.obtained_marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p><b>Total Marks:</b> {result.total_marks}</p>
              <p><b>Obtained Marks:</b> {result.obtained_marks}</p>
              <p><b>Grade: </b> {result.grade}</p>
              <p><b>GPA: </b> {result.gpa}</p>
              <p><b>Credit Hours: </b> {result.credit_hours}</p>

              {/* New CLO achievement sections */}
              <p><b>Achieved CLO Names:</b> {cloAchievements[result.course_id]?.passed.join(', ') || 'None'}</p>
              <p><b>Not Achieved CLO Names:</b> {cloAchievements[result.course_id]?.failed.join(', ') || 'None'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenerateResults;
