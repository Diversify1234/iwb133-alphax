import React, { useEffect, useState } from 'react';
import './ManageEmployees.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEnvelope, faUser, faLock, faTrash } from '@fortawesome/free-solid-svg-icons';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    mail: '',
    name: '',
    password: ''
  });
  const [showModal, setShowModal] = useState(false); 

 
  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await fetch('http://localhost:9090/api/employees');
      const data = await response.json();
      setEmployees(data);
    };

    fetchEmployees();
  }, []);

 
  const addEmployee = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:9090/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmployee),
    });

    if (response.ok) {
      const addedEmployee = await response.json();
      setEmployees([...employees, addedEmployee]);
      setNewEmployee({ mail: '', name: '', password: '' });
      setShowModal(false); 
    } else {
      console.error('Error adding employee');
    }
  };

 
  const deleteEmployee = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this employee?');
    if (confirmed) {
      const response = await fetch(`http://localhost:9090/api/employees?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEmployees(employees.filter(employee => employee.id !== id));
      } else {
        console.error('Error deleting employee');
      }
    }
  };

  // Filter out the admin employee
  const filteredEmployees = employees.filter(employee => employee.mail !== 'admin@gmail.com');

  return (
    <div className="manage-employees">
      <h1>Manage Employees</h1>

      <button onClick={() => setShowModal(true)} className="add-button">
        <FontAwesomeIcon icon={faPlus} /> Add Employee
      </button>

      {/* Modal for adding employee */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Employee</h2>
            <form onSubmit={addEmployee} className="employee-form">
              <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={newEmployee.mail}
                  onChange={(e) => setNewEmployee({ ...newEmployee, mail: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="input-group">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  type="text"
                  placeholder="Name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="input-group">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <button type="submit" className="submit-button">Add Employee</button>
              <button type="button" onClick={() => setShowModal(false)} className="close-button">Close</button>
            </form>
          </div>
        </div>
      )}

      <h2>Employee List</h2>
      <ul className="employee-list">
        {filteredEmployees.map((employee) => (
          <li key={employee.id} className="employee-item">
            <span>{employee.name} ({employee.mail})</span>
            <button onClick={() => deleteEmployee(employee.id)} className="delete-button">
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageEmployees;
