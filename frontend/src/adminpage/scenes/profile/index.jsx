import React, { useState, useEffect ,useRef} from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../../theme"; // Ensure this import is correct
import { useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { jwtDecode } from "jwt-decode";

const ProfilePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [imagePath, setImagePath] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    fetchUserImage();
  }, []);

  const fetchUserImage = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.userId;

      const response = await fetch(`http://localhost:8081/api/getUserImage/${userId}`);
      const data = await response.json();
      const { imagePath } = data;

      setImagePath(imagePath);
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        // Retrieve the user ID from the decoded token
        const accessToken = localStorage.getItem("accessToken");
        const decodedToken = jwtDecode(accessToken);
        const userId = decodedToken.userId;

        // Append the user ID to the FormData object
        formData.append("userId", userId);

        // Make a POST request to upload the file to the server
        const response = await fetch("http://localhost:8081/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        // Update the imagePath state variable synchronously
        setImagePath(data.filePath);

        // Fetch user image automatically after selecting a new image
        fetchUserImage(); // Call fetchUserImage function here

        // Display the selected image automatically
        const reader = new FileReader();
        reader.onload = () => {
          setImagePath(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
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
        <Box display="flex" justifyContent="center" alignItems="center">
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
               <label htmlFor="fileInput">
                  <img
                    alt="profile-user"
                    width="280px"
                    height="280px"
                    src={`http://localhost:8081/${imagePath}`}                    style={{ cursor: "pointer", borderRadius: "50%" }}
                    onClick={handleImageClick}                  
                  />
                </label>
              </Box>
          <Grid item xs={12} sm={8}>
            <Box display="flex" gap={2}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Box>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                type="email"
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Box>
            <Box display="flex" gap={3} mt={3}>
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Box>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
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
