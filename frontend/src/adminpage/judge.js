import React from "react";
import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import Sidebar from "./scenes/global/SidebarRegistrar";
import Topbar from "./scenes/global/Topbar";
import { Outlet } from "react-router-dom"; // Import Outlet from react-router-dom
import { useEffect } from "react";

// ... (other imports)

export default function Admins({ userId }) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/userDetails/:userId");

        if (!response.ok) {
          console.log("object not found");
          throw new Error(
            `Error fetching user details: ${response.status} ${response.statusText}`
          );
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setName(data.firstName);
        } else {
          throw new Error("Invalid response format. Expected JSON.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        // Handle the error here, e.g., set default values or show an error message
        setName("Error fetching data");
      }
    };

    fetchUserDetails();
  }, [userId]);

  const [firstName, setName] = useState("Loading...");

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ display: "flex" }}>
          <Sidebar
            isSidebar={isSidebar}
            role="judge"
            name={firstName}
            privateImage=""
          />
          <div style={{ flexGrow: 1, overflow: "hidden" }}>
            <Topbar setIsSidebar={setIsSidebar} />
            {/* Nested content will be rendered here */}
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
