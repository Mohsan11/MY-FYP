import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import './mapping.css';

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
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');

  const [filterText, setFilterText] = useState('');

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

  // Filter CLOs based on selected course and session
  const filteredClos = clos.filter(clo => 
    (selectedCourse ? clo.course_id === parseInt(selectedCourse) : true) &&
    (selectedSession ? clo.session_id === parseInt(selectedSession) : true)
  );

  // Filter PLOs based on selected program
  const filteredPlos = plos.filter(plo => 
    selectedProgram ? plo.program_id === parseInt(selectedProgram) : true
  );

  const columns = [
    {
      name: 'CLO',
      selector: row => row.clo_name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
    },
    {
      name: 'Course',
      selector: row => row.course_name,
      sortable: true,
    },
    {
      name: 'Session',
      selector: row => row.session_name,
      sortable: true,
    },
    {
      name: 'PLO',
      selector: row => row.plo_name,
      sortable: true,
    },
    {
      name: 'Program',
      selector: row => row.program_name,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <button onClick={() => handleDelete(row.clo_id, row.plo_id)}>Delete</button>
      ),
    },
  ];

  // Extended filter logic to search by CLO, PLO, Program, or Course name
  const filteredData = mappings.map(mapping => {
    const clo = clos.find(clo => clo.id === mapping.clo_id);
    const plo = plos.find(plo => plo.id === mapping.plo_id);
    return {
      clo_name: clo ? clo.clo_name : 'Unknown CLO',
      description: clo ? clo.description : 'No description',
      course_name: clo ? clo.course_name : 'Unknown Course',
      session_name: clo ? clo.session_name : 'Unknown Session',
      plo_name: plo ? plo.plo_name : 'Unknown PLO',
      program_name: plo ? plo.program_name : 'Unknown Program',
      clo_id: mapping.clo_id,
      plo_id: mapping.plo_id
    };
  }).filter(item =>
    item.clo_name.toLowerCase().includes(filterText.toLowerCase()) ||
    item.plo_name.toLowerCase().includes(filterText.toLowerCase()) ||
    item.program_name.toLowerCase().includes(filterText.toLowerCase()) || // Search by program name
    item.course_name.toLowerCase().includes(filterText.toLowerCase())    // Search by course name
  );

  return (
    <div className='MappingContainer'>
      <h2 className="heading">CLO-PLO Mapping</h2>

      {/* Filter Controls */}
      <div className='lp'>
        <label>Select Program:</label>
        <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
          <option value="">All Programs</option>
          {programs.map(program => (
            <option key={program.id} value={program.id}>{program.name}</option>
          ))}
        </select>
      </div>
      
      <div className='lp'>
        <label>Select Session:</label>
        <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
          <option value="">All Sessions</option>
          {sessions.map(session => (
            <option key={session.id} value={session.id}>{session.start_year}-{session.end_year}</option>
          ))}
        </select>
      </div>
     
      <div className='lp'>
        <label>Select Course:</label>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>
      
      {/* Mapping Selection */}
      <div className='lp'>
        <label>Select CLO:</label>
        <select value={cloId} onChange={(e) => setCloId(e.target.value)}>
          <option value="" disabled>Select CLO</option>
          {filteredClos.map(clo => (
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
          {filteredPlos.map(plo => (
            <option key={plo.id} value={plo.id}>{plo.plo_name} ({plo.program_name})</option>
          ))}
        </select>
      </div>

      <div className='button-group rp'>
        <button className='button save-button' onClick={handleSave}>Save</button>
      </div>

      {/* Success/Error Message */}
      {responseMessage && (
        <div className={`response-message ${responseType}`}>
          {responseMessage}
        </div>
      )}

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by CLO, PLO, Program or Course"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        pointerOnHover
      />
    </div>
  );
};

export default Mapping;
