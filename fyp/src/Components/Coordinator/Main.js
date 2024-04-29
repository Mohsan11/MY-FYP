import React, { useState } from "react";
import "./main.css";
import Page1 from "./Pages/page1.js";
import Page2 from "./Pages/page2.js";
import Page3 from "./Pages/page3.js";
import Page4 from "./Pages/page4.js";
import { useLocation } from "react-router-dom";
import Logo from "../Resources/Must Logo.jpg";
const Main = () => {
  const [currentPage, setCurrentPage] = useState("first");
  const location = useLocation();
  const [showOptions, setShowOptions] = useState(true); // State to manage visibility

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const toggleOptions = () => {
    setShowOptions(!showOptions); // Toggle showOptions state
  };

  return (
    <div>
      <p>Welcome, {location.state && location.state.name}!</p>
      <div className="mainPanel">
        <div className="panel-1">
          <img src={Logo} alt="must_logo"></img>
          <div onClick={toggleOptions} className="expandCollapse">
            {showOptions ? "▼" : "▲"} SOS-Courses
          </div>
          {showOptions && (
            <div className="optionsList">
              <p className="tags" onClick={() => handlePageChange("first")}>
                Add Course
              </p>
              <p className="tags" onClick={() => handlePageChange("second")}>
                Add Course Scheme
              </p>
              <p className="tags" onClick={() => handlePageChange("third")}>
                Add Course Scheme Details
              </p>
              <p className="tags" onClick={() => handlePageChange("fourth")}>
                Copy Course Scheme By Courses
              </p>
            </div>
          )}
        </div>
        <div className="panel-2">
          {currentPage === "first" && <Page1 />}
          {currentPage === "second" && <Page2 />}
          {currentPage === "third" && <Page3 />}
          {currentPage === "fourth" && <Page4 />}
        </div>
      </div>
    </div>
  );
};

export default Main;
