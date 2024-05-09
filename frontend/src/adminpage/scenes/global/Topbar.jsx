import {
  Box,
  IconButton,
  useTheme,
  Badge,
  Button,
  Popover,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { io } from "socket.io-client";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import ViewProfilePages from "../profile/profile";

const getUSerID = (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  return decodedToken.userId;
};

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [socket, setSocket] = useState(null); // State to hold the socket object
  const token = localStorage.getItem("accessToken");
  const userId = getUSerID(token);
  const [openDialog, setOpenDialog] = useState(false);

  const getUserRoleFromToken = (token) => {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.role_name;
  };

  const role_name = getUserRoleFromToken(token);
  const role = role_name.toLowerCase();

  useEffect(() => {
    // Establish socket connection when the component mounts
    const socket = io.connect("http://localhost:3001");
    setSocket(socket);

    // Join the user to the socket room
    socket.emit("join_room", userId);

    // Listen for notifications
    socket.on("receive_notification", (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
      setUnreadCount((prevCount) => prevCount + 1);
    });

    // Disconnect the socket when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId]);

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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleCloseNotificationPopover = () => {
    setAnchorEl2(null);
  };

  const handleNotificationClick = (event) => {
    setAnchorEl2(event.currentTarget);
    setUnreadCount(0); // Mark all notifications as read when opening the popover
  };

  const handleMarkAllAsRead = () => {
    setNotifications([]);
    setAnchorEl(null);
    window.location.reload();
  };

  const open = Boolean(anchorEl);
  const openNotification = Boolean(anchorEl2);
  const id = open ? "settings-popover" : undefined;

  return (
    <Box
      display="flex"
      justifyContent="end"
      p={2}
      backgroundColor={colors.blueAccent[900]}
    >
      {" "}
      <div id="google_translate_element"></div>
      {/* SEARCH BAR */}
      <Box display="flex" alignItems={"flex-start"} borderRadius="3px">
        {/* Search bar content */}
      </Box>
      {/* ICONS */}
      <Box display="flex">
        {/* Dark/Light mode toggle */}
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        {/* Notifications icon */}
        <IconButton onClick={handleNotificationClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        {/* Notification popover */}
        <Popover
          open={openNotification}
          anchorEl={anchorEl2}
          onClose={handleCloseNotificationPopover}
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
              borderRadius: "10px", // Rounded corners
            },
          }}
        >
          {/* Notification content */}
          <Box p={2}>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  color="textPrimary" // Use primary text color
                  sx={{
                    marginBottom: index === notifications.length - 1 ? 0 : 1,
                  }} // No margin bottom for the last item
                >
                  {notification}
                </Typography>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                {" "}
                {/* Use secondary text color */}
                No new notifications
              </Typography>
            )}
            {/* Mark all as read button */}
            {notifications.length > 0 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleMarkAllAsRead}
              >
                Mark All as Read
              </Button>
            )}
          </Box>
        </Popover>

        {/* User profile icon */}
        <IconButton onClick={handleSettingsClick}>
          <PersonOutlinedIcon />
        </IconButton>
        {/* User profile menu */}
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
              borderRadius: "10px", // Rounded corners
            },
          }}
        >
          {/* Menu items */}
          <Box p={1}>
            <MenuItem onClick={handleclickprofilebutton} variant="outlines">
              <ListItemIcon>
                <PersonOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
          </Box>
          <Box p={1}>
            <MenuItem variant="outlines" onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Box>
        </Menu>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent style={{ backgroundColor: colors.blueAccent[900] }}>
          {/* Your profile editing form component */}
          <ViewProfilePages />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              color="error"
              variant="outlined"
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Topbar;
