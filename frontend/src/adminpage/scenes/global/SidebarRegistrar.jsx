import React, { useState, useEffect, useRef } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Icon, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GavelIcon from "@mui/icons-material/Gavel";
import { jwtDecode } from "jwt-decode";
import henok from "./image.png";

const Item = ({ title, to, icon, selected, setSelected, subItems }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openSubMenu, setOpenSubMenu] = useState(false);

  const handleSubMenuClick = () => {
    setOpenSubMenu(!openSubMenu);
  };

  return (
    <>
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
        }}
        onClick={subItems ? handleSubMenuClick : () => setSelected(title)}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
      {subItems && openSubMenu && (
        <Menu iconShape="round">
          {subItems.map((subItem, index) => (
            <MenuItem
              key={index}
              active={selected === subItem.title}
              icon={subItem.icon}
              style={{
                color: colors.grey[100],
                border: "3px solid",
                marginLeft: "30px",
                marginRight: "30px",
                borderTop: "transparent",
                borderRight: "transparent",
                padding: "0px",
                marginBottom: ".6rem",
                borderRadius: "8px",
                borderColor: colors.greenAccent[600],
              }}
              onClick={() => setSelected(subItem.title)}
            >
              <Typography>{subItem.title}</Typography>
              <Link to={subItem.to} />
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

const Sidebar = ({ role, name, userId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [firstName, setFirstName] = useState(name);
  const fileInputRef = useRef(null);

  const fetchUserImage = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.userId;

      // Make an API request to fetch the user image path
      const response = await fetch(`http://localhost:8081/api/getUserImage/${userId}`);
      const data = await response.json();
      const { imagePath } = data;

      // Update the state with the fetched image path
      setImagePath(imagePath);
      console.log(imagePath);
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
  };

  useEffect(() => {
    // Call the function to fetch user image path when the component mounts
    fetchUserImage();
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        // Retrieve the user ID from the decoded token
        const accessToken = localStorage.getItem("accessToken");
        const decodedToken = jwtDecode(accessToken);
        const userId = decodedToken.userId;

        // Append the user ID to the FormData object
        formData.append("userId", userId);

        // Make a POST request to upload the file to the server
        const response = await fetch("http://localhost:8081/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        // Update the imagePath state variable synchronously
        setImagePath(data.filePath);

        // Fetch user image automatically after selecting a new image
        fetchUserImage(); // Call fetchUserImage function here

        // Display the selected image automatically
        const reader = new FileReader();
        reader.onload = () => {
          setImagePath(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Retrieve the access token from local storage
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
          // Decode the token to get the user details
          const decodedToken = jwtDecode(accessToken);

          // Extract the first_name from the decoded token
          const userFirstName = decodedToken.name;

          // Set the first_name state with the extracted value
          setFirstName(userFirstName);
        } else {
          console.warn("Access token not found in local storage");
          setFirstName("Default Name");
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        setFirstName("Error Fetching User Details");
      }
    };

    fetchUserDetails();
  }, []);

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
    registrar : [
      { title: "Dashboard", to: "", icon: <HomeOutlinedIcon /> },
      { title: "Manage Team", to: "team", icon: <PeopleOutlinedIcon /> },
      { title: "Profile Form", to: "form", icon: <PersonOutlinedIcon /> },
      {
        title: "Case Management",
        icon: <GavelIcon />,
        subItems: [
          { title: "View Cases", to: "/registrar/addcase", icon: <PersonOutlinedIcon /> },
          { title: "Add Case", to: "/registrar/caseform", icon: <PersonOutlinedIcon /> },
        ]
      },
      {
        title: "Client Management",
        icon: <PersonOutlinedIcon />,
        subItems: [
          { title: "View Client", to: "/registrar/viewclient", icon: <PersonOutlinedIcon /> },
          { title: "View Advocator", to: "/registrar/viewadvocator", icon: <PersonOutlinedIcon /> },
          { title: "Add Client", to: "/registrar/addclient", icon: <PersonOutlinedIcon /> },
          { title: "Add Advocator", to: "/registrar/addadvocator", icon: <PersonOutlinedIcon /> },
        ]
      },
      {
        title: "Appointment",
        to: "appointment",
        icon: <ReceiptOutlinedIcon />,
      },
      {
        title: "Income",
        icon: <PersonOutlinedIcon />,
        subItems: [
          { title: "Invoices", to: "invoices", icon: <ReceiptOutlinedIcon /> },
          { title: "Services", to: "services", icon: <ReceiptOutlinedIcon /> },
        ],
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
      {
        title: "Settings",
        icon: <PersonOutlinedIcon />,
        subItems: [
          { title: "Case Type", to: "casetype", icon: <PersonOutlinedIcon/> },
        ],
      },
    ]
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          color: `${colors.primary[900]}!important`,
          borderRight: "none"
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 20px 5px 20px !important",
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
                  onChange={handleImageChange}
                />
                <label htmlFor="fileInput">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`http://localhost:8081/${imagePath}`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                    onClick={handleImageClick}
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
                subItems={item.subItems} // Pass subItems to the Item component
              />
            ))}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
