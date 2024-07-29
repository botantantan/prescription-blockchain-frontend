import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const menuItems = [
        { text: 'Dashboard',  path: '/' },
        { text: 'Initialize Ledger', path: '/initialize-ledger' },
        { text: 'Create Prescription', path: '/create-prescription' },
        { text: 'Terminate Prescription', path: '/terminate-prescription' },
        { text: 'Fill Prescription', path: '/fill-prescription' },
    ];

    return (
        <Drawer variant="permanent" anchor="left">
            <List>
                {menuItems.map((item) => (
                    <ListItem button key={item.text} component={Link} to={item.path}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
