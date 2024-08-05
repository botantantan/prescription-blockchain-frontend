import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { envOrDefault, formatTimestamp } from '../utils/util';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Container, Grid, Select, MenuItem, FormControl, InputLabel, OutlinedInput, Chip } from '@mui/material';

const CreatePrescription = ({ setMessage }) => {
  const [patientId, setPatientId] = useState('');
  const [patients, setPatients] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [medicineIds, setMedicineIds] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [isIter, setIsIter] = useState(false);
  const [iterCount, setIterCount] = useState('');
  const [prescriptionIdCounter, setPrescriptionIdCounter] = useState(0);

  useEffect(() => {
    // Fetch the current user's doctor ID from local storage
    const currentUserId = localStorage.getItem('userId');
    setDoctorId(currentUserId);

    const fetchPrescriptionIdCounter = async () => {
      try {
        const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
        const response = await axios.get(`${apiUrl}/api/getAllAssets`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
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

    // Fetch all medicines
    const fetchMedicines = async () => {
      try {
        const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
        const response = await axios.get(`${apiUrl}/api/getAllMedicines`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // Sort medicines by numeric value of the ID
        const sortedMedicines = response.data.sort((a, b) => {
          const aId = parseInt(a.medicineId.split('-')[1], 10);
          const bId = parseInt(b.medicineId.split('-')[1], 10);
          return aId - bId;
        });
        setMedicines(sortedMedicines);
      } catch (error) {
        console.error('Error fetching medicines:', error);
        setMessage({ type: 'error', text: `Error fetching medicines: ${error.response?.data || error.message}` });
      }
    };

    fetchMedicines();

    // Fetch all patients
    const fetchPatients = async () => {
      try {
        const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
        const response = await axios.get(`${apiUrl}/api/getAllAssets`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const assets = response.data;

        const patientsList = assets.filter(asset => asset.role === 'patient');
        setPatients(patientsList);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setMessage({ type: 'error', text: `Error fetching patients: ${error.response?.data || error.message}` });
      }
    };

    fetchPatients();
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
        medicineId: medicineIds.join(','),
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Prescribed For</InputLabel>
              <Select
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                required
              >
                <MenuItem value=""><em>Select Patient</em></MenuItem>
                {patients.map(patient => (
                  <MenuItem key={patient.userId} value={patient.userId}>
                    {patient.userId} - {patient.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Prescribed By"
              value={doctorId}
              disabled
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Medicines</InputLabel>
              <Select
                multiple
                value={medicineIds}
                onChange={e => setMedicineIds(e.target.value)}
                input={<OutlinedInput label="Medicines" />}
                renderValue={(selected) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} style={{ margin: 2 }} />
                    ))}
                  </div>
                )}
              >
                <MenuItem value=""><em>Select Medicines</em></MenuItem>
                {medicines.map(medicine => (
                  <MenuItem key={medicine.medicineId} value={medicine.medicineId}>
                    {medicine.medicineId} - {medicine.name} - {medicine.dosage}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
