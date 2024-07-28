import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddAssessment = ({ course, teacherId }) => {
  const [assessmentName, setAssessmentName] = useState('');
  const [assessmentType, setAssessmentType] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(course?.id || '');
  const [selectedSemesterId, setSelectedSemesterId] = useState(course?.semester_id || '');
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState(''); // 'success' or 'error'
  const [assessmentId, setAssessmentId] = useState(null);
  const [questions, setQuestions] = useState([{ question_text: '', clo_id: '', marks: '' }]);
  const [clos, setClos] = useState([]);

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        const coursesResponse = await axios.get(`http://localhost:4000/api/teacherCourseAssignment/teacher/${teacherId}`);
        const fetchedCourses = coursesResponse.data;
        setCourses(fetchedCourses);

        if (!course && fetchedCourses.length > 0) {
          setSelectedCourseId(fetchedCourses[0].id);
          setSelectedSemesterId(fetchedCourses[0].semester_id);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchTeacherCourses();
  }, [course, teacherId]);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const semestersResponse = await axios.get('http://localhost:4000/api/semester/all');
        setSemesters(semestersResponse.data);
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    };

    fetchSemesters();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      const fetchClos = async () => {
        try {
          const closResponse = await axios.get(`http://localhost:4000/api/clo/course/${selectedCourseId}`);
          setClos(closResponse.data);
        } catch (error) {
          console.error("Error fetching CLOs:", error);
        }
      };

      fetchClos();
    }
  }, [selectedCourseId]);

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/assessments', {
        assessment_name: assessmentName,
        assessment_type: assessmentType,
        course_id: selectedCourseId,
        semester_id: selectedSemesterId
      });

      setAssessmentId(response.data.id);
      setResponseMessage("Assessment created successfully! You can now add questions.");
      setResponseType('success');

      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);

      // Clear input fields on successful save
      setAssessmentName('');
      setAssessmentType('');
    } catch (error) {
      console.error("Error creating assessment:", error);
      setResponseMessage("Failed to create assessment. Please try again.");
      setResponseType('error');

      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question_text: '', clo_id: '', marks: '' }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSaveQuestions = async () => {
    try {
      await Promise.all(questions.map(question =>
        axios.post('http://localhost:4000/api/questions', {
          ...question,
          assessment_id: assessmentId
        })
      ));
      console.log(...questions, assessmentId)
      setResponseMessage("Questions added successfully!");
      setResponseType('success');

      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);

      setQuestions([{ question_text: '', clo_id: '', marks: '' }]);
    } catch (error) {
      console.log(...questions, assessmentId)
      console.error("Error adding questions:", error);
      setResponseMessage("Failed to add questions. Please try again.");
      setResponseType('error');

      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);
    }
  };

  return (
    <div className='AssessmentContainer'>
      <h2 className="heading">Add Assessment</h2>
      <div className='lp'>
        <label>Assessment Name:</label>
        <input className="input" type="text" value={assessmentName} onChange={(e) => setAssessmentName(e.target.value)} />
      </div>
      <div className='lp'>
        <label>Assessment Type:</label>
        <select value={assessmentType} onChange={(e) => setAssessmentType(e.target.value)}>
          <option value="" disabled>Select Type</option>
          <option value="quiz">Quiz</option>
          <option value="assignment">Assignment</option>
          <option value="midterm">Mid Term</option>
          <option value="terminal">Terminal</option>
        </select>
      </div>
      <div className='lp'>
        <label>Select Course:</label>
        <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} disabled={!!course}>
          <option value="" disabled>Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.course_name}</option>
          ))}
        </select>
      </div>
      <div className='lp'>
        <label>Select Semester:</label>
        <select value={selectedSemesterId} onChange={(e) => setSelectedSemesterId(e.target.value)} disabled={!!course}>
          <option value="" disabled>Select Semester</option>
          {semesters.map(semester => (
            <option key={semester.id} value={semester.id}>{semester.name}</option>
          ))}
        </select>
      </div>
      <div className='rp button-group'>
        <button className='button save-button' onClick={handleSave}>Save</button>
      </div>
      <div>
        <p className={`message ${responseType}`}>{responseMessage}</p>
      </div>

      {assessmentId && (
        <div className='QuestionsContainer'>
          <h2 className="heading">Add Questions</h2>
          {questions.map((question, index) => (
            <div key={index} className='question'>
              <div className='lp'>
                <label>Question Text:</label>
                <input
                  type="text"
                  value={question.question_text}
                  onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                />
              </div>
              <div className='lp'>
                <label>Marks:</label>
                <input
                  type="number"
                  value={question.marks}
                  onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)}
                />
              </div>
              <div className='lp'>
                <label>Select CLO:</label>
                <select
                  value={question.clo_id}
                  onChange={(e) => handleQuestionChange(index, 'clo_id', e.target.value)}
                >
                  <option value="" disabled>Select CLO</option>
                  {clos.map(clo => (
                    <option key={clo.id} value={clo.id}>{clo.clo_name}- {clo.description}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <div className='rp button-group'>
            <button className='button add-button' onClick={handleAddQuestion}>Add Another Question</button>
            <button className='button save-button' onClick={handleSaveQuestions}>Save Questions</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAssessment;
