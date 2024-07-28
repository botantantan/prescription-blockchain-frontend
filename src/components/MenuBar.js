import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

// Menu bar component to navigate between different pages
const MenuBar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Prescription Management
                </Typography>
                <Button color="inherit" component={Link} to="/">Dashboard</Button>
                <Button color="inherit" component={Link} to="/initialize-ledger">Initialize Ledger</Button>
                <Button color="inherit" component={Link} to="/create-prescription">Create Prescription</Button>
                <Button color="inherit" component={Link} to="/terminate-prescription">Terminate Prescription</Button>
                <Button color="inherit" component={Link} to="/fill-prescription">Fill Prescription</Button>
            </Toolbar>
        </AppBar>
    );
};

export default MenuBar;
