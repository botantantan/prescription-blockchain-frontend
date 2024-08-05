// Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = ({ handleLogout }) => {
  // Get user info from local storage
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  // Define menu items based on role
  const menuItems = {
    admin: [
      { text: 'Dashboard', path: '/dashboard' },
      { text: 'Create Prescription', path: '/create-prescription' },
      { text: 'Terminate Prescription', path: '/terminate-prescription' },
      { text: 'Fill Prescription', path: '/fill-prescription' },
      { text: 'Initialize Ledger', path: '/initialize-ledger' }, // Assuming this is another admin option
    ],
    doctor: [
      { text: 'Dashboard', path: '/dashboard' },
      { text: 'Create Prescription', path: '/create-prescription' },
      { text: 'Terminate Prescription', path: '/terminate-prescription' },
    ],
    pharmacist: [
      { text: 'Dashboard', path: '/dashboard' },
      { text: 'Fill Prescription', path: '/fill-prescription' },
    ],
    patient: [
      { text: 'Dashboard', path: '/dashboard' },
    ],
  };

  return (
    <Drawer variant="permanent" anchor="left">
      <div style={{ padding: '20px' }}>
        <Typography variant="h6">User Info</Typography>
        <Typography>User ID: {userId}</Typography>
        <Typography>Role: {role}</Typography>
      </div>
      <List>
        {menuItems[role] && menuItems[role].map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Button onClick={handleLogout} style={{ margin: '20px' }} variant="contained" color="secondary">
        Logout
      </Button>
    </Drawer>
  );
};

export default Sidebar;
