import React, { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import { useTheme } from "@mui/material";
import Ap from "../image/court/ff.png";
import { UseTokenUpdate } from "../usetoken";

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
  const tokenUpdate = UseTokenUpdate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { token, id } = await response.json();

        console.log("Token:", token);
        console.log("User ID:", id);

        // Store the received token and user ID securely
        localStorage.setItem("token", token);
        localStorage.setItem("userId", id);

        // Update the token state using the hook
        tokenUpdate(token);

        // Fetch the role based on the user ID
        const roleResponse = await fetch(
          `http://localhost:8081/api/getRole/${id}`
        );
        if (roleResponse.ok) {
          const { role } = await roleResponse.json();

          console.log("Role:", role);

          // Store the role securely
          localStorage.setItem("userRole", role);

          // Navigate based on the user role
          navigate(`/${id}/${role}`);
        } else {
          const errorData = await roleResponse.json();
          setErrors({ role: errorData.message });
        }
      } else {
        const errorData = await response.json();
        setErrors({ email: errorData.message, password: errorData.message });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic
    const newErrors = {};
    if (formData.email === "") {
      newErrors.email = "Email is required";
    }
    if (formData.password === "") {
      newErrors.password = "Password is required";
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
          <div style={{ ...styles.container }}>
            <form
              style={{
                ...styles.form,
              }}
              onSubmit={handleSubmit}
            >
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
                <div style={{ color: "red", marginTop: "5px" }}>
                  {errors.email}
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="password">Password</label>
                <div style={{ position: "relative" }}>
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
                  {showPassword ? (
                    <FaEyeSlash
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                      onClick={handleTogglePassword}
                    />
                  ) : (
                    <FaEye
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                      onClick={handleTogglePassword}
                    />
                  )}
                </div>
                <div style={{ color: "red", marginTop: "5px" }}>
                  {errors.password}
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
