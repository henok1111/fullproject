import React from "react";
import { useState } from "react";
import { CssBaseline, ThemeProvider, useTheme } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import Sidebar from "./scenes/global/SidebarRegistrar";
import Topbar from "./scenes/global/Topbar";
import { Outlet, Route, Routes } from "react-router-dom"; // Import Outlet from react-router-dom
import InvoiceDashboard from "./scenes/dashboard/invoice_clerk";
import { tokens } from "../theme";
// ... (other imports)
export default function Invoiclerk() {
  const [colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          style={{
            display: "flex",
            backgroundColor: `${colors.blueAccent[900]}`,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Sidebar isSidebar={isSidebar} role="Invoice_Clerk" privateImage="" />
          <div style={{ flexGrow: 1, overflowY: "auto" }}>
            <Topbar setIsSidebar={setIsSidebar} />
            <div
              style={{
                overflowY: "auto",
                height: "calc(100vh - 64px)",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* 64px is the height of the Topbar */}
              <Routes>
                <Route index element={<InvoiceDashboard />} />
              </Routes>
              <Outlet />
            </div>
          </div>
          <style>{`
            ::-webkit-scrollbar {
              display: none;
            }
            -ms-overflow-style: none;
            scrollbar-width: none;
          `}</style>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
