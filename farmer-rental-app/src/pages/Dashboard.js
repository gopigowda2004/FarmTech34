import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
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
      navigate("/"); // redirect to login if no farmerId
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
    navigate("/"); // go to login
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>🌾 AgriTech</h2>
        <nav>
          <ul style={styles.navList}>
            <li style={styles.navItem} onClick={() => setActiveTab("dashboard")}>Dashboard</li>
            <li style={styles.navItem} onClick={() => navigate("/profile")}>Profile</li>
            <li style={styles.navItem} onClick={() => navigate("/rent-equipment")}>Rent Equipments</li>
            <li style={styles.navItem} onClick={() => setActiveTab("equipments")}>Manage Equipments</li>
            <li style={styles.navItem} onClick={() => setActiveTab("bookings")}>Bookings</li>
            <li style={styles.navItem} onClick={() => setActiveTab("stats")}>Rental Stats</li>
            <li style={styles.navItem} onClick={handleLogout}>Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <input type="text" placeholder="Search equipments..." style={styles.searchInput} />
          <button style={styles.searchBtn}>🔍</button>
        </header>

        {/* Tabs */}
        {activeTab === "dashboard" && (
          <section>
            <h2 style={styles.sectionTitle}>
              Welcome back, {farmerData ? farmerData.name : "Farmer"} 👋
            </h2>
            <p>Here’s a quick look at your dashboard.</p>
          </section>
        )}

        {activeTab === "equipments" && (
          <section>
            <h2 style={styles.sectionTitle}>Manage Equipments</h2>
            <AddEquipmentForm setEquipments={setEquipments} />
            <hr style={{ margin: "20px 0" }} />
            <EquipmentList equipments={equipments} />
          </section>
        )}

        {activeTab === "bookings" && (
          <section>
            <h2 style={styles.sectionTitle}>Your Bookings</h2>
            <p>No bookings yet.</p>
          </section>
        )}

        {activeTab === "stats" && (
          <section>
            <h2 style={styles.sectionTitle}>Rental Statistics</h2>
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
  const [form, setForm] = useState({ name: "", desc: "", price: "", image: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setEquipments((prev) => [...prev, form]);
    setForm({ name: "", desc: "", price: "", image: "" });
    alert("✅ Equipment added successfully!");
  };
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Equipment Name" required style={styles.input} />
      <input type="text" name="desc" value={form.desc} onChange={handleChange} placeholder="Description" required style={styles.input} />
      <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price per day" required style={styles.input} />
      <input type="text" name="image" value={form.image} onChange={handleChange} placeholder="Image URL" style={styles.input} />
      <button type="submit" style={styles.button}>Add Equipment</button>
    </form>
  );
}

/* -------------------------------
   Equipment List
---------------------------------*/
function EquipmentList({ equipments }) {
  return (
    <div style={styles.grid}>
      {equipments.map((eq, index) => (
        <div key={index} style={styles.card}>
          <img src={eq.image} alt={eq.name} style={styles.cardImage} />
          <h3>{eq.name}</h3>
          <p>{eq.desc}</p>
          <p style={styles.price}>₹{eq.price}/day</p>
          <button style={styles.button}>Rent Now</button>
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
