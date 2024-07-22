import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './mapping.css'; // Make sure you have a CSS file for styling

const Mapping = () => {
  const [cloId, setCloId] = useState('');
  const [ploId, setPloId] = useState('');
  const [clos, setClos] = useState([]);
  const [plos, setPlos] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState(''); // 'success' or 'error'
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [closResponse, plosResponse, coursesResponse, sessionsResponse, programsResponse, mappingsResponse] = await Promise.all([
          axios.get('http://localhost:4000/api/clo/all'),
          axios.get('http://localhost:4000/api/plo/all'),
          axios.get('http://localhost:4000/api/courses/all'),
          axios.get('http://localhost:4000/api/session/all'),
          axios.get('http://localhost:4000/api/programs/all'),
          axios.get('http://localhost:4000/api/clo_plo_mapping/all')
        ]);

        const closData = closResponse.data;
        const coursesData = coursesResponse.data;

        // Add course names and session names to CLOs
        const closWithDetails = closData.map(clo => {
          const course = coursesData.find(course => course.id === clo.course_id);
          const session = sessionsResponse.data.find(session => session.id === clo.session_id);
          return { 
            ...clo, 
            course_name: course ? course.name : '', 
            session_name: session ? `${session.start_year}-${session.end_year}` : '' 
          };
        });

        setClos(closWithDetails);
        setPlos(plosResponse.data);
        setCourses(coursesData);
        setSessions(sessionsResponse.data);
        setPrograms(programsResponse.data);
        setMappings(mappingsResponse.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/clo_plo_mapping', {
        clo_id: cloId,
        plo_id: ploId,
      });

      setResponseMessage("Mapping added successfully!");
      setResponseType('success');

      // Update mappings state
      setMappings([...mappings, response.data]);
      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);

      // Clear input fields on successful save
      setCloId('');
      setPloId('');
    } catch (error) {
      console.error("Error saving mapping:", error);
      setResponseMessage("Failed to add mapping. Please try again.");
      setResponseType('error');
      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);
    }
  };

  const handleDelete = async (cloId, ploId) => {
    try {
      await axios.delete(`http://localhost:4000/api/clo_plo_mapping/${cloId}/${ploId}`);
      setResponseMessage("Mapping deleted successfully!");
      setResponseType('success');
      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);
      // Update mappings state
      setMappings(mappings.filter(mapping => !(mapping.clo_id === cloId && mapping.plo_id === ploId)));
    } catch (error) {
      console.error("Error deleting mapping:", error);
      setResponseMessage("Failed to delete mapping. Please try again.");
      setResponseType('error');
      setTimeout(() => {
        setResponseMessage("");
        setResponseType('');
      }, 4000);
    }
  };

  return (
    <div className='MappingContainer'>
      <h2 className="heading">CLO-PLO Mapping</h2>
      
      <div className='lp'>
        <label>Select CLO:</label>
        <select value={cloId} onChange={(e) => setCloId(e.target.value)}>
          <option value="" disabled>Select CLO</option>
          {clos.map(clo => (
            <option key={clo.id} value={clo.id}>
              {clo.clo_name} (Course: {clo.course_name}, Session: {clo.session_name}) - {clo.description}
            </option>
          ))}
        </select>
      </div>
      <div className='lp'>
        <label>Select PLO:</label>
        <select value={ploId} onChange={(e) => setPloId(e.target.value)}>
          <option value="" disabled>Select PLO</option>
          {plos.map(plo => (
            <option key={plo.id} value={plo.id}>{plo.plo_name} (Program: {plo.program_name})(description: {plo.description})</option>
          ))}
        </select>
      </div>
      <div className='rp button-group'>
        <button className='button save-button' onClick={handleSave}>Save</button>
        <button className='button cancel-button' onClick={() => { setCloId(''); setPloId(''); }}>Cancel</button>
      </div>
      <div>
        <p className={`message ${responseType}`}>{responseMessage}</p>
      </div>
      <h3>Current Mappings</h3>
      <table>
        <thead>
          <tr>
            <th>CLO</th>
            <th>Description</th>
            <th>Course</th>
            <th>Session</th>
            <th>PLO</th>
            <th>Program</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map(mapping => {
            const clo = clos.find(clo => clo.id === mapping.clo_id);
            const plo = plos.find(plo => plo.id === mapping.plo_id);
            return (
              <tr key={`${mapping.clo_id}-${mapping.plo_id}`}>
                <td>{clo ? clo.clo_name : 'Unknown CLO'}</td>
                <td>{clo ? clo.description : 'No description'}</td>
                <td>{clo ? clo.course_name : 'Unknown Course'}</td>
                <td>{clo ? clo.session_name : 'Unknown Session'}</td>
                <td>{plo ? plo.plo_name : 'Unknown PLO'}</td>
                <td>{plo ? plo.program_name : 'Unknown Program'}</td>
                <td>
                  <button onClick={() => handleDelete(mapping.clo_id, mapping.plo_id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Mapping;
