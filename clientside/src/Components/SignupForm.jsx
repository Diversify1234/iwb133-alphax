import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import SubmitButton from './SubmitButton';
import "../index.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignupForm() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:9090/api/signup', {
        mail: email,
        name: name,
        password: password
      });

      if (response.data) {
        // Redirect to signin after successful signup
        navigate('/signin');
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <form className='formCss' onSubmit={handleSubmit}>
      <h2 className='headingForm'>
        SignUp
      </h2>
      
      {error && <p className="error-message">{error}</p>}
      
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <SubmitButton buttonTitle="SignUp" />
    </form>
  );
}

export default SignupForm;
