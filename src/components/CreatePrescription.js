import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { envOrDefault, formatTimestamp } from '../utils/util';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Container, Grid } from '@mui/material';

// Component to create a new prescription
const CreatePrescription = ({ setMessage }) => {
    const [patientId, setPatientId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [medicineId, setMedicineId] = useState('');
    const [isIter, setIsIter] = useState(false);
    const [iterCount, setIterCount] = useState('');
    const [prescriptionIdCounter, setPrescriptionIdCounter] = useState(0);

    useEffect(() => {
        const fetchPrescriptionIdCounter = async () => {
            try {
                const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
                const response = await axios.get(`${apiUrl}/api/getAllAssets`);
                const assets = response.data;

                const highestId = assets
                    .filter(asset => asset.prescriptionId)
                    .reduce((maxId, asset) => {
                        const idNumber = parseInt(asset.prescriptionId.split('-')[1], 10);
                        return idNumber > maxId ? idNumber : maxId;
                    }, 0);
                
                setPrescriptionIdCounter(highestId + 1);
            } catch (error) {
                console.error('Error fetching prescription ID counter:', error);
                setMessage({ type: 'error', text: `Error fetching prescription ID counter: ${error.response?.data || error.message}` });
            }
        };

        fetchPrescriptionIdCounter();
    }, [setMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const prescriptionId = `rx-${prescriptionIdCounter}`;
        const creationDate = formatTimestamp();

        try {
            const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
            await axios.post(`${apiUrl}/api/createRx`, {
                prescriptionId,
                creationDate,
                patientId,
                doctorId,
                medicineId,
                isIter: isIter ? '1' : '0',
                iterCount: isIter ? iterCount : '0'
            });
            setMessage({ type: 'success', text: 'Prescription created successfully' });
            setPrescriptionIdCounter(prevCounter => prevCounter + 1);
        } catch (error) {
            console.error('Error creating prescription:', error);
            setMessage({ type: 'error', text: `Error creating prescription: ${error.response?.data || error.message}` });
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Create Prescription</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Prescribed For"
                            value={patientId}
                            onChange={e => setPatientId(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Prescribed By"
                            value={doctorId}
                            onChange={e => setDoctorId(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Medicine ID"
                            value={medicineId}
                            onChange={e => setMedicineId(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isIter}
                                    onChange={e => setIsIter(e.target.checked)}
                                />
                            }
                            label="Is Iter"
                        />
                    </Grid>
                    {isIter && (
                        <Grid item xs={12}>
                            <TextField
                                label="Iter Count"
                                type="number"
                                value={iterCount}
                                onChange={e => setIterCount(e.target.value)}
                                required
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Create Prescription
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default CreatePrescription;
