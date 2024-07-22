import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

const ManageCoordinator = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCoordinators, setFilteredCoordinators] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    fetchCoordinators();
  }, []);

  useEffect(() => {
    filterCoordinators();
  }, [coordinators, search]);

  const fetchCoordinators = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users/role/Coordinator');
      console.log('Fetched coordinators:', response.data); // Debugging
      setCoordinators(response.data);
    } catch (error) {
      console.error('Error fetching coordinators:', error);
    }
  };

  const filterCoordinators = () => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = coordinators.filter(coordinator =>
      coordinator.username.toLowerCase().includes(lowercasedSearch) ||
      coordinator.email.toLowerCase().includes(lowercasedSearch)
    );
    console.log('Filtered coordinators:', filtered); // Debugging
    setFilteredCoordinators(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/users/${id}`);
      setCoordinators(coordinators.filter(coordinator => coordinator.id !== id));
      setTimeout(() => {
        setMessage("Coordinator deleted successfully!");
        setMessageType("success");
      }, 5000);
    } catch (error) {
      console.error('Error deleting coordinator:', error);
      setTimeout(() => {
        setMessage("Failed to delete coordinator.");
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
          <Link to={`/update-coordinator/${row.id}`} className="btn btn-primary">
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="btn btn-danger lp ms-2"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="coordinator-table-container">
      <h3>Coordinator List</h3>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <DataTable
        columns={columns}
        data={filteredCoordinators}
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

export default ManageCoordinator;
