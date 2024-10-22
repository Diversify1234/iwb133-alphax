
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotSignedIn = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>You are not signed in</h1>
      <button style={styles.button} onClick={handleSignIn}>
        Sign In
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: 'var(--background-color2)',
    border: '1px solid var(--border-color)',
    boxShadow: `0px 4px 8px var(--shadow-color)`,
    borderRadius: '8px',
    maxWidth: '400px',
    margin: '100px auto',
  },
  heading: {
    fontSize: 'var(--font-size-heading)',
    color: 'var(--text-primary)',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: 'var(--orange)',
    color: 'white',
    fontSize: 'var(--font-size-normal)',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default NotSignedIn;
