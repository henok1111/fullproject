import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Snackbar } from "@mui/material";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Grid, TextField, Typography, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem } from "@mui/material"; // Import MenuItem component

const initialValues = {};

const checkoutSchema = yup.object().shape({});

const AddCourtRegistrarCase = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const colors = tokens(theme.palette.mode);
    const { userId } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [fetchedCases, setFetchedCases] = useState([]);
    const [filePath, setFilePath] = useState("");
    const [expandedCases, setExpandedCases] = useState({});
    const [referencesVisible, setReferencesVisible] = useState({});
    const [enteredCaseId, setEnteredCaseId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [caseToDelete, setCaseToDelete] = useState(null);
    const [criminalJudges, setCriminalJudges] = useState([]);
    const [civilJudges, setCivilJudges] = useState([]);
    const [selectedJudgeType, setSelectedJudgeType] = useState("");
    const [selectedJudge, setSelectedJudge] = useState('');
    const [selectedCaseId, setSelectedCaseId] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const handleClick = () => {
        navigate(`/registrar/caseform`);
    };

    useEffect(() => {
        fetchCaseCount();
        fetchJudge();
    }, [submitSuccess]);

    const handleSnackbarOpen = () => {
        setSnackbarOpen(true);
    };
    const handleSelectCase = (caseId) => {
      setSelectedCaseId(caseId); // Step 2
  };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
   
    const fetchJudge = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/judge");
        if (!response.ok) {
          throw new Error("Failed to fetch judge information");
        }
        const data = await response.json();
        console.log("Fetched judge information:", data);
  
        // Filter judges into criminal and civil categories
        const criminalJudgesData = data.filter(judge => judge.judge_type.toLowerCase() === 'criminal');
        console.log("Filtered Criminal Judges:", criminalJudgesData);
  
        const civilJudgesData = data.filter(judge => judge.judge_type.toLowerCase() === 'civil');
        console.log("Filtered Civil Judges:", civilJudgesData);
  
        setCriminalJudges(criminalJudgesData);
        setCivilJudges(civilJudgesData);
      } catch (error) {
        console.error("Error fetching judge information:", error);
      }
    };
  
    const fetchCaseCount = async () => {
        try {
            const response = await fetch("http://localhost:8081/api/fetchcaseinformation");
            if (!response.ok) {
                throw new Error("Failed to fetch case count");
            }
            const data = await response.json();
            console.log("Fetched case count:", data);
            setFetchedCases(data);

        } catch (error) {
            console.error("Error fetching case count:", error);
        }
    };

    const toggleCaseDetails = (caseId) => {
        setExpandedCases((prev) => ({
            ...prev,
            [caseId]: !prev[caseId],
        }));

        setReferencesVisible((prev) => ({
            ...prev,
            [caseId]: !prev[caseId],
        }));
    };

    const handleEditCase = (caseId) => {
        console.log("Editing case with ID:", caseId);
    };

    const deleteCase = (caseId) => {
        setCaseToDelete(caseId);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (caseToDelete) {
            await deleteCaseFromServer(caseToDelete);
            setOpenDeleteDialog(false);
        }
    };

    const deleteCaseFromServer = async (caseId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/deletecase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: caseId }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete case');
            }
            setFetchedCases((prevCases) => prevCases.filter((caseData) => caseData.case_id !== caseId));
            handleSnackbarOpen();
        } catch (error) {
            console.error('Error deleting case:', error);
        }
    };

    const handleFormSubmit = (values) => {
        setErrorMessage("");

        const enteredCaseIdNumber = parseInt(enteredCaseId);

        console.log("Entered Case ID:", enteredCaseIdNumber);

        const foundCase = fetchedCases.find((caseData) => caseData.case_id === enteredCaseIdNumber);
        if (foundCase) {
            console.log("Found Case ID:", foundCase.case_id);
            const foundCaseRef = document.getElementById(`case-${foundCase.case_id}`);
            if (foundCaseRef) {
                foundCaseRef.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        } else {
            setErrorMessage("the case number you entered does not match");
        }
    };
    const handleSubmitc = async (selectedCaseId) => {
      // Make sure selectedJudge and selectedCaseId have values before submitting
      if (selectedJudge && selectedCaseId) {
          try {
              // Log the selected judge's value
              console.log("Selected Judge:", selectedJudge);
  
              // Log the selected case ID
              console.log("Selected Case ID:", selectedCaseId);
  
              // Prepare the POST data with only the selected judge's ID
              const postData = {
                  selectedJudgeId: selectedJudge, // Change to selectedJudgeId
                  selectedCaseId: selectedCaseId,
              };
  
              // Perform the API POST request with the selected judge's ID
              const response = await fetch('http://localhost:8081/api/judgeassign', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(postData),
              });
  
              setSubmitSuccess(true);
              // Check if the request was successful
              if (!response.ok) {
                  throw new Error('Failed to submit data');
              }
  
              // Handle success response
              const data = await response.json();
              console.log('Submitted data:', data);
  
              // Optionally, reset the selectedJudge state after submission
              setSelectedJudge('');
  
          } catch (error) {
              console.error('Error submitting data:', error);
              // Handle error state if needed
          }
      } else {
          // Handle case where no judge or case is selected
          console.error('No judge or case selected');
      }
  };
  
  
  
  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Case Management" subtitle="" />
      <Box display="flex" justifyContent="end" mt="10px">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClick}
          startIcon={<AddIcon fontSize="small" />}
          mb="10px"
        >
          Add Case
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
            <Box display="flex" mt={"20px"} >
              {/* First search bar */}
     <TextField
  id="search-bar-case-number"
  className="text"
  value={enteredCaseId}
  onChange={(e) => {
    // Ensure only numbers are entered
    const regex = /^[0-9]*$/;
    if (regex.test(e.target.value) || e.target.value === '') {
      setEnteredCaseId(e.target.value);
    }
  }}
  label="Search Case by Case Number"
  variant="filled"
  placeholder="Search..."
  size="medium"
  sx={{
    ml: "20px",
    width: "350px",
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton type="submit" aria-label="search">
          <SearchIcon style={{ fontSize: "30px" }} />
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
            
            </Box>
{errorMessage && (
    <Typography color="error"  padding={3} mt={1}>{errorMessage}</Typography>
  )}
            {/* DataGrid */}
            <Box
              sx={{ mt: "10px" }}
              padding="5px"
              backgroundColor={colors.blueAccent[900]}
            >
              <Box
                m="40px 0 0 0"
              >
                <Snackbar
  open={snackbarOpen}
  autoHideDuration={6000} // Adjust as needed
  onClose={handleSnackbarClose}
  message="Case deleted successfully"
/>

                {/* Render CaseBoxes for each fetched case */}
              <>
                  {fetchedCases.map((caseData) => (
                    <Box  id={`case-${caseData.case_id}`} key={caseData.case_id}  borderRadius={4} p={3} mt={2} bgcolor={`${colors.primary[400]}80`}>
<Box display="flex" alignItems="center" p={2}>
  <Typography
    marginBottom={2}
    style={{ fontWeight: 'bold', color: colors.greenAccent[300] }}
    variant="h3"
    color="#5bc0de"
    flexGrow={1} // Grow to fill available space
  >
    Case Number {caseData.case_id}
  </Typography>
  <Box>
    <Button  style={{margin:"10px"}} variant="contained" color="primary" onClick={() => handleEditCase(caseData.case_id)}>Edit Case</Button>
    <Button variant="contained" color="error" onClick={() => deleteCase(caseData.case_id)}>Delete Case</Button>
  </Box>
</Box>
<Grid  container spacing={0}  >
                     <Grid item xs={12} md={4.5} margin={1} borderRadius={3} bgcolor={`${colors.primary[400]}40`} boxShadow={10}  >
                     <Box padding={2}>
                     <Typography variant="h3" color="#5bc0de" style={{ fontWeight: 'bold'}} textAlign={"center"}>Case Information</Typography>
  <Typography variant="h4" margin={1}  color={colors.grey[100]} style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
    Case Type  <span style={{ color: colors.greenAccent[300], fontWeight: 'bold', fontSize: '1.1em' }}>{caseData.case_type}</span> 
  </Typography>
  <Typography variant="h4" margin={1} color={colors.grey[100]} style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
    Case Sub Type   <span style={{ color: colors.greenAccent[300], fontWeight: 'bold', fontSize: '1.1em' }}>{caseData.sub_type_name}</span>
  </Typography>
  <Typography variant="h4" margin={1} color={colors.grey[100]} style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
    FIR Date  <span style={{ color: colors.greenAccent[300], fontWeight: 'bold', fontSize: '1.1em' }}>{caseData.FIRDate}</span>
  </Typography>
  <Typography variant="h4" margin={1}  color={colors.grey[100]} style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
    FIR Number  <span style={{ color: colors.greenAccent[300], fontWeight: 'bold', fontSize: '1.1em' }}>{caseData.FIRNumber}</span>
  </Typography>
  <Typography variant="h4" margin={1}  color={colors.grey[100]} style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
    Registration Date  <span style={{ color: colors.greenAccent[300], fontWeight: 'bold', fontSize: '1.1em' }}>{caseData.registrationDate}</span>
  </Typography>
  {expandedCases[caseData.case_id] && (
  <>
    {caseData.case_type === "criminal" && (
      <Typography variant="h4" margin={1} color={colors.grey[100]} style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
        Police Station  <span style={{ color: colors.greenAccent[300], fontWeight: 'bold', fontSize: '1.1em' }}>{caseData.policeStation}</span>
      </Typography>
    )}
  </>
)}
{caseData.first_name === null ? (
  // Render select dropdown to choose a judge
  <>
   <TextField
    select
    label="Judge Type"
    value={selectedJudge}
    onChange={(e) => setSelectedJudge(e.target.value)} // Change this line
    variant="outlined"
    fullWidth
    style={{ marginTop: '10px' }}
>
    {caseData.case_type === "criminal" ?
        criminalJudges.map((judge) => (
            <MenuItem key={judge.id} value={judge.id}> {/* Change value to judge.id */}
                {` ${judge.id}  ${judge.first_name} ${judge.last_name}`}
            </MenuItem>
        )) :
        civilJudges.map((judge) => (
            <MenuItem key={judge.id} value={judge.id}> {/* Change value to judge.id */}
                {`${judge.id}  ${judge.first_name} ${judge.last_name}`}
            </MenuItem>
        ))}
</TextField>

    <Button
      variant="contained"
      color="primary"
      onClick={() => handleSubmitc(caseData.case_id)}
      style={{ marginTop: '10px' }}
    >
      Submit
    </Button>
  </>
) : (
  // Render assigned judge's name
  <Typography variant="h4" margin={1} color={colors.grey[100]} style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
    Assigned Judge: <span style={{ color: colors.greenAccent[300], fontWeight: 'bold', fontSize: '1.1em' }}>{` ${caseData.id} / ${caseData.first_name}/ ${caseData.last_name}`}</span>
  </Typography>
)}
  {caseData.petitioner_advocate_info && caseData.petitioner_advocate_info.first_name && caseData.petitioner_advocate_info.last_name && (
    <Typography variant="h4" margin={1}  color={colors.grey[100]} style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
      Petitioner Advocate <span style={{ color: colors.greenAccent[300], fontWeight: 'bold', fontSize: '1.1em' }}>{`${caseData.petitioner_advocate_info.first_name} ${caseData.petitioner_advocate_info.last_name}`}</span>
    </Typography>
  )}
  {caseData.prosecutor_info && caseData.prosecutor_info.first_name && caseData.prosecutor_info.last_name && (
    <Typography variant="h4" margin={1}  color={colors.grey[100]} style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
      Prosecutor <span style={{ color: colors.greenAccent[300], fontWeight: 'bold', fontSize: '1.1em' }}>{`${caseData.prosecutor_info.first_name} ${caseData.prosecutor_info.last_name}`}</span>
    </Typography>
  )}
  <Typography variant="h4" margin={1}  color={colors.grey[100]} style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
    Respondent Advocate {caseData.respondent_advocate_info ? <span style={{ color: colors.greenAccent[300], fontWeight: 'bold', fontSize: '1.1em' }}>{`${caseData.respondent_advocate_info.first_name} ${caseData.respondent_advocate_info.last_name}`}</span> : 'N/A'}
  </Typography>

</Box>

                     </Grid>
  
                   <Grid item xs={12} boxShadow={10} borderRadius={3} margin={1} bgcolor={`${colors.primary[400]}40`} md={3.6}>
                        {caseData.petitioners_info && (
                          <Box padding={2} >
                            <Typography variant="h3" color="#5bc0de" style={{ fontWeight: 'bold'}} textAlign={"center"}>Petitioners</Typography>
                            {caseData.petitioners_info.map((petitioner, index) => (
                              <Box key={index} borderBottom={3}  mt={1} padding={1} borderRadius={2}  borderColor={colors.blueAccent[800]} marginLeft={2} marginRight={2}>
                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1.1em' }} variant="body1"  color={colors.grey[100]}>
  Full Name   <span style={{ fontWeight: 'bold', fontSize: '1.1em', color: colors.greenAccent[300] }}>{`${petitioner.first_name} ${petitioner.middle_name} ${petitioner.last_name}`}</span>
</Typography>
                                {expandedCases[caseData.case_id] && (
              <>
                <Typography variant="body1"  color={colors.grey[100]}>{`Email:  ${petitioner.email}`}</Typography>
                <Typography variant="body1"  color={colors.grey[100]}>{`Phone Number:  ${petitioner.mobile_number}`}</Typography>
              </>
            )}
                                {/* Render other petitioner info */}
                                {expandedCases[caseData.case_id] && (
                          <>
                            <Typography variant="h5"  color={colors.blueAccent[300]}>Reference Information</Typography>
                            {petitioner.references && petitioner.references.map((reference, index) => (
                              <Box key={index}  color={colors.greenAccent[300] }mt={1} >
                                <Typography variant="body1"  color={colors.grey[100]}>{`Reference Name: ${reference.reference_name}`}</Typography>
                                <Typography variant="body1"  color={colors.grey[100]}>{`Reference Mobile: ${reference.reference_mobile}`}</Typography>
                              </Box>
                            ))}
                          </>
                        )}
                              </Box>
                            ))}
                          </Box>
                        )}
                   </Grid>
  
  <Grid item xs={12} md={3.4} margin={1} borderRadius={3}bgcolor={`${colors.primary[400]}40`} boxShadow={10}>
    {caseData.respondents_info && (
      <Box padding={2}  >
        <Typography variant="h3" color="#5bc0de" style={{ fontWeight: 'bold'}} textAlign={"center"}>Respondents</Typography>
        {caseData.respondents_info.map((respondent, index) => (
          <Box  key={index} borderBottom={3}  mt={1} padding={1} borderRadius={2}  borderColor={colors.blueAccent[800]} marginLeft={2} marginRight={2}>
            <Typography variant="body1"  color={colors.grey[100]}>
  <span style={{ fontWeight: 'bold', fontSize: '1.1.1em' }}>
   Full Name 
  </span>
  <span style={{ fontWeight: 'bold', fontSize: '1.1.1em', color: colors.greenAccent[300] }}>
    {`${respondent.first_name} ${respondent.middle_name} ${respondent.last_name}`}
  </span>
</Typography>

            {expandedCases[caseData.case_id] && (
              <>
                <Typography variant="body1"  color={colors.grey[100]}>{`Email: ${respondent.email}`}</Typography>
                <Typography variant="body1"  color={colors.grey[100]}>{`Phone Number: ${respondent.mobile_number}`}</Typography>
              </>
            )}
            {/* Render other respondent info */}
            {expandedCases[caseData.case_id] && (
              <>
                <Typography variant="h5" color={colors.blueAccent[300]}>References Information</Typography>
                {respondent.references && respondent.references.map((reference, index) => (
                  <Box key={index} mt={1}>
                    <Typography variant="body1"  color={colors.grey[100]}>{`Reference Name: ${reference.reference_name}`}</Typography>
                    <Typography variant="body1"  color={colors.grey[100]}>{`Reference Mobile: ${reference.reference_mobile}`}</Typography>
                  </Box>
                ))}
              </>
            )}
          </Box>
        ))}
      </Box>
    )}
  </Grid>
</Grid>

{expandedCases[caseData.case_id] && (
        <>
     
        
     <TextField style={{margin:"10px"}} multiline label="discrioption" fullWidth disabled variant="outlined" value={caseData.description}/>
        
        </>
      )
       }

 
             
             
  <Button
      variant="contained"
      onClick={() => toggleCaseDetails(caseData.case_id)}
    >
      {expandedCases[caseData.case_id] ? "Hide Details" : "Case Details"}
    </Button>
                    </Box>
                  ))}
              </>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
      <Dialog
    open={openDeleteDialog}
    onClose={() => setOpenDeleteDialog(false)}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    sx={{
      "& .MuiDialog-paper": {
        backgroundColor: `${colors.blueAccent[100]}`, // Set your preferred background color
      },
    }}
>
<DialogTitle id="alert-dialog-title" color={"red"}>
            {"Are you sure you want to delete this Case"}
          </DialogTitle>
    
    <DialogActions>
        <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
        </Button>
        <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
        </Button>
    </DialogActions>
</Dialog>

    </Box>
  );
};

export default AddCourtRegistrarCase;
