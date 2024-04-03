import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { tokens } from "../../../theme"; // Ensure this import is correct
import { useTheme } from "@mui/material";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
// Define your initialValues and validation schema
const initialValues = {
  clientDetail: {
    petitioners: [],
    petitionerAdvocate: [],
    respondents: [],
    respondentAdvocate: [],
  },
  caseDetails: {
    caseNumber: "",
    caseType: "",
    caseSubType: "",
    caseStage: "",
    casePriority: "",
    act: "",
    filingNumber: "",
    filingDate: "",
    registrationNumber: "",
    registrationDate: "",
    firstHearingDate: "",
    CNRNumber: "",
    description: "",
    policeStation: "",
    FIRNumber: "",
    FIRDate: "",
  },
  assignedTo: "",
};

const checkoutSchema = yup.object().shape({
  clientDetail: yup.object().shape({
    petitioners: yup.array().required("Petitioner(s) are required"),
    petitionerAdvocate: yup
      .array()
      .required("Advocate for Petitioner(s) are required"),
    respondents: yup.array().required("Respondent(s) are required"),
    respondentAdvocate: yup
      .array()
      .required("Advocate for Respondent(s) are required"),
  }),
  caseDetails: yup.object().shape({
    caseNumber: yup.string().required("Case Number is required"),
    caseType: yup.string().required("Case Type is required"),
    caseSubType: yup.string().required("Case Sub Type is required"),
    caseStage: yup.string().required("Case Stage is required"),
    casePriority: yup.string().required("Case Priority is required"),
    act: yup.string().required("Act is required"),
    filingNumber: yup.string().required("Filing Number is required"),
    filingDate: yup.date().required("Filing Date is required"),
    registrationNumber: yup.string().required("Registration Number is required"),
    registrationDate: yup.date().required("Registration Date is required"),
    firstHearingDate: yup.date().required("First Hearing Date is required"),
    CNRNumber: yup.string().required("CNR Number is required"),
    description: yup.string().required("Description is required"),
    policeStation: yup.string().required("Police Station is required"),
    FIRNumber: yup.string().required("FIR Number is required"),
    FIRDate: yup.date().required("FIR Date is required"),
  }),
  assignedTo: yup.string().required("Assigned To is required"),
});

const CaseForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [prosecutors, setProsecutors] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [clients, setClients] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseSubTypes, setCaseSubTypes] = useState([]);
  const [judges, setJudges] = useState([]);
  const [caseCount, setCaseCount] = useState(0);  
  const [selectedPetitioners, setSelectedPetitioners] = useState([]);
  const [selectedRespondents, setSelectedRespondents] = useState([]);
  const [selectedCaseType, setSelectedCaseType] = useState("");
  useEffect(() => {
    // Fetch advocates
    fetchAdvocates();
    // Fetch clients
    fetchCaseCount()
    fetchCaseTypes();
    fetchClients();
    fetchCaseSubTypes();
    fetchJudges();
    fetchProsecutors();
  }, []);
  const fetchAdvocates = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/caseadvocators");
      if (!response.ok) {
        throw new Error('Failed to fetch advocates');
      }
      const data = await response.json();
      console.log("Fetched advocates:", data); // Log the fetched data
      // Flatten the nested array
      const flattenedAdvocates = data.flatMap(arr => arr);
      // Filter out unwanted objects
      const filteredAdvocates = flattenedAdvocates.filter(advocate => advocate.middle_name && advocate.first_name);
      console.log("Filtered Advocates:", filteredAdvocates); 
      setAdvocates(filteredAdvocates);
    } catch (error) {
      console.error("Error fetching advocates:", error);
    }
  };
  const fetchProsecutors = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/caseproscuter");
      if (!response.ok) {
        throw new Error("Failed to fetch prosecutors");
      }
      const data = await response.json();
      console.log("Fetched prosecutors:", data);
  
      // Flatten the nested array
      const flattenedProsecutors = data.flatMap(arr => arr);
  
      // Filter out unwanted objects
      const filteredProsecutors = flattenedProsecutors.filter(prosecutor => prosecutor.id && prosecutor.first_name);
  
      console.log("Filtered Prosecutors:", filteredProsecutors);
  
      setProsecutors(filteredProsecutors);
    } catch (error) {
      console.error("Error fetching prosecutors:", error);
    }
  };
  
  
  const fetchJudges = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/judge");
      if (!response.ok) {
        throw new Error('Failed to fetch judges');
      }
      const data = await response.json();
      console.log("fetched  Judges: ", data);
      setJudges(data);
    } catch (error) {
      console.error("Error fetching judges:", error);
    }
  };

  
  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/caseclients");
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      console.log("Fetched clients:", data); // Log the fetched data
      // Flatten the nested array
      const flattenedClients = data.flatMap(arr => arr);
      // Filter out unwanted objects

      const filteredClients = flattenedClients.filter(client => client.id && client.first_name);
      console.log("Filtered Clients:", filteredClients);
      setClients(filteredClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  const fetchCaseTypes = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/getCaseType");
      if (!response.ok) {
        throw new Error('Failed to fetch case types');
      }
      const data = await response.json();
      console.log("Fetched case types:", data); // Log the fetched case types
      // Set case types
      setCaseTypes(data);
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };
  const handleDocumentChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        try {
            const formData = new FormData();
            formData.append("file", file);

            // Extracting the file name
            const fileName = file.name;

            // Extracting the case ID from the case count state
            const caseId = caseCount + 1;

            // Append the file name and case ID to the FormData object
            formData.append("fileName", fileName);
            formData.append("caseId", caseId);

            // Log case ID and file name
            console.log("Case ID:", caseId);
            console.log("File Name:", fileName);

            // Make a POST request to upload the file and associated data to the server
            const response = await fetch("http://localhost:8081/api/uploaddocument", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            // Handle the response as needed
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }
};




  const fetchCaseCount = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/getcasecout");
      if (!response.ok) {
        throw new Error("Failed to fetch case count");
      }
      const data = await response.json();
      console.log("Fetched case count:", data.count);
      setCaseCount(data.count);
    } catch (error) {
      console.error("Error fetching case count:", error);
    }
  };
  const fetchCaseSubTypes = async (caseType) => {
    try {
      const response = await fetch(`http://localhost:8081/api/getCaseSubType?caseType=${caseType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch case sub types');
      }
      const data = await response.json();
      console.log("Fetched case sub types:", data); // Log the fetched case sub types
      // Set case sub types
      setCaseSubTypes(data);
    } catch (error) {
      console.error("Error fetching case sub types:", error);
    }
  };
  

  const handleFormSubmit = (values) => {
    console.log(values);
    // Perform form submission logic here
  };

  const handleBackButtonClick = () => {
    navigate("/registrar/addcase");
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Box display="flex" justifyContent="flex-end" mt="20px">
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleBackButtonClick}
          startIcon={<ArrowBackIosNewOutlinedIcon fontSize="small" />}
        >
          Back
        </Button>
      </Box>
      <Header title="Add Case" subtitle="" />
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
            <Box display="grid" gridRow="span 10" gap="2px" padding="20px">
              <Box
                sx={{ backgroundColor: `${colors.primary[400]}75` }}
                borderRadius="20px"
                padding="30px"
              >
                <Typography color={colors.greenAccent[500]} variant="h3">
                  Client Detail
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h6">Petitioner</Typography>
                    <Select
                      id="petitioners"
                      value={selectedPetitioners}
                      onChange={(event) => {
                        const selectedPetitioner = event.target.value;
                        setSelectedPetitioners(selectedPetitioner);
                        // Remove the selected petitioner from respondents
                        setSelectedRespondents((prev) =>
                          prev.filter((client) => client !== selectedPetitioner)
                        );
                      }}
                      // Render dynamically based on available clients
                      renderValue={(selected) =>
                        selected
                          .map((id) => {
                            const selectedClient = clients.find((client) => client.id === id);
                            return `${selectedClient.first_name} ${selectedClient.last_name}`;
                          })
                          .join(', ')
                      }
                      // Dynamic options based on available clients
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                            width: 250,
                            backgroundColor:`${colors.blueAccent[900]}`
                          },
                        },
                      }}
                      multiple
                      fullWidth
                      autoHighlight
                    >
                      {clients
                        .filter(
                          (client) =>
                            !selectedRespondents.includes(client.id)
                        )
                        .map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            {`${client.first_name} ${client.middle_name} ${client.email}`}
                          </MenuItem>
                        ))}
                    </Select>

                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {selectedCaseType === "criminal" ? 'proscuter for petioner' : "Advocator for petioner"}
                    </Typography>
                    <Select
  id="petitionerAdvocate"
  value={values.clientDetail.petitionerAdvocate}
  onChange={(event) => {
    setFieldValue("clientDetail.petitionerAdvocate", event.target.value);
    console.log("Selected Case Type for Petitioner Advocate:", selectedCaseType); // Log the selected case type for Petitioner Advocate
  }}
  MenuProps={{
    PaperProps: {
      style: {
        maxHeight: 300,
        width: 250,
        backgroundColor: `${colors.blueAccent[900]}`,
      },
    },
  }}
  fullWidth
  autoHighlight
>
  {/* Conditionally render options based on selected case type */}
  {console.log("selected case type from the place where i wanna be " ,selectedCaseType)}
  {selectedCaseType === "criminal" ? (
    // Render prosecutor dynamically if case type is Criminal
    prosecutors.map((prosecutor) => (
      <MenuItem key={prosecutor.id} value={prosecutor.id}>
        {`${prosecutor.first_name} ${prosecutor.middle_name} ${prosecutor.email}`}
      </MenuItem>
    ))
  ) : (
    // Render other advocates for civil cases
    advocates.map((advocate) => (
      <MenuItem key={advocate.id} value={advocate.first_name}>
        {`${advocate.first_name} ${advocate.middle_name} ${advocate.email}`}
      </MenuItem>
    ))
  )}
</Select>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">Respondent</Typography>
                    <Select
                      id="respondents"
                      value={selectedRespondents}
                      onChange={(event) => {
                        const selectedRespondent = event.target.value;
                        setSelectedRespondents(selectedRespondent);
                        // Remove the selected respondent from petitioners
                        setSelectedPetitioners((prev) =>
                          prev.filter((client) => client !== selectedRespondent)
                        );
                      }}
                      // Render dynamically based on available clients
                      renderValue={(selected) =>
                        selected
                          .map((id) => {
                            const selectedClient = clients.find((client) => client.id === id);
                            return `${selectedClient.first_name} ${selectedClient.last_name}`;
                          })
                          .join(', ')
                      }
                      // Dynamic options based on available clients
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                            width: 250,
                            backgroundColor:`${colors.blueAccent[900]}`
                          },
                        },
                      }}
                      multiple
                      fullWidth
                      autoHighlight
                    >
                      {clients
                        .filter(
                          (client) =>
                            !selectedPetitioners.includes(client.id)
                        )
                        .map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            {`${client.first_name} ${client.middle_name} ${client.email}`}
                          </MenuItem>
                        ))}
                    </Select>

                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Advocate for Respondent
                    </Typography>
                    <Select
  id="respondentAdvocate"
  value={values.clientDetail.respondentAdvocate}
  onChange={(event) =>
    setFieldValue(
      "clientDetail.respondentAdvocate",
      event.target.value
    )
  }
  MenuProps={{
    PaperProps: {
      style: {
        maxHeight: 300,
        width: 250,
        backgroundColor:`${colors.blueAccent[900]}`
      },
    },
  }}
  fullWidth
  autoHighlight
>
  {advocates.map((advocate) => (
    <MenuItem key={advocate.id} value={advocate.first_name}>
      {`${advocate.first_name} ${advocate.middle_name} ${advocate.email}`}
    </MenuItem>
  ))}
</Select>

                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{ mt: "30px", backgroundColor: `${colors.primary[400]}75` }}
                borderRadius="15px"
                padding="30px"
              >
                <Typography color={colors.greenAccent[500]} variant="h3">
                  Case Detail
                </Typography>
                <Box sx={{ display: "flex", gap: "20px" }}>
                <TextField
  name="caseNumber"
  label={`Case Number`} // Concatenate the text and case count
  variant="outlined"
  margin="normal"
  fullWidth
  value={`Case Number: ${caseCount + 1}`}// Set the value
  disabled // Make the field disabled
/>

<TextField
  id="caseType"
  select
  label="Case Type"
  value={values.caseDetails.caseType}
  onChange={(event) => {
    const selectedCaseType = event.target.value;
    setSelectedCaseType(selectedCaseType); // Update selected case type state
    setFieldValue("caseDetails.caseType", selectedCaseType);
    fetchCaseSubTypes(selectedCaseType); // Fetch subtypes based on the selected case type
    console.log("Selected Case Type: rom the casetype", selectedCaseType); // Log the selected case type
  }}
  variant="outlined"
  margin="normal"
  fullWidth
  required
>
  {caseTypes.map((caseType) => (
    <MenuItem key={caseType.case_type} value={caseType.case_type}>
      {caseType.case_type}
    </MenuItem>
  ))}
</TextField>


<TextField
  id="caseSubType"
  select
  label="Case Sub Type"
  value={values.caseDetails.caseSubType}
  onChange={(event) => {
    setFieldValue("caseDetails.caseSubType", event.target.value);
  }}
  onBlur={handleBlur}
  variant="outlined"
  margin="normal"
  fullWidth
  required
>
  {caseSubTypes.map((subType) => (
    <MenuItem key={subType.sub_type_name} value={subType.sub_type_name}>
      {subType.sub_type_name}
    </MenuItem>
  ))}
</TextField>


                </Box>
                
                
                <Box sx={{ display: "flex" }}>
                  <Typography variant="body1" sx={{ mt: "20px", ml: "10px" }}>
                    Registration Date:
                  </Typography>
                  <TextField
                    name="registrationDate"
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
                borderRadius="15px"
                padding="30px"
              >
                <Typography color={colors.greenAccent[500]} variant="h3">
                  FIR Detail
                </Typography>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    name="policeStation"
                    label="Police Station"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                  />
                  <TextField
                    name="FIRNumber"
                    label="FIR Number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    sx={{ ml: "20px" }}
                  />
                  <Typography variant="body1" sx={{ mt: "20px", ml: "20px" }}>
                    FIR Date:
                  </Typography>
                  <TextField
                    name="FIRDate"
                    type="date"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    sx={{ ml: "20px" }}
                  />
                </Box>
              </Box>
              <Box
                sx={{ mt: "30px", backgroundColor: `${colors.primary[400]}75` }}
                borderRadius="15px"
                padding="30px"
              >
                <Typography color={colors.greenAccent[500]} variant="h3">
                  Assign To
                </Typography>
                <Box sx={{ display: "flex" }}>
  <TextField
    id="assignedTo"
    select
    label="Assign Case To"
    defaultValue="Assign Case To"
    margin="normal"
    sx={{ width: "500px" }}
    value={values.assignedTo}
    onChange={(event) => setFieldValue("assignedTo", event.target.value)}
  >
    {judges.map((judge) => (
      <MenuItem key={judge.id} value={judge.id}>
        {`${judge.first_name} ${judge.last_name}`}
      </MenuItem>
    ))}
  </TextField>
  <Grid container justifyContent="flex-end" alignItems="flex-start">
  <label htmlFor="file-upload">
    <input
      id="file-upload"
      type="file"
      style={{ display: "none" }}
      onChange={handleDocumentChange} // Attach handleDocumentChange function here
    />
    <Button
      component="span"
      variant="contained"
      color="primary"
      size="large"
      sx={{ mt: "10px" }}
    >
      <DescriptionOutlinedIcon /> Add Document
    </Button>
  </label>
</Grid>

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
                  type="submit"
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

export default CaseForm;
