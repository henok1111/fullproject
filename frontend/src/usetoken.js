import { useContext } from "react";
import React from "react";
import { useState } from "react";

const TokenContext = React.createContext();
const TokenUpdateContext = React.createContext();

export const UseToken = () => {
  const token = useContext(TokenContext);
  if (!token) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return token;
};

export const UseTokenUpdate = () => {
  const updateToken = useContext(TokenUpdateContext);
  if (!updateToken) {
    throw new Error("useTokenUpdate must be used within a TokenProvider");
  }
  return updateToken;
};

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const updateTokenState = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  return (
    <TokenContext.Provider value={token}>
      <TokenUpdateContext.Provider value={updateTokenState}>
        {children}
      </TokenUpdateContext.Provider>
    </TokenContext.Provider>
  );
};
