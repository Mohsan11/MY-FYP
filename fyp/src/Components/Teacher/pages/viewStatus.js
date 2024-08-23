import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewStatus.css'; // Add custom styles here

const ViewStatus = ({ teacherId }) => {
  const [courses, setCourses] = useState([]);
  const [cloStatus, setCloStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Fetch courses assigned to the teacher
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

  // Fetch CLO status for the selected course
  const checkCLOs = async (courseId) => {
    setLoading(true);
    setSelectedCourseId(courseId);
    try {
      const response = await axios.get(`http://localhost:4000/api/assesmentsController/checkCLOs/${courseId}`);
      if (response.data.missingCLOs) {
        const cloDetails = await fetchMissingCLOs(response.data.missingCLOs);
        setCloStatus({ courseId, status: response.data.message, missingCLOs: cloDetails });
      } else {
        setCloStatus({ courseId, status: response.data.message, missingCLOs: [] });
      }
    } catch (err) {
      console.error('Error checking CLOs:', err);
    }
    setLoading(false);
  };

  // Fetch details of missing CLOs
  const fetchMissingCLOs = async (missingCLOs) => {
    try {
      const cloPromises = missingCLOs.map(clo => axios.get(`http://localhost:4000/api/clo/${clo.id}`));
      const cloResults = await Promise.all(cloPromises);
      return cloResults.map(res => res.data);
    } catch (err) {
      console.error('Error fetching CLO details:', err);
      return [];
    }
  };

  return (
    <div className="view-status-container">
      <h2 className="header-title">Course CLO Status</h2>
      <table className="courses-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Program Name</th>
            <th>Session</th>
            <th>Semester</th>
            <th>Check CLOs</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.course_name}</td>
              <td>{course.program_name}</td>
              <td>{course.session}</td>
              <td>{course.semester_name}</td>
              <td>
                <button
                  className="check-btn"
                  onClick={() => checkCLOs(course.id)}
                  disabled={loading && selectedCourseId === course.id}
                >
                  {loading && selectedCourseId === course.id ? (
                    <span className="loading-spinner"></span>
                  ) : 'Check CLOs'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {cloStatus && (
        <div className="clo-status-card">
          <h3 className="course-status-header">Status for Course ID: {cloStatus.courseId}</h3>
          <p className={`status-message ${cloStatus.missingCLOs.length === 0 ? 'success' : 'error'}`}>
            {cloStatus.status}
          </p>

          {cloStatus.missingCLOs.length > 0 && (
            <div className="missing-clos">
              <h4>Missing CLOs:</h4>
              <ul>
                {cloStatus.missingCLOs.map(clo => (
                  <li key={clo.id}>
                    <strong>{clo.clo_name}:</strong> {clo.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewStatus;
