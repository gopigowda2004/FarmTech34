import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", formData);
      if (res.data && res.data.farmerId) {
        localStorage.setItem("farmerId", res.data.farmerId);
        setMessage("✅ Login successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setMessage("❌ Invalid login response.");
      }
    } catch (err) {
      setMessage("❌ Login failed: " + (err.response?.data?.message || "Invalid credentials"));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Left Form Section */}
        <div style={styles.formSection}>
          <h2 style={styles.heading}>Login</h2>
          {message && <p style={{ color: "red", textAlign: "center" }}>{message}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Your Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <label style={styles.label}>Your Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <a href="/forgot-password" style={styles.forgotPassword}>Forgot My Password?</a>

            <button type="submit" style={styles.submitButton}>Sign in</button>
          </form>
        </div>

        {/* Right Image Section */}
        <div style={styles.imageSection}>
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.8K1AFNwiAkB4fQwXimcuRwHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Farm Rental Equipment"
            style={styles.image}
          />
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  page: {
    backgroundColor: "#2196f3", // Blue background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  card: {
    display: "flex",
    width: "700px",
    height: "400px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  formSection: {
    flex: 1,
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  imageSection: {
    flex: 1,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    marginBottom: "5px",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  forgotPassword: {
    fontSize: "12px",
    color: "#555",
    marginBottom: "20px",
    textDecoration: "none",
  },
  submitButton: {
    padding: "12px",
    backgroundColor: "#03a9f4",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
