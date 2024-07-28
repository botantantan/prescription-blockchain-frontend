import React, { useState } from 'react';
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

let rxIdCounter = 1;

// Component to create a new prescription
const CreatePrescription = () => {
    const [prescribedFor, setPrescribedFor] = useState('');
    const [prescribedBy, setPrescribedBy] = useState('');
    const [medicineId, setMedicineId] = useState('');
    const [isIter, setIsIter] = useState(false);
    const [iterCount, setIterCount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const prescriptionId = `rx${rxIdCounter++}`;
        const createdAt = formatTimestamp();

        try {
            await axios.post('/api/createRx', {
                prescriptionId,
                createdAt,
                prescribedFor,
                prescribedBy,
                medicineId,
                isIter: isIter ? '1' : '0',
                iterCount: isIter ? iterCount : '0'
            });
            alert('Prescription created successfully');
        } catch (error) {
            console.error('Error creating prescription:', error);
            alert('Error creating prescription');
        }
    };

    return (
        <div>
            <h1>Create Prescription</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Prescribed For:</label>
                    <input type="text" value={prescribedFor} onChange={e => setPrescribedFor(e.target.value)} required />
                </div>
                <div>
                    <label>Prescribed By:</label>
                    <input type="text" value={prescribedBy} onChange={e => setPrescribedBy(e.target.value)} required />
                </div>
                <div>
                    <label>Medicine ID:</label>
                    <input type="text" value={medicineId} onChange={e => setMedicineId(e.target.value)} required />
                </div>
                <div>
                    <label>
                        <input type="checkbox" checked={isIter} onChange={e => setIsIter(e.target.checked)} />
                        Is Iter
                    </label>
                </div>
                {isIter && (
                    <div>
                        <label>Iter Count:</label>
                        <input type="number" value={iterCount} onChange={e => setIterCount(e.target.value)} required />
                    </div>
                )}
                <button type="submit">Create Prescription</button>
            </form>
        </div>
    );
};

export default CreatePrescription;
