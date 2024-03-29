import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridCloseIcon, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  first_name: yup.string().required('First Name is required'),
  middle_name: yup.string(),
  last_name: yup.string().required('Last Name is required'),
  gender: yup.string(),
  email: yup.string().email('Invalid email address').required('Email is required'),
  mobile_number: yup.string(),
  address: yup.string(),
  // Add validation for other fields as needed
});

const Client = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const navigate = useNavigate();

  const isEmailUnique = async (email) => {
    try {
      const response = await fetch(`http://localhost:8081/api/checkemail?email=${email}`);
      const data = await response.json();
      return data.isUnique;
    } catch (error) {
      console.error("Error checking email uniqueness:", error);
      return false;
    }
  };

  const fetchData = async () => {
    try {
      console.log("Fetching client data...");
      const response = await fetch(
        "http://localhost:8081/api/getJoinedClientData"
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching joined client data: ${response.statusText}`
        );
      }

      const result = await response.json();
      setData(result);
      console.log("Client data fetched successfully:", result);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching joined client data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [selectedClient, setSelectedClient] = useState({
    id: null,
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    email: "",
    mobile_number: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleEditClick = (params) => {
    setSelectedClient({
      id: params.id,
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      phone_number: params.phone_number,
      address: params.address,
      middle_name: params.middle_name,
      gender:params.gender,
      mobile_number: params.mobile_number,
    });
    setIsEditing(true);
  };

  const handleDeleteClick = (params) => {
    setSelectedClient(params);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log(
        "Sending DELETE request to http://localhost:8081/api/deleteClient"
      );
      console.log("Request Body:", JSON.stringify({ id: selectedClient.id }));

      const response = await fetch(
        "http://localhost:8081/api/deleteClient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: selectedClient.id }),
        }
      );

      if (response.ok) {
        console.log(
          `Client with ID ${selectedClient.id} deleted successfully!`
        );

        const updatedData = data.filter(
          (client) => client.id !== selectedClient.id
        );
        setData(updatedData);

        setOpenSnackbar(true);
      } else {
        console.error(`Error deleting client with ID ${selectedClient.id}`);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleEditFormChange = (e, fieldName) => {
    const { value } = e.target;
    setValue(fieldName, value);
    console.log(fieldName, value);
  };

  const handleAddClientClick = () => {
    navigate("/registrar/addclient");
  };

  const handleEditFormSubmit = async () => {
    const editedClientData = {
      id: selectedClient.id,
      first_name: selectedClient.first_name,
      middle_name: selectedClient.middle_name,
      last_name: selectedClient.last_name,
      gender: selectedClient.gender,
      email: selectedClient.email,
      mobile_number: selectedClient.mobile_number,
      address: selectedClient.address,
    };

    try {
      const token = localStorage.getItem("token");
      const isEmailValid = await isEmailUnique(selectedClient.email);
      
      if (!isEmailValid) {
        setError("email", {
          type: "manual",
          message: "This email is already in use. Please use a different one.",
        });
        return;
      }
  
      if (!token) {
        console.error("No token found");
        return;
      }
  
      console.log("Client data to be sent:", editedClientData);
  
      const response = await fetch("http://localhost:8081/api/editClient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedClientData),
      });
  
      if (response.ok) {
        console.log("Client edited successfully!");
        fetchData();
        setOpenSnackbar(true);
      } else {
        console.error("Error editing client:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing client:", error.message);
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedClient({
      id: null,
      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      email: "",
      mobile_number: "",
      address: "",
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const columns = [
    { field: "first_name", headerName: "First Name", flex: 2.5 },
    { field: "middle_name", headerName: "Middle Name", flex: 2.5 },
    { field: "last_name", headerName: "Last Name", flex: 2.5 },
    { field: "gender", headerName: "Gender", flex: 1.5 },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "mobile_number", headerName: "Mobile Number", flex: 2.5 },
    { field: "address", headerName: "Address", flex: 2 },
    {
      field: "actions",
      headerName: "  Actions",
      flex: 3,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Button
            onClick={() => handleEditClick(params.row)}
            style={{ color: "yellowgreen" }}
          >
            <EditIcon />
          </Button>
          <Button
            onClick={() => handleDeleteClick(params.row)}
            style={{ color: "rgba(255, 0, 0, 0.9)" }}
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Client Management" subtitle="" />
      <Box
        display="flex"
        justifyContent="flex-end"
        marginBottom="20px"
        marginRight="20px"
      >
        <Button
          onClick={handleAddClientClick}
          variant="contained"
          color="secondary"
        >
          Add Client
        </Button>
      </Box>
      <Box
        m="40px 0 0 0"
        height="115vh"
        paddingBottom="25vh"
        display="flex"
        flexDirection="column"
      >
        {isEditing && (
          <Box
            marginLeft={10}
            marginRight={10}
            bgcolor={`${colors.primary[400]}80`}
            borderRadius={5}
            padding={5}
            marginBottom={5}
          >
            <Typography variant="h2" gutterBottom>
              Edit Client
            </Typography>
            <form onSubmit={handleSubmit(handleEditFormSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
  <Box sx={{ display: "flex", gap: "20px" }}>
    <Controller
      name="first_name"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="First Name"
          fullWidth
          margin="normal"
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
          onChange={(e) => handleEditFormChange(e, "first_name")}
        />
      )}
    />
    <Controller
      name="middle_name"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Middle Name"
          fullWidth
          margin="normal"
          onChange={(e) => handleEditFormChange(e, "middle_name")}
        />
      )}
    />
  </Box>
  <Box sx={{ display: "flex", gap: "20px" }}>
    <Controller
      name="last_name"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Last Name"
          fullWidth
          margin="normal"
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
          onChange={(e) => handleEditFormChange(e, "last_name")}
        />
      )}
    />
    <Controller
      name="email"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          onChange={(e) => handleEditFormChange(e, "email")}
        />
      )}
    />
  </Box>
  <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
    <Typography variant="body1" sx={{ marginRight: "20px" }}>
      Gender:
    </Typography>
    <Controller
      name="gender"
      control={control}
      render={({ field }) => (
        <>
          <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            {...field}
            onChange={(e) => handleEditFormChange(e, "gender")}
          />
          <label htmlFor="male">Male</label>
          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            {...field}
            onChange={(e) => handleEditFormChange(e, "gender")}
          />
          <label htmlFor="female">Female</label>
        </>
      )}
    />
  </Box>
  <Box sx={{ display: "flex", gap: "20px" }}>
    <Controller
      name="mobile_number"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Mobile Number"
          fullWidth
          margin="normal"
          onChange={(e) => handleEditFormChange(e, "mobile_number")}
        />
      )}
    />
    <Controller
      name="address"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Address"
          fullWidth
          margin="normal"
          onChange={(e) => handleEditFormChange(e, "address")}
        />
      )}
    />
  </Box>
</Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="contained"
                  color="secondary"
                  sx={{ marginLeft: "10px" }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        )}

        <DataGrid
          rows={data}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection={false}
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
          sx={{
            flexGrow: 1,
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
        />
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Operation successful!"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <GridCloseIcon fontSize="small" />
          </IconButton>
        }
      />

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: `${colors.blueAccent[100]}`, // Set your preferred background color
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" color={"red"}>
          {"Are you sure you want to delete this client?"}
        </DialogTitle>
        <DialogContent>
          {/* You can add additional content here if needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Client; 