import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const Results = ({ teacherId }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [studentAssessments, setStudentAssessments] = useState([]);
  const [showAssessmentDetails, setShowAssessmentDetails] = useState(false);
  const [assessmentDetails, setAssessmentDetails] = useState([]);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:4000/api/teacherCourseAssignment/teacher/${teacherId}`)
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, [teacherId]);

  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);

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

    axios.get(`http://localhost:4000/api/marks/student/${studentId}`)
      .then(response => {
        const marks = response.data;

        // Aggregate assessment data
        const assessmentsMap = {};

        marks.forEach(mark => {
          const {
            assessment_id,
            assessment_name,
            assessment_type,
            course_id,
            course_name,
            total_marks,
            obtained_marks,
            question_id
          } = mark;

          if (!assessmentsMap[assessment_id]) {
            assessmentsMap[assessment_id] = {
              assessment_id,
              assessment_name,
              assessment_type,
              course_id,
              course_name,  // Add course name
              total_marks,
              obtained_marks,
              questions: []
            };
          } else {
            assessmentsMap[assessment_id].total_marks += total_marks;
            assessmentsMap[assessment_id].obtained_marks += obtained_marks;
          }

          // Fetch question details for each question_id
          axios.get(`http://localhost:4000/api/questions/${question_id}`)
            .then(questionRes => {
              assessmentsMap[assessment_id].questions.push({
                question_text: questionRes.data.question_text,
                marks: questionRes.data.marks,
                obtained_marks: mark.obtained_marks
              });
            })
            .catch(error => {
              console.error('Error fetching question details:', error);
            });
        });

        // Convert map to array
        const assessmentsArray = Object.values(assessmentsMap);
        setStudentAssessments(assessmentsArray);
        setShowAssessmentDetails(true);
      })
      .catch(error => {
        console.error('Error fetching assessments:', error);
      });
  };
  const handleMoreClick = (assessmentId) => {
    axios.get(`http://localhost:4000/api/assessments/${assessmentId}`)
      .then(response => {
        const assessment = response.data;
        
        axios.get(`http://localhost:4000/api/questions/assessment/${assessmentId}`)
          .then(questionsResponse => {
            const questions = questionsResponse.data;

            const fetchMarksPromises = questions.map(question =>
              axios.get(`http://localhost:4000/api/marks/question/${question.id}`)
                .then(marksResponse => ({
                  ...question,
                  obtained_marks: marksResponse.data.reduce((total, mark) => total + mark.obtained_marks, 0),
                  total_marks: question.marks
                }))
            );

            Promise.all(fetchMarksPromises)
              .then(updatedQuestions => {
                setAssessmentDetails({
                  ...assessment,
                  questions: updatedQuestions
                });
                setShowMoreDetails(true);
              })
              .catch(error => {
                console.error('Error fetching question marks:', error);
              });
          })
          .catch(error => {
            console.error('Error fetching questions:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching assessment details:', error);
      });
  };

  const handleQuestionTextChange = (event, questionId) => {
    const updatedQuestions = assessmentDetails.questions.map(question =>
      question.id === questionId
        ? { ...question, question_text: event.target.value }
        : question
    );
    setAssessmentDetails({ ...assessmentDetails, questions: updatedQuestions });
  };

  const handleMarksChange = (event, questionId) => {
    const updatedQuestions = assessmentDetails.questions.map(question =>
      question.id === questionId
        ? { ...question, marks: parseInt(event.target.value, 10) }
        : question
    );
    setAssessmentDetails({ ...assessmentDetails, questions: updatedQuestions });
  };

  const handleObtainedMarksChange = (event, questionId) => {
    const updatedQuestions = assessmentDetails.questions.map(question =>
      question.id === questionId
        ? { ...question, obtained_marks: parseInt(event.target.value, 10) }
        : question
    );
    setAssessmentDetails({ ...assessmentDetails, questions: updatedQuestions });
  };

  const studentColumns = [
    { name: 'Student Name', selector: row => row.student_name, sortable: true },
    { name: 'Roll No', selector: row => row.roll_number, sortable: true },
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
    { name: 'Assessment Name', selector: row => row.assessment_name, sortable: true },
    { name: 'Course', selector: row => row.course_name, sortable: true },
    { name: 'Assessment Type', selector: row => row.assessment_type, sortable: true },
    { name: 'Total Marks', selector: row => row.total_marks, sortable: true },
    { name: 'Obtained Marks', selector: row => row.obtained_marks, sortable: true },
    {
      name: 'More',
      cell: (row) => (
        <button onClick={() => handleMoreClick(row.assessment_id)}>More</button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const detailedColumns = [
    {
      name: 'Question Text',
      selector: row => row.question_text,
      sortable: true,
      cell: row => (
        <input
          type="text"
          value={row.question_text}
          onChange={(e) => handleQuestionTextChange(e, row.id)}
        />
      )
    },
    {
      name: 'Total Marks',
      selector: row => row.marks,
      sortable: true,
      cell: row => (
        <input
          type="number"
          value={row.marks}
          onChange={(e) => handleMarksChange(e, row.id)}
        />
      )
    },
    {
      name: 'Obtained Marks',
      selector: row => row.obtained_marks,
      sortable: true,
      cell: row => (
        <input
          type="number"
          value={row.obtained_marks}
          onChange={(e) => handleObtainedMarksChange(e, row.id)}
        />
      )
    }
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
              {course.course_name}
            </option>
          ))}
        </select>
      </div>

      {students.length > 0 && !showAssessmentDetails && (
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

      {showMoreDetails && (
        <div>
          <h3>Assessment Details</h3>
          <DataTable
            title="Assessment Questions"
            columns={detailedColumns}
            data={assessmentDetails.questions}
            pagination
          />
        </div>
      )}
    </div>
  );
};

export default Results;
