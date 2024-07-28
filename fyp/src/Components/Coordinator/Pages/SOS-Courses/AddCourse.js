import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import './addcourse.css';

const AddCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/programs/all');
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      const fetchSessions = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/session/program/${selectedProgram}`);
          setSessions(response.data);
        } catch (error) {
          console.error("Error fetching sessions:", error);
        }
      };

      fetchSessions();
    } else {
      setSessions([]);
      setSelectedSession('');
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedSession) {
      const fetchSemesters = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/semester/session/${selectedSession}`);
          setSemesters(response.data);
        } catch (error) {
          console.error("Error fetching semesters:", error);
        }
      };

      fetchSemesters();
    } else {
      setSemesters([]);
      setSelectedSemester('');
    }
  }, [selectedSession]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/courses/allDetail');
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSave = async () => {
    try {
      const courseResponse = await axios.post('http://localhost:4000/api/courses', {
        name: courseName,
        code: courseCode,
        program_id: selectedProgram,
        semester_id: selectedSemester
      });

      setResponseMessage("Course added successfully!");
      setResponseType('success');
      setCourseName('');
      setCourseCode('');
      // setSelectedProgram('');
      // setSelectedSession('');
      // setSelectedSemester('');

      fetchCourses();

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
    setCourseName('');
    setCourseCode('');
    setSelectedProgram('');
    setSelectedSession('');
    setSelectedSemester('');
    setResponseMessage('');
    setResponseType('');
  };

  const handleDelete = async (courseId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/courses/${courseId}`);
      if (response.status === 204) {
        setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
        setResponseMessage("Course deleted successfully!");
        setResponseType('success');
      } else {
        console.error('Failed to delete course:', response.statusText);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setResponseMessage(error.response.data.error);
      } else {
        setResponseMessage("Failed to delete course. Please try again.");
      }
      setResponseType('error');
    }

    setTimeout(() => {
      setResponseMessage("");
      setResponseType('');
    }, 5000);
  };

  const columns = [
    {
      name: 'Course Name',
      selector: row => row.course_name,
      sortable: true,
    },
    {
      name: 'Course Code',
      selector: row => row.course_code,
      sortable: true,
    },
    {
      name: 'Program Name',
      selector: row => row.program_name,
      sortable: true,
    },
    {
      name: 'Session',
      selector: row => row.session,
      sortable: true,
    },
    {
      name: 'Semester No',
      selector: row => `
      ${row.semester_number}`,
      sortable: true,
    },
    // ${row.semester_name} - 
    {
      name: 'Actions',
      cell: row => (
        <button onClick={() => handleDelete(row.id)}>Delete</button>
      ),
    },
  ];

  return (
    <div className='CourseContainer'>
      <h2 className="heading">Add Course</h2>
      <div className='lp'>
        <label>Course Name:</label>
        <input className="input" type="text" placeholder='Object Oriented Programming' value={courseName} onChange={(e) => setCourseName(e.target.value)} />
      </div>
      <div className='lp'>
        <label>Course Code:</label>
        <input className="input" type="text" placeholder='BCS-1203' value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
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
            <option key={semester.id} value={semester.id}>
              {semester.name} - {semester.number}
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
      
      <h3>Courses</h3>
      <DataTable
        columns={columns}
        data={courses}
        pagination
        highlightOnHover
      />
    </div>
  );
};

export default AddCourse;
