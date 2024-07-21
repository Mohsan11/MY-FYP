import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './assignTeacher.css'; // Ensure this file exists for styling

const Assign_Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherResponse, courseResponse, semesterResponse] = await Promise.all([
          axios.get('http://localhost:4000/api/users/role/Teacher'),
          axios.get('http://localhost:4000/api/courses/all'),
          axios.get('http://localhost:4000/api/semester/all'),
        ]);

        setTeachers(teacherResponse.data);
        setCourses(courseResponse.data);
        setSemesters(semesterResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (selectedTeacher && selectedCourse && selectedSemester) {
      try {
        const newAssignment = {
            semester_id: selectedSemester,
            course_id: selectedCourse,
            teacher_id: selectedTeacher,
        };
        console.log(newAssignment);
        const response = await axios.post('http://localhost:4000/api/teacherCourseAssignment', newAssignment);

        // Add the new assignment to the list
        setAssignments([...assignments, response.data]);

        setResponseMessage("Teacher is Assigned to the course successfully!");
        setResponseType('success');

        // Clear selections
        setSelectedTeacher('');
        setSelectedCourse('');
        setSelectedSemester('');
      } catch (error) {
        console.error('Error saving assignment:', error);
        setResponseMessage("Failed to add assignment. Please try again.");
        setResponseType('error');
      } finally {
        setTimeout(() => {
          setResponseMessage("");
          setResponseType('');
        }, 4000);
      }
    } else {
      setResponseMessage("All fields must be selected.");
      setResponseType('error');
      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);
    }
  };

  const handleCancel = () => {
    setSelectedTeacher('');
    setSelectedCourse('');
    setSelectedSemester('');
  };

  return (
    <div className='MappingContainer'>
      <h2 className="heading">Assign Teacher to Course</h2>
      <div className='lp'>
        <label>Teacher:</label>
        <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
          <option value="" disabled>Select Teacher</option>
          {teachers.map(teacher => (
            <option key={teacher.id} value={teacher.id}>{teacher.username}</option>
          ))}
        </select>
      </div>

      <div className='lp'>
        <label>Course:</label>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="" disabled>Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>

      <div className='lp'>
        <label>Semester:</label>
        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
          <option value="" disabled>Select Semester</option>
          {semesters.map(semester => (
            <option key={semester.id} value={semester.id}>{semester.name}</option>
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

      <h3>Assigned Teachers</h3>
      <table>
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Course</th>
            <th>Semester</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(assignment => (
            <tr key={assignment.id}>
              <td>{teachers.find(t => t.id === assignment.teacher_id)?.username}</td>
              <td>{courses.find(c => c.id === assignment.course_id)?.name}</td>
              <td>{semesters.find(s => s.id === assignment.semester_id)?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Assign_Teacher;
