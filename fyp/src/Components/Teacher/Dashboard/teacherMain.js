import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./teacherMain.css";
import Dashboard from '../pages/dashboard.js';
import AddAssessment from '../pages/addAssessment.js';
import AddMarks from '../pages/addMarks.js';
import Results from '../pages/Results.js';
import ViewAssessments from "../pages/ViewAssesments.js";
import ViewStudents from "../pages/viewStudents.js";
import Logo from '../../Resources/Must Logo.jpg';
import profile from '../../Resources/profileavatar.png'; // Adjust path if necessary

const TeacherMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showDashboard, setShowDashboard] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  const toggleAssessment = () => {
    setShowAssessment(!showAssessment);
  };

  const toggleResults = () => {
    setShowResults(!showResults);
  };

  const handleLogout = () => {
    // Perform logout actions if needed
    navigate('/'); // Navigate to '/' on logout
  };

  const { name, id, role, email } = location.state || {}; // Get user info from location state

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setCurrentPage("addAssessment");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard teacherId={id} onCourseClick={handleCourseClick} />;
      case "addAssessment":
        return <AddAssessment course={selectedCourse} teacherId={id} />;
      case "addMarks":
        return <AddMarks course={selectedCourse} teacherId={id} />;
      case "results":
        return <Results />;
      case "viewAssessments":
        return <ViewAssessments courseId={selectedCourse?.id} />;
      case "viewStudents":
        return <ViewStudents courseId={selectedCourse?.id} />;
      default:
        return <Dashboard teacherId={id} onCourseClick={handleCourseClick} />;
    }
  };

  return (
    <div>
      <div className="mainPanel">
        <div className="panel-1">
          <img src={Logo} alt="must_logo" />
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
          <div onClick={toggleAssessment} className="expandCollapse">
            {showAssessment ? "▼" : "▲"} Assessment
          </div>
          {showAssessment && (
            <div className="optionsList">
              <p className="tags" onClick={() => handlePageChange("addAssessment")}>
                Add Assessment
              </p>
              <p className="tags" onClick={() => handlePageChange("addMarks")}>
                Add Marks
              </p>
              <p className="tags" onClick={() => handlePageChange("viewAssessments")}>
                View Assessments
              </p>
              <p className="tags" onClick={() => handlePageChange("viewStudents")}>
                View Students
              </p>
            </div>
          )}
          <div onClick={toggleResults} className="expandCollapse">
            {showResults ? "▼" : "▲"} Results
          </div>
          {showResults && (
            <div className="optionsList">
              <p className="tags" onClick={() => handlePageChange("results")}>
                Results
              </p>
            </div>
          )}
        </div>
        <div className="panel-2">
          <div className="profile-container">
            <div className="pf-img">
              <img className="pf-img" src={profile} alt="profile-logo" />
            </div>
            <div className="pf-titles">
              <div className="pf-title">
                <span>{name}</span>
                <div className="line"></div>
              </div>
              <div className="pf-title">
                <span>{email}</span>
                <div className="line"></div>
              </div>
              <div className="pf-title">
                <span>{role}</span>
                <div className="line"></div>
              </div>
            </div>
            <div className="logout-container">
              <p className="logout-button" onClick={handleLogout}>
                <span className="bullet">&#8226;</span> Logout
              </p>
            </div>
          </div>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default TeacherMain;
