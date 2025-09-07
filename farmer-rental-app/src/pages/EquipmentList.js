import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EquipmentsList() {
  const [equipments, setEquipments] = useState([]);
  const farmerId = localStorage.getItem("farmerId");

  useEffect(() => {
    axios.get(`http://localhost:8080/api/equipments/others/${farmerId}`)
      .then((res) => setEquipments(res.data))
      .catch((err) => console.error("Error fetching equipments:", err));
  }, [farmerId]);

  return (
    <div>
      <h2>Available Equipments</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        {equipments.map((eq) => (
          <div key={eq.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <img src={eq.image} alt={eq.name} width="100" />
            <h3>{eq.name}</h3>
            <p>{eq.description}</p>
            <p>₹{eq.price}/day</p>
            <p><strong>Owner:</strong> {eq.owner?.name}</p>
            <p><strong>Contact:</strong> {eq.owner?.phone}</p>
            <button>Book</button>
          </div>
        ))}
      </div>
    </div>
  );
}
