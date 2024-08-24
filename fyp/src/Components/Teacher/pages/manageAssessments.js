import React, { useState, useEffect } from "react";
import axios from "axios";
import './manageAssessments.css'
const ManageAssessments = ({ teacherId, course }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [cloOptions, setCloOptions] = useState([]);
  const [cloStatus, setCloStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 
  // Fetch courses assigned to the teacher
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:4000/api/teacherCourseAssignment/teacher/${teacherId}`);
        setCourses(response.data);
        setError(null);
      } catch (error) {
        setError("Error fetching courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [teacherId]);

  // Fetch CLO status for the selected course
 // Fetch CLO status for the selected course
useEffect(() => {
  if (selectedCourse) {
    const fetchCloStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:4000/api/assesmentsController/checkCLOs/${selectedCourse.id}`);

        if (response.status === 200) {
          if (response.data.message === 'Not all CLOs have assessments') {
            // CLOs with missing assessments
            const missingCLOIds = response.data.missingCLOs.map(clo => clo.id);

            // Fetch CLO names for each missing CLO ID
            const cloNamesPromises = missingCLOIds.map(id => axios.get(`http://localhost:4000/api/clo/${id}`));
            const cloNamesResponses = await Promise.all(cloNamesPromises);

            const cloNames = cloNamesResponses.map(response => ({
              id: response.data.id,
              clo_name: response.data.clo_name,
              clo_description: response.data.description
            }));

            setCloStatus(cloNames);
          } else {
            // All CLOs have assessments
            setCloStatus('All CLOs have assessments.');
          }
        } else {
          setError("Unexpected response status.");
        }
      } catch (error) {
        setError("Error fetching CLO status.");
      } finally {
        setLoading(false);
      }
    };

    fetchCloStatus();
  }
}, [selectedCourse]);

  

  // Fetch CLOs for the selected course
  useEffect(() => {
    if (selectedCourse) {
      const fetchCLOs = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:4000/api/clo/course/${selectedCourse.id}`);
          setCloOptions(response.data);
          setError(null);
        } catch (error) {
          setError("Error fetching CLOs.");
        } finally {
          setLoading(false);
        }
      };

      fetchCLOs();
    }
  }, [selectedCourse]);

  // Handle course selection and fetch related assessments
  const handleCourseClick = async (course) => {
    setSelectedCourse(course);
    setSelectedAssessment(null);
    setQuestions([]);

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/assessments/course/${course.id}`);
      setAssessments(response.data);
      setError(null);
    } catch (error) {
      setError("Error fetching assessments.");
    } finally {
      setLoading(false);
    }
  };

  // Handle assessment selection and fetch related questions
  const handleAssessmentSelect = async (assessmentId) => {
    const selected = assessments.find((a) => a.id === assessmentId);
    setSelectedAssessment(selected);

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/questions/assessment/${assessmentId}`);
      const questionsWithAssessmentNames = await Promise.all(
        response.data.map(async (question) => {
          const assessmentResponse = await axios.get(`http://localhost:4000/api/assessments/${question.assessment_id}`);
          return {
            ...question,
            assessment_name: assessmentResponse.data.assessment_name,
          };
        })
      );
      setQuestions(questionsWithAssessmentNames);
      setError(null);
    } catch (error) {
      setError("Error fetching questions.");
    } finally {
      setLoading(false);
    }
  };

  // Handle assessment deletion
  const handleDeleteQuestion = async (questionId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:4000/api/questions/questions/${questionId}`);
      setQuestions(questions.filter((q) => q.id !== questionId));
      // alert("Question deleted successfully!");
      setError(null);
    } catch (error) {
      setError("Error deleting question.");
    } finally {
      setLoading(false);
    }
  };
  
  

  // Handle question changes
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };


  
  // Save changes to questions
  const handleSaveQuestion = async (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    setLoading(true);
    try {
      await axios.put(`http://localhost:4000/api/questions/questions/${questionId}`, {
        question_text: question.question_text,
        marks: question.marks,
        clo_id: question.clo_id,
        assessment_id: question.assessment_id, // Ensure assessment_id is included
      });
      alert("Question saved successfully!");
      setMessage('Marks and results saved successfully');
        setMessageType('success');
      setError(null);
    } catch (error) {
      setError("Error saving question.");
      setMessage('Error saving marks and results');
        setMessageType('error');
        console.error('Error saving marks and results:', error);

    } finally {
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
      setLoading(false);
    }
  };
  

  

  return (
    <div>
      <h2>Manage Assessments</h2>
      <div>
          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          {cloStatus && (
          <div>
            {typeof cloStatus === 'string' ? (
              <h3>{cloStatus}</h3>
            ) : (
              <div>
                <h3>Missing CLOs:</h3>
                <ul>
                  {cloStatus.map((clo) => (
                    <li key={clo.id}>{clo.clo_name} -  (Description: {clo.clo_description.split(' ').slice(0, 3).join(' ')})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        </div>

      <div className="course-list">
        <h3>Courses</h3>
        <div className="table-container">
  <table className="assessment-table">
    <thead className="table-header">
      <tr>
        <th className="header-cell">Course Name</th>
        <th className="header-cell">Program Name</th>
        <th className="header-cell">Session</th>
        <th className="header-cell">Semester</th>
      </tr>
    </thead>
    <tbody className="table-body">
      {courses.map((course) => (
        <tr key={course.id} onClick={() => handleCourseClick(course)} className="table-row pointer">
          <td className="table-cell">{course.course_name}</td>
          <td className="table-cell">{course.program_name}</td>
          <td className="table-cell">{course.session}</td>
          <td className="table-cell">{course.semester_name}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>

      {selectedCourse && (
        <div className="assessment-dropdown">
          <h3>Assessments for: {selectedCourse.course_name}</h3>
          <select
            onChange={(e) => handleAssessmentSelect(e.target.value)}
            value={selectedAssessment?.id || ""}
          >
            <option value="">Select an Assessment</option>
            {assessments.map((assessment) => (
              <option key={assessment.id} value={assessment.id}>
                {assessment.assessment_name} - {assessment.assessment_type}
              </option>
            ))}
          </select>
        </div>
      )}

      {questions.length > 0 && (
        <div className="assessment-details">
          <h3>Assessment Questions</h3>
          <ol>
          {questions.map((q, index) => (
  <li key={q.id}>
    <label>Question Text:</label>
    <input
      type="text"
      value={q.question_text}
      className="question-text"
      onChange={(e) => handleQuestionChange(index, "question_text", e.target.value)}
    />
    <label>Marks:</label>
    <input
      type="number"
      className="marks-text"
      value={q.marks}
      onChange={(e) => handleQuestionChange(index, "marks", e.target.value)}
      min="0"
    />
    <label>Assessment Name:</label>
    <input
      type="text"
      value={q.assessment_name}
      readOnly
    />
    <label>CLO:</label>
    <select
      value={q.clo_id || ""}
      onChange={(e) => handleQuestionChange(index, "clo_id", e.target.value)}
    >
      <option value="">Select CLO</option>
      {cloOptions.map((clo) => (
        <option key={clo.id} value={clo.id}>
          {clo.clo_name}
        </option>
      ))}
    </select>
    <div className="button-group rp">
    <button  className="button save-button" onClick={() => handleSaveQuestion(q.id)}>Save</button>
    <button className="button delete-button"   onClick={() => handleDeleteQuestion(q.id)}>Delete</button>
    </div>
  </li>
))}
{message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
          </ol>
          {/* <div className="button-group rp">
            <button className="button save-button" onClick={handleSaveChanges}>Save Changes</button>
            <button className="button delete-button" onClick={handleDeleteAssessment}>Delete Assessment</button>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ManageAssessments;
