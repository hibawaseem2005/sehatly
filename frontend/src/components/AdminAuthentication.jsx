import React, { useState } from "react";
import { 
  Email, Phone, Verified, Shield, CheckCircle, Info 
} from "@mui/icons-material";
import { 
  Button, Card, CardContent, Typography, Modal, Box, List, ListItem, ListItemIcon, ListItemText 
} from "@mui/material";
import pmdcCert from "../sehatly-images/pmdc.jpg";
import adminPhoto from "../sehatly-images/admin.jpeg";

const AdminVerificationPage = () => {
  const [openCert, setOpenCert] = useState(false);

  const handleOpen = () => setOpenCert(true);
  const handleClose = () => setOpenCert(false);

  // Mock PMDC license info
  const license = {
    number: "PMDC-987654321",
    issuedBy: "Pakistan Medical & Dental Council",
    expiry: "31 Dec 2026",
    certificateImage: pmdcCert,
  };

  // Mock vendor photo
  const vendorPhoto = adminPhoto;

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <Typography variant="h4" gutterBottom>
          Sehatly Pharmacy Admin
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          All medicines are provided by certified and licensed professionals.
        </Typography>
      </header>

      {/* Vendor Info Card */}
      <Card style={styles.card}>
        <img src={adminPhoto} alt="Vendor" style={styles.adminPhoto} />
        <CardContent style={{ flex: 1 }}>
          <Typography variant="h5">
            Dr. Sara Khan{" "}
            <CheckCircle style={{ color: "#10b981", verticalAlign: "middle" }} />
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Licensed Pharmacist / Vendor
          </Typography>
          <Typography><strong>License Number:</strong> {license.number}</Typography>
          <Typography><strong>Issued By:</strong> {license.issuedBy}</Typography>
          <Typography><strong>Expiry Date:</strong> {license.expiry}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            style={{ marginTop: "1rem" }}
            onClick={handleOpen}
          >
            View License Certificate
          </Button>
        </CardContent>
      </Card>

      {/* Assurance Section */}
      <Card style={{ ...styles.card, backgroundColor: "#e0f2fe", marginTop: "2rem" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Shield style={{ verticalAlign: "middle", marginRight: "0.5rem" }}/>
            Why you can trust us
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckCircle style={{ color: "#10b981" }} /></ListItemIcon>
              <ListItemText primary="All medicines are FDA-approved and sourced from verified distributors." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle style={{ color: "#10b981" }} /></ListItemIcon>
              <ListItemText primary="Secure and safe transactions for all customers." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle style={{ color: "#10b981" }} /></ListItemIcon>
              <ListItemText primary="Your personal information is private and protected." />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card style={{ ...styles.card, backgroundColor: "#fef3c7", marginTop: "2rem" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Info style={{ verticalAlign: "middle", marginRight: "0.5rem" }}/>
            Contact & Support
          </Typography>
          <Typography>
            <Email style={{ verticalAlign: "middle", marginRight: "0.3rem" }}/>
            admin@sehatly.com
          </Typography>
          <Typography>
            <Phone style={{ verticalAlign: "middle", marginRight: "0.3rem" }}/>
            +92 300 1234567
          </Typography>
        </CardContent>
      </Card>

      {/* License Certificate Modal */}
      <Modal
        open={openCert}
        onClose={handleClose}
        aria-labelledby="license-modal"
        aria-describedby="vendor-license"
      >
        <Box style={styles.modal}>
          <Typography variant="h6" gutterBottom>
            PMDC License Certificate
          </Typography>
          <img 
            src={license.certificateImage} 
            alt="License Certificate" 
            style={{ width: "100%", borderRadius: "8px", marginTop: "1rem" }}
          />
          <Button 
            variant="contained" 
            color="secondary" 
            style={{ marginTop: "1rem" }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "2rem",
    backgroundColor: "#f9fafb",
    color: "#1f2937",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  card: {
    display: "flex",
    padding: "1rem",
    borderRadius: "12px",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  adminPhoto: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    marginRight: "2rem",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: 24,
    width: "400px",
    outline: "none",
  },
};

export default AdminVerificationPage;
