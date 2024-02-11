import React, { useContext } from "react";
import { Link } from "react-router-dom";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import {
  AppBar,
  Toolbar,
  useTheme,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import Logo from "../image/Logo/logo.png";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};
  const colorMode = useContext(ColorModeContext);

  const buttonStyle = {
    textTransform: "none",
    marginLeft: "5px",
    color: colors.blueAccent && colors.grey[100] ? colors.grey[100] : "#fff",
    "&:hover": {
      color:
        colors.secondary && colors.secondary[300]
          ? colors.secondary[300]
          : colors.primary[100],
    },
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: colors.primary[700],
        height: "75px",
        paddingBottom: "5px",
        paddingTop: "10px",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left side */}
        <Box display="flex" alignItems="center">
          <img
            src={Logo}
            alt="Logo"
            width="50"
            height="50"
            style={{ marginRight: "5px", borderRadius: "50%" }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: colors.primary && colors.grey[100],
              fontSize: "1.8rem",
              fontFamily: '"Trirong", serif',
              fontWeight: 700,
            }}
          >
            Court Information System
          </Typography>
        </Box>

        {/* Right side */}
        <Box display="flex" alignItems="center">
          <Button component={Link} to="/" sx={{ ...buttonStyle }}>
            <HomeRoundedIcon sx={{ fontSize: 30 }} />
            Home
          </Button>

          <Button component={Link} to="/about" sx={{ ...buttonStyle }}>
            <Groups2RoundedIcon sx={{ fontSize: 30 }} />
            About Us
          </Button>

          <Button component={Link} to="/login" sx={{ ...buttonStyle }}>
            <LoginRoundedIcon sx={{ fontSize: 30 }} />
            Login
          </Button>
          <Button
            onClick={colorMode.toggleColorMode}
            sx={{ ...buttonStyle, marginRight: "10px" }}
          >
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
