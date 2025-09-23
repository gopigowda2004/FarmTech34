import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";
import MapComponent from "../components/MapComponent";

export default function OwnerRequests() {
  const { t } = useI18n();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState("");
  const navigate = useNavigate();

  const ownerId = localStorage.getItem("farmerId");

  const fetchData = () => {
    if (!ownerId) {
      navigate("/");
      return;
    }
    setLoading(true);
    api
      .get(`/bookings/owner/${ownerId}`)
      .then((res) => setBookings(res.data || []))
      .catch((err) => {
        console.error("Error fetching owner bookings:", err?.response?.data || err.message);
        setError(`${t("common.error")}: Failed to load booking requests. Please try again.`);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId]);

  const handleAccept = async (booking) => {
    try {
      await api.patch(`/bookings/${booking.id}/status`, null, { params: { status: "CONFIRMED" } });
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: "CONFIRMED" } : b)));
      // Show map with the location
      if (booking.location) {
        setMapLocation(booking.location);
        setShowMap(true);
      } else {
        alert("No location provided for this booking.");
      }
    } catch (err) {
      console.error("Failed to accept booking:", err?.response?.data || err.message);
      alert(`${t("common.error")}: Could not accept booking. Try again.`);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, null, { params: { status: "CANCELLED" } });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "CANCELLED" } : b)));
    } catch (err) {
      console.error("Failed to reject booking:", err?.response?.data || err.message);
      alert(`${t("common.error")}: Could not reject booking. Try again.`);
    }
  };

  if (loading) return <div style={styles.page}>{t("common.loading")}</div>;
  if (error) return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>📨 {t("ownerRequests.title")}</h2>
        <button style={styles.secondaryBtn} onClick={() => navigate("/dashboard")}>
          {t("ownerRequests.backToDashboard")}
        </button>
      </div>
      <p>{error}</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>📨 {t("ownerRequests.title")}</h2>
        <div>
          <button style={styles.secondaryBtn} onClick={fetchData}>↻ {t("ownerRequests.refresh")}</button>
          <button style={{...styles.secondaryBtn, marginLeft: 8}} onClick={() => navigate("/dashboard")}>
            {t("ownerRequests.backToDashboard")}
          </button>
          <span style={{ marginLeft: 12 }}><LanguageSwitcher inline /></span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div style={styles.empty}>{t("ownerRequests.empty")}</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Equipment</th>
              <th>Renter</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Start</th>
              <th>Hours</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.equipment?.name}</td>
                <td>{b.renter?.name}</td>
                <td>{b.renter?.phone}</td>
                <td>{b.location || "—"}</td>
                <td>{b.startDate}</td>
                <td>{b.hours ?? (b.endDate && b.startDate ? Math.max(1, Math.round((new Date(b.endDate) - new Date(b.startDate)) / (1000 * 60 * 60))) : "")}</td>
                <td>{b.status}</td>
                <td>
                  {b.status === "PENDING" ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={styles.acceptBtn} onClick={() => handleAccept(b)}>{t("ownerRequests.accept")}</button>
                      <button style={styles.rejectBtn} onClick={() => handleReject(b.id)}>{t("ownerRequests.reject")}</button>
                    </div>
                  ) : (
                    <em>—</em>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showMap && mapLocation && (
        <div style={{ marginTop: 20, padding: 20, border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3>📍 Location for Booking</h3>
            <button style={styles.secondaryBtn} onClick={() => setShowMap(false)}>✕ Close</button>
          </div>
          <p><strong>Address:</strong> {mapLocation}</p>
          <MapComponent location={mapLocation} />
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: 20, fontFamily: "Arial, sans-serif" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { margin: 0 },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff" },
  empty: { background: "#fff", border: "1px solid #e5e7eb", padding: 24, borderRadius: 8 },
  secondaryBtn: { padding: "8px 10px", background: "#374151", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  acceptBtn: { padding: "6px 10px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  rejectBtn: { padding: "6px 10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
};