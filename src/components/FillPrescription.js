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

// Component to fill a prescription
const FillPrescription = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState('');
    const [pharmacistId, setPharmacistId] = useState('');

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

    const handleFill = async (e) => {
        e.preventDefault();
        const filledAt = formatTimestamp();

        try {
            await axios.post('/api/fillRx', {
                prescriptionId: selectedPrescription,
                filledAt,
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
