import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ teacherId, onCourseClick }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/teacherCourseAssignment/teacher/${teacherId}`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [teacherId]);

  return (
    <div>
      <h2>Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Program Name</th>
            <th>Session</th>
            <th>Semester</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} onClick={() => onCourseClick(course)}>
              <td className='pointer'>{course.course_name}</td>
              <td>{course.program_name}</td>
              <td>{course.session}</td>
              <td>{course.semester_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
