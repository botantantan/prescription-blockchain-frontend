import React from 'react';
import axios from 'axios';
import { Button, Typography, Container } from '@mui/material';
import { envOrDefault } from '../utils/util';

const InitializeLedger = ({ setMessage }) => {
    const handleInitialize = async () => {
        try {
            const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
            await axios.post(`${apiUrl}/api/initLedger`);
            setMessage({ type: 'success', text: 'Ledger initialized successfully' });
        } catch (error) {
            console.error('Error initializing ledger:', error);
            setMessage({ type: 'error', text: `Error initializing ledger: ${error.response?.data || error.message}` });
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Initialize Ledger</Typography>
            <Button variant="contained" color="primary" onClick={handleInitialize}>
                Initialize Ledger
            </Button>
        </Container>
    );
};

export default InitializeLedger;
