import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useNavigate, useParams } from 'react-router-dom';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [editingStudent, setEditingStudent] = useState(null); // State for editing student
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams(); // Extract ID from URL if needed

  useEffect(() => {
    fetchStudents();
    fetchPrograms();
    fetchSessions();
    fetchSemesters();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, search]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/viewsos/all');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/programs/all');
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/session/all');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/semester/all');
      setSemesters(response.data);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  const filterStudents = () => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = students.filter(student =>
      student.roll_number.toLowerCase().includes(lowercasedSearch) ||
      student.student_name.toLowerCase().includes(lowercasedSearch) ||
      student.email.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredStudents(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/students/${id}`);
      setStudents(students.filter(student => student.id !== id));
      setMessage("Student deleted successfully!");
      setMessageType("success");
    } catch (error) {
      console.error('Error deleting student:', error);
      setMessage("Failed to delete student.");
      setMessageType("error");
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/students/${id}`, editingStudent);
      setMessage("Student updated successfully!");
      setMessageType("success");
      setEditingStudent(null); // Clear editing state
      navigate('/'); // Redirect to the desired page after update
    } catch (error) {
      console.error('Error updating student:', error);
      setMessage("Failed to update student.");
      setMessageType("error");
    }
  };

  const handleRollNumberChange = (e) => {
    setEditingStudent(prevState => ({
      ...prevState,
      roll_number: e.target.value.toUpperCase()
    }));
  };

  const handleEmailChange = (e) => {
    setEditingStudent(prevState => ({
      ...prevState,
      email: e.target.value.toLowerCase()
    }));
  };

  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Name', selector: row => row.student_name, sortable: true },
    { name: 'Roll Number', selector: row => row.roll_number, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Program', selector: row => row.program_name || 'N/A', sortable: true },
    { name: 'Session', selector: row => row.session_name || 'N/A', sortable: true },
    { name: 'Semester', selector: row => row.semester_name || 'N/A', sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button
            onClick={() => setEditingStudent(row)}
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
      )
    }
  ];

  return (
    <div>
      {editingStudent ? (
        <div className="student-form-container">
          <h3>Update Student</h3>
          <form onSubmit={handleUpdateStudent}>
            <div className="form-group">
              <label>Roll Number</label>
              <input
                className='form-control'
                type="text"
                value={editingStudent.roll_number}
                onChange={handleRollNumberChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input
                className='form-control'
                type="text"
                value={editingStudent.student_name}
                onChange={(e) => setEditingStudent(prevState => ({
                  ...prevState,
                  student_name: e.target.value
                }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                className='form-control'
                type="email"
                value={editingStudent.email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                className='form-control'
                type="password"
                value={editingStudent.password}
                onChange={(e) => setEditingStudent(prevState => ({
                  ...prevState,
                  password: e.target.value
                }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Program</label>
              <select
                className='form-control'
                value={editingStudent.program_id}
                onChange={(e) => setEditingStudent(prevState => ({
                  ...prevState,
                  program_id: e.target.value
                }))}
              >
                <option value="">Select Program</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Session</label>
              <select
                className='form-control'
                value={editingStudent.session_id}
                onChange={(e) => setEditingStudent(prevState => ({
                  ...prevState,
                  session_id: e.target.value
                }))}
                disabled={!editingStudent.program_id} // Disable if no program is selected
              >
                <option value="">Select Session</option>
                {sessions.map(session => (
                  <option key={session.id} value={session.id}>{session.start_year} - {session.end_year}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Semester</label>
              <select
                className='form-control'
                value={editingStudent.semester_id}
                onChange={(e) => setEditingStudent(prevState => ({
                  ...prevState,
                  semester_id: e.target.value
                }))}
                disabled={!editingStudent.session_id} // Disable if no session is selected
              >
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester.id} value={semester.id}>{semester.name} - {semester.number}</option>
                ))}
              </select>
            </div>
            <div className="button-group">
              <button className='btn btn-primary' type="submit">Update</button>
              <button
                className='btn btn-secondary'
                type="button"
                onClick={() => setEditingStudent(null)} // Go back to the student table
              >
                Cancel
              </button>
            </div>
          </form>
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default StudentTable;
