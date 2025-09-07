import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [farmer, setFarmer] = useState(null);
  const farmerId = localStorage.getItem("farmerId"); // get from localStorage

  useEffect(() => {
    if (farmerId) {
      axios
        .get(`http://localhost:8080/api/farmers/profile/${farmerId}`)
        .then((res) => setFarmer(res.data))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [farmerId]);

  if (!farmer) return <p style={{ textAlign: "center" }}>Loading profile...</p>;

  return (
    <div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 15,
          maxWidth: 500,
          width: "100%",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 20,
            borderBottom: "2px solid #27ae60",
            paddingBottom: 10,
          }}
        >
          Farmer Profile
        </h2>
        <p><strong>Name:</strong> {farmer.name}</p>
        <p><strong>Email:</strong> {farmer.email}</p>
        <p><strong>Phone:</strong> {farmer.phone}</p>
        <p><strong>Address:</strong> {farmer.address}</p>
      </div>
    </div>
  );
}
