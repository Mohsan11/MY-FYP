import React, { useState } from "react";
import "./main.css";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Resources/Must Logo.jpg";
import Dashboard from './Pages/Dashboard/dashboard.js';
import AddStaff from './Pages/manage staff/Staff/addStaff.js';
import DeleteCoordinator from './Pages/manage staff/Staff/deleteCoordinator.js';
import UpdateCoordinator from './Pages/manage staff/Staff/updateCoordinator.js';
import SearchCoordinator from './Pages/manage staff/Staff/manageCordinator.js';
import AddTeacher from './Pages/manage staff/Teacher/addTeacher.js';
import DeleteTeacher from './Pages/manage staff/Teacher/deleteTeacher.js';
import UpdateTeacher from './Pages/manage staff/Teacher/updateTeacher.js';
import SearchTeacher from './Pages/manage staff/Teacher/manageTeacher.js';
import AddStudent from './Pages/manage staff/Student/addstudent.js';
import UpdateStudent from './Pages/manage staff/Student/updatestudent.js';
import StudentTable from './Pages/manage staff/Student/studentTable.js';
import AddProgram from "./Pages/SOS-Courses/AddProgram.js";
import AddCourse from "./Pages/SOS-Courses/AddCourse.js";
import AddSemester from "./Pages/SOS-Courses/AddSemester.js";
import AddPLO from "./Pages/SOS-Courses/AddPLO.js";
import AddCLO from "./Pages/SOS-Courses/ADDCLO.js";
import Mapping from "./Pages/SOS-Courses/Mapping.js";
import ViewSOS from "./Pages/SOS-Courses/ViewSOS.js";
import profile from '../Resources/profileavatar.png'
import AssignTeacher from "./Pages/SOS-Courses/Assign_Teacher.js";
import AssignStudent from "./Pages/SOS-Courses/assignStudent.js";
import GenerateResuts from "./Pages/Results/gernerateresults.js";
const Main = () => {
  const navigate = useNavigate(); 
  const [currentPage, setCurrentPage] = useState("dashboard");
  const location = useLocation();
  const [showDashboard, setShowDashboard] = useState(true); 
  const [showManageStaff, setShowManageStaff] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSOSCourses, setShowSOSCourses] = useState(false); 

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  const toggleManageStaff = () => {
    setShowManageStaff(!showManageStaff);
  };
  const toggleResults = () => {
    setShowResults(!showResults);
  };

  const toggleSOSCourses = () => {
    setShowSOSCourses(!showSOSCourses); 
  };

  const { name, id, role ,email} = location.state || {};

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
          <div onClick={toggleManageStaff} className="expandCollapse">
            {showManageStaff ? "▼" : "▲"} Manage Staff
          </div>
          {showManageStaff && (
            <div className="optionsList">
              <p className="tags" onClick={() => handlePageChange("addstaff")}>
                Add Teacher/Coordinator
              </p>
              {/* <p className="tags" onClick={() => handlePageChange("deleteCoordinator")}>
                Delete Coordinator
              </p> */}
              {/* <p className="tags" onClick={() => handlePageChange("updateCoordinator")}>
                Update Coordinator
              </p> */}
              <p className="tags" onClick={() => handlePageChange("searchCoordinator")}>
                Manage Coordinator
              </p>
              {/* <p className="tags" onClick={() => handlePageChange("addTeacher")}>
                Add Teacher
              </p> */}
              {/* <p className="tags" onClick={() => handlePageChange("deleteTeacher")}>
                Delete Teacher
              </p> */}
              {/* <p className="tags" onClick={() => handlePageChange("updateTeacher")}>
                Update Teacher
              </p> */}
              <p className="tags" onClick={() => handlePageChange("searchTeacher")}>
                Manage Teacher
              </p>
              <p className="tags" onClick={() => handlePageChange("addStudent")}>
                Add Student
              </p>
              {/* <p className="tags" onClick={() => handlePageChange("updateStudent")}>
                Update Student
              </p> */}
              <p className="tags" onClick={() => handlePageChange("managestudents")}>
                Manage Students
              </p>
            </div>
          )}
          <div onClick={toggleSOSCourses} className="expandCollapse">
            {showSOSCourses ? "▼" : "▲"} SOS-Courses
          </div>
          {showSOSCourses && (
            <div className="optionsList">
              <p className="tags" onClick={() => handlePageChange("addprogram")}>
                Add Program
              </p>
              <p className="tags" onClick={() => handlePageChange("addsemester")}>
                Add Semester
              </p>
              <p className="tags" onClick={() => handlePageChange("addcourse")}>
                Add Course
              </p>
              <p className="tags" onClick={() => handlePageChange("assignTeacher")}>
                Assign Teacher
              </p>
              <p className="tags" onClick={() => handlePageChange("assignStudent")}>
                Assign Student
              </p>
              <p className="tags" onClick={() => handlePageChange("addplo")}>
                Add PLO
              </p>
              <p className="tags" onClick={() => handlePageChange("addclo")}>
                Add CLO
              </p>
              <p className="tags" onClick={() => handlePageChange("mapping")}>
                Mapping
              </p>
              <p className="tags" onClick={() => handlePageChange("view_SOS")}>
                View-SOS
              </p>
            </div>
          )}
          <div onClick={toggleResults} className="expandCollapse">
            {showResults ? "▼" : "▲"} Results
          </div>
          {showResults && (
            <div className="optionsList">
              <p className="tags" onClick={() => handlePageChange("generateResults")}>
                Generate Results
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
      <span> {name}</span>
      <div className="line"></div>
    </div>
    <div className="pf-title">
      <span> {email}</span>
      <div className="line"></div>
    </div>
    <div className="pf-title">
      <span> {role}</span>
      <div className="line"></div>
    </div>
  </div>
  <div className="logout-container">
            <p className="logout-button" onClick={handleLogout}> <span className="bullet">&#8226;</span> Logout</p>
          </div>
</div>
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "addprogram" && <AddProgram />}
          {currentPage === "addsemester" && <AddSemester />}
          {currentPage === "addcourse" && <AddCourse />}
          {currentPage === "assignTeacher" && <AssignTeacher />}
          {currentPage === "assignStudent" && <AssignStudent />}
          {currentPage === "addplo" && <AddPLO />}
          {currentPage === "addclo" && <AddCLO />}
          {currentPage === "mapping" && <Mapping />}
          {currentPage === "view_SOS" && < ViewSOS />}
          {currentPage === "addstaff" && <AddStaff />}
          {currentPage === "deleteCoordinator" && <DeleteCoordinator />}
          {currentPage === "updateCoordinator" && <UpdateCoordinator />}
          {currentPage === "searchCoordinator" && <SearchCoordinator />}
          {currentPage === "addTeacher" && <AddTeacher />}
          {currentPage === "deleteTeacher" && <DeleteTeacher />}
          {currentPage === "updateTeacher" && <UpdateTeacher />}
          {currentPage === "searchTeacher" && <SearchTeacher />}
          {currentPage === "addStudent" && <AddStudent />}
          {currentPage === "updateStudent" && <UpdateStudent />}
          {currentPage === "managestudents" && <StudentTable />}
          {currentPage === "generateResults" && <GenerateResuts />}
        </div>
      </div>
    </div>
  );
};

export default Main;
