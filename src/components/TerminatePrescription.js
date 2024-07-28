import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { envOrDefault, formatTimestamp } from '../utils/util';

// Component to terminate a prescription
const TerminatePrescription = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [error, setError] = useState(null);

    const fetchPrescriptions = async () => {
        try {
            const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
            const response = await axios.get(`${apiUrl}/api/getAllAssets`);
            const assets = response.data;

            const sortedPrescriptions = assets
                .filter(asset => asset.prescriptionId && asset.creationDate && (Boolean(Number(asset.isValid))))
                .sort((a, b) => {
                    const aId = parseInt(a.prescriptionId.split('-')[1], 10);
                    const bId = parseInt(b.prescriptionId.split('-')[1], 10);
                    return aId - bId;
                });

            setPrescriptions(sortedPrescriptions);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            setError('Error fetching prescriptions');
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const handleTerminate = async (e) => {
        e.preventDefault();
        const terminationDate = formatTimestamp();

        try {
            const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
            await axios.post(`${apiUrl}/api/terminateRx`, {
                prescriptionId: selectedPrescription,
                terminationDate,
                doctorId
            });
            alert('Prescription terminated successfully');
            fetchPrescriptions(); // Refresh the list of prescriptions
        } catch (error) {
            console.error('Error terminating prescription:', error);
            alert('Error terminating prescription');
        }
    };

    return (
        <div>
            <h1>Terminate Prescription</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleTerminate}>
                <div>
                    <label>Prescription:</label>
                    <select value={selectedPrescription} onChange={e => setSelectedPrescription(e.target.value)} required>
                        <option value="">Select Prescription</option>
                        {prescriptions.map(prescription => (
                            <option key={prescription.prescriptionId} value={prescription.prescriptionId}>
                                {prescription.prescriptionId} - {prescription.patientId}
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
