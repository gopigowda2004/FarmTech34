import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";

// Checkout page: confirm details, capture location, fake payment, then create booking
export default function Checkout() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const equipmentId = Number(searchParams.get("equipmentId"));
  const start = searchParams.get("start"); // YYYY-MM-DD
  const hours = Number(searchParams.get("hours"));

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationText, setLocationText] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);

  const farmerId = localStorage.getItem("farmerId");

  useEffect(() => {
    if (!farmerId) {
      navigate("/");
      return;
    }
    if (!equipmentId || !start || !hours || hours <= 0) {
      setError("Missing booking details. Please start again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    api.get(`/equipments/${equipmentId}`)
      .then((res) => setEquipment(res.data))
      .catch((err) => setError(err?.response?.data || err.message || "Failed to load equipment"))
      .finally(() => setLoading(false));
  }, [equipmentId, start, hours, farmerId, navigate]);

  const pricePerHour = useMemo(() => equipment?.pricePerHour ?? null, [equipment]);
  const totalPrice = useMemo(() => (pricePerHour ? Math.round(pricePerHour * hours) : null), [pricePerHour, hours]);

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



  if (loading) return <div style={styles.page}>{t("common.loading")}</div>;
  if (error) return <div style={styles.page}>{error}</div>;

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>🧾 {t("checkout.title") || "Checkout"}</h2>
        <div>
          <button style={styles.secondaryBtn} onClick={() => navigate(-1)}>← {t("common.back") || "Back"}</button>
          <span style={{ marginLeft: 12 }}><LanguageSwitcher inline /></span>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>{t("checkout.equipment") || "Equipment"}</h3>
          <div style={{ display: "flex", gap: 16 }}>
            {equipment?.image && <img src={equipment.image} alt={equipment?.name} style={styles.image} />}
            <div>
              <div><strong>{equipment?.name}</strong></div>
              <div>{equipment?.description}</div>
              <div>
                <strong>{t("rent.pricePerHour") || "Price per hour"}:</strong> {pricePerHour ? `₹${pricePerHour}` : "—"}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>{t("checkout.details") || "Booking details"}</h3>
          <div>Start date: <strong>{start}</strong></div>
          <div>Hours: <strong>{hours}</strong></div>
          <div>Total: <strong>{totalPrice ? `₹${totalPrice}` : "—"}</strong></div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>{t("checkout.location") || "Location"}</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder={t("checkout.locationPlaceholder") || "Type your location or use current location"}
              style={styles.input}
            />
            <button style={styles.secondaryBtn} onClick={handleUseMyLocation} disabled={gettingLocation}>
              {gettingLocation ? "…" : (t("checkout.useMyLocation") || "Use my location")}
            </button>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <button
            style={styles.payBtn}
            onClick={() => {
              if (!locationText.trim()) {
                alert("Please provide a location or use current location.");
                return;
              }
              navigate(`/payment?equipmentId=${equipmentId}&start=${start}&hours=${hours}`, {
                state: { locationText },
              });
            }}
          >
            {t("checkout.payAndBook") || "Pay & Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 20, fontFamily: "Arial, sans-serif" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { margin: 0 },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { margin: "0 0 8px 0" },
  image: { width: 120, height: 90, objectFit: "cover", borderRadius: 6 },
  input: { flex: 1, padding: 8, border: "1px solid #d1d5db", borderRadius: 6 },
  secondaryBtn: { padding: "8px 10px", background: "#374151", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  payBtn: { padding: "10px 14px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" },
};