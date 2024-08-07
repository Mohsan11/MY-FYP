import React, { useEffect, useState } from 'react';
import './dashboard.css'; // Add styles for alerts here

const Dashboard = () => {
  const [cloProgress, setCloProgress] = useState([]);
  const [showAlerts, setShowAlerts] = useState([]);
  const [studentId, setStudentId] = useState(12); // Replace with the actual student_id
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetch the list of courses the student is enrolled in
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/studentenrollments/student/${studentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setEnrolledCourses(data);
        } else {
          console.error('Expected data to be an array, but got:', data);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    fetchEnrolledCourses();
  }, [studentId]);

  // Fetch CLO progress data for all enrolled courses
  useEffect(() => {
    const fetchAllCloProgress = async () => {
      try {
        const progressPromises = enrolledCourses.map(async (enrollment) => {
          const response = await fetch(`http://localhost:4000/api/assesmentsController/cloProgress/${enrollment.course_id}/${studentId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch CLO progress for course ${enrollment.course_id}`);
          }
          return response.json();
        });

        const results = await Promise.all(progressPromises);
        const allCloProgress = results.flat();

        // Log the data to inspect its structure
        console.log('Fetched CLO progress data:', allCloProgress);

        // Ensure data is an array before applying filter
        if (Array.isArray(allCloProgress)) {
          setCloProgress(allCloProgress);
          // Set alerts for CLOs with status 'Fail'
          const alerts = allCloProgress.filter(clo => clo.status === 'Fail');
          setShowAlerts(alerts);
        } else {
          console.error('Expected data to be an array, but got:', allCloProgress);
        }
      } catch (error) {
        console.error('Error fetching CLO progress:', error);
      }
    };

    if (enrolledCourses.length > 0) {
      fetchAllCloProgress();
    }
  }, [enrolledCourses, studentId]);

  const handleCloseAlert = (index) => {
    setShowAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {showAlerts.length > 0 && (
        <div className="alerts-container">
          {showAlerts.map((alert, index) => (
            <div key={index} className="alert alert-danger">
              <p>CLO with ID {alert.clo_id} has failed. Please check your progress.</p>
              <button className="alert-close-btn" onClick={() => handleCloseAlert(index)}>X</button>
            </div>
          ))}
        </div>
      )}
      {/* Rest of the dashboard content */}
    </div>
  );
};

export default Dashboard;
