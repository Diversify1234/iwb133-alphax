import React, { useEffect, useState } from 'react';
import './ManageEmployees.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEnvelope, faUser, faLock, faTrash } from '@fortawesome/free-solid-svg-icons';

import Lottie from 'react-lottie';
import Emp from '../Components/Images/Employees.json';



const ManageEmployees = () => {
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  
  
  useEffect(() => {
    fetchEmployees();
  }, []);
  
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Emp,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    mail: '',
    name: '',
    password: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/employees');
        if (!response.ok) throw new Error('Failed to fetch employees');
        
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchEmployees();
  }, []);

  const addEmployee = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:9090/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmployee),
        });

        const data = await response.json(); 
        
        if (!response.ok) {
            throw new Error(data.message || 'Error adding employee');
        }

        fetchEmployees();

        setNewEmployee({ mail: '', name: '', password: '' });
        setShowModal(false);
    } catch (error) {
        alert(error.message);
    }
};



  const deleteEmployee = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this employee?');
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:9090/api/employees?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error deleting employee');

        setEmployees(employees.filter(employee => employee.id !== id));
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

 
  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage);
      setErrorMessage('');
    }
  }, [errorMessage]);

 
  const filteredEmployees = employees.filter(employee => employee.mail !== 'admin@gmail.com');

  return (
    <div className="manage-employees">
      <div>
        <Lottie 
          options={defaultOptions}
          height={100}
          width={150}
        />
      </div>
      
      <h1>Manage Employees</h1>

      <button onClick={() => setShowModal(true)} className="add-button">
        <FontAwesomeIcon icon={faPlus} /> Add Employee
      </button>

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
