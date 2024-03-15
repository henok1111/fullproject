import Header from "../../components/Header";
import { useState } from "react";
import { tokens } from "../../../theme";
import { Autocomplete, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

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
const Appointmentform = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handlebackbuttonClick = () => {
    // Navigate to another page (e.g., '/other-page')
    navigate("/registrar/appointment");
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]} mb="10px">
      <Box display="flex" justifyContent="end" mt="10px">
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
      <Header title="Add Appointment" subtitle="Appointment Form" />
      <Box
        sx={{ backgroundColor: `${colors.primary[400]}80` }}
        margin="20px"
        padding="30px"
        borderRadius="15px"
      >
        <Box>
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
        </Box>
        <Box display="flex" gap="20px" mt="10px">
          <TextField label="Mobile No" variant="outlined" fullWidth />
          <Typography variant="body1" sx={{ mt: "20px", ml: "20px" }}>
            Date:
          </Typography>
          <TextField type="date" variant="outlined" fullWidth />
          <Typography variant="body1" sx={{ mt: "20px", ml: "20px" }}>
            Time:
          </Typography>
          <TextField type="time" variant="outlined" fullWidth />
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
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="contained"
            color="success"
            sx={{ mt: "10px" }}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Appointmentform;
