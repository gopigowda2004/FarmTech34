import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axiosInstance";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const equipmentType = searchParams.get("equipmentType");
  const start = searchParams.get("start"); // YYYY-MM-DD
  const hours = Number(searchParams.get("hours"));
  const locationText = location.state?.locationText || "";

  const farmerId = localStorage.getItem("farmerId");

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [method, setMethod] = useState("cod"); // cod | upi | card

  // toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success"); // success | error | info | warning

  // Predefined equipment list
  const equipments = useMemo(
    () => [
      { id: "tractor", nameEn: "Tractor", descEn: "Powerful tractor suitable for plowing, tilling, and hauling.", pricePerHour: 800 },
      { id: "harvester", nameEn: "Harvester", descEn: "Efficient harvester for cutting and threshing crops.", pricePerHour: 1000 },
      { id: "rotavator", nameEn: "Rotavator", descEn: "Used for seedbed preparation and soil conditioning.", pricePerHour: 400 },
      { id: "plough", nameEn: "Plough", descEn: "Used for primary tillage to loosen and turn the soil.", pricePerHour: 150 },
      { id: "seedDrill", nameEn: "Seed Drill", descEn: "For precise sowing of seeds in rows with proper depth.", pricePerHour: 200 },
      { id: "sprayer", nameEn: "Sprayer", descEn: "Used for spraying pesticides, herbicides, and fertilizers.", pricePerHour: 50 },
      { id: "cultivator", nameEn: "Cultivator", descEn: "Used for secondary tillage and soil preparation.", pricePerHour: 200 },
      { id: "powerTiller", nameEn: "Power Tiller", descEn: "Compact machine for plowing, weeding, and small farm operations.", pricePerHour: 300 },
      { id: "discHarrow", nameEn: "Disc Harrow", descEn: "Used for breaking clods, mixing soil, and weed control.", pricePerHour: 250 },
      { id: "riceTransplanter", nameEn: "Rice Transplanter", descEn: "Specialized machine for transplanting rice seedlings into paddy fields.", pricePerHour: 400 },
      { id: "thresher", nameEn: "Threshing Machine", descEn: "Separates grain from stalks and husks efficiently.", pricePerHour: 1200 },
      { id: "waterPump", nameEn: "Water Pump", descEn: "Irrigation equipment for pumping water into fields.", pricePerHour: 90 },
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

  const handlePlaceOrder = async () => {
    try {
      if (method !== "cod") {
        setToastSeverity("info");
        setToastMsg("This payment method is coming soon. Please use Cash on Delivery.");
        setToastOpen(true);
        return;
      }
      await api.post(`/bookings/create`, null, {
        params: { equipmentType, renterId: farmerId, startDate: start, hours, location: locationText },
      });
      setToastSeverity("success");
      setToastMsg("Booking confirmed (Cash on Delivery)!");
      setToastOpen(true);
      // redirect after short delay
      setTimeout(() => navigate("/my-bookings", { replace: true }), 1200);
    } catch (err) {
      console.error("Payment booking error:", err?.response?.data || err.message);
      setToastSeverity("error");
      setToastMsg("Failed to place order. Please try again.");
      setToastOpen(true);
    }
  };

  if (loading) return <div style={styles.page}>Loading…</div>;
  if (error) return <div style={styles.page}>{error}</div>;

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>💳 Payment</h2>
        <div>
          <button style={styles.secondaryBtn} onClick={() => navigate(-1)}>← Back</button>
          <span style={{ marginLeft: 12 }}><LanguageSwitcher inline /></span>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>
          <div><strong>Equipment:</strong> {equipment?.nameEn}</div>
          <div><strong>Start date:</strong> {start}</div>
          <div><strong>Hours:</strong> {hours}</div>
          <div><strong>Total:</strong> {totalPrice ? `₹${totalPrice}` : "—"}</div>
          {locationText ? (
            <div><strong>Location:</strong> {locationText}</div>
          ) : null}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Select Payment Method</h3>
          <div style={styles.paymentList}>
            <label style={styles.paymentOption}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
              />
              <span style={{ marginLeft: 8 }}>Cash on Delivery (Pay at pickup/delivery)</span>
            </label>

            <label style={styles.paymentOption}>
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={method === "upi"}
                onChange={() => setMethod("upi")}
              />
              <span style={{ marginLeft: 8 }}>UPI (Coming soon)</span>
            </label>

            <label style={styles.paymentOption}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              <span style={{ marginLeft: 8 }}>Card / Netbanking (Coming soon)</span>
            </label>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <button style={styles.confirmBtn} onClick={handlePlaceOrder}>Confirm & Place Order</button>
        </div>
      </div>

      {/* Flipkart-like toast at the top */}
      <Snackbar
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} variant="filled" sx={{ width: "100%" }}>
          {toastMsg}
        </Alert>
      </Snackbar>
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
  paymentList: { display: "flex", flexDirection: "column", gap: 10 },
  paymentOption: { display: "flex", alignItems: "center" },
  secondaryBtn: { padding: "8px 10px", background: "#374151", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  confirmBtn: { padding: "10px 14px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" },
};