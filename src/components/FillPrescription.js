import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { envOrDefault, formatTimestamp } from '../utils/util';

// Component to fill a prescription
const FillPrescription = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState('');
    const [pharmacistId, setPharmacistId] = useState('');

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

    const handleFill = async (e) => {
        e.preventDefault();
        const filledDate = formatTimestamp();

        try {
            const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000')
            await axios.post(`${apiUrl}/api/fillRx`, {
                prescriptionId: selectedPrescription,
                filledDate,
                pharmacistId
            });
            alert('Prescription filled successfully');
        } catch (error) {
            console.error('Error filling prescription:', error);
            alert('Error filling prescription');
        }
    };

    return (
        <div>
            <h1>Fill Prescription</h1>
            <form onSubmit={handleFill}>
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
                    <label>Pharmacist ID:</label>
                    <input type="text" value={pharmacistId} onChange={e => setPharmacistId(e.target.value)} required />
                </div>
                <button type="submit">Fill Prescription</button>
            </form>
        </div>
    );
};

export default FillPrescription;
