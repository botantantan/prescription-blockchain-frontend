import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { envOrDefault } from '../utils/util';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Box,
  Button,
  Modal,
  Paper,
  Chip,
  Divider,
} from '@mui/material';

// Dashboard component to display prescriptions and activities
const Dashboard = ({ setMessage }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // Fetch all assets when component mounts
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
        const response = await axios.get(`${apiUrl}/api/getAllAssets`);
        const assets = response.data;

        // Filter and sort prescriptions
        const sortedPrescriptions = assets
          .filter(asset => asset.prescriptionId && asset.creationDate)
          .sort((a, b) => {
            const aId = parseInt(a.prescriptionId.split('-')[1], 10);
            const bId = parseInt(b.prescriptionId.split('-')[1], 10);
            return aId - bId;
          });
        setPrescriptions(sortedPrescriptions);

        // Filter and sort activities
        const sortedActivities = assets
          .filter(asset => asset.activityId && asset.timestamp)
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
      const response = await axios.get(`${apiUrl}/api/getRxHistory/${prescriptionId}`);
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
        <Tab label="Activities" />
      </Tabs>

      <Box hidden={tabIndex !== 0} mt={2}>
        <Grid container spacing={3}>
          {prescriptions.map(prescription => (
            <Grid item xs={12} sm={6} md={4} key={prescription.prescriptionId}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">Prescription ID: {prescription.prescriptionId}</Typography>
                    <Chip
                      label={Boolean(Number(prescription.isValid)) ? "Valid" : "Invalid"}
                      color={Boolean(Number(prescription.isValid)) ? "success" : "error"}
                      size="small"
                    />
                  </Box>
                  <Typography><strong>Created At:</strong> {prescription.creationDate}</Typography>
                  <Typography><strong>Prescribed For:</strong> {prescription.patientId}</Typography>
                  <Typography><strong>Prescribed By:</strong> {prescription.doctorId}</Typography>
                  <Typography><strong>Medicine ID:</strong> {prescription.medicineId}</Typography>
                  <Typography><strong>Iter:</strong> {prescription.isIter}</Typography>
                  <Typography><strong>Iter Count:</strong> {prescription.iterCount}</Typography>
                  <Typography><strong>Filled By:</strong> {prescription.pharmacistId || 'N/A'}</Typography>
                  <Typography><strong>Terminated At:</strong> {prescription.terminationDate || 'N/A'}</Typography>
                  <Box mt={2}>
                    <Button variant="contained" color="primary" fullWidth onClick={() => handleViewHistory(prescription.prescriptionId)}>
                      View Activity Chain
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box hidden={tabIndex !== 1} mt={2}>
        <Grid container spacing={3}>
          {activities.map(activity => (
            <Grid item xs={12} sm={6} md={4} key={activity.activityId}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Activity ID: {activity.activityId}</Typography>
                  <Typography><strong>Timestamp:</strong> {activity.timestamp}</Typography>
                  <Typography><strong>Prescription ID:</strong> {activity.prescriptionId}</Typography>
                  <Typography><strong>Actor:</strong> {activity.actorId}</Typography>
                  <Typography><strong>Type:</strong> {activity.type}</Typography>
                  <Typography><strong>Parent ID:</strong> {activity.parentId || 'N/A'}</Typography>
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
        <Paper style={{ margin: 'auto', padding: '20px', maxWidth: '80%', maxHeight: '80%', overflowY: 'auto', marginTop: '50px' }}>
          <Typography variant="h6" id="modal-title">Activity Chain</Typography>
          <Divider style={{ marginBottom: '20px' }} />
          {history.length > 0 ? (
            <Grid container spacing={3}>
              {history.map(activity => (
                <Grid item xs={12} key={activity.activityId}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Activity ID: {activity.activityId}</Typography>
                      <Typography><strong>Timestamp:</strong> {activity.timestamp}</Typography>
                      <Typography><strong>Prescription ID:</strong> {activity.prescriptionId}</Typography>
                      <Typography><strong>Actor:</strong> {activity.actorId}</Typography>
                      <Typography><strong>Type:</strong> {activity.type}</Typography>
                      <Typography><strong>Parent ID:</strong> {activity.parentId || 'N/A'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No activity found for this prescription.</Typography>
          )}
          <Box mt={2}>
            <Button variant="contained" onClick={handleCloseModal}>Close</Button>
          </Box>
        </Paper>
      </Modal>
    </Container>
  );
};

export default Dashboard;
