import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../../theme"; // Ensure this import is correct
import { useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const ProfilePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [imagePath, setImagePath] = useState("");

  const handleChoosePicture = () => {
    const input = document.createElement("input");
    input.type = "file";

    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Limit image size to 5MB
          const maxSize = 5 * 1024 * 1024; // 5MB in bytes
          if (reader.result.length < maxSize) {
            // Update the image path with the selected image
            setImagePath(reader.result);
            // Store the image path in local storage
            localStorage.setItem("imagePath", reader.result);
          } else {
            console.error("Image size exceeds the allowed limit (5MB).");
            // You can show an error message to the user if needed.
          }
        };
        reader.readAsDataURL(file);
      }
    });

    input.click();
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Profile" subtitle="" color={colors.greenAccent[500]} />
      <Box
        sx={{
          backgroundColor: `${colors.primary[400]}80`,
          borderRadius: 2,
          mb: "170px",
        }}
        padding={2}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <img
              alt="profile-user"
              width="300px"
              height="300px"
              src={imagePath}
              style={{ cursor: "pointer", borderRadius: "100%" }}
              onClick={handleChoosePicture}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box display="flex" gap={2}>
              <TextField label="First Name" variant="outlined" fullWidth />
              <TextField label="Last Name" variant="outlined" fullWidth />
            </Box>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                type="email"
                label="Email"
                variant="outlined"
                fullWidth
              />
              <TextField label="Phone" variant="outlined" fullWidth />
            </Box>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                label="Registration Number"
                variant="outlined"
                fullWidth
              />
              <TextField label="Associated Name" variant="outlined" fullWidth />
            </Box>
            <Box display="flex" gap={2} mt={2}>
              <TextField label="Address" variant="outlined" fullWidth />
              <TextField label="Zip Code" variant="outlined" width={100} />
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<EditIcon fontSize="small" />}
          >
            Edit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
