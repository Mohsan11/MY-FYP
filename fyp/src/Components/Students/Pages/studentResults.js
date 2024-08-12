import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentResults = ({ studentId, semesterId }) => {
  const [results, setResults] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [cgpa, setCgpa] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/results/${studentId}/semester/${semesterId}`);
        const finalResults = response.data;

        let totalCredits = 0;
        let totalGP = 0;

        const calculatedResults = finalResults.map(result => {
          const { course_id, credit_hours, obtained_marks, gpa } = result;
          
          totalCredits += credit_hours;
          totalGP += gpa * credit_hours;

          return {
            courseId: course_id,
            creditHours: credit_hours,
            marks: obtained_marks,
            gp: gpa,
            cp: gpa * credit_hours,
          };
        });

        setTotalCredits(totalCredits);
        setCgpa((totalGP / totalCredits).toFixed(2));
        setResults(calculatedResults);
      } catch (error) {
        console.error('Error fetching student results:', error);
      }
    };

    fetchResults();
  }, [studentId, semesterId]);

  return (
    <div className="results-container">
      <h3>Results Semester: {semesterId}</h3>
      <table className="results-table">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Credit Hours</th>
            <th>Marks</th>
            <th>GP</th>
            <th>CP</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.courseId}</td>
              <td>{result.creditHours}</td>
              <td>{result.marks}</td>
              <td>{result.gp.toFixed(2)}</td>
              <td>{result.cp.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">CGPA: {cgpa}</td>
            <td colSpan="2">Total Credits: {totalCredits}</td>
          </tr>
        </tfoot>
      </table>
      <p>Scholastic Status: Promoted/Not Promoted</p>
    </div>
  );
};

export default StudentResults;
