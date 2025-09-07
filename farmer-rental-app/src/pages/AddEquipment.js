import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function AddEquipment() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState({
    name: "",
    description: "",
    pricePerDay: "",
    imageUrl: "",
    farmerName: localStorage.getItem("farmerName") || "Unknown Farmer",
    farmerEmail: localStorage.getItem("farmerEmail") || "N/A",
    farmerPhone: localStorage.getItem("farmerPhone") || "N/A",
  });

  const handleChange = (e) => {
    setEquipment({ ...equipment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.post("/equipments/add", equipment);
    alert("Equipment added successfully!");
    navigate("/equipment/list");
  };

  return (
    <div style={styles.container}>
      <h2>Add New Equipment</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="name" placeholder="Equipment Name"
          value={equipment.name} onChange={handleChange} required style={styles.input}/>
        <textarea name="description" placeholder="Description"
          value={equipment.description} onChange={handleChange} required style={styles.textarea}/>
        <input type="number" name="pricePerDay" placeholder="Price Per Day"
          value={equipment.pricePerDay} onChange={handleChange} required style={styles.input}/>
        <input type="text" name="imageUrl" placeholder="Image URL"
          value={equipment.imageUrl} onChange={handleChange} required style={styles.input}/>
        <button type="submit" style={styles.button}>Add Equipment</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "500px", margin: "auto", padding: "20px", background: "#fff", borderRadius: "10px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  textarea: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "80px" },
  button: { padding: "10px", border: "none", borderRadius: "5px", background: "#581c87", color: "white", fontWeight: "bold", cursor: "pointer" }
};
