import React from 'react';
import { useLocation } from 'react-router-dom';

const TeacherDashboard = () => {
  const location = useLocation();
  // Destructure state from props.location safely
  const { state } = location || {};
  // Destructure properties from state, providing default values if state is undefined
  const { name, id, role } = location.state || {};
  return (
    <div>
      <h1>Welcome to Teacher Dashboard</h1>
      <p>Teacher Name: {name}</p>
      <p>ID: {id}</p>
      <p>Role: {role}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default TeacherDashboard;
