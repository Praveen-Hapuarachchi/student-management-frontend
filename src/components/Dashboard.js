import React from "react";
import { Grid, Paper, Typography, Box, Avatar } from "@mui/material";
import FlagImage from "../assets/flag.png";  // Path to the flag image
import SchoolBadge from "../assets/school-badgee.png";  // Path to the school badge image

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f5f5f5" }}>
      {/* Header with Flag and School Badge */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 4,
          backgroundColor: "#fff",
          padding: 3,
          borderRadius: 2,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Avatar
          alt="School Flag"
          src={FlagImage}
          sx={{ width: 85, height: 80, marginRight: 2 }} // Increased size
        />
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#333", textAlign: "center", flexGrow: 1 }}
        >
          Welcome to the Student Management System 
        </Typography>
        <Avatar
          alt="School Badge"
          src={SchoolBadge}
          sx={{ width: 80, height: 80, marginLeft: "auto" }} // Increased size
        />
      </Box>

      {/* Welcome Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: 3,
          borderRadius: 2,
          marginBottom: 4,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="body1"
          sx={{ marginBottom: 2, lineHeight: 1.8, color: "#555" }}
        >
          This portal is designed to streamline administrative and academic
          operations for government schools. With a mission to provide quality
          education to all students, we aim to bridge the gap in educational
          resources and promote equal opportunities.
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginBottom: 2, lineHeight: 1.8, color: "#555" }}
        >
          Our system currently supports over 5,000 students and 250 teachers
          across various schools, helping them manage exams, assignments, and
          other educational activities efficiently.
        </Typography>
      </Box>

      {/* Statistics Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              padding: 2,
              textAlign: "center",
              backgroundColor: "#e0f7fa",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" sx={{ color: "#00796b" }}>
              Total Students
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#004d40" }}>
              5000
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              padding: 2,
              textAlign: "center",
              backgroundColor: "#fff3e0",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" sx={{ color: "#e65100" }}>
              Upcoming Exams
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#bf360c" }}>
              15
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              padding: 2,
              textAlign: "center",
              backgroundColor: "#ede7f6",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" sx={{ color: "#4527a0" }}>
              Assignments Due
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#311b92" }}>
              10
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              padding: 2,
              textAlign: "center",
              backgroundColor: "#f1f8e9",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" sx={{ color: "#33691e" }}>
              Total Teachers
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1b5e20" }}>
              250
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
