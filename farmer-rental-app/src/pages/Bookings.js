import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Bookings() {
  const { t } = useI18n();
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const farmerId = localStorage.getItem("farmerId");

  useEffect(() => {
    if (!farmerId) {
      navigate("/");
      return;
    }
    setLoading(true);
    api
      .get(`/equipments/others/${farmerId}`)
      .then((res) => setEquipments(res.data || []))
      .catch((err) => {
        console.error("Error fetching equipments:", err?.response?.data || err.message);
        setError(`${t("common.error")}: Failed to load equipments. Please try again.`);
      })
      .finally(() => setLoading(false));
  }, [farmerId, navigate, t]);

  const handleBook = (eqId) => {
    const startDate = prompt("Start time (YYYY-MM-DDTHH:mm)", "2025-09-13T10:00");
    const hoursStr = prompt("How many hours?", "4");
    const hours = hoursStr ? parseInt(hoursStr, 10) : NaN;
    if (!startDate || !Number.isFinite(hours) || hours <= 0) return;
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return;
    const startDateOnly = start.toISOString().slice(0, 10);
    // Navigate to checkout with details
    navigate(`/checkout?equipmentId=${eqId}&start=${startDateOnly}&hours=${hours}`);
  };

  if (loading) return <div style={styles.page}>{t("common.loading")}</div>;
  if (error) return <div style={styles.page}>{error}</div>;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={styles.sidebarTitle}>{t("common.categories")}</h3>
          <LanguageSwitcher inline />
        </div>
        <ul style={styles.categoryList}>
          {t("bookings.categories").map((c, idx) => (
            <li key={idx}>{c}</li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <h2 style={styles.header}>{t("equipmentList.title")}</h2>

        {equipments.length === 0 ? (
          <div style={styles.empty}>
            <p>{t("bookings.empty")}</p>
            <button style={styles.primaryBtn} onClick={() => navigate("/rent-equipment")}>
              {t("bookings.listYourEquipment")}
            </button>
          </div>
        ) : (
          equipments.map((eq) => (
            <div key={eq.id} style={styles.card}>
              <div style={styles.cardLeft}>
                <img src={eq.image} alt={eq.name} style={styles.image} />
                <div>
                  <h3 style={styles.name}>{eq.name}</h3>
                  <p><strong>{t("common.owner")}:</strong> {eq.owner?.name}</p>
                  <p><strong>{t("common.contact")}:</strong> {eq.owner?.phone}</p>
                  <p>{eq.description}</p>
                  <p>
                    <strong>{t("common.price")}:</strong> {t("common.priceDay").replace("{price}", eq.price)} {eq.pricePerHour && ` • ${t("common.priceHour").replace("{price}", eq.pricePerHour)}`}
                  </p>
                </div>
              </div>

              <div style={styles.cardRight}>
                <div style={styles.priceBox}>
                  <p style={styles.totalPrice}>{t("common.totalRentalPrice")}</p>
                  <h3 style={styles.priceValue}>₹{eq.price}</h3>
                  <small>{t("common.inclTaxes")}</small>
                </div>
                <button style={styles.reserveBtn} onClick={() => handleBook(eq.id)}>
                  {t("common.reserve")}
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { display: "flex", fontFamily: "Arial, sans-serif", background: "#f9fafb", padding: "20px" },
  sidebar: { width: "220px", background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", marginRight: "20px", height: "fit-content" },
  sidebarTitle: { fontSize: "16px", fontWeight: "bold", marginBottom: "10px", borderBottom: "2px solid #10b981", paddingBottom: "5px" },
  categoryList: { listStyle: "none", padding: 0, margin: 0, lineHeight: "2em", color: "#374151" },
  main: { flex: 1 },
  header: { marginBottom: "20px" },
  card: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  cardLeft: { display: "flex", gap: "16px", alignItems: "flex-start" },
  cardRight: { textAlign: "center" },
  image: { width: "120px", height: "90px", objectFit: "cover", borderRadius: "6px" },
  name: { margin: "0 0 6px 0" },
  priceBox: { background: "#e6f9f1", padding: "10px", borderRadius: "8px", marginBottom: "10px" },
  totalPrice: { margin: 0, fontSize: "14px", color: "#374151" },
  priceValue: { margin: "5px 0", color: "#10b981" },
  reserveBtn: { background: "#10b981", color: "#fff", padding: "8px 14px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  primaryBtn: { padding: "10px 12px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" },
  empty: { textAlign: "center", padding: 40, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10 },
};