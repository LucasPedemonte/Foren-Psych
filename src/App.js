import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./Components/SignIn";
import Home from "./Components/Home";
import Contact from "./Components/Contact";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute"; // Adjusted import path

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <PrivateRoute>
              <Contact />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/signin" />} /> {/* Default route */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
