import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignStudent = () => {
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programsRes, studentsRes] = await Promise.all([
          axios.get('http://localhost:4000/api/programs/all'),
          axios.get('http://localhost:4000/api/students/all'),
        ]);

        setPrograms(programsRes.data || []);
        setStudents(studentsRes.data || []);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      const fetchSessions = async () => {
        try {
          const sessionsRes = await axios.get(`http://localhost:4000/api/session/program/${selectedProgram}`);
          setSessions(sessionsRes.data || []);
        } catch (error) {
          console.error('Error fetching sessions', error);
        }
      };

      fetchSessions();
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedProgram && selectedSession) {
      const fetchCourses = async () => {
        try {
          const coursesRes = await axios.get(`http://localhost:4000/api/courses/program/${selectedProgram}/session/${selectedSession}`);
          setCourses(coursesRes.data || []);
        } catch (error) {
          console.error('Error fetching courses', error);
        }
      };

      fetchCourses();
    }
  }, [selectedProgram, selectedSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (let course of courses) {
        const { data } = await axios.get(`http://localhost:4000/api/studentenrollments/student/${selectedStudent}/course/${course.id}`);

        if (data.length === 0) {
          await axios.post('http://localhost:4000/api/studentenrollments/', {
            student_id: selectedStudent,
            course_id: course.id,
            semester_id: course.semester_id,
          });
        }
      }

      setMessage('Enrollment created successfully');
      setMessageType('success');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      console.error('Error creating enrollment', error);
      setMessage('Failed to create enrollment');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
};


  const handleCancel = () => {
    setSelectedProgram('');
    setSelectedSession('');
    setSelectedStudent('');
    setCourses([]);
  };

  return (
    <div className='MappingContainer'>
      <h2 className='heading'>Assign Student to Courses</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Program</label>
          <select className='lp' value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} required>
            <option value="">Select a program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Session</label>
          <select className='lp' value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)} required>
            <option value="">Select a session</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.start_year} - {session.end_year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Student</label>
          <select className='lp' value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.student_name}
              </option>
            ))}
          </select>
        </div>
        {message && (
          <p style={{
            color: messageType === 'success' ? 'green' : 'red',
            border: `1px solid ${messageType === 'success' ? 'green' : 'red'}`,
            borderRadius: '5px',
            backgroundColor: messageType === 'success' ? 'lightgreen' : 'lightcoral',
            padding: '10px',
            marginTop: '10px',
            textAlign: 'center'
          }}>
            {message}
          </p>
        )}
        <div className='rp button-group'>
          <button className='button save-button' type="submit">Save</button>
          <button className='button cancel-button' type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AssignStudent;
