import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import GlobalStyle from "./components/GlobalStyle";
import { TokenProvider } from "./usetoken";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <TokenProvider>
      <App />
    </TokenProvider>
  </React.StrictMode>
);
