import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Dashboard component to display prescriptions and activities
const Dashboard = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [activities, setActivities] = useState([]);

    // Fetch all assets when component mounts
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await axios.get('/api/getAllAssets');
                const assets = response.data;
                setPrescriptions(assets.filter(asset => asset.type === 'prescription'));
                setActivities(assets.filter(asset => asset.type === 'activity'));
            } catch (error) {
                console.error('Error fetching assets:', error);
            }
        };

        fetchAssets();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Prescriptions</h2>
            <ul>
                {prescriptions.map(prescription => (
                    <li key={prescription.prescriptionId}>{prescription.prescribedFor} - {prescription.medicineId}</li>
                ))}
            </ul>
            <h2>Activities</h2>
            <ul>
                {activities.map(activity => (
                    <li key={activity.activityId}>{activity.description}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
