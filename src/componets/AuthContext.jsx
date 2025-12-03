import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem("customerAuth");
      setAuthUser(data ? JSON.parse(data) : null);
    } catch {
      setAuthUser(null);
    }
  }, []);

  const loginUser = (user) => {
    localStorage.setItem("customerAuth", JSON.stringify(user));
    setAuthUser(user);
  };

  const logoutUser = () => {
    localStorage.removeItem("customerAuth");
    localStorage.removeItem("role");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
