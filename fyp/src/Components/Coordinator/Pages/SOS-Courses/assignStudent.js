import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignStudent = () => {
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [programsRes, studentsRes] = await Promise.all([
          axios.get('http://localhost:4000/api/programs/all'),
          axios.get('http://localhost:4000/api/students/all'),
        ]);
        setPrograms(programsRes.data || []);
        setStudents(studentsRes.data || []);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      const fetchSessions = async () => {
        setLoading(true);
        try {
          const sessionsRes = await axios.get(`http://localhost:4000/api/session/program/${selectedProgram}`);
          setSessions(sessionsRes.data || []);
        } catch (error) {
          console.error('Error fetching sessions', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSessions();
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedSession) {
      const fetchSemesters = async () => {
        setLoading(true);
        try {
          const semestersRes = await axios.get(`http://localhost:4000/api/semester/session/${selectedSession}`);
          setSemesters(semestersRes.data || []);
        } catch (error) {
          console.error('Error fetching semesters', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSemesters();
    }
  }, [selectedSession]);

  useEffect(() => {
    if (selectedProgram && selectedSession) {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const coursesRes = await axios.get(`http://localhost:4000/api/courses/program/${selectedProgram}/session/${selectedSession}`);
          setCourses(coursesRes.data || []);
          console.log('Fetched courses:', coursesRes.data); // Log fetched courses
        } catch (error) {
          console.error('Error fetching courses', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCourses();
    }
  }, [selectedProgram, selectedSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const selectedSemesterNumber = Number(selectedSemester); // Ensure correct type
      console.log('Selected Semester Number:', selectedSemesterNumber);
      
      const filteredCourses = courses.filter(course => course.semester_id === selectedSemesterNumber);
      console.log('Filtered Courses:', filteredCourses);
      
      if (filteredCourses.length === 0) {
        console.warn('No courses found for the selected semester.');
        setMessage('No courses found for the selected semester');
        setMessageType('warning');
        setLoading(false);
        return;
      }
    
      for (let course of filteredCourses) {
        // console.log('Checking enrollment for student:', selectedStudent, 'Course:', course.id);
    
        const { data } = await axios.get(`http://localhost:4000/api/studentenrollments/student/${selectedStudent}/course/${course.id}`);
        // console.log('Enrollment data:', data);
    
        if (data.length === 0) {
          console.log('student: ', selectedStudent, 'Courses: ', course.id, 'Semester: ', course.semester_id)
          await axios.post('http://localhost:4000/api/studentenrollments/', {
            student_id: selectedStudent,
            course_id: course.id,
            semester_id: course.semester_id,
          });
          // console.log('Enrollment created for student:', selectedStudent, 'Course:', course.id);
        }
      }
    
      setMessage('Enrollment created successfully');
      setMessageType('success');
    } catch (error) {
      console.error('Error creating enrollment:', error.response ? error.response.data : error.message);
      setMessage('Failed to create enrollment');
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };
  
  const handleCancel = () => {
    setSelectedProgram('');
    setSelectedSession('');
    setSelectedSemester('');
    setSelectedStudent('');
    setCourses([]);
  };

  return (
    <div className='MappingContainer'>
      <h2 className='heading'>Assign Student to Courses</h2>
      {loading && <p>Loading...</p>}
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
          <label>Semester</label>
          <select className='lp' value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} required>
            <option value="">Select a semester</option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name} - {semester.number}
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
