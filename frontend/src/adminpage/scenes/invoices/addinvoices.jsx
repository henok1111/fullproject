import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Popper,
  Fade,
  Select,
  MenuItem,
  IconButton,
  ClickAwayListener,
  MenuList,
} from "@mui/material";
import Header from "../../components/Header";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { tokens } from "../../../theme"; // Ensure this import is correct
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import SaveIcon from "@mui/icons-material/Save";

function generateInvoiceNumberGenerator() {
  let counter = 1;

  return function () {
    const invoiceNumber = `INV-${counter++}`;
    return invoiceNumber;
  };
}

const AddInvoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const generateInvoiceNumber = generateInvoiceNumberGenerator();
  const [invoiceRows, setInvoiceRows] = useState([
    {
      service: "",
      description: "",
      qty: 0,
      rate: 0,
    },
  ]);

  const handleAddMore = () => {
    setInvoiceRows((prevRows) => [
      ...prevRows,
      {
        service: "",
        description: "",
        qty: 0,
        rate: 0,
      },
    ]);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleActionClick = (event, index) => {
    if (anchorEl && index === selectedRow) {
      // Clicked again on the same row, close the Popper
      setAnchorEl(null);
    } else {
      // Clicked on a different row or the Popper is not open, open the Popper
      setSelectedRow(index);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleEdit = () => {
    // Add your edit logic here
    setAnchorEl(null);
  };

  const handleRemove = () => {
    setInvoiceRows((prevRows) =>
      prevRows.filter((row, index) => index !== selectedRow)
    );
    setAnchorEl(null);
  };

  const handleClosePopper = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handlebackbuttonClick = () => {
    // Navigate to another page (e.g., '/other-page')
    navigate("/registrar/invoices");
  };
  const services = ["Service A", "Service B", "Service C"];

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;`
  );

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Box display="flex" justifyContent="flex-end">
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
      <Header
        title="Add Invoices"
        subtitle=""
        color={colors.greenAccent[500]}
      />
      <Box  sx={{ backgroundColor: `${colors.primary[400]}80` }} margin="20px" padding="30px" borderRadius="15px">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Invoice Number"
              variant="outlined"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6} display="grid" justifyContent="flex-end">
            <Box
              mt={2}
              sx={{ display: "flex", alignItems: "center", mt: "10px" }}
            >
              <InputLabel sx={{ width: "150px", marginRight: "5px" }}>
                <Typography>Invoice Number:</Typography>
              </InputLabel>
              <TextField
                name="InvoiceDueDate"
                variant="standard"
                value={generateInvoiceNumber()}
                disabled
              />
            </Box>
            <Box
              mt={2}
              sx={{ display: "flex", alignItems: "center", mt: "10px" }}
            >
              <InputLabel sx={{ width: "150px", marginRight: "5px" }}>
                <Typography>Invoice Date:</Typography>
              </InputLabel>
              <TextField
                name="InvoiceDate"
                type="date"
                sx={{ width: "180px" }}
              />
            </Box>
            <Box
              mt={2}
              sx={{ display: "flex", alignItems: "center", mt: "10px" }}
            >
              <InputLabel sx={{ width: "150px", marginRight: "5px" }}>
                <Typography>Invoice Due Date:</Typography>
              </InputLabel>
              <TextField
                name="InvoiceDate"
                type="date"
                sx={{ width: "180px" }}
              />
            </Box>
          </Grid>
        </Grid>
        <Box mt={4}>
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: `${colors.primary[400]}80` }} >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "300px" }}>Services</TableCell>
                  <TableCell sx={{ width: "300px" }}>Description</TableCell>
                  <TableCell required>QTY</TableCell>
                  <TableCell required>Rate</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select fullWidth value={row.service}>
                        {services.map((service) => (
                          <MenuItem key={service} value={service}>
                            {service}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextField fullWidth multiline value={row.description} />
                    </TableCell>
                    <TableCell>
                      <TextField type="number" value={row.qty} />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={row.rate}
                        InputProps={{
                          endAdornment: <span>&nbsp;%</span>,
                        }}
                        disabled
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={`${row.qty * row.rate} `}
                        InputProps={{
                          readOnly: true,
                          endAdornment: <span>&nbsp;Birr</span>,
                        }}
                        disabled
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleActionClick(event, index)}
                      >
                        <MoreVertOutlinedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={2} display="flex">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddMore}
            >
              Add More
            </Button>
          </Box>
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            placement="bottom"
            transition
            onClose={handleClosePopper}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <ClickAwayListener onClickAway={handleClosePopper}>
                    <MenuList>
                      <MenuItem onClick={handleEdit}>Edit</MenuItem>
                      <MenuItem onClick={handleRemove}>Remove</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Fade>
            )}
          </Popper>
          <Box mt={2} sx={{ display: "flex", mt: "40px" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Textarea
                  aria-label="Note"
                  placeholder="Note"
                  minRows="5"
                  sx={{
                    width: "100%",
                    backgroundColor: `${colors.primary[400]}`,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <Typography color={colors.greenAccent[500]} variant="h5">
                  Sub Total:
                </Typography>
                <TextField
                  label="Select Tax"
                  select
                  variant="outlined"
                  sx={{ width: "300px", mt: "7px" }}
                />
                <Box display="flex" alignItems="center" mt={2}>
                  <InputLabel sx={{ width: "150px", marginRight: "5px" }}>
                    <Typography>Invoice Number:</Typography>
                  </InputLabel>
                  <TextField name="Total" sx={{ width: "350px" }} disabled />
                </Box>
              </Grid>
            </Grid>
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
              size="large"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              color="success"
              size="large"
              sx={{ mt: "10px", ml: "10px" }}
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddInvoices;
