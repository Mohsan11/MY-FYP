import React, { useState } from "react";
import "./page1.css";

const Page1 = () => {
  const initialFormData = {
    courseNo: "",
    courseTitle: "",
    abbrCourseTitle: "",
    courseType: "",
    program: "",
    theoryCredits: "",
    labCredits: "",
    courseSchemeName: "",
    detailsNotes: "",
    session: "",
    minimumDurationYears: "",
    minimumSemesters: "",
    minimumCreditsSemesters: "",
    maximumCreditsSemesters: "",
    totalCourse: "",
    totalCredits: "",
    notifications: "",
    courseObjectives: "",
    outlineTheory: "",
    outlineLab: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api//add-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Course added successfully");
        setFormData(initialFormData); // Reset form after successful submission
      } else {
        console.error("Failed to add course");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="Pg1-Main">
      <form onSubmit={handleSubmit}>
        <div className="Pg1_heading">
          <h2>Add Course</h2>
        </div>
        <div className="Pg1_note">
          <div className="small_heading">
            <h4 className="small_heading1">Note:</h4>
          </div>
          <small>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </small>
        </div>

        {/* Course No */}
        <div className="Pg1_Input">
          <p className="label">
            Course No <span className="imp">#</span>
          </p>
          <input
            className="inputfield"
            name="courseNo"
            type="text"
            value={formData.courseNo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Course Title */}
        <div className="Pg1_Input">
          <p className="label">
            Course Title <span className="imp">#</span>
          </p>
          <input
            className="inputfield"
            name="courseTitle"
            type="text"
            value={formData.courseTitle}
            onChange={handleChange}
            required
          />
        </div>

        {/* Abbreviated Course Title */}
        <div className="Pg1_Input">
          <p className="label">Abbreviated Course Title</p>
          <input
            className="inputfield"
            name="abbrCourseTitle"
            type="text"
            value={formData.abbrCourseTitle}
            onChange={handleChange}
          />
        </div>

        {/* Course Type */}
        <div className="Pg1_Input">
          <p className="label">
            Course Type <span className="imp">#</span>
          </p>
          <select
            className="Page1input"
            name="courseType"
            value={formData.courseType}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="1">Type 1</option>
            <option value="2">Type 2</option>
          </select>
        </div>

        {/* Program */}
        <div className="Pg1_Input">
          <p className="label">
            Program <span className="imp">#</span>
          </p>
          <select
            className="Page1input"
            name="program"
            value={formData.program}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="1">Program 1</option>
            <option value="2">Program 2</option>
          </select>
        </div>

        {/* Theory Credits */}
        <div className="Pg1_Input">
          <p className="label">
            Theory Credits <span className="imp">#</span>
          </p>
          <select
            className="Page1input"
            name="theoryCredits"
            value={formData.theoryCredits}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>

        {/* Lab Credits */}
        <div className="Pg1_Input">
          <p className="label">
            Lab Credits <span className="imp">#</span>
          </p>
          <select
            className="Page1input"
            name="labCredits"
            value={formData.labCredits}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>

        {/* Course Scheme Name */}
        <div className="Pg1_Input">
          <p className="label">
            Course Scheme Name <span className="imp">#</span>
          </p>
          <input
            className="inputfield"
            name="courseSchemeName"
            type="text"
            value={formData.courseSchemeName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Details & Notes */}
        <div className="Pg1_Input">
          <p className="label">Details & Notes</p>
          <input
            className="inputfield"
            name="detailsNotes"
            type="text"
            value={formData.detailsNotes}
            onChange={handleChange}
          />
        </div>

        {/* Session */}
        <div className="Pg1_Input">
          <p className="label">
            Session <span className="imp">#</span>
          </p>
          <select
            className="Page1input"
            name="session"
            value={formData.session}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="1">Session 1</option>
            <option value="2">Session 2</option>
          </select>
        </div>

        {/* Minimum Duration (Years) */}
        <div className="Pg1_Input">
          <p className="label">Minimum Duration (Years)</p>
          <input
            className="inputfield"
            name="minimumDurationYears"
            type="text"
            value={formData.minimumDurationYears}
            onChange={handleChange}
          />
        </div>

        {/* Minimum Semesters */}
        <div className="Pg1_Input">
          <p className="label">Minimum Semesters</p>
          <input
            className="inputfield"
            name="minimumSemesters"
            type="text"
            value={formData.minimumSemesters}
            onChange={handleChange}
          />
        </div>

        {/* Minimum Credits/Semesters */}
        <div className="Pg1_Input">
          <p className="label">Minimum Credits/Semesters</p>
          <input
            className="inputfield"
            name="minimumCreditsSemesters"
            type="text"
            value={formData.minimumCreditsSemesters}
            onChange={handleChange}
          />
        </div>

        {/* Maximum Credits/Semesters */}
        <div className="Pg1_Input">
          <p className="label">Maximum Credits/Semesters</p>
          <input
            className="inputfield"
            name="maximumCreditsSemesters"
            type="text"
            value={formData.maximumCreditsSemesters}
            onChange={handleChange}
          />
        </div>

        {/* Total Course */}
        <div className="Pg1_Input">
          <p className="label">Total Course</p>
          <input
            className="inputfield"
            name="totalCourse"
            type="text"
            value={formData.totalCourse}
            onChange={handleChange}
          />
        </div>

        {/* Total Credits */}
        <div className="Pg1_Input">
          <p className="label">Total Credits</p>
          <input
            className="inputfield"
            name="totalCredits"
            type="text"
            value={formData.totalCredits}
            onChange={handleChange}
          />
        </div>

        {/* Notifications */}
        <div className="Pg1_Input">
          <p className="label">Notifications</p>
          <input
            className="inputfield"
            name="notifications"
            type="text"
            value={formData.notifications}
            onChange={handleChange}
          />
        </div>

        {/* Course Objectives */}
        <div className="Pg1_Input">
          <p className="label">Course Objectives</p>
          <input
            className="inputfield"
            name="courseObjectives"
            type="text"
            value={formData.courseObjectives}
            onChange={handleChange}
          />
        </div>

        {/* Outline (Theory) */}
        <div className="Pg1_Input">
          <p className="label">Outline (Theory)</p>
          <input
            className="inputfield"
            name="outlineTheory"
            type="text"
            value={formData.outlineTheory}
            onChange={handleChange}
          />
        </div>

        {/* Outline (Lab) */}
        <div className="Pg1_Input">
          <p className="label">Outline (Lab)</p>
          <input
            className="inputfield"
            name="outlineLab"
            type="text"
            value={formData.outlineLab}
            onChange={handleChange}
          />
        </div>

        {/* Submit and Clear Buttons */}
        <div className="endBtns">
          <button
            type="button"
            className="cancelbtn btns"
            onClick={() => setFormData(initialFormData)}
          >
            Clear Form
          </button>
          <button type="submit" className="savebtn btns">
            Add New
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page1;
