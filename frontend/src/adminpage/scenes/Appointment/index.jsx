import React, { useState } from "react";
import { Box, Button, TextField, Typography, InputLabel } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const initialValues = {};

const checkoutSchema = yup.object().shape({});

const Appointment = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  const handleClick = () => {
    navigate("/registrar/appointmentform");
  };

  const columns = [
    { field: "No", headerName: "No", flex: 0.5 },
    {
      field: "Client Name",
      headerName: "Client Name",
      flex: 2.3,
    },
    {
      field: "Mobile",
      headerName: "Mobile",
      flex: 0.5,
    },
    { field: "Date", headerName: "Date", flex: 0.5 },
    { field: "Time", headerName: "Time", flex: 0.5 },
    { field: "Status", headerName: "status", flex: 0.5 },
    { field: "Action", headerName: "Action", flex: 0.4 },
  ];

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Appointmen Management" subtitle="" />
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
                }}
              >
                <DataGrid
                  rows={[]} // You need to provide rows data here
                  columns={columns}
                  components={{ Toolbar: GridToolbar }}
                />
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Appointment;
