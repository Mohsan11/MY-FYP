import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

const Summary = ({ studentId }) => {
  const [courseData, setCourseData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch enrolled courses for the student
        const enrolledCoursesResponse = await fetch(`http://localhost:4000/api/studentenrollments/student/${studentId}`);
        const enrolledCourses = await enrolledCoursesResponse.json();

        const courseDetails = await Promise.all(enrolledCourses.map(async (course) => {
          // Fetch course details
          const courseResponse = await fetch(`http://localhost:4000/api/courses/${course.course_id}`);
          const courseData = await courseResponse.json();

          // Fetch semester details
          const semesterResponse = await fetch(`http://localhost:4000/api/semester/${course.semester_id}`);
          const semesterData = await semesterResponse.json();

          // Fetch teacher details
          const teacherResponse = await fetch(`http://localhost:4000/api/teachercourseassignment/course/${course.course_id}`);
          const teacherAssignments = await teacherResponse.json();
          const teacherIds = teacherAssignments.map(assignment => assignment.teacher_id);
          const teachers = await Promise.all(teacherIds.map(async (teacherId) => {
            const teacherResponse = await fetch(`http://localhost:4000/api/users/${teacherId}`);
            return await teacherResponse.json();
          }));

          // Fetch CLOs
          const cloResponse = await fetch(`http://localhost:4000/api/clo/course/${course.course_id}`);
          const clos = await cloResponse.json();

          return {
            courseId: courseData.id,
            courseName: courseData.name,
            teacherNames: teachers.map(teacher => teacher.username).join(', '),
            courseCLOs: clos.map(clo => clo.clo_name).join(', '),
            semester: semesterData.name,
            theoryCreditHours: courseData.theory_credit_hours,
            labCreditHours: courseData.lab_credit_hours
          };
        }));

        setCourseData(courseDetails);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchData();
  }, [studentId]);

  const fetchAssessments = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/results/course/${courseId}/student/${studentId}`);
      const data = await response.json();
      setAssessments(data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleCourseClick = (courseId) => {
    setSelectedCourse(courseId);
    fetchAssessments(courseId);
  };

  const handleBackClick = () => {
    setSelectedCourse(null);
    setAssessments([]);
  };

  const columns = [
    {
      name: 'Course Name',
      selector: row => row.courseName,
      sortable: true,
      cell: row => <div onClick={() => handleCourseClick(row.courseId)} style={{ cursor: 'pointer', color: 'blue' }}>{row.courseName}</div>,
    },
    { name: 'Teacher Names', selector: row => row.teacherNames, sortable: true },
    { name: 'Course CLOs', selector: row => row.courseCLOs, sortable: true },
    { name: 'Semester', selector: row => row.semester, sortable: true },
    { name: 'Theory Credit Hours', selector: row => row.theoryCreditHours, sortable: true },
    { name: 'Lab Credit Hours', selector: row => row.labCreditHours, sortable: true }
  ];

  const assessmentColumns = [
    { name: 'Assessment Name', selector: row => row.assessment_name, sortable: true },
    { name: 'Assessment Type', selector: row => row.assessment_type, sortable: true },
    { name: 'Final Total Marks', selector: row => row.final_total_marks, sortable: true },
    { name: 'Final Obtained Marks', selector: row => row.final_obtained_marks, sortable: true }
  ];

  return (
    <div>
      <h1>Course Summary</h1>
      {selectedCourse ? (
        <div>
          <button className="button" onClick={handleBackClick}>Back</button>
          <h2>Assessments for {courseData.find(course => course.courseId === selectedCourse)?.courseName}</h2>
          <DataTable
            columns={assessmentColumns}
            data={assessments}
            pagination
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={courseData}
          pagination
        />
      )}
    </div>
  );
};

export default Summary;
