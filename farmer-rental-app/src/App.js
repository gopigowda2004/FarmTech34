import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RentEquipment from "./pages/RentEquipment"; 
import AddEquipment from "./pages/AddEquipment";
import EquipmentList from "./pages/EquipmentList";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/rent-equipment" element={<RentEquipment />} />
        <Route path="/add-equipment" element={<AddEquipment />} />
        <Route path="/equipment-list" element={<EquipmentList />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
