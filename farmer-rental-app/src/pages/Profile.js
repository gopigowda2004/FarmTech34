import React, { useEffect, useState } from "react";
import axios from "axios";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Profile() {
  const { t } = useI18n();
  const [farmer, setFarmer] = useState(null);
  const farmerId = localStorage.getItem("farmerId"); // get from localStorage

  useEffect(() => {
    if (farmerId) {
      axios
        .get(`http://localhost:8080/api/farmers/profile/${farmerId}`)
        .then((res) => setFarmer(res.data))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [farmerId]);

  if (!farmer) return <p style={{ textAlign: "center" }}>{t("profile.loading")}</p>;

  return (
    <div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 15,
          maxWidth: 500,
          width: "100%",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: 20,
              borderBottom: "2px solid #27ae60",
              paddingBottom: 10,
            }}
          >
            {t("profile.title")}
          </h2>
          <LanguageSwitcher inline />
        </div>
        <p><strong>{t("profile.name")}:</strong> {farmer.name}</p>
        <p><strong>{t("profile.email")}:</strong> {farmer.email}</p>
        <p><strong>{t("profile.phone")}:</strong> {farmer.phone}</p>
        <p><strong>{t("profile.address")}:</strong> {farmer.address}</p>
      </div>
    </div>
  );
}