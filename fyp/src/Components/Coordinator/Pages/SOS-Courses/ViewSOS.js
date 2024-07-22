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

        const formattedData = courses.map(course => {
          const courseCLOs = clos.filter(clo => clo.course_id === course.id);

          const cloPloMappings = courseCLOs.flatMap(clo => {
            return mappings
              .filter(mapping => mapping.clo_id === clo.id)
              .map(mapping => {
                const plo = plos.find(p => p.id === mapping.plo_id);
                return { clo_name: clo.clo_name, plo_name: plo ? plo.plo_name : 'Unknown PLO' };
              });
          });

          const program = programs.find(program => program.id === course.program_id)?.name || 'Unknown Program';

          const semesterAssignment = teacherAssignments.find(assignment => assignment.course_id === course.id);
          const semester = semesterAssignment ? semesters.find(semester => semester.id === semesterAssignment.semester_id) : null;
          const semesterName = semester ? `${semester.name} ${semester.number}` : 'Unknown Semester';

          const session = semester ? sessions.find(session => session.id === semester.session_id) : null;
          const sessionName = session ? `${session.start_year} - ${session.end_year}` : 'Unknown Session';

          const teacher = semesterAssignment ? users.find(user => user.id === semesterAssignment.teacher_id) : null;
          const teacherName = teacher ? teacher.username : 'Unknown Teacher';

          return {
            program,
            session: sessionName,
            semester: semesterName,
            course: course.name,
            cloPloMappings,
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
      <table className="data-table">
        <thead>
          <tr>
            <th>Program</th>
            <th>Session</th>
            <th>Semester</th>
            <th>Course</th>
            <th>CLO - PLO Mappings</th>
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
              <td>
                {item.cloPloMappings.map((mapping, i) => (
                  <div key={i}>{mapping.clo_name} - {mapping.plo_name}</div>
                ))}
              </td>
              <td>{item.teacher}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewSOS;
