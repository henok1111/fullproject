import {
  Box,
  Typography,
  useTheme,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const columns = [
    { field: "No", headerName: "No", flex: 0.5 },
    {
      field: "Invoice Number",
      headerName: "Invoice No",
      flex: 1.7,
    },
    {
      field: "Client Name",
      headerName: "Client Name",
      flex: 1.5,
    },
    {
      field: "Total",
      headerName: "Total",
      flex: 0.5,
    },
    {
      field: "Paid",
      headerName: "Paid",
      flex: 0.7,
    },
    {
      field: "Due",
      headerName: "Due",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 0.4,
    },
  ];

  const handleaddinvoicesbuttonClick = () => {
    // Navigate to another page (e.g., '/other-page')
    navigate("/registrar/addinvoices");
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="INVOICES" subtitle="" />
      <Box display="flex" justifyContent="flex-end">
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleaddinvoicesbuttonClick}
          startIcon={<AddIcon fontSize="small" />}
          sx={{ justifyContent: "flex-end" }}
        >
          Add Invoices
        </Button>
      </Box>
      <Header title="" subtitle="List of Invoice Balances" />
      <Box display="flex" mt={"3px"}>
        <TextField
          id="search-bar"
          className="text"
          onInput={(e) => {
            setSearchQuery(e.target.value);
          }}
          label="Search by Client Name"
          variant="outlined"
          placeholder="Search..."
          size="small"
          sx={{
            ml: "20px",
            width: "350px",
          }}
        />
        <IconButton type="submit" aria-label="search">
          <SearchIcon style={{ fill: "blue" }} />
        </IconButton>
      </Box>
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
        }}
      >
        <DataGrid checkboxSelection rows={[]} columns={columns} />
      </Box>
    </Box>
  );
};

export default Invoices;
