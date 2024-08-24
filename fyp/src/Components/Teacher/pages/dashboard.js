import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const Dashboard = ({ teacherId, onCourseClick }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/teacherCourseAssignment/teacher/${teacherId}`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [teacherId]);

  // Define the columns for the DataTable
  const columns = [
    {
      name: 'Course Name',
      selector: (row) => row.course_name,
      sortable: true,
      cell: (row) => <span className="pointer" onClick={() => onCourseClick(row)}>{row.course_name}</span>,
    },
    {
      name: 'Program Name',
      selector: (row) => row.program_name,
      sortable: true,
    },
    {
      name: 'Session',
      selector: (row) => row.session,
      sortable: true,
    },
    {
      name: 'Semester',
      selector: (row) => row.semester_name,
      sortable: true,
    }
  ];

  return (
    <div>
      <h2>Dashboard</h2>
      <DataTable
        columns={columns}
        data={courses}
        pagination
        highlightOnHover
        pointerOnHover
        responsive
        striped
      />
    </div>
  );
};

export default Dashboard;
