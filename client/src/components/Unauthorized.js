// Unauthorized.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        p: 3,
      }}
    >
      <LockIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        401 - Unauthorized
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Oops! You are not authorized to view this page.  
        Please log in to continue.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/login")}
        sx={{ borderRadius: 2, px: 4, textTransform: "none" }}
      >
        Go to Login
      </Button>
    </Box>
  );
};

export default Unauthorized;
