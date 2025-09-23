import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";

export default function EquipmentsList() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState([]);
  const farmerId = localStorage.getItem("farmerId");

  useEffect(() => {
    api.get(`/equipments/others/${farmerId}`)
      .then((res) => setEquipments(res.data))
      .catch((err) => console.error("Error fetching equipments:", err));
  }, [farmerId]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>{t("equipmentList.title")}</h2>
        <LanguageSwitcher inline />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        {equipments.map((eq) => (
          <div key={eq.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <img src={eq.image} alt={eq.name} width="100" />
            <h3>{eq.name}</h3>
            <p>{eq.description}</p>
            <p>{t("common.priceDay").replace("{price}", eq.price)}</p>
            <p><strong>{t("common.owner")}:</strong> {eq.owner?.name}</p>
            <p><strong>{t("common.contact")}:</strong> {eq.owner?.phone}</p>
            <button onClick={() => {
              const renterId = localStorage.getItem("farmerId");
              const startDate = prompt("Start time (YYYY-MM-DDTHH:mm)", "2025-09-13T10:00");
              const hoursStr = prompt("How many hours?", "4");
              const hours = hoursStr ? parseInt(hoursStr, 10) : NaN;
              if (!startDate || !Number.isFinite(hours) || hours <= 0) return;
              // Backend expects date-only startDate/endDate; compute endDate from hours
              const start = new Date(startDate);
              if (isNaN(start.getTime())) return;
              const startDateOnly = start.toISOString().slice(0, 10);
              api.post(`/bookings/create`, null, {
                params: { equipmentId: eq.id, renterId, startDate: startDateOnly, hours },
              })
                .then(() => navigate(`/checkout?equipmentId=${eq.id}&start=${startDateOnly}&hours=${hours}`))
                .catch(() => alert("Failed to proceed to checkout"));
            }}>{t("equipmentList.book")}</button>
          </div>
        ))}
      </div>
    </div>
  );
}