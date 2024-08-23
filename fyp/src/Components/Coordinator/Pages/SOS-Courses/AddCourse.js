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
  const [theoryCredit, setTheoryCredit] = useState(1);
  const [labCredit, setLabCredit] = useState(0);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');
  const [courses, setCourses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);

  // New state variables for search
  const [searchCourseName, setSearchCourseName] = useState('');
  const [searchCourseCode, setSearchCourseCode] = useState('');
  const [searchProgramName, setSearchProgramName] = useState('');
  const [searchSemester, setSearchSemester] = useState('');
  const [searchSession, setSearchSession] = useState('');

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
    if (theoryCredit + labCredit > 4) {
      setResponseMessage("Total credit hours cannot exceed 4.");
      setResponseType('error');
      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 5000);
      return;
    }

    try {
      if (editMode) {
        await axios.put(`http://localhost:4000/api/courses/${editCourseId}`, {
          name: courseName,
          code: courseCode,
          program_id: parseInt(selectedProgram),
          semester_id: parseFloat(selectedSemester),
          theory_credit_hours: theoryCredit,
          lab_credit_hours: labCredit,
        });
        setResponseMessage("Course updated successfully!");
      } else {
        await axios.post('http://localhost:4000/api/courses', {
          name: courseName,
          code: courseCode,
          program_id: selectedProgram,
          semester_id: selectedSemester,
          theory_credit_hours: theoryCredit,
          lab_credit_hours: labCredit,
        });
        setResponseMessage("Course added successfully!");
      }

      setResponseType('success');
      setCourseName('');
      setCourseCode('');
      setSelectedProgram('');
      setSelectedSession('');
      setSelectedSemester('');
      setTheoryCredit(1);
      setLabCredit(0);
      setEditMode(false);
      fetchCourses();

      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 5000);
    } catch (error) {
      console.error("Error saving course:", error);
      setResponseMessage(editMode ? "Failed to update Course. Please try again." : "Failed to add Course. Please try again.");
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
    setTheoryCredit(1);
    setLabCredit(0);
    setResponseMessage('');
    setResponseType('');
    setEditMode(false);
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

  const handleEdit = (course) => {
    setCourseName(course.course_name);
    setCourseCode(course.course_code);
    setSelectedProgram(course.program_id);
    setSelectedSession(course.session_id);
    setSelectedSemester(course.semester_id);
    setTheoryCredit(course.theory_credit_hours);
    setLabCredit(course.lab_credit_hours);
    setEditCourseId(course.id);
    setEditMode(true);
  };

  const filteredCourses = courses.filter(course => 
    (searchCourseName === '' || course.course_name.toLowerCase().includes(searchCourseName.toLowerCase())) &&
    (searchCourseCode === '' || course.course_code.toLowerCase().includes(searchCourseCode.toLowerCase())) &&
    (searchProgramName === '' || course.program_name.toLowerCase().includes(searchProgramName.toLowerCase())) &&
    (searchSemester === '' || course.semester_name.toLowerCase().includes(searchSemester.toLowerCase())) &&
    (searchSession === '' || course.session.toLowerCase().includes(searchSession.toLowerCase()))
  );

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
      selector: row => `${row.semester_name} - ${row.semester_number}`,
      sortable: true,
    },
    {
      name: 'Theory Credit',
      selector: row => row.theory_credit_hours,
      sortable: true,
    },
    {
      name: 'Lab Credit',
      selector: row => row.lab_credit_hours,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <>
          <button  onClick={() => handleEdit(row)}>Edit</button>
          <button onClick={() => handleDelete(row.id)}>Delete</button>
        </>
      ),
    },
  ];

  return (
    <div className='CourseContainer'>
      <h2 className="heading">{editMode ? 'Edit Course' : 'Add Course'}</h2>
      <div className='lp'>
        <label>Course Name:</label>
        <input
          className="input"
          type="text"
          placeholder='Object Oriented Programming'
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </div>
      <div className='lp'>
        <label>Course Code:</label>
        <input
          className="input"
          type="text"
          placeholder='BCS-1101'
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
        />
      </div>
      <div className='lp'>
        <label>Program:</label>
        <select
          className="select"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
        >
          <option value="">Select Program</option>
          {programs.map(program => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </div>
      <div className='lp'>
        <label>Session:</label>
        <select
          className="select"
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
        >
          <option value="">Select Session</option>
          {sessions.map(session => (
            <option key={session.id} value={session.id}>
              {session.start_year} - {session.end_year}
            </option>
          ))}
        </select>
      </div>
      <div className='lp'>
        <label>Semester:</label>
        <select
          className="select"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option value="">Select Semester</option>
          {semesters.map(semester => (
            <option key={semester.id} value={semester.id}>
              {semester.name}
            </option>
          ))}
        </select>
      </div>
      <div className='lp'>
        <label>Theory Credit Hours:</label>
        <input
          className="input"
          type="number"
          value={theoryCredit}
          onChange={(e) => setTheoryCredit(parseFloat(e.target.value))}
        />
      </div>
      <div className='lp'>
        <label>Lab Credit Hours:</label>
        <input
          className="input"
          type="number"
          value={labCredit}
          onChange={(e) => setLabCredit(parseFloat(e.target.value))}
        />
      </div>
      <div className='lp'>
        <div className='rp button-group'>
        <button className="save-button button" onClick={handleSave}>
          {editMode ? 'Update Course' : 'Add Course'}
        </button>
        <button className="cancel-button button" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
      {responseMessage && (
        <p className={`response-message ${responseType}`}>
          {responseMessage}
        </p>
      )}
      <div className="search">
        <input
          type="text"
          placeholder="Search Course Name"
          value={searchCourseName}
          onChange={(e) => setSearchCourseName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search Course Code"
          value={searchCourseCode}
          onChange={(e) => setSearchCourseCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search Program Name"
          value={searchProgramName}
          onChange={(e) => setSearchProgramName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search Semester"
          value={searchSemester}
          onChange={(e) => setSearchSemester(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search Session"
          value={searchSession}
          onChange={(e) => setSearchSession(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredCourses}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default AddCourse;
