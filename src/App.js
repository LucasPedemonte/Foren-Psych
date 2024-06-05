// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./Components/SignIn";
import Home from "./Components/Home";
import { AuthProvider } from "./AuthContext"; // Import AuthProvider

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<SignIn />} /> {/* Default route */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
