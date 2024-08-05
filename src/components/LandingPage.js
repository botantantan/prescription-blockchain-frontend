import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';

const LandingPage = () => {
  const history = useHistory();

  const handleLogin = () => {
    history.push('/login');
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Prescription Management System</Typography>
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
};

export default LandingPage;
