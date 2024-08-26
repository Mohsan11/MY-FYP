import React, { useEffect, useState } from 'react';
import './dashboard.css'; // Import the CSS file

const Dashboard = ({ studentId }) => {
  const [alerts, setAlerts] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [session, setSession] = useState(null);
  const [program, setProgram] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        // Fetch student details
        const studentResponse = await fetch(`http://localhost:4000/api/students/${studentId}`);
        const student = await studentResponse.json();

        // Fetch program details
        const programResponse = await fetch(`http://localhost:4000/api/programs/${student.program_id}`);
        const programData = await programResponse.json();
        setProgram(programData);

        // Fetch session details
        const sessionResponse = await fetch(`http://localhost:4000/api/session/${student.session_id}`);
        const sessionData = await sessionResponse.json();
        setSession(sessionData);

        // Fetch courses
        const coursesResponse = await fetch(`http://localhost:4000/api/courses/program/${student.program_id}`);
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);

        // Fetch semesters
        const semestersResponse = await fetch(`http://localhost:4000/api/semester/session/${sessionData.id}`);
        const semestersData = await semestersResponse.json();
        console.log("Session Data:", sessionData); // Debugging
        console.log("Semesters Data:", semestersData); // Debugging
        setSemesters(semestersData);

        // Fetch CLO progress
        const courseAlerts = [];
        for (const course of coursesData) {
          const cloProgressResponse = await fetch(`http://localhost:4000/api/assesmentsController/cloProgress/${course.id}/${studentId}`);
          const cloProgress = await cloProgressResponse.json();
          if (Array.isArray(cloProgress)) {
            const failedCLOs = cloProgress.filter(clo => clo.status === 'Fail');
            for (const clo of failedCLOs) {
              const cloResponse = await fetch(`http://localhost:4000/api/clo/${clo.clo_id}`);
              const cloData = await cloResponse.json();
              courseAlerts.push({
                courseName: course.name,
                cloName: cloData.clo_name
              });
            }
          }
        }
        setAlerts(courseAlerts);

        setStudentDetails({
          name: student.student_name,
          programName: programData.name,
          session: `${sessionData.start_year} - ${sessionData.end_year}`,
          numberOfCourses: coursesData.length,
          numberOfSemesters: semestersData.length, 
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts([]);
      }, 5000); // Timeout duration for notifications

      return () => clearTimeout(timer);
    }
  }, [alerts]);

  return (
    <div className='lp'>
      <h1>Dashboard</h1>
    <div className="dashboard-container">
      {alerts.length > 0 && (
        <div className="alerts">
          {alerts.map((alert, index) => (
            <div key={index} className="alert alert-fail">
              <p>Your course {alert.courseName} has a failed CLO: {alert.cloName}.</p>
            </div>
          ))}
        </div>
      )}
      {studentDetails && (
        <div className="student-summary">
          <h2>Student Summary</h2>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Student Name</td>
                <td>{studentDetails.name}</td>
              </tr>
              <tr>
                <td>Program Name</td>
                <td>{studentDetails.programName}</td>
              </tr>
              <tr>
                <td>Program Session</td>
                <td>{studentDetails.session}</td>
              </tr>
              <tr>
                <td>Total Number of Enrolled Courses</td>
                <td>{studentDetails.numberOfCourses}</td>
              </tr>
              <tr>
                <td>Total Semesters</td>
                <td>{studentDetails.numberOfSemesters}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
      </div>
  );
};

export default Dashboard;
