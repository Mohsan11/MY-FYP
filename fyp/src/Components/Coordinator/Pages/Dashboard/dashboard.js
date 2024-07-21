import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dashboard.css'
const Dashboard = () => {
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalCoordinators, setTotalCoordinators] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const coursesResponse = await axios.get('http://localhost:4000/api/totals/totalCourses');
        setTotalCourses(coursesResponse.data.total_courses);

        const programsResponse = await axios.get('http://localhost:4000/api/totals/totalPrograms');
        setTotalPrograms(programsResponse.data.total_programs);

        const teachersResponse = await axios.get('http://localhost:4000/api/users/totalUsers/Teacher');
        setTotalTeachers(teachersResponse.data.count);

        const coordinatorsResponse = await axios.get('http://localhost:4000/api/users/totalUsers/Coordinator');
        setTotalCoordinators(coordinatorsResponse.data.count);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Courses</td>
            <td>{totalCourses}</td>
          </tr>
          <tr>
            <td>Total Programs</td>
            <td>{totalPrograms}</td>
          </tr>
          <tr>
            <td>Total Teachers</td>
            <td>{totalTeachers}</td>
          </tr>
          <tr>
            <td>Total Coordinators</td>
            <td>{totalCoordinators}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
