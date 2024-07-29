import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { envOrDefault } from '../utils/util';
import { Typography, Container, Grid, Card, CardContent, Button, ToggleButtonGroup, ToggleButton, Modal, Box } from '@mui/material';

const Dashboard = ({ setMessage }) => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [activities, setActivities] = useState([]);
    const [view, setView] = useState('prescriptions'); // State to toggle between views
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [activityChain, setActivityChain] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

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
                setMessage({ type: 'error', text: `Error fetching assets: ${error.response?.data || error.message}` });
            }
        };

        fetchAssets();
    }, [setMessage]);

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    const handleOpenModal = async (prescriptionId) => {
        try {
            const apiUrl = envOrDefault('REACT_APP_API_BASE_URL', 'http://localhost:3000');
            const response = await axios.get(`${apiUrl}/api/getRxHistory/${prescriptionId}`);
            setActivityChain(response.data);
            setSelectedPrescription(prescriptionId);
            setModalOpen(true);
        } catch (error) {
            console.error('Error fetching activity chain:', error);
            setMessage({ type: 'error', text: `Error fetching activity chain: ${error.response?.data || error.message}` });
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setActivityChain([]);
        setSelectedPrescription(null);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Dashboard</Typography>

            <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                aria-label="view toggle"
                style={{ marginBottom: '20px' }}
            >
                <ToggleButton value="prescriptions" aria-label="prescriptions view">
                    Prescriptions
                </ToggleButton>
                <ToggleButton value="activities" aria-label="activities view">
                    Activities
                </ToggleButton>
            </ToggleButtonGroup>

            {view === 'prescriptions' && (
                <>
                    <Typography variant="h6">Prescriptions</Typography>
                    <Grid container spacing={2}>
                        {prescriptions.map(prescription => (
                            <Grid item xs={12} sm={6} md={4} key={prescription.prescriptionId}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">Prescription ID: {prescription.prescriptionId}</Typography>
                                        <Typography>Created At: {prescription.creationDate}</Typography>
                                        <Typography>Prescribed For: {prescription.patientId}</Typography>
                                        <Typography>Prescribed By: {prescription.doctorId}</Typography>
                                        <Typography>Medicine ID: {prescription.medicineId}</Typography>
                                        <Typography>Iter: {prescription.isIter}</Typography>
                                        <Typography>Iter Count: {prescription.iterCount}</Typography>
                                        <Typography>Valid: {prescription.isValid}</Typography>
                                        <Typography>Filled By: {prescription.pharmacistId || 'N/A'}</Typography>
                                        <Typography>Terminated At: {prescription.terminationDate || 'N/A'}</Typography>
                                        <Button variant="contained" color="primary" onClick={() => handleOpenModal(prescription.prescriptionId)}>
                                            View Activity Chain
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}

            {view === 'activities' && (
                <>
                    <Typography variant="h6">Activities</Typography>
                    <Grid container spacing={2}>
                        {activities.map(activity => (
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
                </>
            )}

            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box style={{ padding: '20px', backgroundColor: 'white', margin: '20px auto', maxWidth: '600px' }}>
                    <Typography variant="h6" gutterBottom>Activity Chain for {selectedPrescription}</Typography>
                    {activityChain.map(activity => (
                        <Box key={activity.activityId} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={4}>
                            <Typography>Activity ID: {activity.activityId}</Typography>
                            <Typography>Timestamp: {activity.timestamp}</Typography>
                            <Typography>Prescription ID: {activity.prescriptionId}</Typography>
                            <Typography>Actor: {activity.actorId}</Typography>
                            <Typography>Type: {activity.type}</Typography>
                            <Typography>Parent ID: {activity.parentId || 'N/A'}</Typography>
                        </Box>
                    ))}
                </Box>
            </Modal>
        </Container>
    );
};

export default Dashboard;
