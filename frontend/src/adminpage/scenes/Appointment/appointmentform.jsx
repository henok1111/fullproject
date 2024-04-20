import { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  Box,
  Button,
  colors,
  useTheme,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios"; // Import Axios for making HTTP requests
import { tokens } from "../../../theme";

const Appointmentform = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [petitioners, setPetitioners] = useState([]);
  const [respondents, setRespondents] = useState([]);

  // Function to fetch cases from the backend
  const fetchCases = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/cases");
      const data = await response.json();
      console.log("data", data);
      setCases(data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  // Function to fetch petitioners and respondents for the selected case
  const fetchPetitionersAndRespondents = async (caseId) => {
    try {
      console.log("Selected Case ID:", caseId); // Log the selected case ID before making requests
      const petitionersResponse = await axios.get(
        `http://localhost:8081/api/petitioners/${caseId}`
      );
      const respondentsResponse = await axios.get(
        `http://localhost:8081/api/respondents/${caseId}`
      );

      setPetitioners(petitionersResponse.data);
      setRespondents(respondentsResponse.data);
    } catch (error) {
      console.error("Error fetching case details:", error);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleBackButtonClick = () => {
    navigate("/registrar/appointment");
  };

  const handleCaseChange = (event, newValue) => {
    setSelectedCase(newValue);
    if (newValue) {
      console.log("Selected Case ID:", newValue.case_id); // Log the selected case ID
      fetchPetitionersAndRespondents(newValue.case_id);
    } else {
      setPetitioners([]);
      setRespondents([]);
    }
  };
  const handleSaveAppointment = async () => {
    try {
      // Extract phone numbers from the fetched petitioner and respondent data
      const petitionerPhoneNumbers = petitioners
        .map((petitioner) => petitioner.mobile_number)
        .join(", ");
      const respondentPhoneNumbers = respondents
        .map((respondent) => respondent.mobile_number)
        .join(", ");

      const appointmentData = {
        case_id: selectedCase.case_id,
        petitioner_phone_numbers: petitionerPhoneNumbers, // Include petitioner's phone numbers
        respondent_phone_numbers: respondentPhoneNumbers, // Include respondent's phone numbers
        date: date,
        time: time,
        note: note,
      };
      console.log("Data to be sent to the server:", appointmentData);
      const response = await axios.post(
        "http://localhost:8081/api/addappointments",
        appointmentData
      );
      console.log("Appointment saved successfully:", response.data);
      // Optionally, you can navigate to another page or show a success message here
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  };

  return (
    <Box padding="20px" mb="10px" backgroundColor={colors.blueAccent[900]}>
      <Box display="flex" justifyContent="end" mt="10px">
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
      <Header title="Add Appointment" subtitle="Appointment Form" />
      <Box
        margin="20px"
        padding="30px"
        borderRadius="15px"
        bgcolor="primary.400"
      >
        <Box>
          <Autocomplete
            value={selectedCase}
            onChange={handleCaseChange}
            options={cases}
            getOptionLabel={(option) => option.case_id.toString()}
            renderInput={(params) => (
              <TextField {...params} label="Select Case" variant="outlined" />
            )}
            openOnFocus
            autoHighlight
            fullWidth
            sx={{ mt: "10px" }}
          />
        </Box>
        {selectedCase && (
          <Box>
            <Typography variant="h6" sx={{ mt: "20px" }}>
              Petitioners:
            </Typography>
            {petitioners.map((petitioner, index) => (
              <Typography key={index}>
                Name: {petitioner.first_name} - PhoneNumber:{" "}
                {petitioner.mobile_number} - Email: {petitioner.email}
              </Typography>
            ))}
            <Typography variant="h6" sx={{ mt: "20px" }}>
              Respondents:
            </Typography>
            {respondents.map((respondent, index) => (
              <Typography key={index}>
                Name: {respondent.first_name} - PhoneNumber:{" "}
                {respondent.mobile_number} - Email: {respondent.email}
              </Typography>
            ))}
          </Box>
        )}
        <Box display="flex" gap="20px" mt="10px">
          <Typography variant="body1" sx={{ mt: "20px", ml: "20px" }}>
            Date:
          </Typography>
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Typography variant="body1" sx={{ mt: "20px", ml: "20px" }}>
            Time:
          </Typography>
          <TextField
            type="time"
            variant="outlined"
            fullWidth
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Box>
        <Box mt="10px">
          <TextField
            multiline
            rows={4}
            fullWidth
            id="Note"
            name="Note"
            label="Note"
            variant="outlined"
            sx={{ mt: "20px" }}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Box>
        <Box
          sx={{
            mt: "30px",
            display: "flex",
            justifyContent: "flex-end",
            mb: "50px",
          }}
          gap={2}
        >
          <Button
            type="button"
            variant="contained"
            color="error"
            sx={{ mt: "10px" }}
            onClick={handleBackButtonClick}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            sx={{ mt: "10px" }}
            onClick={handleSaveAppointment}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Appointmentform;
