import React from "react";
import "./Bookings.css";

function Bookings() {
  const bookings = [
    { id: 101, equipment: "Tractor", date: "2025-09-05", status: "Confirmed" },
    { id: 102, equipment: "Plough", date: "2025-09-06", status: "Pending" },
    { id: 103, equipment: "Harvester", date: "2025-09-07", status: "Cancelled" },
  ];

  return (
    <div className="bookings-container">
      <h2>📑 My Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Equipment</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.equipment}</td>
              <td>{b.date}</td>
              <td>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Bookings;
