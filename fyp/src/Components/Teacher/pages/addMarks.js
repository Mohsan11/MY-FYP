import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const AddMarks = ({ teacherId }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [questions, setQuestions] = useState([]);
  const [marks, setMarks] = useState({});
  const [showMarksPage, setShowMarksPage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

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

    axios.get(`http://localhost:4000/api/assessments/course/${courseId}`)
      .then(response => {
        setAssessments(response.data);
      })
      .catch(error => {
        console.error('Error fetching assessments:', error);
      });
  };

  const handleAssessmentChange = (event) => {
    const assessmentId = event.target.value;
    setSelectedAssessment(assessmentId);
  
    axios.get(`http://localhost:4000/api/questions/assessment/${assessmentId}`)
      .then(response => {
        console.log('Questions data:', response.data);
        setQuestions(response.data);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  };
  
  const handleMarkChange = (questionId, studentId, event) => {
    const value = event.target.value;
    setMarks(prevMarks => ({
      ...prevMarks,
      [questionId]: {
        ...prevMarks[questionId],
        [studentId]: value
      }
    }));
  };

  const handleSubmit = () => {
    const markPromises = Object.keys(marks).flatMap(questionId => {
      const questionMarks = marks[questionId];
      return Object.keys(questionMarks).map(studentId => {
        const obtainedMarks = questionMarks[studentId];
        const totalMarks = questions.find(q => q.id === parseInt(questionId))?.marks;
  
        if (!studentId || !questionId || !totalMarks || !obtainedMarks) {
          console.error('Invalid data:', { studentId, questionId, totalMarks, obtainedMarks });
          setMessage('Error saving marks. Please check the input data.');
          setMessageType('error');
          return Promise.reject('Invalid data');
        }
  
        return axios.post('http://localhost:4000/api/marks', {
          student_id: studentId,
          question_id: questionId,
          assessment_id: selectedAssessment,
          total_marks: totalMarks,
          obtained_marks: obtainedMarks
        });
      });
    });
  
    Promise.all(markPromises)
      .then(markResponses => {
        return axios.get(`http://localhost:4000/api/assessments/marks/assessment/${selectedAssessment}`)
          .then(response => {
            const marksData = response.data;
            const totalMarksSum = marksData.reduce((sum, mark) => sum + mark.total_marks, 0);
            const obtainedMarksSum = marksData.reduce((sum, mark) => sum + mark.obtained_marks, 0);
  
            return axios.get(`http://localhost:4000/api/assessments/${selectedAssessment}`)
              .then(response => {
                const normalizedTotalMarks = response.data.normalized_total_marks;
                const normalizedObtainedMarks = (obtainedMarksSum / totalMarksSum) * normalizedTotalMarks;
  
                return axios.post('http://localhost:4000/api/results', {
                  final_total_marks: normalizedTotalMarks,
                  final_obtained_marks: normalizedObtainedMarks,
                  assessment_id: selectedAssessment
                });
              });
          });
      })
      .then(() => {
        setMessage('Marks and results saved successfully');
        setMessageType('success');
      })
      .catch(error => {
        setMessage('Error saving marks and results');
        setMessageType('error');
        console.error('Error saving marks and results:', error);
      })
      .finally(() => {
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      });
  };
  
  

  
  

  const studentColumns = [
    { name: 'Student Name', selector: row => row.student_name, sortable: true },
    { name: 'Roll Number', selector: row => row.roll_number, sortable: true },
    { name: 'Course', selector: row => row.course_name, sortable: true },
    {
      name: 'Action',
      cell: (row) => (
        <button onClick={() => setShowMarksPage(true)}>Add Marks</button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const markColumns = [
    { name: 'Student Name', selector: row => row.student_name, sortable: true },
    { name: 'Roll Number', selector: row => row.roll_number, sortable: true },
    { name: 'Question Text', selector: row => row.question_text, sortable: true },
    { name: 'Total Marks', selector: row => row.marks, sortable: true },
    {
      name: 'Obtained Marks',
      cell: (row) => (
        <input
          type="number"
          value={marks[row.question_id]?.[row.student_id] || ''}
          onChange={(e) => handleMarkChange(row.question_id, row.student_id, e)}
        />
      ),
      sortable: true,
    },
  ];

  const data = students.flatMap(student =>
    questions.map(question => ({
      ...student,
      question_text: question.question_text,
      marks: question.marks,
      question_id: question.id,
    }))
  );

  return (
    <div>
      {!showMarksPage ? (
        <>
          <h2>Add Marks</h2>
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
          {students.length > 0 && (
            <DataTable
              title="Students Enrolled"
              columns={studentColumns}
              data={students}
              pagination
            />
          )}
        </>
      ) : (
        <div>
          <h2>Add Marks for Students</h2>
          <div>
            <label htmlFor="assessment">Select Assessment:</label>
            <select id="assessment" value={selectedAssessment} onChange={handleAssessmentChange}>
              <option value="">Select an assessment</option>
              {assessments.map(assessment => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.assessment_name}
                </option>
              ))}
            </select>
          </div>
          {questions.length > 0 && (
            <>
              <DataTable
                title="Marks"
                columns={markColumns}
                data={data}
                pagination
              />
              <div className='rp button-group'>
                <button className='button save-button' onClick={handleSubmit}>Save Marks</button>
              </div>
            </>
          )}
        </div>
      )}
      {message && (
        <p style={{
          color: messageType === 'success' ? 'green' : 'red',
          border: `1px solid ${messageType === 'success' ? 'green' : 'red'}`,
          borderRadius: '5px',
          backgroundColor: messageType === 'success' ? 'lightgreen' : 'lightcoral',
          padding: '10px',
          marginTop: '10px',
          textAlign: 'center'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AddMarks;
