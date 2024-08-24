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
  const [selectedStudent, setSelectedStudent] = useState(null); // Store selected student

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
    setStudents([]);
    setAssessments([]);
    setSelectedAssessment('');
    setQuestions([]);
    setMarks({});
    setShowMarksPage(false);
    setSelectedStudent(null);

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
    setQuestions([]);
    setMarks({});

    axios.get(`http://localhost:4000/api/questions/assessment/${assessmentId}`)
      .then(response => {
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
        }).then(response => {
          console.log('Mark saved:', response.data);
          return response.data;
        }).catch(error => {
          console.error('Error saving mark:', error);
          return Promise.reject(error);
        });
      });
    });

    Promise.all(markPromises)
      .then(markResponses => {
        console.log('All marks saved:', markResponses);
        return axios.get(`http://localhost:4000/api/assessments/${selectedAssessment}`)
          .then(response => {
            const assessmentData = response.data;
            const totalMarksSum = markResponses.reduce((sum, mark) => sum + mark.total_marks, 0);
            const obtainedMarksSum = markResponses.reduce((sum, mark) => sum + mark.obtained_marks, 0);

            const normalizedTotalMarks = assessmentData.normalized_total_marks;
            const normalizedObtainedMarks = (obtainedMarksSum / totalMarksSum) * normalizedTotalMarks;

            if (!selectedStudent || !selectedStudent.student_id) {
              console.error('Selected student is not properly set:', selectedStudent);
              setMessage('Error: Selected student is not set.');
              setMessageType('error');
              return Promise.reject('Selected student is not set');
            }

            return axios.post('http://localhost:4000/api/results', {
              final_total_marks: normalizedTotalMarks,
              final_obtained_marks: normalizedObtainedMarks,
              assessment_id: selectedAssessment,
              student_id: selectedStudent.student_id,
              assessment_name: assessmentData.assessment_name,
              assessment_type: assessmentData.assessment_type
            }).then(response => {
              console.log('Result saved:', response.data);
              return response.data;
            }).catch(error => {
              console.error('Error saving result:', error);
              return Promise.reject(error);
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

  const handleAddMarksClick = (student) => {
    setSelectedStudent(student); // Store the selected student
    setShowMarksPage(true);
  };

  const handleBackClick = () => {
    setShowMarksPage(false);
    setSelectedStudent(null);
    setMarks({});
    setQuestions([]);
  };

  const studentColumns = [
    { name: 'Student Name', selector: row => row.student_name, sortable: true },
    { name: 'Roll Number', selector: row => row.roll_number, sortable: true },
    { name: 'Course', selector: row => row.course_name, sortable: true },
    {
      name: 'Action',
      cell: (row) => (
        <button onClick={() => handleAddMarksClick(row)}>Add Marks</button>
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

  const data = selectedStudent ? questions.map(question => ({
    ...selectedStudent,
    question_text: question.question_text,
    marks: question.marks,
    question_id: question.id,
  })) : [];

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
                  {course.course_name.split(' ').slice(0, 3).join(' ')}
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
          <h2>Add Marks for Student: {selectedStudent?.student_name}</h2>
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
                <button className='button back-button' onClick={handleBackClick}>Back</button>
              </div>
              {message && (
                <div className={`message ${messageType}`}>
                  {message}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AddMarks;
