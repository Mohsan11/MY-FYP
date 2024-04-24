import React, { useState } from "react";
import logo from "../../Resources/logo.png";
import "./student.css";

const Student = () => {
  return (
    <div className="stud_Container">
      <div className="container2">
        <img src={logo} alt="Logo"></img>
      </div>
      <form className="container3">
        <div className="content">
          <div className="content_">MUST/FA15-A09-080/AJK</div>
        </div>
        <div className="holder">
          <label className="label" htmlFor="rollNo">
            RollNo:
          </label>
          <select>
            <option>FA20</option>
            <option>FA21</option>
            <option>FA22</option>
            <option>FA23</option>
          </select>
          <select>
            <option>BCS</option>
            <option>BIT</option>
          </select>
          <input type="text" id="rollNo" />
        </div>
        <div className="holder">
          <label className="label" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            required
            width={500}
          />
        </div>
        <button className="button1" type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Student;
