import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { envOrDefault } from '../utils/util'

// Dashboard component to display prescriptions and activities
const Dashboard = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null);

    // Fetch all assets when component mounts
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
                const response = await axios.get(`${apiUrl}/api/getAllAssets`);
                const assets = response.data;


                // Filter and sort prescriptions
                const sortedPrescriptions = assets
                    .filter(asset => asset.prescriptionId && asset.creationDate)
                    .sort((a, b) => {
                        const aId = parseInt(a.prescriptionId.split('-')[1], 10);
                        const bId = parseInt(b.prescriptionId.split('-')[1], 10);
                        return aId - bId;
                    });
                setPrescriptions(sortedPrescriptions);

                // Filter and sort activities
                const sortedActivities = assets
                    .filter(asset => asset.activityId && asset.timestamp)
                    .sort((a, b) => {
                        const aId = parseInt(a.activityId.split('-')[1], 10);
                        const bId = parseInt(b.activityId.split('-')[1], 10);
                        return aId - bId;
                    });
                setActivities(sortedActivities);
            } catch (error) {
                console.error('Error fetching assets:', error);
                setError('Error fetching assets');
            }
        };

        fetchAssets();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {error && <p>{error}</p>}
            <h2>Prescriptions</h2>
            <ul>
                {prescriptions.map(prescription => (
                    <li key={prescription.prescriptionId}>
                        Prescription ID: {prescription.prescriptionId}, Created At: {prescription.creationDate}, Prescribed For: {prescription.patientId}, Prescribed By: {prescription.doctorId}, Medicine ID: {prescription.medicineId}, Iter: {prescription.isIter}, Iter Count: {prescription.iterCount}, Valid: {prescription.isValid}, Filled By: {prescription.pharmacistId || 'N/A'}, Terminated At: {prescription.terminationDate || 'N/A'}
                    </li>
                ))}
            </ul>
            <h2>Activities</h2>
            <ul>
                {activities.map(activity => (
                    <li key={activity.activityId}>
                        Activity ID: {activity.activityId}, Timestamp: {activity.timestamp}, Prescription ID: {activity.prescriptionId}, Actor: {activity.actorId}, Type: {activity.type}, Parent ID: {activity.parentId || 'N/A'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
