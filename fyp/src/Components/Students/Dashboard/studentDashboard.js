import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Retrieve student data from local storage
    const storedStudentData = localStorage.getItem("studentData");
    if (storedStudentData) {
      setStudent(JSON.parse(storedStudentData));
    } else {
      // If no student data found in local storage, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      {student ? (
        <div>
          <p>Student Name: {student.student_name}</p>
          <p>Roll Number: {student.roll_number}</p>
          <p>Email: {student.email}</p>
          <p>Program ID: {student.program_id}</p>
          <p>Session ID: {student.session_id}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
