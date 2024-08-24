import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import './ViewStatus.css'; // Add custom styles here

const ViewStatus = ({ teacherId }) => {
  const [courses, setCourses] = useState([]);
  const [cloStatus, setCloStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseName, setCourseName] = useState(''); // New state for course name

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

  // Fetch course name based on course ID
  const fetchCourseName = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/courses/${courseId}`);
      return response.data.name;
    } catch (error) {
      console.error('Error fetching course name:', error);
      return 'Unknown Course';
    }
  };

  // Fetch CLO status for the selected course
  const checkCLOs = async (courseId) => {
    setLoading(true);
    setSelectedCourseId(courseId);
    try {
      const response = await axios.get(`http://localhost:4000/api/assesmentsController/checkCLOs/${courseId}`);
      const courseName = await fetchCourseName(courseId); // Fetch the course name
      if (response.data.missingCLOs) {
        const cloDetails = await fetchMissingCLOs(response.data.missingCLOs);
        setCloStatus({ courseId, courseName, status: response.data.message, missingCLOs: cloDetails });
      } else {
        setCloStatus({ courseId, courseName, status: response.data.message, missingCLOs: [] });
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

  const columns = [
    { name: 'Course Name', selector: row => row.course_name, sortable: true },
    { name: 'Program Name', selector: row => row.program_name, sortable: true },
    { name: 'Session', selector: row => row.session, sortable: true },
    { name: 'Semester', selector: row => row.semester_name, sortable: true },
    {
      name: 'Check CLOs',
      cell: row => (
        <button
          className="check-btn"
          onClick={() => checkCLOs(row.id)}
          disabled={loading && selectedCourseId === row.id}
        >
          {loading && selectedCourseId === row.id ? (
            <span className="loading-spinner"></span>
          ) : 'Check CLOs'}
        </button>
      )
    }
  ];

  return (
    <div className="view-status-container">
      <h2 className="header-title">Course CLO Status</h2>
      <DataTable
        columns={columns}
        data={courses}
        pagination
        highlightOnHover
        responsive
        pointerOnHover
      />

      {cloStatus && (
        <div className="clo-status-card">
          <h3 className="course-status-header">Status for Course: {cloStatus.courseName}</h3> {/* Display course name */}
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
