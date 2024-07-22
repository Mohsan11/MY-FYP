import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './updateTeacher.css';

const UpdateTeacher = () => {
  const { id } = useParams(); // Extract ID from URL
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState({
    username: '',
    email: '',
    role: '', // Added role
    password: '' // Added password
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    fetchTeacher();
  }, []);

  const fetchTeacher = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/users/${id}`);
      setTeacher(response.data);
    } catch (error) {
      console.error('Error fetching teacher:', error);
      setMessage("Failed to fetch teacher details.");
      setMessageType("error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/users/${id}`, teacher);
      setMessage("Teacher updated successfully!");
      setMessageType("success");
      setTimeout(() => navigate('/teachers'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error updating teacher:', error);
      setMessage("Failed to update teacher.");
      setMessageType("error");
    }
  };

  return (
    <div className="update-teacher-container">
      <h3>Update Teacher</h3>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={teacher.username}
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
            value={teacher.email}
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
            value={teacher.role}
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
            value={teacher.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

export default UpdateTeacher;
