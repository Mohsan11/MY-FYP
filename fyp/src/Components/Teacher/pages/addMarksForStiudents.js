// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import DataTable from 'react-data-table-component';
// import AddMarks from './addMarks';
// const AddMarksForStudents = ({ teacherId }) => {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState('');
//   const [students, setStudents] = useState([]);
//   const [selectedStudentId, setSelectedStudentId] = useState(null);

//   useEffect(() => {
//     const fetchTeacherCourses = async () => {
//       try {
//         const response = await axios.get(`http://localhost:4000/api/teacherCourseAssignment/teacher/${teacherId}`);
//         setCourses(response.data);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       }
//     };

//     fetchTeacherCourses();
//   }, [teacherId]);

//   useEffect(() => {
//     if (selectedCourseId) {
//       const fetchStudents = async () => {
//         try {
//           const response = await axios.get(`http://localhost:4000/api/students/course/${selectedCourseId}`);
//           setStudents(response.data);
//         } catch (error) {
//           console.error("Error fetching students:", error);
//         }
//       };

//       fetchStudents();
//     }
//   }, [selectedCourseId]);

//   const handleAddMarksClick = (studentId) => {
//     setSelectedStudentId(studentId);
//   };

//   if (selectedStudentId) {
//     return <AddMarks studentId={selectedStudentId} courseId={selectedCourseId} />;
//   }

//   const columns = [
//     { name: 'Name', selector: row => row.name, sortable: true },
//     { name: 'Roll Number', selector: row => row.roll_number, sortable: true },
//     {
//       name: 'Actions',
//       cell: row => (
//         <button onClick={() => handleAddMarksClick(row.id)}>
//           Add Marks
//         </button>
//       )
//     }
//   ];

//   return (
//     <div>
//       <div>
//         <label>Select Course: </label>
//         <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
//           <option value="" disabled>Select Course</option>
//           {courses.map(course => (
//             <option key={course.id} value={course.id}>{course.course_name}</option>
//           ))}
//         </select>
//       </div>

//       {students.length > 0 && (
//         <DataTable
//           title="Students"
//           columns={columns}
//           data={students}
//         />
//       )}
//     </div>
//   );
// };

// export default AddMarksForStudents;
