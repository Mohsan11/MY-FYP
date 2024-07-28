import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import './assignTeacher.css'; // Ensure this file exists for styling

const AssignTeacher = () => {
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/programs/all');
        setPrograms(response.data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users/role/Teacher');
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchPrograms();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      const fetchSessions = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/session/program/${selectedProgram}`);
          setSessions(response.data);
        } catch (error) {
          console.error('Error fetching sessions:', error);
        }
      };

      fetchSessions();
    } else {
      setSessions([]);
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedProgram && selectedSession) {
      const fetchSemesters = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/semester/session/${selectedSession}`);
          setSemesters(response.data);
        } catch (error) {
          console.error('Error fetching semesters:', error);
        }
      };

      fetchSemesters();
    } else {
      setSemesters([]);
    }
  }, [selectedProgram, selectedSession]);

  useEffect(() => {
    if (selectedSemester) {
      const fetchCourses = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/courses/semester/${selectedSemester}`);
          setCourses(response.data);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      };

      fetchCourses();
    } else {
      setCourses([]);
    }
  }, [selectedSemester]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/teacherCourseAssignment');
        const assignmentsData = response.data;

        // Fetch details for each assignment
        const assignmentDetails = await Promise.all(assignmentsData.map(async (assignment) => {
          const [teacher, course, semester] = await axios.all([
            axios.get(`http://localhost:4000/api/users/${assignment.teacher_id}`),
            axios.get(`http://localhost:4000/api/courses/${assignment.course_id}`),
            axios.get(`http://localhost:4000/api/semester/${assignment.semester_id}`)
          ]);

          return {
            ...assignment,
            teacherName: teacher.data.username,
            courseName: course.data.name,
            semesterName: semester.data.name,
          };
        }));

        setAssignments(assignmentDetails);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  const handleSave = async () => {
    if (selectedTeacher && selectedCourse && selectedSemester) {
      try {
        const newAssignment = {
          semester_id: selectedSemester,
          course_id: selectedCourse,
          teacher_id: selectedTeacher,
        };

        const response = await axios.post('http://localhost:4000/api/teacherCourseAssignment', newAssignment);

        // Fetch and update the new assignment with additional details
        const [teacher, course, semester] = await axios.all([
          axios.get(`http://localhost:4000/api/users/${response.data.teacher_id}`),
          axios.get(`http://localhost:4000/api/courses/${response.data.course_id}`),
          axios.get(`http://localhost:4000/api/semester/${response.data.semester_id}`)
        ]);

        const newAssignmentWithDetails = {
          ...response.data,
          teacherName: teacher.data.username,
          courseName: course.data.name,
          semesterName: semester.data.name,
        };

        // Add the new assignment to the list
        setAssignments(prevAssignments => [...prevAssignments, newAssignmentWithDetails]);

        setResponseMessage('Teacher is assigned to the course successfully!');
        setResponseType('success');

        // Clear selections
        setSelectedTeacher('');
        setSelectedCourse('');
        setSelectedSemester('');
        setSelectedSession('');
        setSelectedProgram('');
      } catch (error) {
        console.error('Error saving assignment:', error);
        setResponseMessage('Failed to add assignment. Please try again.');
        setResponseType('error');
      } finally {
        setTimeout(() => {
          setResponseMessage('');
          setResponseType('');
        }, 4000);
      }
    } else {
      setResponseMessage('All fields must be selected.');
      setResponseType('error');
      setTimeout(() => {
        setResponseMessage('');
        setResponseType('');
      }, 4000);
    }
  };

  const handleCancel = () => {
    setSelectedTeacher('');
    setSelectedCourse('');
    setSelectedSemester('');
    setSelectedSession('');
    setSelectedProgram('');
  };

  const handleDelete = async (assignmentId) => {
    try {
      await axios.delete(`http://localhost:4000/api/teacherCourseAssignment/${assignmentId}`);
      setAssignments(prevAssignments => prevAssignments.filter(assignment => assignment.id !== assignmentId));
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const columns = [
    {
      name: 'Teacher',
      selector: row => row.teacherName,
    },
    {
      name: 'Course',
      selector: row => row.courseName,
    },
    {
      name: 'Semester',
      selector: row => row.semesterName,
    },
    {
      name: 'Actions',
      cell: row => (
        <button
          onClick={() => handleDelete(row.id)}
          className="action-button"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className='MappingContainer'>
      <h2 className='heading'>Assign Teacher to Course</h2>

      <div className='lp'>
        <label>Program:</label>
        <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
          <option value='' disabled>Select Program</option>
          {programs.map(program => (
            <option key={program.id} value={program.id}>{program.name}</option>
          ))}
        </select>
      </div>

      {selectedProgram && (
        <div className='lp'>
          <label>Session:</label>
          <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
            <option value='' disabled>Select Session</option>
            {sessions.map(session => (
              <option key={session.id} value={session.id}>{session.start_year} - {session.end_year}</option>
            ))}
          </select>
        </div>
      )}

      {selectedSession && (
        <div className='lp'>
          <label>Teacher:</label>
          <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
            <option value='' disabled>Select Teacher</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>{teacher.username}</option>
            ))}
          </select>
        </div>
      )}

      {selectedTeacher && (
        <>
          <div className='lp'>
            <label>Semester:</label>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
              <option value='' disabled>Select Semester</option>
              {semesters.map(semester => (
                <option key={semester.id} value={semester.id}>{semester.name} - {semester.number}</option>
              ))}
            </select>
          </div>

          <div className='lp'>
            <label>Course:</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value='' disabled>Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className='rp button-group'>
        <button className='button save-button' onClick={handleSave}>Save</button>
        <button className='button cancel-button' onClick={handleCancel}>Cancel</button>
      </div>

      {responseMessage && (
        <div>
          <p className={`message ${responseType}`}>{responseMessage}</p>
        </div>
      )}

      <h3>Recent Assigned Teachers</h3>
      <DataTable
        columns={columns}
        data={assignments}
        pagination
      />
    </div>
  );
};

export default AssignTeacher;
