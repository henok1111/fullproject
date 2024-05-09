import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputLabel,
  DialogActions,
  DialogTitle,
  DialogContent,
  Dialog,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const initialValues = {};

const checkoutSchema = yup.object().shape({});

const Appointment = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [cases, setCases] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  const handleClick = () => {
    navigate("/judge/appointmentform");
  };

  useEffect(() => {
    fetchAppointment();
  }, []); // Fetch appointments when the component mounts

  const initialValues = {
    note: "",
    date: "",
    time: "",
  };

  const appointmentSchema = yup.object().shape({
    note: yup.string().required("Note is required"),
    date: yup.date().required("Date is required"),
    time: yup.string().required("Time is required"),
  });

  const handleEditClick = (row) => {
    setSelectedAppointment(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
  };
  const handleSubmitAppointment = async (values) => {
    // Extract only the fields that need to be updated
    const { "Appointment ID": appointmentId, time, date, note } = values;

    // Prepare the updated appointment data
    const updatedAppointment = {
      "Appointment ID": appointmentId, // Use the existing appointment ID
      time,
      date,
      note,
    };
    console.log(updatedAppointment);
    try {
      const response = await fetch(
        "http://localhost:8081/api/updateappointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAppointment),
        }
      );

      if (response.ok) {
        console.log("Appointment updated successfully");
        // Close the dialog after successful update
        handleCloseDialog();
        // Refresh appointments after update
        fetchAppointment();
      } else {
        console.error("Failed to update appointment");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const fetchAppointment = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const judgeId = decodedToken.userId; // Get the userId from the decoded JWT token

      const response = await fetch("http://localhost:8081/api/getappointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ judgeId }), // Send the judgeId to the backend server
      });

      const data = await response.json();
      console.log("data", data);
      setCases(data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  const handleDeleteClick = async (row) => {
    try {
      console.log("Deleting appointment with ID:", row["Appointment ID"]);

      const response = await fetch(
        "http://localhost:8081/api/deleteappointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appointmentId: row["Appointment ID"] }),
        }
      );

      if (response.ok) {
        // Appointment deleted successfully
        console.log("Appointment deleted successfully");
        // Refresh appointments after deletion
        fetchAppointment();
      } else {
        // Error deleting appointment
        console.error("Failed to delete appointment");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const columns = [
    {
      field: "Appointment ID",
      headerName: "Appointment ID",
      flex: 1,
    },
    {
      field: "Case ID",
      headerName: "Case ID",
      flex: 1,
    },
    {
      field: "Date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "Time",
      headerName: "Time",
      flex: 1,
    },
    {
      field: "Note",
      headerName: "Note",
      flex: 3,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 0.8,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
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
      <Header title="Appointment Management" subtitle="" />
      <Box display="flex" justifyContent="end" mt="10px">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClick}
          startIcon={<AddIcon fontSize="small" />}
          mb="10px"
        >
          Add Appointment
        </Button>
      </Box>
      <Box>
        <Typography color={colors.greenAccent[500]} variant="h2">
          Search Appointment
        </Typography>
      </Box>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Box display="flex" mt={"20px"}>
              {/* First search bar */}
              <Box display="flex">
                <InputLabel
                  className="text"
                  htmlFor="search-bar-appointment-form"
                  sx={{ mt: "10px", ml: "25px" }}
                >
                  From Date:
                </InputLabel>
                <TextField
                  id="search-bar-appointment-date"
                  className="text"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  variant="outlined"
                  type="date"
                  size="small"
                  sx={{
                    ml: "10px",
                    width: "350px",
                  }}
                />
              </Box>
              {/* Second search bar */}
              <Box display="flex">
                <InputLabel
                  className="text"
                  htmlFor="search-bar-appointment-to-date"
                  sx={{ mt: "10px", ml: "25px" }}
                >
                  To Date:
                </InputLabel>
                <TextField
                  id="search-bar-litigant-name"
                  className="text"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  variant="outlined"
                  type="date"
                  size="small"
                  sx={{
                    ml: "10px",
                    width: "350px",
                  }}
                />
              </Box>
            </Box>

            {/* DataGrid */}
            <Box
              sx={{ mt: "10px" }}
              padding="5px"
              backgroundColor={colors.blueAccent[900]}
            >
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
                  "& .name-column--cell": {
                    color: colors.greenAccent[300],
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
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
                  "& .date-time-cell": {
                    color: "blue", // Change the color to blue
                    fontWeight: "bold", // Add additional styles as needed
                  },
                }}
              >
                <DataGrid
                  rows={cases.map((appointment, index) => ({
                    id: index + 1,
                    "Appointment ID": appointment.appointment_id,
                    "Case ID": appointment.case_id,
                    Date: new Date(appointment.date).toLocaleDateString(),
                    Time: appointment.time,
                    Note: appointment.note,
                    Action: "Action Button",
                  }))}
                  columns={columns}
                  components={{ Toolbar: GridToolbar }}
                />
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
      {/* Edit Appointment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <Formik
          initialValues={selectedAppointment || initialValues}
          validationSchema={appointmentSchema}
          onSubmit={handleSubmitAppointment}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <DialogTitle style={{ backgroundColor: colors.blueAccent[900] }}>
                Edit Appointment
              </DialogTitle>
              <DialogContent
                style={{ backgroundColor: colors.blueAccent[900] }}
              >
                <TextField
                  fullWidth
                  id="note"
                  name="note"
                  label="Note"
                  value={values.note}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.note && Boolean(errors.note)}
                  helperText={touched.note && errors.note}
                  style={{ margin: "10px 0px 10px 0px" }}
                />
                <TextField
                  fullWidth
                  id="date"
                  name="date"
                  label="Date"
                  type="date"
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.date && Boolean(errors.date)}
                  helperText={touched.date && errors.date}
                  style={{ margin: "10px 0px 10px 0px" }}
                  InputProps={{
                    inputProps: {
                      min: new Date().toISOString().split("T")[0], // Set min date to today
                    },
                  }}
                />

                <TextField
                  fullWidth
                  id="time"
                  name="time"
                  label="Time"
                  type="time"
                  value={values.time}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.time && Boolean(errors.time)}
                  helperText={touched.time && errors.time}
                  style={{ margin: "10px 0px 10px 0px" }}
                />
              </DialogContent>
              <DialogActions
                style={{ backgroundColor: colors.blueAccent[900] }}
              >
                <Button color="error" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" color="secondary">
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default Appointment;
