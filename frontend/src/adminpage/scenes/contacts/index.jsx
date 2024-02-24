import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Switch,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [editFormData, setEditFormData] = useState({
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    role: "Judge",
    status: false,
  });

  const [userData, setUserData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/getUsers");
      const data = await response.json();

      // Update the status property based on the backend data
      const updatedData = data.map((user, index) => ({
        ...user,
        status: user.status === "Activated",
        id: index + 1, // Add this line to start the ID from 1
      }));

      setUserData(updatedData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (params) => {
    setEditFormData({
      id: params.id,
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      phone_number: params.phone_number,
      address: params.address,
      role: params.role,
      status: params.status,
    });

    setAnchorEl(null);
  };

  const handleDeleteClick = async (params) => {
    try {
      const response = await fetch("http://localhost:8081/api/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: params.id }),
      });

      if (response.ok) {
        console.log(`User with ID ${params.id} deleted successfully!`);
        setOpenSnackbar(true);
        fetchUsers();
      } else {
        console.error(`Error deleting user with ID ${params.id}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }

    setAnchorEl(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setEditFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const handleSwitchChange = async (userId, newStatus) => {
    try {
      const backendStatus = newStatus ? "Activated" : "Deactivated";

      const response = await fetch("http://localhost:8081/api/editUserStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId, status: backendStatus }),
      });

      if (response.ok) {
        console.log(`User with ID ${userId} status updated successfully!`);

        // Immediately update the local state with the new status
        setUserData((prevData) =>
          prevData.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );

        setOpenSnackbar(true);
      } else {
        console.error(`Error updating user status with ID ${userId}`);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditFormData({
      id: null,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
      role: "",
      status: false,
    });

    setAnchorEl(null);
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        "http://localhost:8081/api/editUser",
        editFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("User edited successfully!");
        setOpenSnackbar(true);
        fetchUsers();
      } else {
        console.error("Error editing user:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing user:", error.message);
    }

    setEditFormData({
      id: null,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
      role: "",
      status: false,
    });

    setAnchorEl(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "first_name",
      headerName: "First Name",
      flex: 1,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          backgroundColor={
            params.value === "admin"
              ? colors.greenAccent[600]
              : params.value === "manager"
              ? colors.greenAccent[700]
              : colors.greenAccent[700]
          }
          borderRadius="4px"
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          color="secondary"
          name="status"
          inputProps={{ "aria-label": "controlled" }}
          onClick={() => handleSwitchChange(params.id, !params.value)}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton
            aria-controls="action-menu"
            aria-haspopup="true"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="action-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleEditClick(params)}>Edit</MenuItem>
            <MenuItem onClick={() => handleDeleteClick(params)}>
              Delete
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        m="40px 0 0 0"
        height="115vh"
        paddingBottom="25vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[800],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={userData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      <Box
        position="fixed"
        top="20%"
        left="20%"
        zIndex={1000}
        display={editFormData.id ? "block" : "none"}
        backgroundColor={`${colors.primary[500]}`}
        color={colors.grey[200]}
        padding="30px"
        borderRadius="20px"
        boxShadow={4}
        margin=" 0px 300px 300px 300px"
      >
        <form onSubmit={handleEditFormSubmit}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="first_name"
            value={editFormData.first_name}
            onChange={handleEditFormChange}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="last_name"
            value={editFormData.last_name}
            onChange={handleEditFormChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={editFormData.email}
            onChange={handleEditFormChange}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            name="phone_number"
            value={editFormData.phone_number}
            onChange={handleEditFormChange}
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            margin="normal"
            name="address"
            value={editFormData.address}
            onChange={handleEditFormChange}
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="role">Role</InputLabel>
            <Select
              label="Role"
              name="role"
              value={editFormData.role || ""}
              onChange={handleEditFormChange}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Registrar">Registrar</MenuItem>
              <MenuItem value="Judge">Judge</MenuItem>
              <MenuItem value="Proscuter">Proscuter</MenuItem>
              <MenuItem value="Invoice_Clerk">Invoice_Clerk</MenuItem>
              <MenuItem value="Court_Manager">Court_Manager</MenuItem>
              {/* Add other roles as needed */}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: "10px", marginRight: "10px" }}
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCancelEdit}
            sx={{ marginTop: "10px" }}
          >
            Cancel
          </Button>
        </form>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          User edited successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contacts;
