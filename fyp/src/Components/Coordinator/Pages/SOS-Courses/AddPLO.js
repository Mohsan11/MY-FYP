import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import './addplo.css';

const AddPLO = () => {
  const [description, setDescription] = useState('');
  const [ploName, setPloName] = useState('');
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [plos, setPlos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editPloId, setEditPloId] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState(''); // 'success' or 'error'

  // State variables for search
  const [searchProgram, setSearchProgram] = useState('');
  const [searchSession, setSearchSession] = useState('');

  useEffect(() => {
    const fetchProgramsAndSessions = async () => {
      try {
        const [programsResponse, sessionsResponse] = await Promise.all([
          axios.get('http://localhost:4000/api/programs/all'),
          axios.get('http://localhost:4000/api/session/all')
        ]);
        setPrograms(programsResponse.data);
        setSessions(sessionsResponse.data);
      } catch (error) {
        console.error("Error fetching programs or sessions:", error);
      }
    };
    fetchProgramsAndSessions();
    fetchPlos();
  }, []);

  const fetchPlos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/plo/all');
      setPlos(response.data);
    } catch (error) {
      console.error("Error fetching PLOs:", error);
    }
  };

  const handleSave = async () => {
    if (editMode) {
      handleUpdate();
    } else {
      try {
        const ploResponse = await axios.post('http://localhost:4000/api/plo', {
          description,
          program_id: selectedProgram,
          session_id: selectedSession,
          plo_name: ploName
        });
  
        setResponseMessage("PLO added successfully!");
        setResponseType('success');
        fetchPlos();
        handleCancel();
      } catch (error) {
        console.error("Error saving PLO:", error);
  
        // Check if the error message is about a duplicate PLO
        if (error.response && error.response.data.error === 'PLO with the same name already exists for this program and session.') {
          setResponseMessage("PLO with the same name already exists for the selected program and session.");
          setResponseType('error');
        } else {
          setResponseMessage("Failed to add PLO. Please try again.");
          setResponseType('error');
        }
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
      await axios.put(`http://localhost:4000/api/plo/${editPloId}`, {
        description,
        program_id: selectedProgram,
        session_id: selectedSession,
        plo_name: ploName
      });
      setResponseMessage("PLO updated successfully!");
      setResponseType('success');
      fetchPlos();
      handleCancel();
    } catch (error) {
      console.error("Error updating PLO:", error);
      setResponseMessage("Failed to update PLO. Please try again.");
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
      await axios.delete(`http://localhost:4000/api/plo/${id}`);
      setResponseMessage("PLO deleted successfully!");
      setResponseType('success');
      fetchPlos();
    } catch (error) {
      console.error("Error deleting PLO:", error);
      setResponseMessage("Failed to delete PLO. Please try again.");
      setResponseType('error');
    } finally {
      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);
    }
  };

  const handleEdit = (plo) => {
    setDescription(plo.description);
    setPloName(plo.plo_name);
    setSelectedProgram(plo.program_id);
    setSelectedSession(plo.session_id);
    setEditMode(true);
    setEditPloId(plo.id);
  };

  const handleCancel = () => {
    // Clear input fields on cancel
    setDescription('');
    setPloName('');
    setSelectedProgram('');
    setSelectedSession('');
    setEditMode(false);
    setEditPloId(null);
    setResponseMessage('');
    setResponseType('');
  };

  const columns = [
    {
      name: 'PLO Name',
      selector: row => row.plo_name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Program',
      selector: row => programs.find(program => program.id === row.program_id)?.name,
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

  // Filter PLOs based on search terms
  const filteredPlos = plos.filter(plo => {
    const programName = programs.find(program => program.id === plo.program_id)?.name.toLowerCase() || '';
    const sessionName = `${sessions.find(session => session.id === plo.session_id)?.start_year} - ${sessions.find(session => session.id === plo.session_id)?.end_year}`.toLowerCase();

    return (
      (searchProgram === '' || programName.includes(searchProgram.toLowerCase())) &&
      (searchSession === '' || sessionName.includes(searchSession.toLowerCase()))
    );
  });

  return (
    <div className='PLOContainer'>
      <h2 className="heading">Add PLO</h2>
      <div className='lp'>
        <label>PLO Name:</label>
        <input className="input" type="text" value={ploName} placeholder='PLO- 1' onChange={(e) => setPloName(e.target.value)} />
      </div>
      <div className='lp'>
        <label>Description:</label>
        <input className="input" placeholder='Knowledge for Solving Computing Problems' type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className='lp'>
        <label>Select Program:</label>
        <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
          <option value="" disabled>Select Program</option>
          {programs.map(program => (
            <option key={program.id} value={program.id}>{program.name}</option>
          ))}
        </select>
      </div>
      <div className='lp'>
        <label>Select Session:</label>
        <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
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
      <h3 className="heading">Manage PLOs</h3>
      <div className='search'>
        <input
          type="text"
          placeholder="Search By Program Name"
          value={searchProgram}
          onChange={(e) => setSearchProgram(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search By Session"
          value={searchSession}
          onChange={(e) => setSearchSession(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredPlos}
        pagination
      />
    </div>
  );
};

export default AddPLO;
