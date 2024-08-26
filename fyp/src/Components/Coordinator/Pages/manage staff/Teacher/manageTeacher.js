import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';


const ManageTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [editMode, setEditMode] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState({
    id: '',
    username: '',
    email: '',
    role: '',
    password: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, search]);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users/role/Teacher');
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
    setFilteredTeachers(filtered);
  };

  const handleEdit = (teacher) => {
    setCurrentTeacher({
      id: teacher.id,
      username: teacher.username,
      email: teacher.email,
      role: teacher.role,
      password: '', // Reset password field
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/users/${id}`);
      setTeachers(teachers.filter(teacher => teacher.id !== id));
      setMessage("Teacher deleted successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      setMessage("Failed to delete teacher.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/users/${currentTeacher.id}`, currentTeacher);
      setMessage("Teacher updated successfully!");
      setMessageType("success");
      setEditMode(false);
      fetchTeachers(); // Refresh the list
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error('Error updating teacher:', error);
      setMessage("Failed to update teacher.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTeacher(prevState => ({
      ...prevState,
      [name]: value
    }));
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
          <button
            onClick={() => handleEdit(row)}
            className="btn btn-primary ms-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="btn btn-danger ms-2"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="teacher-container">
      {editMode ? (
        <div className="update-teacher-container">
          <h3>Update Teacher</h3>
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={currentTeacher.username}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={currentTeacher.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                value={currentTeacher.role}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select Role</option>
                <option value="Teacher">Teacher</option>
                <option value="Coordinator">Coordinator</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={currentTeacher.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Update</button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ManageTeacher;
