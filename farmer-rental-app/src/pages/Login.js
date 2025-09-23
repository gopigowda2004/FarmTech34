import React, { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Login() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/auth/login`, formData);
      if (res.data && res.data.farmerId) {
        localStorage.setItem("farmerId", res.data.farmerId);
        setMessage(`✅ ${t("auth.success")}`);
        navigate("/dashboard", { replace: true });
      } else {
        setMessage(`❌ ${t("auth.invalid")}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Invalid credentials";
      setMessage(`❌ ${t("auth.failed")}: ${msg}`);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Left Form Section */}
        <div style={styles.formSection}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h2 style={styles.heading}>{t("auth.loginTitle")}</h2>
            <LanguageSwitcher inline />
          </div>
          {message && <p style={{ color: "red", textAlign: "center" }}>{message}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>{t("auth.phone")}</label>
            <input
              type="text"
              name="phone"
              placeholder={t("auth.phonePlaceholder")}
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <label style={styles.label}>{t("auth.password")}</label>
            <input
              type="password"
              name="password"
              placeholder={t("auth.passwordPlaceholder")}
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <a href="/forgot-password" style={styles.forgotPassword}>{t("auth.forgot")}</a>

            <button type="submit" style={styles.submitButton}>{t("auth.signIn")}</button>
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
  imageSection: { flex: 1, overflow: "hidden" },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  heading: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column" },
  label: { fontSize: "14px", marginBottom: "5px" },
  input: {
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  forgotPassword: { fontSize: "12px", color: "#555", marginBottom: "20px", textDecoration: "none" },
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