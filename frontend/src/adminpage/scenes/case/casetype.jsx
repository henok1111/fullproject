import React, { useEffect } from "react";
import Header from "../../components/Header";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import * as Yup from "yup";

const Casetype = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);
  const [opencasetype, setOpencasetype] = useState(false);
  const [opencasesubtype, setOpencasesubtype] = useState(false);
  const [casetype, setCasetype] = useState("");
  const [CaseType, setCaseType] = useState("");
  const [casetypeerror, setcasetypeerror] = useState(false);
  const [casesubtype, setCasesubtype] = useState("");
  const [casesubtypeerror, setcasesubtypeerror] = useState(false);
  const [CaseTypes, setCaseTypes] = useState([]);

  const columns = [
    { field: "id", headerName: "Number", flex: 0.5 },
    { field: "caseType", headerName: "Case Type", flex: 2.3 },
    { field: "caseSubType", headerName: "Case Sub Types", flex: 2 },
    { field: "Action", headerName: "Action", flex: 0.4 },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleaddcasetypebuttonClick = () => {
    console.log("Adding case type button clicked");
    setOpencasetype(true);
  };

  const handleaddcasesubtypebuttonClick = () => {
    console.log("Adding case subtype button clicked");
    setOpencasesubtype(true);
  };

  const handleclosecasetype = () => {
    console.log("Closing case type modal");
    // Reset the state variables related to case type modal
    setCasetype("");
    setcasetypeerror(false);
    setOpencasetype(false);
  };

  const handleclosecasesubtype = () => {
    console.log("Closing case subtype modal");
    // Reset the state variables related to case subtype modal
    setCasesubtype("");
    setcasesubtypeerror(false);
    setValue(null);
    setInputValue("");
    setOpencasesubtype(false);
  };

  const validationSchema = Yup.object().shape({
    casetype: Yup.string().required("Case type Name is required"),
  });

  const subtypeValidationSchema = Yup.object().shape({
    casesubtype: Yup.string().required("Case subtype Name is required"),
  });

  const handleSave = () => {
    console.log("Saving case type");
    // Validate form fields
    validationSchema
      .validate({ casetype }, { abortEarly: false })
      .then(() => {
        // If validation succeeds, proceed with saving
        console.log("Validation successful. Sending request...");
        axios
          .post("http://localhost:8081/api/addcasetype", {
            case_type_name: casetype,
          })
          .then((response) => {
            console.log("Case type saved successfully");
            handleclosecasetype();
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error saving case type:", error);
          });
      })
      .catch((error) => {
        // If validation fails, set error states for invalid fields
        console.log("Validation failed:", error);
        const validationErrors = {};
        error.inner.forEach((fieldError) => {
          validationErrors[fieldError.path] = fieldError.message;
        });
        setcasetypeerror(validationErrors.casetype || false);
      });
  };

  useEffect(() => {
    // Fetch case types from backend when component mounts
    console.log("Fetching case types...");
    axios
      .get("http://localhost:8081/api/getCaseType")
      .then((response) => {
        console.log("Case types fetched successfully:", response.data);
        setCaseType(response.data);
      })
      .catch((error) => {
        console.error("Error fetching case types:", error);
      });
  }, []);

  const handSubTypeSave = () => {
    console.log("Saving case subtype");
    // Validate form fields
    subtypeValidationSchema
      .validate({ casesubtype }, { abortEarly: false })
      .then(() => {  
        // If validation succeeds, proceed with saving
        console.log("Validation successful. Sending request...");
        axios
          .post("http://localhost:8081/api/addcasesubtype", {
            case_type: value.case_type,
            sub_type_name: casesubtype,
          })
          
          .then((response) => {
            console.log("Case subtype saved successfully",);
            handleclosecasesubtype();
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error saving case subtype:", error);
          });
      })
      .catch((error) => {
        // If validation fails, set error states for invalid fields
        console.log("Validation failed:", error);
        const validationErrors = {};
        error.inner.forEach((fieldError) => {
          validationErrors[fieldError.path] = fieldError.message;
        });
        setcasesubtypeerror(validationErrors.casesubtype || false);
      });
  };
  

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/getCaseTypeGrid")
      .then((response) => {
        console.log("Case types fetched successfully:", response.data);
        setCaseTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching case types:", error);
      });
  }, []);

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Case Type" subtitle="" />
      <Box gap={2} display="flex" justifyContent="flex-end" mt="20px">
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleaddcasetypebuttonClick}
          startIcon={<AddIcon fontSize="small" />}
        >
          Add Case type
        </Button>
        <Modal
          open={opencasetype}
          onClose={handleclosecasetype}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box mt="10px" sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Case Type
            </Typography>
            <TextField
              mt="10px"
              required
              label="Enter Case Type"
              value={casetype}
              onChange={(e) => {
                setCasetype(e.target.value);
                setcasetypeerror(false);
              }}
              error={casetypeerror}
              helperText={casetypeerror ? "Case Type is required" : ""}
              fullWidth
            />
            <Box gap="5px" display="flex" justifyContent="end" mt="20px">
              <Button
                color="error"
                variant="outlined"
                onClick={handleclosecasetype}
                startIcon={<ClearIcon fontSize="small" />}
              >
                Cancel
              </Button>
              <Button
                color="success"
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Modal>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleaddcasesubtypebuttonClick}
          startIcon={<AddIcon fontSize="small" />}
        >
          Add Case Sub type
        </Button>
        <Modal
          open={opencasesubtype}
          onClose={handleclosecasesubtype}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Case Sub Type
            </Typography>
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
                options={CaseType}
                getOptionLabel={(option) => option.case_type}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Case Type"
                    variant="outlined"
                  />
                )}
                openOnFocus
                autoHighlight
                sx={{ mt: "10px" }}
              />
            </Box>
            <Box mt="10px">
              <TextField
                value={casesubtype}
                required
                label="Enter Case Sub Type"
                onChange={(e) => {
                  setCasesubtype(e.target.value);
                  setcasesubtypeerror(false);
                }}
                error={casesubtypeerror}
                helperText={casesubtypeerror ? "Case Type is required" : ""}
                fullWidth
              />
            </Box>
            <Box gap="5px" display="flex" justifyContent="end" mt="20px">
              <Button
                color="error"
                variant="outlined"
                onClick={handleclosecasesubtype}
                startIcon={<ClearIcon />}
              >
                Cancel
              </Button>
              <Button
                color="success"
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={handSubTypeSave}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
      <Box
        sx={{ mt: "10px" }}
        padding="5px"
        backgroundColor={colors.blueAccent[900]}
      >
        <Box
          m="40px 0 0 0"
          height="115vh"
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
            rows={CaseTypes.flatMap((caseType, index) => {
              const subtypes = caseType.subtypes
                .map((subtype) => subtype.name)
                .join(", ");
              return [
                {
                  id: index + 1,
                  caseType: caseType.name,
                  caseSubType: subtypes,
                  Action: "", // Add an empty string for the Action column
                },
              ];
            })}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Casetype;
