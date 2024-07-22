import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

const ManageTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, search]);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users/role/Teacher');
      console.log('Fetched teachers:', response.data); // Debugging
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const filterTeachers = () => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = teachers.filter(teacher =>
      teacher.username.toLowerCase().includes(lowercasedSearch) ||
      teacher.email.toLowerCase().includes(lowercasedSearch)
    );
    console.log('Filtered teachers:', filtered); // Debugging
    setFilteredTeachers(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/users/${id}`);
      setTeachers(teachers.filter(teacher => teacher.id !== id));
      setTimeout(() => {
        setMessage("Teacher deleted successfully!");
        setMessageType("success");
      }, 5000);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      setTimeout(() => {
        setMessage("Failed to delete teacher.");
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
      name: 'Username',
      selector: row => row.username,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <Link to={`/update-teacher/${row.id}`} className="btn btn-primary">
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
    <div className="teacher-table-container">
      <h3>Teacher List</h3>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <DataTable
        columns={columns}
        data={filteredTeachers}
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

export default ManageTeacher;
