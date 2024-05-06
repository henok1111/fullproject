import React, { useState, useContext } from "react";
import { Box, IconButton, useTheme, Menu, MenuItem, ListItemIcon, Dialog, DialogContent, Button } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { ColorModeContext, tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import ViewProfilePages from "../profile/profile";

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const handleclickprofilebutton = () => {
    setOpenDialog(true);
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "settings-popover" : undefined;

  return (
    <Box
      display="flex"
      justifyContent="end"
      p={2}
      backgroundColor={colors.blueAccent[900]}
    >
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleSettingsClick}>
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
        >
          <MenuItem onClick={handleclickprofilebutton} variant="outlines">
            <ListItemIcon>
              <PersonOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem variant="outlines" onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
      {/* Profile Dialog */}
         {/* Edit Profile Dialog */}
         <Dialog open={openDialog} onClose={handleCloseDialog}>
  <DialogContent style={{ backgroundColor: colors.blueAccent[900] }}>
    {/* Your profile editing form component */}
    <ViewProfilePages />
    <Box display="flex" justifyContent="flex-end" mt={2}>
      <Button variant="text" color="error" onClick={handleCloseDialog}>
        Cancel
      </Button>
    </Box>
  </DialogContent>
</Dialog>

    </Box>
  );
};

export default Topbar;
