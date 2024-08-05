import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { envOrDefault } from '../utils/util';
import { Typography, Container, Grid, Card, CardContent, Tab, Tabs, Box, Button, Modal, Paper } from '@mui/material';

const Dashboard = ({ setMessage }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken)
        setRole(decodedToken.role);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
        const response = await axios.get(`${apiUrl}/api/getAllAssets`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const assets = response.data;

        // Filter and sort prescriptions
        const sortedPrescriptions = assets
          .filter((asset) => asset.prescriptionId && asset.creationDate)
          .sort((a, b) => {
            const aId = parseInt(a.prescriptionId.split('-')[1], 10);
            const bId = parseInt(b.prescriptionId.split('-')[1], 10);
            return aId - bId;
          });
        setPrescriptions(sortedPrescriptions);

        // Filter and sort activities
        const sortedActivities = assets
          .filter((asset) => asset.activityId && asset.timestamp)
          .sort((a, b) => {
            const aId = parseInt(a.activityId.split('-')[1], 10);
            const bId = parseInt(b.activityId.split('-')[1], 10);
            return aId - bId;
          });
        setActivities(sortedActivities);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setError('Error fetching assets');
        setMessage({ type: 'error', text: `Error fetching assets: ${error.response?.data || error.message}` });
      }
    };

    fetchAssets();
  }, [setMessage]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleViewHistory = async (prescriptionId) => {
    try {
      const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
      const response = await axios.get(`${apiUrl}/api/getRxHistory/${prescriptionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setHistory(response.data);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching prescription history:', error);
      setMessage({ type: 'error', text: `Error fetching prescription history: ${error.response?.data || error.message}` });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setHistory([]);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="asset tabs">
        <Tab label="Prescriptions" />
        {/* <Tab label="Activities" /> */}
      </Tabs>

      <Box hidden={tabIndex !== 0}>
        <Grid container spacing={2}>
          {prescriptions.map((prescription) => (
            <Grid item xs={12} sm={6} md={4} key={prescription.prescriptionId}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    Prescription ID: {prescription.prescriptionId}
                    <span style={{ color: prescription.isValid === '1' ? 'green' : 'red', marginLeft: '10px' }}>
                      {prescription.isValid === '1' ? 'Valid' : 'Invalid'}
                    </span>
                  </Typography>
                  <Typography>Created At: {prescription.creationDate}</Typography>
                  <Typography>Prescribed For: {prescription.patientId}</Typography>
                  <Typography>Prescribed By: {prescription.doctorId}</Typography>
                  <Typography>Medicine ID: {prescription.medicineId}</Typography>
                  <Typography>Iter: {prescription.isIter}</Typography>
                  <Typography>Iter Count: {prescription.iterCount}</Typography>
                  <Typography>Filled By: {prescription.pharmacistId || 'N/A'}</Typography>
                  <Typography>Terminated At: {prescription.terminationDate || 'N/A'}</Typography>
                  <Button variant="contained" color="primary" onClick={() => handleViewHistory(prescription.prescriptionId)}>
                    View Activity Chain
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box hidden={tabIndex !== 1}>
        <Grid container spacing={2}>
          {activities.map((activity) => (
            <Grid item xs={12} sm={6} md={4} key={activity.activityId}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Activity ID: {activity.activityId}</Typography>
                  <Typography>Timestamp: {activity.timestamp}</Typography>
                  <Typography>Prescription ID: {activity.prescriptionId}</Typography>
                  <Typography>Actor: {activity.actorId}</Typography>
                  <Typography>Type: {activity.type}</Typography>
                  <Typography>Parent ID: {activity.parentId || 'N/A'}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Paper style={{ margin: 'auto', padding: '20px', maxWidth: '80%', marginTop: '50px' }}>
          <Typography variant="h6" id="modal-title">Activity Chain</Typography>
          {history.length > 0 ? (
            history.map((activity) => (
              <Box key={activity.activityId} mb={2}>
                <Card>
                  <CardContent>
                    <Typography>Activity ID: {activity.activityId}</Typography>
                    <Typography>Timestamp: {activity.timestamp}</Typography>
                    <Typography>Prescription ID: {activity.prescriptionId}</Typography>
                    <Typography>Actor: {activity.actorId}</Typography>
                    <Typography>Type: {activity.type}</Typography>
                    <Typography>Parent ID: {activity.parentId || 'N/A'}</Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            <Typography>No activity found for this prescription.</Typography>
          )}
          <Button variant="contained" onClick={handleCloseModal}>Close</Button>
        </Paper>
      </Modal>
    </Container>
  );
};

export default Dashboard;
