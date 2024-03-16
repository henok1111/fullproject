import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./adminpage/admin";
import Admins from "./adminpage/judge";
import Adminss from "./adminpage/registrar";
import Form from "./adminpage/scenes/form";
import Team from "./adminpage/scenes/team";
import Contacts from "./adminpage/scenes/contacts";
import Invoices from "./adminpage/scenes/invoices/index";
import Calendar from "./adminpage/scenes/calendar/calendar";
import FAQ from "./adminpage/scenes/faq";
import Bar from "./adminpage/scenes/bar";
import Pie from "./adminpage/scenes/pie";
import Line from "./adminpage/scenes/line";
import Geography from "./adminpage/scenes/geography";
import RegistrarDashboard from "./adminpage/scenes/registrardashboard copy";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import AddInvoices from "./adminpage/scenes/invoices/addinvoices";
import AddClient from "./adminpage/scenes/addclient/addclient";
import Appointmentform from "./adminpage/scenes/Appointment/appointmentform";
import Appointment from "./adminpage/scenes/Appointment";
import Client from "./adminpage/scenes/client";
import AddCase from "./adminpage/scenes/addcase/addcase";
import Caseform from "./adminpage/scenes/form/caseform";
import { GavelRounded, HailRounded, PedalBikeOutlined } from "@mui/icons-material";

const App = () => {
  const [theme, colorMode] = useMode();
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuthenticated(true);
      const role = getUserRoleFromToken(token);
      setUserRole(role);
    }
  }, []);

  const getUserRoleFromToken = (token) => {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.role_name;
  };

  const RedirectToDashboard = () => {
    if (!authenticated) {
      return <Navigate to="/login" />;
    } else {
      switch (userRole) {
        case "Registrar":
          return <Navigate to="/registrar" />;
        case "Admin":
          return <Navigate to="/admin" />;
        case "Judge":
          return <Navigate to="/judge" />;
        default:
          return <Navigate to="/login" />;
      }
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<RedirectToDashboard />} />
            <Route path="/login" element={<Login setAuthenticated={setAuthenticated} setUserRole={setUserRole} />} />
            {authenticated && (
              <>
                {userRole === "Registrar" && (
                  <Route path="/registrar/*" element={<RegistrarRoutes />} />
                )}
                {userRole === "Judge" && (
                  <Route path="/judge/*" element={<JudgeRoutes />} />
                )}
                {userRole === "Admin" && (
                  <Route path="/admin/*" element={<AdminRoutes />} />
                )}
              </>
            )}

           
            <Route path="*" element={<p color="black">Page Not Found</p>} />
            <Route path="/unauthorized" element={<p color="black">Unauthorized</p>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

const RegistrarRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Adminss />}>
        <Route path="/caseform" element={<Caseform />} />
        <Route path="/addinvoices" element={<AddInvoices />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/form" element={<Form />} />
        <Route path="/addcase" element={<AddCase />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/pie" element={<Pie />} />
        <Route path="/geography" element={<Geography />} />
        <Route path="/bar" element={<Bar />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/addclient" element={<AddClient />} />
        <Route path="/client" element={<Client />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/appointmentform" element={<Appointmentform />} />
       
      </Route>
    </Routes>
  );
};

const JudgeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Admins />}>
        <Route
          index
          element={
            <RegistrarDashboard
              showRecentTransactions={true}
              showCampaign={true}
              showCalendar={true}
              statBoxes={[
                {
                  title: "431,225",
                  subtitle: "Total Case",
                  progress: "0.50",
                  increase: "+21%",
                  icon: <GavelRounded />,
                },
                {
                  title: "Your Title",
                  subtitle: "Your Subtitle",
                  progress: "0.75",
                  increase: "+15%",
                  icon: <HailRounded />,
                },
                {
                  title: "Fuck",
                  subtitle: "Henok",
                  progress: "0.75",
                  increase: "+15%",
                  icon: <PedalBikeOutlined />,
                },
                // Add more objects as needed
              ]}
            />
          }
        />
        <Route path="team" element={<Team />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="form" element={<Form />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="pie" element={<Pie />} />
        <Route path="geography" element={<Geography />} />
      </Route>
    </Routes>
  );
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Admin />}>
        <Route path="team" element={<Team />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="form" element={<Form />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="bar" element={<Bar />} />
        <Route path="pie" element={<Pie />} />
        <Route path="line" element={<Line />} />
        <Route path="geography" element={<Geography />} />
        <Route path="addcase" element={<AddCase />} />
      </Route>
    </Routes>
  );
};

export default App;
