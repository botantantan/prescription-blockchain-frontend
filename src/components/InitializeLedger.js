import React from 'react';
import axios from 'axios';

import { envOrDefault } from '../utils/util'

// Component to initialize the ledger
const InitializeLedger = () => {
    const handleInitialize = async () => {
        try {
            const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000')
            await axios.post(`${apiUrl}/api/initLedger`);
            alert('Ledger initialized successfully');
        } catch (error) {
            console.error('Error initializing ledger:', error);
            alert('Error initializing ledger');
        }
    };

    return (
        <div>
            <h1>Initialize Ledger</h1>
            <button onClick={handleInitialize}>Initialize Ledger</button>
        </div>
    );
};

export default InitializeLedger;
