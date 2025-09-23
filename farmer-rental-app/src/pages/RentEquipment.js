import React, { useMemo, useState } from "react";
import api from "../api/axiosInstance"; // shared axios instance
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";

const RentEquipment = () => {
  const { t } = useI18n();

  // Internal form state kept in English for backend consistency
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerHour: "",
    image: "",
  });
  const [selectedId, setSelectedId] = useState("");
    
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
        pricePerHour: 300,
        image: "/images/harvester.jpg",
      },
      {
        id: "rotavator",
        tKey: "equip.rotavator",
        nameEn: "Rotavator",
        descEn: "Used for seedbed preparation and soil conditioning.",
        pricePerHour: 150,
        image: "/images/rotavator.jpg",
      },
      {
        id: "plough",
        tKey: "equip.plough",
        nameEn: "Plough",
        descEn: "Used for primary tillage to loosen and turn the soil.",
        pricePerHour: 120,
        image: "/images/plough.jpg",
      },
      {
        id: "seedDrill",
        tKey: "equip.seedDrill",
        nameEn: "Seed Drill",
        descEn: "For precise sowing of seeds in rows with proper depth.",
        pricePerHour: 100,
        image: "/images/seed-drill.jpg",
      },
      {
        id: "sprayer",
        tKey: "equip.sprayer",
        nameEn: "Sprayer",
        descEn: "Used for spraying pesticides, herbicides, and fertilizers.",
        pricePerHour: 80,
        image: "/images/sprayer.jpg",
      },
      {
        id: "cultivator",
        tKey: "equip.cultivator",
        nameEn: "Cultivator",
        descEn: "Used for secondary tillage and soil preparation.",
        pricePerHour: 110,
        image: "/images/cultivator.jpg",
      },
      {
        id: "baler",
        tKey: "equip.baler",
        nameEn: "Baler",
        descEn: "For compressing cut crops like hay or straw into compact bales.",
        pricePerHour: 250,
        image: "/images/baler.jpg",
      },
      {
        id: "powerTiller",
        tKey: "equip.powerTiller",
        nameEn: "Power Tiller",
        descEn: "Compact machine for plowing, weeding, and small farm operations.",
        pricePerHour: 140,
        image: "/images/power-tiller.jpg",
      },
      {
        id: "discHarrow",
        tKey: "equip.discHarrow",
        nameEn: "Disc Harrow",
        descEn: "Used for breaking clods, mixing soil, and weed control.",
        pricePerHour: 130,
        image: "/images/disc-harrow.jpg",
      },
      {
        id: "riceTransplanter",
        tKey: "equip.riceTransplanter",
        nameEn: "Rice Transplanter",
        descEn:
          "Specialized machine for transplanting rice seedlings into paddy fields.",
        pricePerHour: 220,
        image: "/images/rice-transplanter.jpg",
      },
      {
        id: "thresher",
        tKey: "equip.thresher",
        nameEn: "Threshing Machine",
        descEn: "Separates grain from stalks and husks efficiently.",
        pricePerHour: 240,
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

  const selectedEq = useMemo(
    () => equipments.find((eq) => eq.id === selectedId),
    [selectedId, equipments]
  );

  // Handle dropdown change → auto fill EN details for backend; display uses t()
  const handleEquipmentSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    const selected = equipments.find((eq) => eq.id === id);
    if (selected) {
      setFormData({
        name: selected.nameEn,
        description: selected.descEn,
        pricePerHour: selected.pricePerHour,
        image: selected.image,
      });
    } else {
      setFormData({ name: "", description: "", pricePerHour: "", image: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!farmerId) {
        alert("Please login again. Missing farmerId in localStorage.");
        return;
      }
      const payload = {
        ...formData,
        pricePerHour: Number(formData.pricePerHour), // ensure number
      };
      const res = await api.post(`/equipments/add/${farmerId}`, payload);
      if (res?.data?.id) {
        alert("✅ Equipment listed for rent successfully!");
        setSelectedId("");
        setFormData({ name: "", description: "", pricePerHour: "", image: "" });
      } else {
        alert("Server did not return an equipment ID. Please try again.");
      }
    } catch (error) {
      console.error("Add equipment error:", error?.response?.data || error.message);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message ||
        "Unknown error";
      alert(`❌ Error listing equipment: ${msg}`);
    }
  };

  // Derived values for UI (translated)
  // eslint-disable-next-line no-unused-vars
  const displayName = selectedEq ? t(`${selectedEq.tKey}.name`) : "";
  const displayDescription = selectedEq ? t(`${selectedEq.tKey}.description`) : "";

  return (
    <div className="rent-container">
      <style>{`
        .rent-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(to bottom right, #d1fae5, #ffffff, #bbf7d0);
          padding: 1rem;
        }
        .rent-card {
          width: 100%;
          max-width: 550px;
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          padding: 2rem;
        }
        .rent-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          font-size: 1.4rem;
          font-weight: 800;
          text-align: left;
          color: #166534;
          margin-bottom: 1rem;
        }
        .rent-form { display: flex; flex-direction: column; gap: 1.2rem; }
        .rent-label { font-size: 0.9rem; font-weight: 500; color: #374151; margin-bottom: 0.2rem; }
        .rent-input, .rent-textarea, .rent-select {
          width: 100%; padding: 0.8rem; border: 1px solid #d1d5db; border-radius: 0.6rem; outline: none; background-color: #f9fafb;
        }
        .rent-input:focus, .rent-textarea:focus, .rent-select:focus { border-color: #16a34a; box-shadow: 0 0 0 2px rgba(34,197,94,0.3); }
        .rent-textarea { resize: none; }
        .rent-input[readonly], .rent-textarea[readonly] { background-color: #f3f4f6; cursor: not-allowed; }
        .rent-button { width: 100%; padding: 1rem; border: none; border-radius: 0.6rem; font-size: 1rem; font-weight: 600; color: #fff; background: linear-gradient(to right, #22c55e, #15803d); cursor: pointer; }
        .rent-button:hover { transform: scale(1.05); background: linear-gradient(to right, #16a34a, #166534); }
        .rent-image { margin-top: 0.8rem; width: 100%; height: 200px; object-fit: cover; border-radius: 0.6rem; border: 1px solid #d1d5db; }
      `}</style>

      <div className="rent-card">
        <div className="rent-title">
          <span>🌾 {t("rent.title")}</span>
          <LanguageSwitcher inline />
        </div>

        <form onSubmit={handleSubmit} className="rent-form">
          {/* Select equipment */}
          <div>
            <label className="rent-label">{t("rent.selectEquipment")}</label>
            <select
              className="rent-select"
              onChange={handleEquipmentSelect}
              value={selectedId}
              required
            >
              <option value="">{t("rent.choosePlaceholder")}</option>
              {equipments.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {t(`${eq.tKey}.name`)}
                </option>
              ))}
            </select>
          </div>

          {/* Description (locked, translated view) */}
          <div>
            <label className="rent-label">{t("rent.description")}</label>
            <textarea
              name="description"
              value={displayDescription}
              className="rent-textarea"
              rows={3}
              readOnly
              required
            />
          </div>

          {/* Price per hour (locked) */}
          <div>
            <label className="rent-label">{t("rent.pricePerHour")}</label>
            <input
              type="number"
              name="pricePerHour"
              value={formData.pricePerHour}
              className="rent-input"
              readOnly
              required
            />
          </div>

          {/* Image preview only */}
          {formData.image && (
            <div>
              <label className="rent-label">{t("rent.preview")}</label>
              <img src={formData.image} alt="Preview" className="rent-image" />
            </div>
          )}

          <button type="submit" className="rent-button">
            {t("btn.rentEquipment")} 🚜
          </button>
        </form>
      </div>
    </div>
  );
};

export default RentEquipment;