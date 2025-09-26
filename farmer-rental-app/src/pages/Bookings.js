import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Bookings() {
  const { t } = useI18n();
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationText, setLocationText] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const navigate = useNavigate();

  const farmerId = localStorage.getItem("farmerId");

  // Predefined equipment list for selection
  const equipmentTypes = useMemo(
    () => [
      { id: "tractor", nameEn: "Tractor", tKey: "equip.tractor" },
      { id: "harvester", nameEn: "Harvester", tKey: "equip.harvester" },
      { id: "rotavator", nameEn: "Rotavator", tKey: "equip.rotavator" },
      { id: "plough", nameEn: "Plough", tKey: "equip.plough" },
      { id: "seedDrill", nameEn: "Seed Drill", tKey: "equip.seedDrill" },
      { id: "sprayer", nameEn: "Sprayer", tKey: "equip.sprayer" },
      { id: "cultivator", nameEn: "Cultivator", tKey: "equip.cultivator" },
      { id: "powerTiller", nameEn: "Power Tiller", tKey: "equip.powerTiller" },
      { id: "discHarrow", nameEn: "Disc Harrow", tKey: "equip.discHarrow" },
      { id: "riceTransplanter", nameEn: "Rice Transplanter", tKey: "equip.riceTransplanter" },
      { id: "thresher", nameEn: "Threshing Machine", tKey: "equip.thresher" },
      { id: "waterPump", nameEn: "Water Pump", tKey: "equip.waterPump" },
    ],
    []
  );

  const [selectedEquipmentType, setSelectedEquipmentType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [hours, setHours] = useState("");

  // Reverse-geocode coordinates to a readable address
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch address");
      const data = await res.json();
      const parts = [data.locality || data.city, data.principalSubdivision, data.countryName].filter(Boolean);
      return parts.join(", ") || `${latitude}, ${longitude}`;
    } catch (e) {
      return `${latitude}, ${longitude}`; // fallback
    }
  };

  // Fallback to IP-based approximate address when GPS is unavailable/blocked
  const ipGeocode = async () => {
    try {
      const res = await fetch('https://api.bigdatacloud.net/data/ip-geolocation-client?localityLanguage=en');
      if (!res.ok) throw new Error('Failed ip geolocation');
      const data = await res.json();
      const parts = [data.city || data.locality, data.principalSubdivision, data.countryName].filter(Boolean);
      return parts.join(', ');
    } catch (e) {
      return '';
    }
  };

  const handleUseMyLocation = async () => {
    setGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        const ipAddr = await ipGeocode();
        if (ipAddr) {
          setLocationText(ipAddr);
        } else {
          alert('Geolocation not supported and IP lookup failed. Please type your address.');
        }
        return;
      }

      // Try browser GPS with timeout and high accuracy
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      );

      const { latitude, longitude } = pos.coords;
      const address = await reverseGeocode(latitude, longitude);
      setLocationText(address);
    } catch (err) {
      // Fallback to IP-based city/region
      const ipAddr = await ipGeocode();
      if (ipAddr) {
        alert('Could not get precise location. Using approximate city from IP.');
        setLocationText(ipAddr);
      } else {
        alert(`Failed to get location: ${err.message || err}`);
      }
    } finally {
      setGettingLocation(false);
    }
  };

  useEffect(() => {
    if (!farmerId) {
      navigate("/");
      return;
    }
    // No need to fetch equipments anymore, as we're changing the flow
    setLoading(false);
  }, [farmerId, navigate]);

  const handleRequestRental = (e) => {
    e.preventDefault();
    if (!selectedEquipmentType || !startDate || !hours || !locationText) {
      alert("Please fill all fields.");
      return;
    }
    const hoursNum = parseInt(hours, 10);
    if (!Number.isFinite(hoursNum) || hoursNum <= 0) {
      alert("Please enter a valid number of hours.");
      return;
    }
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      alert("Please enter a valid start date.");
      return;
    }
    const startDateOnly = start.toISOString().slice(0, 10);
    // Navigate to checkout with equipmentType instead of equipmentId
    navigate(`/checkout?equipmentType=${selectedEquipmentType}&start=${startDateOnly}&hours=${hoursNum}&location=${encodeURIComponent(locationText)}`);
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
        <h2 style={styles.header}>{t("bookings.title") || "Request Equipment Rental"}</h2>

        <div style={styles.card}>
          <form onSubmit={handleRequestRental} style={styles.form}>
            <div style={styles.section}>
              <label style={styles.label}>{t("rent.selectEquipment")}</label>
              <select
                style={styles.select}
                value={selectedEquipmentType}
                onChange={(e) => setSelectedEquipmentType(e.target.value)}
                required
              >
                <option value="">{t("rent.choosePlaceholder")}</option>
                {equipmentTypes.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {t(`${eq.tKey}.name`)}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.section}>
              <label style={styles.label}>{t("checkout.location") || "Location"}</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder={t("checkout.locationPlaceholder") || "Type your location or use current location"}
                  style={styles.input}
                  required
                />
                <button type="button" style={styles.secondaryBtn} onClick={handleUseMyLocation} disabled={gettingLocation}>
                  {gettingLocation ? "…" : (t("checkout.useMyLocation") || "Use my location")}
                </button>
              </div>
            </div>

            <div style={styles.section}>
              <label style={styles.label}>{t("checkout.startDate") || "Start Date"}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.section}>
              <label style={styles.label}>{t("checkout.hours") || "Hours"}</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="e.g., 4"
                style={styles.input}
                min="1"
                required
              />
            </div>

            <button type="submit" style={styles.primaryBtn}>
              {t("bookings.requestRental") || "Request Rental"} 🚜
            </button>
          </form>
        </div>
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
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  section: {},
  label: { display: "block", marginBottom: "4px", fontWeight: "bold", color: "#374151" },
  select: { width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "16px" },
  input: { flex: 1, padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "16px" },
  secondaryBtn: { padding: "10px", background: "#374151", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  primaryBtn: { padding: "12px", background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" },
  page: { padding: 20, fontFamily: "Arial, sans-serif", textAlign: "center" },
};