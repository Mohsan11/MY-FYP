import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './updatecoordinator.css';

const UpdateCoordinator = () => {
  const { id } = useParams(); // Extract ID from URL
  const navigate = useNavigate();

  const [coordinator, setCoordinator] = useState({
    username: '',
    email: '',
    role: '', // Added role
    password: '' // Added password
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    fetchCoordinator();
  }, []);

  const fetchCoordinator = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/users/${id}`);
      setCoordinator(response.data);
    } catch (error) {
      console.error('Error fetching coordinator:', error);
      setMessage("Failed to fetch coordinator details.");
      setMessageType("error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoordinator(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/users/${id}`, coordinator);
      setMessage("Coordinator updated successfully!");
      setMessageType("success");
      setTimeout(() => navigate('/coordinators'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error updating coordinator:', error);
      setMessage("Failed to update coordinator.");
      setMessageType("error");
    }
  };

  return (
    <div className="update-coordinator-container">
      <h3>Update Coordinator</h3>
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
            value={coordinator.username}
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
            value={coordinator.email}
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
            value={coordinator.role}
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
            value={coordinator.password}
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

export default UpdateCoordinator;
