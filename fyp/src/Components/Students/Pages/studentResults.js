import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './studentResults.css'; // Ensure this file has styles for notifications

const StudentResults = ({ studentId, programId, sessionId }) => {
  const [semesterResults, setSemesterResults] = useState([]);
  const [ploNotifications, setPloNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch final results for the student
        const resultsResponse = await axios.get(`http://localhost:4000/api/add_final_results/${studentId}/${programId}/${sessionId}`);
        const resultsData = resultsResponse.data;

        // Fetch courses and semester details
        const courseRequests = Object.values(resultsData).flatMap(semester => 
          semester.results.map(result => 
            axios.get(`http://localhost:4000/api/courses/${result.course_id}`)
          )
        );

        const semesterRequests = Object.keys(resultsData).map(semesterId => 
          axios.get(`http://localhost:4000/api/semester/${semesterId}`)
        );

        // Determine semesterId from resultsData
        const semesterIds = Object.keys(resultsData);

        // Fetch PLO achievements using studentId and all semesterIds
        const ploPromises = semesterIds.map(semesterId =>
          axios.get(`http://localhost:4000/api/track/plo-achievements/${studentId}/${semesterId}`)
        );

        const ploResponses = await Promise.all(ploPromises);
        const ploData = ploResponses.reduce((acc, response) => {
          acc[response.data.semesterId] = response.data;
          return acc;
        }, {});

        const [courseResponses, semesterResponses] = await Promise.all([
          Promise.all(courseRequests),
          Promise.all(semesterRequests)
        ]);

        // Map course and semester data
        const courses = courseResponses.reduce((acc, response) => {
          acc[response.data.id] = response.data.name;
          return acc;
        }, {});

        const semesters = semesterResponses.reduce((acc, response) => {
          acc[response.data.id] = response.data.name;
          return acc;
        }, {});

        // Process results data
        const resultsWithCoursesAndSemesters = Object.entries(resultsData).map(([semesterId, { results, totalCredits, cgpa, status }]) => ({
          semesterId,
          semesterName: semesters[semesterId] || 'Unknown Semester',
          results: results.map(result => ({
            ...result,
            course_name: courses[result.course_id],
            clo_achieved: result.clo_achieved || 'N/A',
            clo_not_achieved: result.clo_not_achieved || 'N/A'
          })),
          totalCredits,
          cgpa,
          status
        }));

        setSemesterResults(resultsWithCoursesAndSemesters);

        // Extract PLOs that are not achieved
        const ploNotifications = Object.entries(ploData).flatMap(([semesterId, ploData]) => 
          Object.entries(ploData.ploStatus).filter(([_, plo]) => !plo.achieved).map(([ploId, plo]) => ({
            plo_name: plo.plo_name,
            semester_name: semesters[semesterId] || 'Unknown Semester'
          }))
        );

        setPloNotifications(ploNotifications);
        
      } catch (error) {
        console.error('Error fetching student results:', error);
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [studentId, programId, sessionId]);



  useEffect(() => {
    // Automatically remove notifications after 5 seconds
    const timer = setTimeout(() => {
      setPloNotifications([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [ploNotifications]);

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
            {ploNotifications.length > 0 && (
        <div className="notification-container">
          <h2>Not Achieved PLOs in {semesterName}</h2>
          <ul>
            {ploNotifications.map((notification, index) => (
              <li key={index} className="notification-item">
                <strong>{notification.plo_name}</strong> not achieved in Semester: {semesterName}
              </li>
            ))}
          </ul>
        </div>
      )}
            <div className="table-responsive">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Total Marks</th>
                    <th>Obtained Marks</th>
                    <th>Grade</th>
                    <th>GPA</th>
                    <th>Credit Hours</th>
                    <th>CLO Achieved</th>
                    <th>CLO Not Achieved</th>
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
                      <td>{result.clo_achieved}</td>
                      <td>{result.clo_not_achieved}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="6">CGPA: {cgpa}</td>
                    <td colSpan="2">Total Credits: {totalCredits}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
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
