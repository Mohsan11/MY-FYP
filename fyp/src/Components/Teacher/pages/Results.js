import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const Results = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [showAssessmentDetails, setShowAssessmentDetails] = useState(false);
  const [studentAssessments, setStudentAssessments] = useState([]);

  useEffect(() => {
    // Fetch courses
    axios.get('http://localhost:4000/api/courses/')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);
    
    // Fetch students for the selected course
    axios.get(`http://localhost:4000/api/studentenrollments/course/${courseId}`)
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  };

  const handleViewClick = (studentId) => {
    setSelectedStudent(studentId);

    // Fetch assessments for the selected student
    axios.get(`http://localhost:4000/api/marks/student/${studentId}`)
      .then(response => {
        const marks = response.data;
        const assessmentPromises = marks.map(mark => 
          axios.get(`http://localhost:4000/api/questions/${mark.question_id}`)
            .then(questionRes => 
              axios.get(`http://localhost:4000/api/assessments/${questionRes.data.assessment_id}`)
                .then(assessmentRes => 
                  axios.get(`http://localhost:4000/api/courses/${assessmentRes.data.course_id}`)
                    .then(courseRes => ({
                      ...assessmentRes.data,
                      course_name: courseRes.data.name,
                      obtained_marks: mark.marks
                    }))
                )
            )
        );
        return Promise.all(assessmentPromises);
      })
      .then(assessments => {
        setStudentAssessments(assessments);
        setShowAssessmentDetails(true);
      })
      .catch(error => {
        console.error('Error fetching assessments:', error);
      });
  };

  const studentColumns = [
    { name: 'Student Name', selector: row => row.student_name, sortable: true },
    { name: 'Roll Number', selector: row => row.roll_number, sortable: true },
    { name: 'Course', selector: row => row.course_name, sortable: true },
    {
      name: 'Action',
      cell: (row) => (
        <button onClick={() => handleViewClick(row.student_id)}>View</button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const assessmentColumns = [
    { name: 'Assessment Name', selector: row => row.name, sortable: true },
    { name: 'Course', selector: row => row.course_name, sortable: true },
    { name: 'Total Marks', selector: row => row.total_marks, sortable: true },
    { name: 'Obtained Marks', selector: row => row.obtained_marks, sortable: true },
  ];

  return (
    <div>
      <h2>Results</h2>
      <div>
        <label htmlFor="course">Select Course:</label>
        <select id="course" value={selectedCourse} onChange={handleCourseChange}>
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      
      {students.length > 0 && (
        <DataTable
          title="Students Enrolled"
          columns={studentColumns}
          data={students}
          pagination
        />
      )}

      {showAssessmentDetails && (
        <div>
          <h3>Assessments for Student</h3>
          <DataTable
            title="Student Assessments"
            columns={assessmentColumns}
            data={studentAssessments}
            pagination
          />
        </div>
      )}
    </div>
  );
};

export default Results;
