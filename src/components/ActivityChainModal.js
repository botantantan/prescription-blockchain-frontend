import React from "react";
import { Modal, Box, Typography, Card, CardContent, Grid } from "@mui/material";

const ActivityChainModal = ({ open, onClose, activityChain }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 600,
          margin: "auto",
          marginTop: "10%",
          padding: 2,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h6" component="h2">
          Activity Chain
        </Typography>
        <Grid container spacing={2}>
          {activityChain.map((activity) => (
            <Grid item key={activity.activityId} xs={12}>
              <Card>
                <CardContent>
                  <Typography>Activity ID: {activity.activityId}</Typography>
                  <Typography>Timestamp: {activity.timestamp}</Typography>
                  <Typography>
                    Prescription ID: {activity.prescriptionId}
                  </Typography>
                  <Typography>Actor: {activity.actorId}</Typography>
                  <Typography>Type: {activity.type}</Typography>
                  <Typography>
                    Parent ID: {activity.parentId || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Modal>
  );
};

export default ActivityChainModal;
