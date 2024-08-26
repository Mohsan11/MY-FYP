import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const ManageCoordinator = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCoordinators, setFilteredCoordinators] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [editingCoordinator, setEditingCoordinator] = useState(null);

  useEffect(() => {
    fetchCoordinators();
  }, []);

  useEffect(() => {
    filterCoordinators();
  }, [coordinators, search]);

  const fetchCoordinators = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users/role/Coordinator');
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
    setFilteredCoordinators(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/users/${id}`);
      setCoordinators(coordinators.filter(coordinator => coordinator.id !== id));
      setMessage("Coordinator deleted successfully!");
      setMessageType("success");
    } catch (error) {
      console.error('Error deleting coordinator:', error);
      setMessage("Failed to delete coordinator.");
      setMessageType("error");
    }
    setTimeout(() => setMessage(""), 5000);
  };

  const handleEditClick = (coordinator) => {
    setEditingCoordinator(coordinator);
  };

  const handleCancelEdit = () => {
    setEditingCoordinator(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCoordinator(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/users/${editingCoordinator.id}`, editingCoordinator);
      setCoordinators(coordinators.map(coordinator =>
        coordinator.id === editingCoordinator.id ? editingCoordinator : coordinator
      ));
      setMessage("Coordinator updated successfully!");
      setMessageType("success");
      setEditingCoordinator(null);
    } catch (error) {
      console.error('Error updating coordinator:', error);
      setMessage("Failed to update coordinator.");
      setMessageType("error");
    }
    setTimeout(() => setMessage(""), 5000);
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
        <div className="action-buttons d-inline-flex">
          <button
            onClick={() => handleEditClick(row)}
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

      {editingCoordinator && (
        <div className="edit-form-container">
          <h3>Edit Coordinator</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={editingCoordinator.username}
                onChange={handleEditChange}
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
                value={editingCoordinator.email}
                onChange={handleEditChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                value={editingCoordinator.role}
                onChange={handleEditChange}
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
                value={editingCoordinator.password}
                onChange={handleEditChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Update</button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="btn btn-secondary ms-2"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageCoordinator;
