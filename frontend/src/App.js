import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/About";
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
import Dashboard from "./adminpage/scenes/dashboard";
import RegistrarDashboard from "./adminpage/scenes/registrardashboard copy";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import AddInvoices from "./adminpage/scenes/invoices/addinvoices";
import AddClient from "./adminpage/scenes/addclient/addclient";
<<<<<<< HEAD
import { GavelOutlined, HomeMaxOutlined, PendingActionsRounded } from "@mui/icons-material";
=======
import Client from "./adminpage/scenes/client";
import Appointment from "./adminpage/scenes/Appointment";
import Appointmentform from "./adminpage/scenes/Appointment/appointmentform";
import {
  GavelOutlined,
  HomeMaxOutlined,
  PendingActionsRounded,
} from "@mui/icons-material";
>>>>>>> ced5f3e27a65fafc02b26895ef4d66b471a2328a
import AddCase from "./adminpage/scenes/addcase/addcase";
import Caseform from "./adminpage/scenes/form/caseform";

const App = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />

            {/* Routes for /judge/:userId */}
            <Route path="/judge/:userId/*" element={<Admins />}>
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
                        icon: <GavelOutlined />,
                      },
                      {
                        title: "Your Title",
                        subtitle: "Your Subtitle",
                        progress: "0.75",
                        increase: "+15%",
                        icon: <HomeMaxOutlined />,
                      },
                      {
                        title: "Henok",
                        subtitle: "Basazn",
                        progress: "0.75",
                        increase: "+15%",
                        icon: <PendingActionsRounded />,
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

            {/* Routes for /registrar/:userId */}
            <Route path="/registrar/:userId/*" element={<Adminss />}>
              <Route path="caseform" element={<Caseform />} />
              <Route path="addinvoices" element={<AddInvoices />} />
              <Route index element={<Dashboard />} />
              <Route path="team" element={<Team />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="form" element={<Form />} />
              <Route path="addcase" element={<AddCase />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="pie" element={<Pie />} />
              <Route path="geography" element={<Geography />} />
              <Route path="bar" element={<Bar />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="addclient" element={<AddClient />} />
              <Route path="client" element={<Client />} />
              <Route path="appointment" element={<Appointment />} />
              <Route path="appointmentform" element={<Appointmentform />} />
            </Route>

            {/* Routes for /admin/:userId */}
            <Route path="/admin/:userId/*" element={<Admin />}>
              <Route index element={<Dashboard />} />
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
              {/* Add other routes for /admin/:userId as needed */}
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
