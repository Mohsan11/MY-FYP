import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentResults = ({ studentId, semesterId }) => {
  const [results, setResults] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalGP, setTotalGP] = useState(0);
  const [cgpa, setCgpa] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/results//${studentId}/semester/${semesterId}`);
        const courses = response.data.courses;

        let totalCredits = 0;
        let totalGP = 0;

        const calculatedResults = courses.map(course => {
          const gp = calculateGP(course.marks); // function to calculate grade points based on marks
          const cp = gp * course.creditHours;
          
          totalCredits += course.creditHours;
          totalGP += cp;

          return {
            ...course,
            gp,
            cp,
          };
        });

        setTotalCredits(totalCredits);
        setTotalGP(totalGP);
        setCgpa((totalGP / totalCredits).toFixed(2)); // Calculate CGPA
        setResults(calculatedResults);
      } catch (error) {
        console.error('Error fetching student results:', error);
      }
    };

    fetchResults();
  }, [studentId, semesterId]);

  const calculateGP = (marks) => {
    // Example function to convert marks to GP; replace with your own logic
    if (marks >= 85) return 4.0;
    if (marks >= 80) return 3.7;
    if (marks >= 75) return 3.3;
    if (marks >= 70) return 3.0;
    if (marks >= 65) return 2.7;
    if (marks >= 60) return 2.3;
    if (marks >= 55) return 2.0;
    if (marks >= 50) return 1.7;
    return 0;
  };

  return (
    <div className="results-container">
      <h3>Result Semester: FALL 2020</h3>
      <table className="results-table">
        <thead>
          <tr>
            <th>Course No</th>
            <th>Course Title</th>
            <th>Credit</th>
            <th>Marks</th>
            <th>LG</th>
            <th>GP</th>
            <th>CP</th>
          </tr>
        </thead>
        <tbody>
          {results.map((course, index) => (
            <tr key={index}>
              <td>{course.code}</td>
              <td>{course.name}</td>
              <td>{course.creditHours}</td>
              <td>{course.marks}</td>
              <td>{course.letterGrade}</td>
              <td>{course.gp.toFixed(2)}</td>
              <td>{course.cp.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5">CGPA: {cgpa}</td>
            <td colSpan="2">GPA: {(totalGP / totalCredits).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <p>Scholastic Status: Promoted</p>
    </div>
  );
};

export default StudentResults;
