import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, search]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/viewsos/all');
      console.log('Fetched students:', response.data); // Debugging
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const filterStudents = () => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = students.filter(student =>
      student.roll_number.toLowerCase().includes(lowercasedSearch) ||
      student.student_name.toLowerCase().includes(lowercasedSearch) ||
      student.email.toLowerCase().includes(lowercasedSearch)
    );
    console.log('Filtered students:', filtered); // Debugging
    setFilteredStudents(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/students/${id}`);
      // Update the student list after deletion
      setStudents(students.filter(student => student.id !== id));
      setTimeout(() => {
        setMessage("Student deleted successfully!");
        setMessageType("success");
        
      }, 5000);
    } catch (error) {
      console.error('Error deleting student:', error);
      setTimeout(() => {
        setMessage("Failed to delete student.");
        setMessageType("error");
      }, 5000);
    }
  };

  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'Roll Number',
      selector: row => row.roll_number,
      sortable: true,
    },
    {
      name: 'Name',
      selector: row => row.student_name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Program',
      selector: row => row.program_name || 'N/A', // Assuming this field exists
      sortable: true,
    },
    {
      name: 'Session',
      selector: row => row.session_name || 'N/A', // Assuming this field exists
      sortable: true,
    },
    {
      name: 'Semester',
      selector: row => row.semester_name || 'N/A', // Assuming this field exists
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <Link to={`/update-student/${row.id}`} className="btn btn-primary">
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="btn btn-danger ms-2 lp"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="student-table-container">
      <h3>Student List</h3>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <DataTable
        columns={columns}
        data={filteredStudents}
        pagination
        highlightOnHover
        pointerOnHover
        selectableRows
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Search..."
            className="w-25 form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />
    </div>
  );
};

export default StudentTable;
