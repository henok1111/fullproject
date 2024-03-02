// Import statements...
import React, { useState, useEffect, useRef } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import axios from "axios";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GavelIcon from "@mui/icons-material/Gavel";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ role, name, userId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [firstName, setFirstName] = useState(name);
  const [profilePicture, setProfilePicture] = useState(null);
  const fileInputRef = useRef(null);

  const handleChoosePicture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];

    // Assuming you are storing the file in the state
    setProfilePicture(file);

    // If you are storing the file URL directly, use something like:
    // setProfilePicture(URL.createObjectURL(file));
  };

  const handleChange = async () => {
    try {
      // Check if userId and profilePicture are defined
      if (userId === undefined || profilePicture === null) {
        throw new Error("userId and profilePicture must be defined");
      }

      // You can now use the FormData API to send the file to the server
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);

      // Add other user data to the form data if needed
      formData.append("id", userId);
      // ...

      // Make API call to update user profile
      const response = await axios.post(
        "http://localhost:8081/api/upload",
        formData
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error updating user profile:", error.message);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Retrieve the first name from local storage
        const storedFirstName = localStorage.getItem("accesstoken");

        if (storedFirstName) {
          // Display the stored first name
          setFirstName(storedFirstName);
        } else {
          // If the first name is not found in local storage, fetch it from the server
          const response = await fetch(`/api/userDetails/${userId}`);

          if (!response.ok) {
            throw new Error(
              `Error fetching user details: ${response.status} ${response.statusText}`
            );
          }

          if (
            response.headers.get("content-type").includes("application/json")
          ) {
            const data = await response.json();
            setFirstName(data.firstName);
          } else {
            console.warn("Received a non-JSON response. Using default values.");
            setFirstName("Default Name");
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        setFirstName("Error Fetching User Details");
      }
    };

    fetchUserDetails();
  }, [userId]); // Include userId in the dependency array if you're using it inside the useEffect

  // Define different items for admin, judge, and registrar
  const sidebarItems = {
    admin: [
      { title: "Dashboard", to: "", icon: <HomeOutlinedIcon /> },
      { title: "Manage Team", to: "team", icon: <PeopleOutlinedIcon /> },
      { title: "Profile Form", to: "form", icon: <PersonOutlinedIcon /> },
      {
        title: "Contact Information",
        to: "contacts",
        icon: <ContactsOutlinedIcon />,
      },
    ],
    judge: [
      { title: "Dashboard", to: "", icon: <HomeOutlinedIcon /> },
      {
        title: "Contact Information",
        to: "contacts",
        icon: <ContactsOutlinedIcon />,
      },
      {
        title: "Calendar",
        to: "calendar",
        icon: <CalendarTodayOutlinedIcon />,
      },
    ],
    registrar: [
      { title: "Dashboard", to: "", icon: <HomeOutlinedIcon /> },
      { title: "Manage Team", to: "team", icon: <PeopleOutlinedIcon /> },
      { title: "Profile Form", to: "form", icon: <PersonOutlinedIcon /> },
      { title: "Case Management", to: "addcase", icon: <GavelIcon /> },
      {
        title: "Client Management",
        to: "client",
        icon: <PersonOutlinedIcon />,
      },
      {
        title: "Appointment",
        to: "appointment",
        icon: <ReceiptOutlinedIcon />,
      },
      {
        title: "Invoices Balances",
        to: "invoices",
        icon: <ReceiptOutlinedIcon />,
      },
      {
        title: "Contact Information",
        to: "contacts",
        icon: <ContactsOutlinedIcon />,
      },
      {
        title: "Calendar",
        to: "calendar",
        icon: <CalendarTodayOutlinedIcon />,
      },
    ],
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  {role.toUpperCase()}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="0px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleChange}
                />
                <label htmlFor="fileInput">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={imagePath}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                    onClick={handleChoosePicture}
                  />
                </label>
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {firstName}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {role === "admin" ? "Administrator" : ""}
                  {role === "judge" ? "Judge" : ""}
                  {role === "registrar" ? "Registrar" : ""}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {sidebarItems[role].map((item, index) => (
              <Item
                key={index}
                title={item.title}
                to={item.to}
                icon={item.icon}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
