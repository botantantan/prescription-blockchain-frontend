import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Utility function to format current timestamp
const formatTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day},${hours}:${minutes}`;
};

// Component to terminate a prescription
const TerminatePrescription = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState('');
    const [doctorId, setDoctorId] = useState('');

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get('/api/getAllAssets');
                setPrescriptions(response.data.filter(asset => asset.type === 'prescription'));
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
            }
        };

        fetchPrescriptions();
    }, []);

    const handleTerminate = async (e) => {
        e.preventDefault();
        const terminatedAt = formatTimestamp();

        try {
            await axios.post('/api/terminateRx', {
                prescriptionId: selectedPrescription,
                terminatedAt,
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
