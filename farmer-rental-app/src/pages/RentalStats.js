import React from "react";
import "./RentalStats.css";

function RentalStats() {
  return (
    <div className="stats-container">
      <h2>📊 Rental Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>10</h3>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card">
          <h3>6</h3>
          <p>Active Rentals</p>
        </div>
        <div className="stat-card">
          <h3>₹12,500</h3>
          <p>Total Earnings</p>
        </div>
        <div className="stat-card">
          <h3>4.8⭐</h3>
          <p>Average Rating</p>
        </div>
      </div>
    </div>
  );
}

export default RentalStats;
