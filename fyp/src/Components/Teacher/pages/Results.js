import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const Results = ({ teacherId }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [studentAssessments, setStudentAssessments] = useState([]);
  const [assessmentDetails, setAssessmentDetails] = useState([]);
  const [showAssessmentDetails, setShowAssessmentDetails] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);


  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:4000/api/teacherCourseAssignment/teacher/${teacherId}`)
      .then(response => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses.');
        setLoading(false);
      });
  }, [teacherId]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Show message for 3 seconds

      return () => clearTimeout(timer); // Clean up the timer on unmount
    }
  }, [successMessage]);

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setIsError(false);
  };
  
  const handleError = (message) => {
    setSuccessMessage(message);
    setIsError(true);
  };
  


  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);

    setLoading(true);
    axios.get(`http://localhost:4000/api/studentenrollments/course/${courseId}`)
      .then(response => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
        setError('Failed to load students.');
        setLoading(false);
      });
  };

  const handleViewClick = (studentId) => {
    setSelectedStudent(studentId);
    setLoading(true);

    // Fetch assessments for the selected student
    axios.get(`http://localhost:4000/api/marks/student/${studentId}`)
      .then(response => {
        const marks = response.data;

        // Filter assessments based on the selected course
        const filteredAssessments = marks.filter(mark => mark.course_id === parseInt(selectedCourse));
        const assessmentsMap = {};

        filteredAssessments.forEach(mark => {
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
              course_name,
              total_marks,
              obtained_marks,
              questions: []
            };
          } else {
            assessmentsMap[assessment_id].total_marks += total_marks;
            assessmentsMap[assessment_id].obtained_marks += obtained_marks;
          }

          axios.get(`http://localhost:4000/api/questions/${question_id}`)
            .then(questionRes => {
              assessmentsMap[assessment_id].questions.push({
                id: questionRes.data.id,
                question_text: questionRes.data.question_text,
                marks: questionRes.data.marks,
                obtained_marks: mark.obtained_marks
              });
            })
            .catch(error => {
              console.error('Error fetching question details:', error);
            });
        });

        const assessmentsArray = Object.values(assessmentsMap);
        setStudentAssessments(assessmentsArray);
        setShowAssessmentDetails(true);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching assessments:', error);
        setError('Failed to load assessments.');
        setLoading(false);
      });
  };

  const handleMoreClick = (assessmentId) => {
    setSelectedAssessment(assessmentId); // Save the selected assessment ID
    setLoading(true);
    axios.get(`http://localhost:4000/api/assessments/${assessmentId}`)
      .then(response => {
        const assessment = response.data;
  
        axios.get(`http://localhost:4000/api/questions/assessment/${assessmentId}`)
          .then(questionsResponse => {
            const questions = questionsResponse.data;
  
            const fetchMarksPromises = questions.map(question =>
              axios.get(`http://localhost:4000/api/marks/question/${question.id}`)
                .then(marksResponse => ({
                  id: question.id,
                  question_text: question.question_text,
                  marks: question.marks,
                  obtained_marks: marksResponse.data.reduce((total, mark) => total + mark.obtained_marks, 0),
                  total_marks: question.marks
                }))
            );
  
            Promise.all(fetchMarksPromises)
              .then(updatedQuestions => {
                setAssessmentDetails({
                  ...assessment,
                  student_id: selectedStudent,
                  assessment_id: assessmentId, // Add assessment_id here
                  questions: updatedQuestions
                });
                setShowMoreDetails(true);
                setLoading(false);
                setError('');
                setSuccessMessage('Marks saved successfully!'); 
              })
              .catch(error => {
                console.error('Error fetching question marks:', error);
                setError('Failed to load question marks.');
                setLoading(false);
              });
          })
          .catch(error => {
            console.error('Error fetching questions:', error);
            setError('Failed to load questions.');
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Error fetching assessment details:', error);
        setError('Failed to load assessment details.');
        setLoading(false);
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
    // Disable editing of total marks
    return;
  };

  const handleObtainedMarksChange = (event, questionId) => {
    const obtainedMarks = parseFloat(event.target.value);
    // Ensure obtainedMarks is a valid number and not NaN
    if (!isNaN(obtainedMarks)) {
      const updatedQuestions = assessmentDetails.questions.map(question =>
        question.id === questionId
          ? { ...question, obtained_marks: obtainedMarks }
          : question
      );
      setAssessmentDetails({ ...assessmentDetails, questions: updatedQuestions });
    }
  };
  

  

  const handleSaveClick = () => {
    setLoading(true);
  
    const assessmentId = selectedAssessment;
    const studentId = assessmentDetails.student_id;
  
    if (!Number.isInteger(assessmentId) || !Number.isInteger(studentId)) {
      handleError('Invalid assessment ID or student ID.');
      setLoading(false);
      return;
    }
  
    const saveMarksPromises = assessmentDetails.questions.map(question => {
      const obtainedMarks = question.obtained_marks != null ? parseFloat(question.obtained_marks) : 0;
  
      if (isNaN(obtainedMarks) || question.id === undefined || question.id === null) {
        console.error(`Invalid data for question ${question.id}. Skipping...`);
        return Promise.reject('Invalid question data');
      }
  
      return axios.put(`http://localhost:4000/api/marks/update/${question.id}`, {
        obtained_marks: obtainedMarks
      }).catch(error => {
        console.error(`Error updating marks for question ${question.id}:`, error);
      });
    });
  
    Promise.all(saveMarksPromises)
      .then(() => {
        return axios.get(`http://localhost:4000/api/assessments/${assessmentId}`);
      })
      .then(response => {
        const { normalized_total_marks } = response.data;
  
        const totalObtainedMarks = assessmentDetails.questions.reduce((total, question) => {
          return total + (question.obtained_marks ? parseFloat(question.obtained_marks) : 0);
        }, 0);
  
        const totalMarks = assessmentDetails.questions.reduce((total, question) => {
          return total + (question.marks ? parseFloat(question.marks) : 0);
        }, 0);
  
        const normalizedObtainedMarks = totalMarks === 0 ? 0 : (totalObtainedMarks / totalMarks) * normalized_total_marks;
        const finalObtainedMarks = parseFloat(normalizedObtainedMarks.toFixed(1));
  
        return axios.put(`http://localhost:4000/api/results/update/${assessmentId}/${studentId}`, {
          final_obtained_marks: finalObtainedMarks
        });
      })
      .then(() => {
        setLoading(false);
        handleSuccess('Marks saved successfully!');
      })
      .catch(error => {
        console.error('Error saving marks or results:', error);
        handleError('Failed to save marks or results.');
        setLoading(false);
      });
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
          readOnly
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
    },
  ];

  return (
    <div>
      <h1>Results</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!showAssessmentDetails && (
        <div>
          <h2>Select Course</h2>
          <select onChange={handleCourseChange} value={selectedCourse}>
            <option value="">Select a course</option>
            {courses.map(course => (
             <option key={course.id} value={course.id}>
             {course.course_name.split(' ').slice(0, 3).join(' ')}
           </option>
            ))}
          </select>
          <DataTable
            title="Students"
            columns={studentColumns}
            data={students}
            pagination
          />
        </div>
      )}
      {showAssessmentDetails && (
        <div>
          <h2>Assessments for Selected Student</h2>
          <DataTable
            title="Assessments"
            columns={assessmentColumns}
            data={studentAssessments}
            pagination
          />
          {showMoreDetails && (
  <div>
    <h2>Assessment Details</h2>
    <DataTable
      title="Detailed Questions"
      columns={detailedColumns}
      data={assessmentDetails.questions}
      pagination
      />
      
      {successMessage && (
        <p className={`message ${isError ? 'error-msg' : 'success-msg'}`}>
          {successMessage}
        </p>
      )}
      <div className='button-group rp'>
        <button className='button save-button' onClick={handleSaveClick}>Save</button>
      </div>
    </div>
)}

        </div>
      )}
    </div>
  );
};

export default Results;
