import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import SubmitButton from './SubmitButton';
import "../index.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SigninForm() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:9090/api/signin', {
        mail: email,
        password: password
      });

      if (response.data) {
      
        navigate('/employee');
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <form className='formCss' onSubmit={handleSubmit}>
      <h2 className='headingForm'>
        SignIn
      </h2>
      
      {error && <p className="error-message">{error}</p>}
      
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
      
      <SubmitButton buttonTitle="Login" />
    </form>
  );
}

export default SigninForm;
