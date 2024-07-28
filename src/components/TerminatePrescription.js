import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { envOrDefault, formatTimestamp } from '../utils/util';

// Component to terminate a prescription
const TerminatePrescription = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState('');
    const [doctorId, setDoctorId] = useState('');

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000')
                const response = await axios.get(`${apiUrl}/api/getAllAssets`);
                setPrescriptions(response.data.filter(asset => asset.type === 'prescription'));
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
            }
        };

        fetchPrescriptions();
    }, []);

    const handleTerminate = async (e) => {
        e.preventDefault();
        const terminationDate = formatTimestamp();

        try {
            const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000')
            await axios.post(`${apiUrl}/api/terminateRx`, {
                prescriptionId: selectedPrescription,
                terminationDate,
                doctorId
            });
            alert('Prescription terminated successfully');
        } catch (error) {
            console.error('Error terminating prescription:', error);
            alert('Error terminating prescription');
        }
    };

    return (
        <div>
            <h1>Terminate Prescription</h1>
            <form onSubmit={handleTerminate}>
                <div>
                    <label>Prescription:</label>
                    <select value={selectedPrescription} onChange={e => setSelectedPrescription(e.target.value)} required>
                        <option value="">Select Prescription</option>
                        {prescriptions.map(prescription => (
                            <option key={prescription.prescriptionId} value={prescription.prescriptionId}>
                                {prescription.prescribedFor} - {prescription.medicineId}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Doctor ID:</label>
                    <input type="text" value={doctorId} onChange={e => setDoctorId(e.target.value)} required />
                </div>
                <button type="submit">Terminate Prescription</button>
            </form>
        </div>
    );
};

export default TerminatePrescription;
