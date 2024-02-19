import React from "react";
import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import Topbar from "./scenes/global/Topbar";
import { Outlet, useParams } from "react-router-dom"; // Import Outlet and useParams
import Sidebar from "./scenes/global/SidebarRegistrar";

export default function Admin() {
  const { userId } = useParams(); // Use useParams to get userId from the route
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ display: "flex" }}>
          <Sidebar
            isSidebar={isSidebar}
            role="admin"
            name="Henok"
            privateImage="./scenes/global/hena.jpg"
            userId={userId} // Pass userId to the Sidebar component
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
