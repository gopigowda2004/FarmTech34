import React from "react";

function Equipments() {
  const equipments = [
    { id: 1, name: "Tractor", price: "₹1500/day" },
    { id: 2, name: "Plough", price: "₹500/day" },
    { id: 3, name: "Seed Drill", price: "₹800/day" },
    { id: 4, name: "Harvester", price: "₹2500/day" },
  ];

  return (
    <div style={styles.container}>
      <h2>🚜 Available Equipments</h2>
      <div style={styles.grid}>
        {equipments.map((eq) => (
          <div key={eq.id} style={styles.card}>
            <h3>{eq.name}</h3>
            <p>{eq.price}</p>
            <button style={styles.button}>Rent Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" },
  card: { background: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0px 2px 6px rgba(0,0,0,0.1)", textAlign: "center" },
  button: { marginTop: "10px", padding: "8px 12px", border: "none", borderRadius: "6px", background: "#581c87", color: "white", cursor: "pointer" }
};

export default Equipments;
