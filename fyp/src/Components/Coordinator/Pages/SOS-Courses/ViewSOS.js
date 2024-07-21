import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './viewSOS.css'; // Ensure you have a CSS file for styling

const ViewSOS = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from APIs
        const [
          programResponse,
          sessionResponse,
          courseResponse,
          cloResponse,
          ploResponse,
          mappingResponse,
          semesterResponse,
          teacherAssignmentResponse,
          userResponse
        ] = await Promise.all([
          axios.get('http://localhost:4000/api/programs/all'),
          axios.get('http://localhost:4000/api/session/all'),
          axios.get('http://localhost:4000/api/courses/all'),
          axios.get('http://localhost:4000/api/clo/all'),
          axios.get('http://localhost:4000/api/plo/all'),
          axios.get('http://localhost:4000/api/clo_plo_mapping/all'),
          axios.get('http://localhost:4000/api/semester/all'),
          axios.get('http://localhost:4000/api/teacherCourseAssignment/all'),
          axios.get('http://localhost:4000/api/users/all')
        ]);

        const programs = programResponse.data;
        const sessions = sessionResponse.data;
        const courses = courseResponse.data;
        const clos = cloResponse.data;
        const plos = ploResponse.data;
        const mappings = mappingResponse.data;
        const semesters = semesterResponse.data;
        const teacherAssignments = teacherAssignmentResponse.data;
        const users = userResponse.data;

        // Format data to include only relevant PLOs for each course
        const formattedData = courses.map(course => {
          // Find related CLOs
          const courseCLOs = clos.filter(clo => clo.course_id === course.id);
          const courseCLOsNames = courseCLOs.map(clo => clo.clo_name).join(', ');

          // Find related PLOs for the CLOs
          const coursePLOIds = courseCLOs.flatMap(clo => {
            return mappings
              .filter(mapping => mapping.clo_id === clo.id)
              .map(mapping => mapping.plo_id);
          });

          const relatedPLOs = plos.filter(plo => coursePLOIds.includes(plo.id));
          const relatedPLOsNames = relatedPLOs.map(plo => plo.plo_name).join(', ');

          // Get program information
          const program = programs.find(program => program.id === course.program_id)?.name || 'Unknown Program';

          // Get semester information
          const semesterAssignment = teacherAssignments.find(assignment => assignment.course_id === course.id);
          const semester = semesters.find(semester => semester.id === (semesterAssignment ? semesterAssignment.semester_id : null));
          const semesterName = semester ? `${semester.term} ${semester.number}` : 'Unknown Semester';

          // Get session information
          const session = sessions.find(session => session.id === (semester ? semester.session_id : null));
          const sessionName = session ? `${session.start_year} - ${session.end_year}` : 'Unknown Session';

          // Get teacher information
          const teacherAssignment = teacherAssignments.find(assignment => assignment.course_id === course.id);
          const teacher = users.find(user => user.id === (teacherAssignment ? teacherAssignment.teacher_id : null));
          const teacherName = teacher ? teacher.username : 'Unknown Teacher';

          return {
            program,
            session: sessionName,
            semester: semesterName,
            course: course.name,
            clos: courseCLOsNames,
            plos: relatedPLOsNames,
            teacher: teacherName
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="view-sos-container">
      <h2>View Courses</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="button-group">
        <button className="btn primary">Button 1</button>
        <button className="btn secondary">Button 2</button>
        <button className="btn success">Button 3</button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Program</th>
            <th>Session</th>
            <th>Semester</th>
            <th>Course</th>
            <th>CLOs</th>
            <th>PLOs</th>
            <th>Teacher</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.program}</td>
              <td>{item.session}</td>
              <td>{item.semester}</td>
              <td>{item.course}</td>
              <td>{item.clos}</td>
              <td>{item.plos}</td>
              <td>{item.teacher}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewSOS;
