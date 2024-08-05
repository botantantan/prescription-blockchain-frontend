// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Button, TextField, Typography, Container, Snackbar, Alert } from '@mui/material';
import { envOrDefault } from '../utils/util';

const LoginPage = ({ setMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false); // State to control Snackbar visibility
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error message
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
      const response = await axios.post(`${apiUrl}/api/login`, { username, password });
      const { token, userId, role } = response.data;

      // Store the token and user info in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);

      // Redirect to dashboard
      history.push('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Invalid credentials. Please try again.');
      setOpen(true);
    }
  };

  // Function to close the Snackbar
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
