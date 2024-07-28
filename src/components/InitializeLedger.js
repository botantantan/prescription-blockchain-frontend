import React from 'react';
import axios from 'axios';

// Component to initialize the ledger
const InitializeLedger = () => {
    const handleInitialize = async () => {
        try {
            await axios.post('/api/initLedger');
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
