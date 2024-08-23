import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentResults = ({ studentId, programId, sessionId }) => {
  const [semesterResults, setSemesterResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch semester results
        const resultsResponse = await axios.get(`http://localhost:4000/api/add_final_results/${studentId}/${programId}/${sessionId}`);
        const resultsData = resultsResponse.data;

        // Fetch course names and semester details
        const courseRequests = Object.values(resultsData).flatMap(semester => 
          semester.results.map(result => 
            axios.get(`http://localhost:4000/api/courses/${result.course_id}`)
          )
        );

        const semesterRequests = Object.keys(resultsData).map(semesterId => 
          axios.get(`http://localhost:4000/api/semester/${semesterId}`)
        );

        // Await all course and semester requests
        const [courseResponses, semesterResponses] = await Promise.all([
          Promise.all(courseRequests),
          Promise.all(semesterRequests)
        ]);

        const courses = courseResponses.reduce((acc, response) => {
          acc[response.data.id] = response.data.name;
          return acc;
        }, {});

        const semesters = semesterResponses.reduce((acc, response) => {
          acc[response.data.id] = response.data.name;
          return acc;
        }, {});

        // Map results to include course names and semester names
        const resultsWithCoursesAndSemesters = Object.entries(resultsData).map(([semesterId, { results, totalCredits, cgpa, status }]) => ({
          semesterId,
          semesterName: semesters[semesterId],
          results: results.map(result => ({
            ...result,
            course_name: courses[result.course_id]
          })),
          totalCredits,
          cgpa,
          status
        }));

        setSemesterResults(resultsWithCoursesAndSemesters);
      } catch (error) {
        console.error('Error fetching student results:', error);
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [studentId, programId, sessionId]);

  if (loading) {
    return <p>Loading results...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="results-container">
      {semesterResults.length > 0 ? (
        semesterResults.map(({ semesterId, semesterName, results, totalCredits, cgpa, status }) => (
          <div key={semesterId} className="semester-results">
            <h3>Results for Semester: {semesterName}</h3>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Total Marks</th>
                  <th>Obtained Marks</th>
                  <th>Grade</th>
                  <th>GPA</th>
                  <th>Credit Hours</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result.id}>
                    <td>{result.course_name}</td>
                    <td>{result.total_marks}</td>
                    <td>{result.obtained_marks}</td>
                    <td>{result.grade}</td>
                    <td>{parseFloat(result.gpa).toFixed(2)}</td>
                    <td>{result.credit_hours}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5">CGPA: {cgpa}</td>
                  <td>Total Credits: {totalCredits}</td>
                </tr>
              </tfoot>
            </table>
            <p>Scholastic Status: {status}</p>
          </div>
        ))
      ) : (
        <p>No results available.</p>
      )}
    </div>
  );
};

export default StudentResults;
