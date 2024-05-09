import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Dialog, DialogContent } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import UploadProscutorDocumentPage from "./index";
import { useTheme } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";

const ProscutoreDocuments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [documents, setDocuments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []); // Fetch documents when the component mounts

  const fetchDocuments = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const prosecutorId = decodedToken.userId; // Get the userId from the decoded JWT token

      const response = await fetch(
        "http://localhost:8081/api/fetchproscutorcases",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prosecutorId }), // Send the prosecutorId to the backend server
        }
      );

      const data = await response.json();
      console.log("data", data);
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleDeleteClick = async (row) => {
    try {
      console.log("Deleting document with ID:", row.id);

      const response = await fetch(
        "http://localhost:8081/api/deleteproscutordocument",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ documentId: row.id }),
        }
      );

      if (response.ok) {
        // Document deleted successfully
        console.log("Document deleted successfully");
        // Refresh documents after deletion
        fetchDocuments();
      } else {
        // Error deleting document
        console.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleNavigateClick = () => {
    setOpenDialog(true); // Open the dialog when the button is clicked
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
    fetchDocuments();
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      field: "file_path",
      headerName: "File Path",
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 0.8,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {/* Disable the delete button if status is 'approved' */}
          {params.row.status === "pending" ? (
            <Button
              variant="outlined"
              onClick={() => handleDeleteClick(params.row)}
              color="error"
            >
              Delete
            </Button>
          ) : (
            <Button variant="outlined" disabled color="error">
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Typography color={colors.greenAccent[500]} variant="h2">
        Proscutore Documents
      </Typography>
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
          "& .date-time-cell": {
            color: "blue", // Change the color to blue
            fontWeight: "bold", // Add additional styles as needed
          },
        }}
      >
        {" "}
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleNavigateClick}
          >
            Add Case Document
          </Button>
        </Box>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogContent style={{ backgroundColor: colors.blueAccent[900] }}>
            {/* Your profile editing form component */}
            <UploadProscutorDocumentPage />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="text" color="error" onClick={handleCloseDialog}>
                Cancel
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
        <DataGrid
          rows={documents}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default ProscutoreDocuments;
