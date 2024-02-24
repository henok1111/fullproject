import React, { useState } from "react";
import { Box, Button } from "@mui/material";
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

const Client = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  const handleClick = () => {
    navigate("/registrar/addclient");
  };

  const columns = [
    { field: "No", headerName: "No", flex: 0.5 },
    { field: "Client Name", headerName: "Client Name", flex: 2.3 },
    { field: "Mobile", headerName: "Mobile", flex: 1 },
    { field: "Case", headerName: "Case", flex: 1 },
    { field: "Status", headerName: "status", flex: 0.5 },
    { field: "Action", headerName: "Action", flex: 0.4 },
  ];

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Client Management" subtitle="" />
      <Box display="flex" justifyContent="end" mt="0px">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClick}
          startIcon={<AddIcon fontSize="small" />}
          mb="10px"
        >
          Add Client
        </Button>
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
            {/* DataGrid */}
            <Box
              //   sx={{ mt: "10px" }}
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

export default Client;
