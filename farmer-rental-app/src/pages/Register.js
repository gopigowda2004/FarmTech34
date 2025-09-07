import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    aadharNumber: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Fetch farmer details using Aadhaar
  const handleFetchDetails = async () => {
    if (!formData.aadharNumber) {
      alert("⚠️ Enter Aadhaar Number first!");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/api/farmers/fetch/${formData.aadharNumber}`
      );
      setFormData({
        ...formData,
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        address: res.data.address,
      });
    } catch (err) {
      alert("❌ Farmer not found for this Aadhaar!");
    } finally {
      setLoading(false);
    }
  };

  // Register Farmer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/register", formData);
      alert("✅ Registration successful!");
      navigate("/login");
    } catch (error) {
      alert(
        "❌ Registration failed: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.heading}>Farmer Registration</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="aadharNumber"
            placeholder="Aadhar Number"
            value={formData.aadharNumber}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button
            type="button"
            onClick={handleFetchDetails}
            style={styles.fetchButton}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch Details"}
          </button>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.submitButton}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    background: "#f0f4f8",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#2c3e50",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  fetchButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2980b9",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "12px",
    cursor: "pointer",
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Register;
