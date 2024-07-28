import React from 'react';
import { Alert, Snackbar } from '@mui/material';

// Notification component to display success or error messages
const Notification = ({ message, handleClose }) => {
    if (!message) return null;

    return (
        <Snackbar 
            open={true} 
            autoHideDuration={6000} 
            onClose={handleClose} 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert 
                onClose={handleClose} 
                severity={message.type} 
                sx={{ width: '100%' }}
            >
                {message.text}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
