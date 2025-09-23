import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Dashboard() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [farmerData, setFarmerData] = useState(null);
  const [equipments, setEquipments] = useState([
    { name: "Power Weeder", desc: "Used for soil preparation and weeding", price: 1200, image: "https://cdn-icons-png.flaticon.com/512/7431/7431830.png" },
    { name: "Brush Cutter", desc: "Cutting weeds and small bushes", price: 800, image: "https://cdn-icons-png.flaticon.com/512/3131/3131624.png" },
    { name: "Power Reaper", desc: "Efficient harvesting of crops", price: 1800, image: "https://cdn-icons-png.flaticon.com/512/7431/7431819.png" },
    { name: "Rotary Tiller", desc: "HD / HS Multispeed tiller", price: 1500, image: "https://cdn-icons-png.flaticon.com/512/4324/4324492.png" },
  ]);

  useEffect(() => {
    const farmerId = localStorage.getItem("farmerId");
    if (!farmerId) {
      navigate("/"); // redirect to home if no farmerId
      return;
    }

    axios
      .get(`http://localhost:8080/api/farmers/profile/${farmerId}`)
      .then((res) => {
        setFarmerData(res.data);
      })
      .catch((err) => console.error("Error fetching farmer data:", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("farmerId");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>{t("dashboard.logo")}</h2>
        <nav>
          <ul style={styles.navList}>
            <li style={styles.navItem} onClick={() => setActiveTab("dashboard")}>{t("dashboard.menu.dashboard")}</li>
            <li style={styles.navItem} onClick={() => navigate("/profile")}>{t("dashboard.menu.profile")}</li>
            <li style={styles.navItem} onClick={() => navigate("/rent-equipment")}>{t("dashboard.menu.rentEquipments")}</li>
            <li style={styles.navItem} onClick={() => navigate("/manage-my-equipment")}>{t("dashboard.menu.manageEquipments")}</li>
            <li style={styles.navItem} onClick={() => navigate("/bookings")}>{t("dashboard.menu.browseEquipments")}</li>
            <li style={styles.navItem} onClick={() => navigate("/my-bookings")}>{t("dashboard.menu.myBookings")}</li>
            <li style={styles.navItem} onClick={() => navigate("/owner-requests")}>{t("dashboard.menu.ownerRequests")}</li>
            <li style={styles.navItem} onClick={() => setActiveTab("stats")}>{t("dashboard.menu.rentalStats")}</li>
            <li style={{...styles.navItem, marginTop: 20, opacity: 0.8}}>{t("dashboard.menu.smartFarming")}</li>
            <li style={styles.navItem} onClick={() => navigate("/ml/crop-recommendation")}>{t("dashboard.menu.cropRecommendation")}</li>
            <li style={styles.navItem} onClick={() => navigate("/ml/fertilizer-prediction")}>{t("dashboard.menu.fertilizerPrediction")}</li>
            <li style={styles.navItem} onClick={() => navigate("/ml/crop-yield-estimation")}>{t("dashboard.menu.cropYieldEstimation")}</li>
            <li style={styles.navItem} onClick={() => navigate("/ml/soil-analysis")}>{t("dashboard.menu.soilAnalysis")}</li>
            <li style={styles.navItem} onClick={() => navigate("/ml/plant-disease")}>{t("dashboard.menu.plantDiseaseDetection")}</li>
            <li style={styles.navItem} onClick={handleLogout}>{t("dashboard.menu.logout")}</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <input type="text" placeholder={t("dashboard.searchPlaceholder")} style={styles.searchInput} />
          <button style={styles.searchBtn}>🔍</button>
          <div style={{ marginLeft: 12 }}>
            <LanguageSwitcher inline />
          </div>
        </header>

        {/* Tabs */}
        {activeTab === "dashboard" && (
          <section>
            <h2 style={styles.sectionTitle}>
              {t("dashboard.welcome").replace("{name}", farmerData ? farmerData.name : "Farmer")}
            </h2>
            <p>{t("dashboard.quickLook")}</p>
          </section>
        )}

        {activeTab === "equipments" && (
          <section>
            <h2 style={styles.sectionTitle}>{t("dashboard.menu.manageEquipments")}</h2>
            <AddEquipmentForm setEquipments={setEquipments} />
            <hr style={{ margin: "20px 0" }} />
            <EquipmentList equipments={equipments} />
          </section>
        )}

        {activeTab === "stats" && (
          <section>
            <h2 style={styles.sectionTitle}>{t("dashboard.menu.rentalStats")}</h2>
            <p>Coming soon...</p>
          </section>
        )}
      </main>
    </div>
  );
}

/* -------------------------------
   Add Equipment Form
---------------------------------*/
function AddEquipmentForm({ setEquipments }) {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", desc: "", price: "", image: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setEquipments((prev) => [...prev, form]);
    setForm({ name: "", desc: "", price: "", image: "" });
    alert(`✅ ${t("dashboard.addForm.success")}`);
  };
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder={t("dashboard.addForm.equipmentName") } required style={styles.input} />
      <input type="text" name="desc" value={form.desc} onChange={handleChange} placeholder={t("dashboard.addForm.description")} required style={styles.input} />
      <input type="number" name="price" value={form.price} onChange={handleChange} placeholder={t("dashboard.addForm.pricePerDay")} required style={styles.input} />
      <input type="text" name="image" value={form.image} onChange={handleChange} placeholder={t("dashboard.addForm.imageUrl")} style={styles.input} />
      <button type="submit" style={styles.button}>{t("dashboard.addForm.button")}</button>
    </form>
  );
}

/* -------------------------------
   Equipment List
---------------------------------*/
function EquipmentList({ equipments }) {
  const { t } = useI18n();
  return (
    <div style={styles.grid}>
      {equipments.map((eq, index) => (
        <div key={index} style={styles.card}>
          <img src={eq.image} alt={eq.name} style={styles.cardImage} />
          <h3>{eq.name}</h3>
          <p>{eq.desc}</p>
          <p style={styles.price}>{t("common.priceDay").replace("{price}", eq.price)}</p>
          <button style={styles.button}>{t("btn.rentNow")}</button>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------
   Styles
---------------------------------*/
const styles = {
  container: { display: "flex", fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#f4f4f9" },
  sidebar: { width: "220px", background: "linear-gradient(180deg, #3b0764, #581c87)", color: "#fff", padding: "20px" },
  logo: { marginBottom: "30px", fontSize: "22px", fontWeight: "bold", textAlign: "center" },
  navList: { listStyle: "none", padding: 0 },
  navItem: { margin: "15px 0", cursor: "pointer", fontSize: "16px" },
  main: { flex: 1, padding: "20px" },
  header: { display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" },
  searchInput: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", marginRight: "8px" },
  searchBtn: { padding: "8px 12px", border: "none", borderRadius: "6px", background: "#3b0764", color: "#fff", cursor: "pointer" },
  sectionTitle: { margin: "20px 0 10px", color: "#333" },
  form: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" },
  input: { padding: "8px", border: "1px solid #ccc", borderRadius: "6px", flex: "1 1 200px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" },
  card: { background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", textAlign: "center" },
  cardImage: { width: "100px", height: "100px", marginBottom: "10px" },
  price: { fontWeight: "bold", color: "#3b0764" },
  button: { marginTop: "10px", padding: "8px 12px", background: "#581c87", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
};