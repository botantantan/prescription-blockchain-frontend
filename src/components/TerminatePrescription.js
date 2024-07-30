import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { envOrDefault, formatTimestamp } from '../utils/util';
import { TextField, Button, Typography, Container, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const TerminatePrescription = ({ setMessage }) => {
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
            setMessage({ type: 'error', text: `Error fetching prescriptions: ${error.response?.data || error.message}` });
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
            setMessage({ type: 'success', text: 'Prescription terminated successfully' });
            fetchPrescriptions();
        } catch (error) {
            console.error('Error terminating prescription:', error);
            setMessage({ type: 'error', text: `Error terminating prescription: ${error.response?.data || error.message}` });
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Terminate Prescription</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleTerminate}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Prescription</InputLabel>
                    <Select
                        value={selectedPrescription}
                        onChange={e => setSelectedPrescription(e.target.value)}
                        required
                    >
                        <MenuItem value=""><em>Select Prescription</em></MenuItem>
                        {prescriptions.map(prescription => (
                            <MenuItem key={prescription.prescriptionId} value={prescription.prescriptionId}>
                                {prescription.prescriptionId} - {prescription.patientId}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Doctor ID"
                    value={doctorId}
                    onChange={e => setDoctorId(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>Terminate Prescription</Button>
            </form>
        </Container>
    );
};

export default TerminatePrescription;
