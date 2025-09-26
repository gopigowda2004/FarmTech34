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
  const equipmentType = searchParams.get("equipmentType");
  const start = searchParams.get("start"); // YYYY-MM-DD
  const hours = Number(searchParams.get("hours"));
  const locationParam = searchParams.get("location");

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationText, setLocationText] = useState(locationParam || "");
  const [gettingLocation, setGettingLocation] = useState(false);

  const farmerId = localStorage.getItem("farmerId");

  // Predefined equipment list (source of truth)
  const equipments = useMemo(
    () => [
      {
        id: "tractor",
        tKey: "equip.tractor",
        nameEn: "Tractor",
        descEn: "Powerful tractor suitable for plowing, tilling, and hauling.",
        pricePerHour: 800,
        image: "/images/tractor.png",
      },
      {
        id: "harvester",
        tKey: "equip.harvester",
        nameEn: "Harvester",
        descEn: "Efficient harvester for cutting and threshing crops.",
        pricePerHour: 1000,
        image: "/images/harvester.jpg",
      },
      {
        id: "rotavator",
        tKey: "equip.rotavator",
        nameEn: "Rotavator",
        descEn: "Used for seedbed preparation and soil conditioning.",
        pricePerHour: 400,
        image: "/images/rotavator.jpg",
      },
      {
        id: "plough",
        tKey: "equip.plough",
        nameEn: "Plough",
        descEn: "Used for primary tillage to loosen and turn the soil.",
        pricePerHour: 150,
        image: "/images/plough.jpg",
      },
      {
        id: "seedDrill",
        tKey: "equip.seedDrill",
        nameEn: "Seed Drill",
        descEn: "For precise sowing of seeds in rows with proper depth.",
        pricePerHour: 200,
        image: "/images/seed-drill.jpg",
      },
      {
        id: "sprayer",
        tKey: "equip.sprayer",
        nameEn: "Sprayer",
        descEn: "Used for spraying pesticides, herbicides, and fertilizers.",
        pricePerHour: 50,
        image: "/images/sprayer.jpg",
      },
      {
        id: "cultivator",
        tKey: "equip.cultivator",
        nameEn: "Cultivator",
        descEn: "Used for secondary tillage and soil preparation.",
        pricePerHour: 200,
        image: "/images/cultivator.jpg",
      },
      {
        id: "powerTiller",
        tKey: "equip.powerTiller",
        nameEn: "Power Tiller",
        descEn: "Compact machine for plowing, weeding, and small farm operations.",
        pricePerHour: 300,
        image: "/images/power-tiller.jpg",
      },
      {
        id: "discHarrow",
        tKey: "equip.discHarrow",
        nameEn: "Disc Harrow",
        descEn: "Used for breaking clods, mixing soil, and weed control.",
        pricePerHour: 250,
        image: "/images/disc-harrow.jpg",
      },
      {
        id: "riceTransplanter",
        tKey: "equip.riceTransplanter",
        nameEn: "Rice Transplanter",
        descEn:
          "Specialized machine for transplanting rice seedlings into paddy fields.",
        pricePerHour: 400,
        image: "/images/rice-transplanter.jpg",
      },
      {
        id: "thresher",
        tKey: "equip.thresher",
        nameEn: "Threshing Machine",
        descEn: "Separates grain from stalks and husks efficiently.",
        pricePerHour: 1200,
        image: "/images/thresher.jpg",
      },
      {
        id: "waterPump",
        tKey: "equip.waterPump",
        nameEn: "Water Pump",
        descEn: "Irrigation equipment for pumping water into fields.",
        pricePerHour: 90,
        image: "/images/water-pump.jpg",
      },
    ],
    []
  );

  useEffect(() => {
    if (!farmerId) {
      navigate("/");
      return;
    }
    if (!equipmentType || !start || !hours || hours <= 0) {
      setError("Missing booking details. Please start again.");
      setLoading(false);
      return;
    }

    const selectedEq = equipments.find((eq) => eq.id === equipmentType);
    if (selectedEq) {
      setEquipment(selectedEq);
    } else {
      setError("Equipment type not found.");
    }
    setLoading(false);
  }, [equipmentType, start, hours, farmerId, navigate, equipments]);

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
              <div><strong>{equipment?.nameEn}</strong></div>
              <div>{equipment?.descEn}</div>
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
              navigate(`/payment?equipmentType=${equipmentType}&start=${start}&hours=${hours}`, {
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