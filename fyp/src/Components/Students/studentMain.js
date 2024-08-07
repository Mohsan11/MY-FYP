import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from '../Resources/Must Logo.jpg'
import profile from '../Resources/profileavatar.png'
import Dashboard from "./Dashboard/dashboard";
import Summary from './Pages/Summary'
import Result from './Pages/result'

const StudentMain = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const location = useLocation();
  const [showDashboard, setShowDashboard] = useState(true); 
  const [showManageStaff, setShowManageStaff] = useState(false);
  const [showSOSCourses, setShowSOSCourses] = useState(false)

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  const toggleCourses = () => {
    setShowManageStaff(!showManageStaff);
  };

  const toggleResult = () => {
    setShowSOSCourses(!showSOSCourses); 
  };

  const [student, setStudent] = useState(null);
  const {id, student_name, roll_number ,email, program_id, session_id} = location.state || {};
  const handleLogout = () => {
    // Perform logout actions if needed
    navigate('/'); // Navigate to '/' on logout
  };
  return (
    <div>
      {/* <p>Welcome, {name} (ID: {id}, Role: {role})!</p> */}
      <div className="mainPanel">
        <div className="panel-1">
          <img src={Logo} alt="must_logo"></img>
          <div onClick={toggleDashboard} className="expandCollapse">
            {showDashboard ? "▼" : "▲"} Dashboard
          </div>
          {showDashboard && (
            <div className="optionsList">
              <p className="tags" onClick={() => handlePageChange("dashboard")}>
                Dashboard
              </p>
            </div>
          )}
          <div onClick={toggleCourses} className="expandCollapse">
            {showManageStaff ? "▼" : "▲"} Courses
          </div>
          {showManageStaff && (
            <div className="optionsList">
              <p className="tags" onClick={() => handlePageChange("summary")}>
                Summary
              </p>
              
            </div>
          )}
          <div onClick={toggleResult} className="expandCollapse">
            {showSOSCourses ? "▼" : "▲"} Result
          </div>
          {showSOSCourses && (
            <div className="optionsList">
              <p className="tags" onClick={() => handlePageChange("result")}>
                Result
              </p>
             
            </div>
          )}
          
        </div>
        <div className="panel-2">
        <div className="profile-container ">
  <div className="pf-img">
    <img className="pf-img" src={profile} alt="profile-logo" />
  </div>
  <div className="pf-titles">
    <div className="pf-title">
      <span> {student_name}</span>
      <div className="line"></div>
    </div>
    <div className="pf-title">
      <span> {email}</span>
      <div className="line"></div>
    </div>
    <div className="pf-title">
      <span> {roll_number}</span>
      <div className="line"></div>
    </div>
    
  </div>
  <div className="logout-container">
            <p className="logout-button" onClick={handleLogout}> <span className="bullet">&#8226;</span> Logout</p>
          </div>
</div>
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "summary" && <Summary />}
          {currentPage === "result" && <Result />}
        </div>
      </div>
    </div>
  );
};

export default StudentMain;
