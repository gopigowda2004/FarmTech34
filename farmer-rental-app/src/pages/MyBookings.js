import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function MyBookings() {
  const { t } = useI18n();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const farmerId = localStorage.getItem("farmerId");

  const fetchData = () => {
    if (!farmerId) {
      navigate("/");
      return;
    }
    setLoading(true);
    api
      .get(`/bookings/renter/${farmerId}`)
      .then((res) => setBookings(res.data || []))
      .catch((err) => {
        console.error("Error fetching my bookings:", err?.response?.data || err.message);
        setError(`${t("common.error")}: Failed to load your bookings. Please try again.`);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmerId]);

  const StatusBadge = ({ status }) => {
    const s = String(status || "").toUpperCase();
    const styles = {
      base: { padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600, display: "inline-block" },
      PENDING: { background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" },
      CONFIRMED: { background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" },
      CANCELLED: { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
    };
    const style = { ...styles.base, ...(styles[s] || styles.PENDING) };
    return <span style={style}>{s}</span>;
  };

  if (loading) return <div style={pageStyles.page}>{t("common.loading")}</div>;

  return (
    <div style={pageStyles.page}>
      <div style={pageStyles.headerRow}>
        <h2 style={pageStyles.title}>📑 {t("myBookings.title")}</h2>
        <div>
          <button style={pageStyles.secondaryBtn} onClick={fetchData}>↻ {t("myBookings.refresh")}</button>
          <button style={{...pageStyles.secondaryBtn, marginLeft: 8}} onClick={() => navigate("/bookings")}>
            {t("myBookings.browse")}
          </button>
          <span style={{ marginLeft: 12 }}><LanguageSwitcher inline /></span>
        </div>
      </div>

      {error && <div style={pageStyles.error}>{error}</div>}

      {bookings.length === 0 ? (
        <div style={pageStyles.empty}>{t("myBookings.empty")}</div>
      ) : (
        <table style={pageStyles.table}>
          <thead>
            <tr>
              <th>{t("myBookings.table.id")}</th>
              <th>{t("myBookings.table.equipment")}</th>
              <th>{t("myBookings.table.owner")}</th>
              <th>{t("myBookings.table.ownerContact")}</th>
              <th>{t("myBookings.table.start")}</th>
              <th>{t("myBookings.table.hours")}</th>
              <th>{t("myBookings.table.status")}</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.equipment?.name}</td>
                <td>{b.owner?.name}</td>
                <td>{b.owner?.phone}</td>
                <td>{b.startDate}</td>
                <td>{b.hours ?? (b.endDate && b.startDate ? Math.max(1, Math.round((new Date(b.endDate) - new Date(b.startDate)) / (1000 * 60 * 60))) : "")}</td>
                <td><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const pageStyles = {
  page: { padding: 20, fontFamily: "Arial, sans-serif" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { margin: 0 },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff" },
  empty: { background: "#fff", border: "1px solid #e5e7eb", padding: 24, borderRadius: 8 },
  error: { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", padding: 12, borderRadius: 6, marginBottom: 12 },
  secondaryBtn: { padding: "8px 10px", background: "#374151", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
};