import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const AddCLO = () => {
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [cloName, setCloName] = useState('');
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [clos, setClos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editCloId, setEditCloId] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, sessionsResponse] = await Promise.all([
          axios.get('http://localhost:4000/api/courses/all'),
          axios.get('http://localhost:4000/api/session/all')
        ]);
        setCourses(coursesResponse.data);
        setSessions(sessionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchClos();
  }, []);

  const fetchClos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/clo/all');
      setClos(response.data);
    } catch (error) {
      console.error("Error fetching CLOs:", error);
    }
  };

  const handleSave = async () => {
    if (editMode) {
      handleUpdate();
    } else {
      try {
        const response = await axios.post('http://localhost:4000/api/clo', {
          description,
          course_id: courseId,
          session_id: sessionId,
          clo_name: cloName
        });

        setResponseMessage("CLO added successfully!");
        setResponseType('success');
        fetchClos();
        handleCancel();
      } catch (error) {
        console.error("Error saving CLO:", error);
        setResponseMessage("Failed to add CLO. Please try again.");
        setResponseType('error');
      } finally {
        setTimeout(() => {
          setResponseMessage("");
          setResponseType('');
        }, 4000);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:4000/api/clo/${editCloId}`, {
        description,
        course_id: courseId,
        session_id: sessionId,
        clo_name: cloName
      });
      setResponseMessage("CLO updated successfully!");
      setResponseType('success');
      fetchClos();
      handleCancel();
    } catch (error) {
      console.error("Error updating CLO:", error);
      setResponseMessage("Failed to update CLO. Please try again.");
      setResponseType('error');
    } finally {
      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/clo/${id}`);
      setResponseMessage("CLO deleted successfully!");
      setResponseType('success');
      fetchClos();
    } catch (error) {
      console.error("Error deleting CLO:", error);
      setResponseMessage("Failed to delete CLO. Please try again.");
      setResponseType('error');
    } finally {
      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);
    }
  };

  const handleEdit = (clo) => {
    setDescription(clo.description);
    setCloName(clo.clo_name);
    setCourseId(clo.course_id);
    setSessionId(clo.session_id);
    setEditMode(true);
    setEditCloId(clo.id);
  };

  const handleCancel = () => {
    // Clear input fields on cancel
    setDescription('');
    setCourseId('');
    setSessionId('');
    setCloName('');
    setEditMode(false);
    setEditCloId(null);
    setResponseMessage('');
    setResponseType('');
  };

  const columns = [
    {
      name: 'CLO Name',
      selector: row => row.clo_name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Course',
      selector: row => courses.find(course => course.id === row.course_id)?.name,
      sortable: true,
    },
    {
      name: 'Session',
      selector: row => `${sessions.find(session => session.id === row.session_id)?.start_year} - ${sessions.find(session => session.id === row.session_id)?.end_year}`,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <>
          <button className="button edit-button" onClick={() => handleEdit(row)}>Edit</button>
          <button className="button delete-button" onClick={() => handleDelete(row.id)}>Delete</button>
        </>
      ),
    },
  ];

  return (
    <div className='CLOContainer'>
      <h2 className="heading">Add CLO</h2>
      <div className='lp'>
        <label>CLO Name:</label>
        <input className="input" type="text" value={cloName} onChange={(e) => setCloName(e.target.value)} />
      </div>
      <div className='lp'>
        <label>Description:</label>
        <input className="input" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className='lp'>
        <label>Select Course:</label>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="" disabled>Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>
      <div className='lp'>
        <label>Select Session:</label>
        <select value={sessionId} onChange={(e) => setSessionId(e.target.value)}>
          <option value="" disabled>Select Session</option>
          {sessions.map(session => (
            <option key={session.id} value={session.id}>{session.start_year} - {session.end_year}</option>
          ))}
        </select>
      </div>
      
      <div className='rp button-group'>
        <button className='button save-button' onClick={handleSave}>{editMode ? 'Update' : 'Save'}</button>
        <button className='button cancel-button' onClick={handleCancel}>Cancel</button>
      </div>
      <div>
        <p className={`message ${responseType}`}>{responseMessage}</p>
      </div>
      <h3 className="heading">Manage CLOs</h3>
      <DataTable
        columns={columns}
        data={clos}
        pagination
      />
    </div>
  );
};

export default AddCLO;
