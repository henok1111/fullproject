import React from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Snackbar,
  FormControl,
  FormLabel,
} from "@mui/material";
import * as yup from "yup";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  middleName: yup.string().required("Middle Name is required"),
  lastName: yup.string().required("Last Name is required"),
  gender: yup.string().required("Gender is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobileNumber: yup.string().required("Mobile Number is required"),
  alternateNumber: yup.string(),
  address: yup.string().required("Address is required"),
  references: yup.array().of(
    yup.object().shape({
      referenceName: yup.string(),
      referenceMobile: yup.string(),
    })
  ),
});

const AddClient = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Create the formik instance
  const formik = useFormik({
    validationSchema,
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      email: "",
      mobileNumber: "",
      alternateNumber: "",
      address: "",
      references: [{ referenceName: "", referenceMobile: "" }],
    },
    onSubmit: handleSubmit,
  });

  const handleCancel = () => {
    // Use resetForm directly from the formik instance
    formik.resetForm();
  };

  // Updated handleSubmit function
  const handleSubmit = async (values) => {
    try {
      // Log form values
      console.log(values);

      // Create the user object
      const userObject = createUserObject(values);

      // Log the created object
      console.log(userObject);

      // Simulate the API call (replace this with your actual API endpoint)
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userObject),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        // Show success notification if needed

        // Reset the form after successful submission
        formik.resetForm();
      } else {
        // Handle errors
        console.error('Failed to submit form data');
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  // Function to create the user object
  const createUserObject = (values) => {
    return {
      first_name: values.firstName,
      middle_name: values.middleName,
      last_name: values.lastName,
      gender: values.gender,
      email: values.email,
      mobile_number: values.mobileNumber,
      alternate_number: values.alternateNumber,
      address: values.address,
      references: values.references.map((reference) => ({
        reference_name: reference.referenceName,
        reference_mobile: reference.referenceMobile,
      })),
    };
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Client Management" subtitle="Add Client" />
      <form onSubmit={formik.handleSubmit}>
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
                name="firstName"
                label="First Name"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.firstName}
                error={formik.touched.firstName && !!formik.errors.firstName}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
              <TextField
                name="middleName"
                label="Middle Name"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.middleName}
                error={formik.touched.middleName && !!formik.errors.middleName}
                helperText={formik.touched.middleName && formik.errors.middleName}
              />
              <TextField
                name="lastName"
                label="Last Name"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.lastName}
                error={formik.touched.lastName && !!formik.errors.lastName}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Box>
            <Box sx={{ display: "flex", mt: "20px", gap: "20px" }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  name="gender"
                  value={formik.values.gender || "male"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  row
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio color="default" />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio color="default" />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                name="mobileNumber"
                label="Mobile Number"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.mobileNumber}
                error={formik.touched.mobileNumber && !!formik.errors.mobileNumber}
                helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
              />
            </Box>
            <Box sx={{ display: "flex", mt: "20px", gap: "20px" }}>
              <TextField
                name="alternateNumber"
                label="Alternate Number"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.alternateNumber}
              />
              <TextField
                name="address"
                label="Address"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.address}
                error={formik.touched.address && !!formik.errors.address}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Box>
            <Box sx={{ mt: "20px" }}>
              <FormLabel component="legend">References</FormLabel>
              {formik.values.references.map((reference, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", gap: "20px", alignItems: "center" }}
                >
                  <TextField
                    name={`references[${index}].referenceName`}
                    label="Reference Name"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={reference.referenceName}
                  />
                  <TextField
                    name={`references[${index}].referenceMobile`}
                    label="Reference Mobile"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={reference.referenceMobile}
                  />
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "20px" }}>
            <Button
              type="button"
              color="secondary"
              variant="contained"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              sx={{ marginLeft: "10px" }}
            >
              Add Client
            </Button>
          </Box>
        </Box>
      </form>
      <Snackbar
        open={false}  // Replace with your own state variable for Snackbar
        autoHideDuration={6000}
        onClose={() => {}}  // Replace with your own function to handle Snackbar close
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </Box>
  );
};

export default AddClient;
