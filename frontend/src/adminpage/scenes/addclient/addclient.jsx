import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { tokens } from "../../../theme"; // Ensure this import is correct
import { useTheme } from "@mui/material";
import Header from "../../components/Header";
import { Form, Formik } from "formik";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const Addclient = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rowCount, setRowCount] = useState(1);

  const handleAddRow = () => {
    setRowCount((prevCount) => prevCount + 1);
  };

  const initialValues = {
    respondentDetails: [{ name: "", advocate: "" }],
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    // Perform form submission logic here
  };

  const handleRemove = (index) => {
    setRowCount((prevRowCount) => prevRowCount - 1);
  };
  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Client Management" subtitle="Add Client" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={[]}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Box
              padding="20px"
              backgroundColor={colors.blueAccent[900]}
              sx={{ mb: "150px" }}
            >
              <Box
                sx={{
                  backgroundColor: `${colors.primary[400]}75`,
                }}
                padding="30px"
                borderRadius="10px"
                margin="5px"
              >
                <Box sx={{ display: "flex", gap: "20px" }}>
                  <TextField
                    name="First Name"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    name="Middle Name"
                    label="Middle Name"
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    name="Last Name"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                  />
                </Box>
                <Box sx={{ display: "flex", mt: "20px", gap: "20px" }}>
                  <FormControl sx={{ ml: "20px" }} fullWidth>
                    <FormLabel
                      id="gender-row-radio-buttons-group-label"
                      variant="h2"
                      sx={{ fontSize: "1.1rem" }}
                    >
                      Gender
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="gender-row-radio-buttons-group"
                      name="gender-radio-buttons-group"
                    >
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                    </RadioGroup>
                  </FormControl>
                  <TextField
                    name="Email"
                    label="Email"
                    type="email"
                    fullWidth
                  />
                  <TextField
                    name="Mobile Number"
                    label="Mobile No"
                    type="tele"
                    fullWidth
                  />
                </Box>
                <Box sx={{ display: "flex", mt: "20px", gap: "20px" }}>
                  <TextField
                    name="Alternate number"
                    label="Altenate No"
                    type="tele"
                    sx={{ width: "500px" }}
                  />
                  <TextField
                    name="Address"
                    label="Address"
                    type="outlined"
                    multiline
                    fullWidth
                  />
                </Box>
                {[...Array(rowCount)].map((_, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", mt: "20px", gap: "20px" }}
                  >
                    <TextField
                      name="Reference Name"
                      label="Reference Name"
                      type="outlined"
                      fullWidth
                    />
                    <TextField
                      name="Reference mobile"
                      label="Reference mobile"
                      type="tele"
                      fullWidth
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="contained"
                        color="error"
                        onClick={() => handleRemove(index)}
                        sx={{
                          marginTop: "12px",
                          mb: "17px",
                          mr: "5px",
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                ))}
                <Box sx={{ display: "flex", mt: "20px", gap: "20px" }}>
                  <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<AddOutlinedIcon />}
                    onClick={handleAddRow}
                  >
                    Add More Reference
                  </Button>
                </Box>
                <Box
                  sx={{
                    mt: "30px",
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: "50px",
                  }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    sx={{ mt: "10px" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    color="success"
                    sx={{ mt: "10px", ml: "10px" }}
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Addclient;
