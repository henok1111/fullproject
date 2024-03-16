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

  // Define fetchData as an arrow function to access it in the component
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
    fetchData(); // Call fetchData when the component mounts
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
    references: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editedValues, setEditedValues] = useState({});

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
      
      references: params.references
    });
    setIsEditing(true);
    setAnchorEl(null);
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

        // Update the data state after successful deletion
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

const handleEditFormChange = (e, fieldName, index) => {
  const { value } = e.target;

  let updatedValues = {};

  if (fieldName.startsWith('references')) {
    const referenceIndex = parseInt(fieldName.match(/\[(\d+)\]/)[1]);
    const referenceFieldName = fieldName.split('.')[1];

    // Update the form state for the nested field within the references array
    setValue(`references[${referenceIndex}].${referenceFieldName}`, value);

    updatedValues = {
      ...editedValues,
      references: editedValues.references ? [...editedValues.references] : [], // Create a shallow copy of references or initialize it as an empty array
    };

    // Update the specific reference if it exists, otherwise, initialize it
    if (updatedValues.references[referenceIndex]) {
      updatedValues.references[referenceIndex] = {
        ...updatedValues.references[referenceIndex],
        [referenceFieldName]: value,
      };
    } else {
      updatedValues.references[referenceIndex] = { [referenceFieldName]: value };
    }
  } else {
    // Update the form state for non-nested fields
    setValue(fieldName, value);

    updatedValues = {
      ...editedValues,
      [fieldName]: value, // Update the latest edited value
    };
  }

  setEditedValues(updatedValues);
  console.log("Edited Values:", updatedValues);
};




  const handleAddClientClick = () => {
    // Navigate to /addclient route
    navigate("/registrar/addclient");
    fetchData();
  };

const handleEditFormSubmit = async () => {
  // Prepare the data to be sent to the backend
  const editedClientData = {
    id: selectedClient.id,
    first_name: editedValues.first_name,
    middle_name: editedValues.middle_name,
    last_name: editedValues.last_name,
    gender: editedValues.gender,
    email: editedValues.email,
    mobile_number: editedValues.mobile_number,
    address: editedValues.address,
    references: selectedClient.references.map((ref, index) => ({
      id: ref.id, // Include the reference ID
      reference_name: editedValues.references[index].reference_name, // Update reference_name
      reference_mobile: editedValues.references[index].reference_mobile, // Update reference_mobile
    })),
  };

  try {
    const token = localStorage.getItem("token");

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
    setEditedValues({
      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      email: "",
      mobile_number: "",
      address: "",
      references: [],
    });
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
      references: [],
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
      field: "references",
      headerName: "References",
      flex: 8,
      renderCell: (params) => {
        const references = params.row.references || [];
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {references.map((ref, index) => (
              <div key={index} style={{ marginRight: "16px" }}>
                <div style={{ fontWeight: "bold" }}>
                  {`Name: ${ref.reference_name}`}
                </div>
                <div>{`Mobile: ${ref.reference_mobile}`}</div>
              </div>
            ))}
          </div>
        );
      },
    },
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
              <Box
                sx={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
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
  name="gender"
  control={control}
 
  render={({ field }) => (
    <TextField
      {...field}
      label="Gender"
      fullWidth
      margin="normal"
      onChange={(e) => handleEditFormChange(e, "gender")}
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

             
{selectedClient.references.map((ref, index) => (
  <Box
    key={index}
    sx={{ display: "flex", gap: "20px", alignItems: "center" }}
  >
    <Controller
      name={`references[${index}].referenceName`}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Reference Name"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => handleEditFormChange(e, `references[${index}].reference_name`)}
        />
      )}
    />
    <Controller
      name={`references[${index}].referenceMobile`}
      control={control}
      
      render={({ field }) => (
        <TextField
          {...field}
          label="Reference Mobile"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => handleEditFormChange(e, `references[${index}].reference_mobile`)}
        />
      )}
    />
                </Box>
              ))}
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
        onClose={() => setOpenDialog(false)}
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
          <Button onClick={() => setOpenDialog(false)} color="primary">
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