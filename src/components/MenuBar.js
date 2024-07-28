import React from 'react';
import { Link } from 'react-router-dom';

// Menu bar component to navigate between different pages
const MenuBar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/initialize-ledger">Initialize Ledger</Link></li>
                <li><Link to="/create-prescription">Create Prescription</Link></li>
                <li><Link to="/terminate-prescription">Terminate Prescription</Link></li>
                <li><Link to="/fill-prescription">Fill Prescription</Link></li>
            </ul>
        </nav>
    );
};

export default MenuBar;
