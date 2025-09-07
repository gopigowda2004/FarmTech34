import React, { useState } from "react";
import axios from "axios";

const RentEquipment = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: ""
  });

  const farmerId = localStorage.getItem("farmerId"); // stored after login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/equipments/add/${farmerId}`, formData);
      alert("✅ Equipment rented successfully!");
      setFormData({ name: "", description: "", price: "", image: "" });
    } catch (error) {
      alert("❌ Error renting equipment");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Rent Out Equipment</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Equipment Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Rent Equipment
        </button>
      </form>
    </div>
  );
};

export default RentEquipment;
