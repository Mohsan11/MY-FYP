import React, { useState } from 'react';
import axios from 'axios';

const AddStaff = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState(''); // 'success' or 'error'

  const handleRegisterUser = async () => {
    // Validate input fields
    if (!username || !email || !password || !role) {
      setResponseMessage('All fields are required, and a role must be selected.');
      setResponseType('error');
      setTimeout(() => {
        setResponseMessage('');
        setResponseType('');
      }, 4000);
      return;
    }

    try {
      const newUser = {
        username,
        password,
        role,
        email
      };

      const response = await axios.post('http://localhost:4000/api/users/register', newUser);
      setResponseMessage('User registered successfully!');
      setResponseType('success');

      // Clear input fields
      setUsername('');
      setPassword('');
      setRole('');
      setEmail('');
    } catch (error) {
      console.error('Error registering user:', error);
      setResponseMessage('Failed to register user. Please try again.');
      setResponseType('error');
    }

    setTimeout(() => {
      setResponseMessage('');
      setResponseType('');
    }, 4000);
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setRole('');
    setEmail('');
  };

  return (
    <div className='StaffContainer'>
      <h2>Register User</h2>
      <div>
        <label>Username:</label>
        <input className='lp' type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input className='lp'  style={{width: 'calc(100% - 20px)'}} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input className='lp' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Role:</label>
        <select className='lp' value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="Teacher">Teacher</option>
          <option value="Coordinator">Coordinator</option>
        </select>
      </div>
      <div className='rp button-group'>
        <button className='button save-button' onClick={handleRegisterUser}>Register</button>
        <button className='button cancel-button' onClick={handleCancel}>Cancel</button>
      </div>
      <div>
        <p className={`message ${responseType}`}>{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddStaff;
