import React, { useState } from 'react';
import axios from 'axios';

import { envOrDefault, formatTimestamp } from '../utils/util';

let rxIdCounter = 7;

// Component to create a new prescription
const CreatePrescription = () => {
    const [patientId, setPatientId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [medicineId, setMedicineId] = useState('');
    const [isIter, setIsIter] = useState(false);
    const [iterCount, setIterCount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const prescriptionId = `rx-${rxIdCounter}`;
        rxIdCounter = rxIdCounter + 1
        const creationDate = formatTimestamp();

        try {
            const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000')
            await axios.post(`${apiUrl}/api/createRx`, {
                prescriptionId,
                creationDate,
                patientId,
                doctorId,
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
                    <input type="text" value={patientId} onChange={e => setPatientId(e.target.value)} required />
                </div>
                <div>
                    <label>Prescribed By:</label>
                    <input type="text" value={doctorId} onChange={e => setDoctorId(e.target.value)} required />
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
