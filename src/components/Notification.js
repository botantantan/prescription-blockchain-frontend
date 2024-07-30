import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const Notification = ({ message, handleClose }) => {
    if (!message) return null;

    return (
        <Snackbar
            open={true}
            autoHideDuration={3000} 
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert onClose={handleClose} severity={message.type} sx={{ width: '100%' }}>
                {message.text}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
