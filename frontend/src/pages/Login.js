import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import Clock from "../components/clock";
import { CssBaseline, ThemeProvider, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import Ap from "../image/court/ff.png";

// Function to extract user role from the token
const getUserRoleFromToken = (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  return decodedToken.role_name;
};

// Function to extract user status from the token
const getUserStatusFromToken = (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  return decodedToken.status;
};

const Logo = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <img
      src={Ap}
      alt="Logo"
      style={{
        width: "299px",
        height: "167px",
        marginBottom: "10px",
        borderRadius: "5px",
      }}
    />
    <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h1>
  </div>
);

const LoginForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};
  const colorMode = useContext(ColorModeContext);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "85vh",
      marginTop: "0px",
      backgroundColor: colors.primary ? colors.primary[700] : "#000",
    },
    form: {
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "400px",
      width: "100%",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: colors.primary ? colors.blueAccent[900] : "#000",
      color: colors.primary[100],
      marginLeft: "30%",
    },
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 4;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const logTokenInfo = () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      console.log("Token:", token);

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded Token:", decodedToken);
    } else {
      console.log("Token not found in localStorage");
    }
  };

  const handleLogin = async (e) => {
    try {
      setLoading(true); // Set loading to true when login starts

      const response = await axios.post(
        "http://localhost:8081/api/login",
        formData
      );

      const accessToken = response.data.token;
      localStorage.setItem("accessToken", accessToken);

      // Call the function to log token information
      logTokenInfo();

      toast.success("Login successful", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Get user role and status from the token
      const token = localStorage.getItem("accessToken");
      const role_name = getUserRoleFromToken(token);
      const role = role_name.toLowerCase();

      // Get user status directly from the token and convert to lowercase
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userStatus = decodedToken.status.toLowerCase();

      // Log the user role and status for debugging
      console.log("User Role:", role);
      console.log("User Status:", userStatus);

      // Perform additional checks based on the user's status
      if (userStatus === "activated") {
        // User is activated, proceed with navigation based on the role
        navigate(`/${role}`);
      } else {
        // User is deactivated, navigate to /deactivated
        navigate("/deactivated");
      }

      // Set loading to false after a delay (2000 milliseconds)
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      // Set loading to false when login fails
      setLoading(false);

      if (error.response) {
        toast.error(`Login failed: ${error.response.data.message}`);
        if (error.response?.status === 401) {
          setErrors({
            email: "Invalid email or password",
            password: "",
          });
        }
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic
    const newErrors = {};

    if (formData.email === "") {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.password === "") {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password should be at least 4 characters";
    }

    setErrors(newErrors);

    // If there are no errors, proceed with login
    if (Object.keys(newErrors).length === 0) {
      handleLogin();
    }
  };

  return (
    <>
      <MainNavbar />
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Clock />
          <div style={{ ...styles.container }}>
            <form style={{ ...styles.form }} onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "10px",
                  marginTop: "1px",
                  color: colors.grey[200],
                  fontFamily: '"Trirong", serif',
                }}
              >
                <Logo />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="email">Email</label>
                <div>
                  <input
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                      backgroundColor: colors.primary[700],
                      color: colors.primary[200],
                      borderRadius: "5px",
                    }}
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div style={{ color: "red", marginTop: "5px" }}>
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="password">Password</label>
                <div>
                  <input
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                      paddingRight: "30px",
                      backgroundColor: colors.primary[700],
                      color: colors.primary[200],
                      borderRadius: "5px",
                    }}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div style={{ color: "red", marginTop: "5px" }}>
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: colors.blueAccent
                    ? colors.blueAccent[600]
                    : "#000",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
      <Footer />
    </>
  );
};

export default LoginForm;
