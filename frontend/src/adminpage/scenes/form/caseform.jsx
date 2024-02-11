import React from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { tokens } from "../../../theme"; // Ensure this import is correct
import { useTheme } from "@mui/material";
import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { useNavigate } from "react-router-dom";
// Define your initialValues and validation schema
const initialValues = {
  respondentDetails: [{ name: "", advocate: "" }],
};

const checkoutSchema = yup.object().shape({
  respondentDetails: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Respondent Name is required"),
      advocate: yup.string().required("Respondent Advocate is required"),
    })
  ),
});

const Client = [
  {
    value: "Amanuel",
    label: "Amanuel",
  },
  {
    value: "Henok",
    label: "Henok",
  },
  {
    value: "Sisay",
    label: "Sisay",
  },
  {
    value: "Hendrikson",
    label: "Hendrikson",
  },
];

const Caseform = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const [rowCount, setRowCount] = useState(1);

  const handleAddMore = () => {
    setRowCount((prevRowCount) => prevRowCount + 1);
  };

  const handleRemove = (index) => {
    setRowCount((prevRowCount) => prevRowCount - 1);
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    // Perform form submission logic here
  };
  const handlebackbuttonClick = () => {
    // Navigate to another page (e.g., '/other-page')
    navigate("/registrar/addcase");
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Box display="flex" justifyContent="flex-end" mt="20px" >
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handlebackbuttonClick}
          startIcon={<ArrowBackIosNewOutlinedIcon fontSize="small" />}
        >
          Back
        </Button>
      </Box>
      <Header title="Add Case" subtitle=""  />
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
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Box display="grid" gridRow="span 10" gap="2px"  padding="20px" >
              <Box sx={{ backgroundColor: `${colors.primary[400]}75` }} borderRadius="20px" padding="30px">
                <Typography color={colors.greenAccent[500]} variant="h3">
                  Client Detail
                </Typography>
                <Grid container spacing={2}   >
                  <Grid item xs={6}>
                    <Autocomplete
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                      inputValue={inputValue}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                      }}
                      options={Client}
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search and Select"
                          variant="outlined"
                        />
                      )}
                      openOnFocus
                      autoHighlight
                      sx={{ mt: "10px" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <RadioGroup
                      name="role"
                      display="flex"
                      row
                      sx={{ mt: "12px" }}
                    >
                      <FormControlLabel
                        value="Petitioner"
                        control={<Radio color="default" />}
                        label="Petitioner"
                      />
                      <FormControlLabel
                        value="Respondent"
                        control={<Radio color="default" />}
                        label="Respondent"
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
                {[...Array(rowCount)].map((_, index) => (
                  <Box
                    key={index}
                    style={{ display: "flex", marginTop: "10px" }}
                  >
                    <TextField
                      name={`respondentDetails.${index}.name`}
                      label="Respondent Name"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      name={`respondentDetails.${index}.advocate`}
                      label="Respondent's Advocate"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      sx={{ marginLeft: "20px" }}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="contained"
                        color="error"
                        onClick={() => handleRemove(index)}
                        sx={{
                          marginTop: "25px",
                          mb: "17px",
                          ml: "5px",
                          mr: "5px",
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                ))}
                <Box>
                  <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    onClick={handleAddMore}
                    sx={{ marginTop: "10px" }}
                    startIcon={
                      <AddIcon fontSize="small" sx={{ marginRight: "0px" }} />
                    }
                  >
                    Add More
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{ mt: "30px", backgroundColor: `${colors.primary[400]}75`   }} borderRadius="15px" padding="30px"
              >
                <Typography color={colors.greenAccent[500]} variant="h3">
                  Case Detail
                </Typography>
                <Box sx={{ display: "flex", gap: "20px" }}>
                  <TextField
                    name="Case No"
                    label="Case Number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                  <TextField
                    id="Case Type"
                    select
                    label="Case Type"
                    defaultValue="Case Type"
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    id="Case Sub Type"
                    select
                    label="Case Sub Type"
                    defaultValue="Case Sub Type"
                    fullWidth
                    margin="normal"
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ display: "flex" }}>
                    <TextField
                      id="case stage"
                      select
                      label="Select case Stage"
                      defaultValue="Select case stage"
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      mt={2}
                      sx={{ display: "flex", alignItems: "center", mt: "20px" }}
                    >
                      <RadioGroup
                        name="Case stage"
                        display="flex"
                        sx={{ display: "flex" }}
                        row
                      >
                        <FormControlLabel
                          value="High"
                          control={<Radio color="default" />}
                          label="High"
                        />
                        <FormControlLabel
                          value="Medium"
                          control={<Radio color="default" />}
                          label="Medium"
                        />
                        <FormControlLabel
                          value="Low"
                          control={<Radio color="default" />}
                          label="Low"
                        />
                      </RadioGroup>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    name="Act"
                    label="Act"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                  />
                  <TextField
                    name="Filing Number"
                    label="Filing Number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    sx={{ ml: "20px" }}
                  />
                  <Typography variant="body1" sx={{ mt: "20px", ml: "20px" }}>
                    Filing Date:
                  </Typography>
                  <TextField
                    name="Filing Date"
                    type="date"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    sx={{ ml: "20px" }}
                  />
                </Box>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    name="Registration Number"
                    label="Registration Number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                  />
                  <Typography variant="body1" sx={{ mt: "20px", ml: "10px" }}>
                    Registration Date:
                  </Typography>
                  <TextField
                    name="Registration Date"
                    type="date"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    sx={{ ml: "20px" }}
                  />
                  <Typography variant="body1" sx={{ mt: "10px", ml: "20px" }}>
                    First Hearing Date:
                  </Typography>
                  <TextField
                    name="First Hearing Date"
                    type="date"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    sx={{ ml: "20px" }}
                  />
                </Box>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    name="CNR Number"
                    label="CNR Number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    variant="outlined"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    sx={{ mt: 2, ml: "20px" }}
                  />
                </Box>
              </Box>
              <Box
                sx={{ mt: "30px", backgroundColor: `${colors.primary[400]}75` }}
                borderRadius="15px" padding="30px"
              >
                <Typography color={colors.greenAccent[500]} variant="h3">
                  FIR Detail
                </Typography>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    name="Police Station"
                    label="Police Station"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                </Box>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    name="FIR Number"
                    label="FIR Number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                  <Typography variant="body1" sx={{ mt: "20px", ml: "30px" }}>
                    FIR Date:
                  </Typography>
                  <TextField
                    name="FIR Date"
                    type="date"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    sx={{ ml: "20px" }}
                  />
                </Box>
              </Box>
              <Box
                sx={{ mt: "30px", backgroundColor: `${colors.primary[400]}75` }}
                borderRadius="15px" padding="30px"
              >
                <Typography color={colors.greenAccent[500]} variant="h3">
                  Assign To
                </Typography>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    id="User"
                    select
                    label="Assign Case To"
                    defaultValue="Assign Case To"
                    margin="normal"
                    sx={{ width: "500px" }}
                  />
                </Box>
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
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Caseform;
