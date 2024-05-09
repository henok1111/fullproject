import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { jwtDecode } from "jwt-decode";

const UploadProscutorDocumentPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  useEffect(() => {
    fetchDocuments();
  }, []); // Fetch documents when the component mounts

  const fetchDocuments = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const prosecutorId = decodedToken.userId; // Get the userId from the decoded JWT token

      const response = await fetch(
        "http://localhost:8081/api/fetchproscutorcases",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prosecutorId }), // Send the prosecutorId to the backend server
        }
      );

      const data = await response.json();
      console.log("data", data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);

      // Decode the token from local storage
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const prosecutorId = decodedToken.userId; // Assuming userId is the prosecutorId

      // Add prosecutorId to FormData
      formData.append("prosecutor_id", prosecutorId);

      const response = await axios.post(
        "http://localhost:8081/api/uploadproscutordocumentss",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Document uploaded successfully!");
        // Reset the form fields
        setDescription("");
        setFile(null);
        fetchDocuments();
      } else {
        console.error("Failed to upload document.");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  return (
    <Box
      minHeight="32vh" // Set the minimum height to 100% of the viewport height
      bgcolor={colors.blueAccent[900]} // Set the background color
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container sx={{ backgroundColor: colors.blueAccent[900] }} maxWidth="sm">
        <Box padding="5px" borderRadius="8px">
          <Typography marginBottom={3} variant="h5">
            Initiate Case
          </Typography>
          <TextField
            style={{ marginBottom: "1rem" }}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Description"
            value={description}
            onChange={handleDescriptionChange}
          />
          <input
            accept="application/pdf"
            id="contained-button-file"
            type="file"
            onChange={handleFileChange}
          />

          <Button
            variant="outlined"
            color="secondary"
            disabled={!description || !file}
            onClick={handleUpload}
            style={{ marginLeft: "1.5rem" }}
          >
            Upload
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
export default UploadProscutorDocumentPage;
