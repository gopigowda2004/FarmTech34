import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function AddEquipment() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const farmerId = localStorage.getItem("farmerId");
  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerDay: "",
    pricePerHour: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!farmerId) {
      alert(t("addEquipment.alerts.missingFarmer"));
      return;
    }
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.pricePerDay), // per-day price expected as 'price'
      pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : null,
      image: form.imageUrl,
    };
    await axiosInstance.post(`/equipments/add`, payload, { params: { farmerId } });
    alert(t("dashboard.addForm.success"));
    navigate("/equipment-list");
  };

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>{t("addEquipment.title")}</h2>
        <LanguageSwitcher inline />
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="name" placeholder={t("addEquipment.fields.name")}
          value={form.name} onChange={handleChange} required style={styles.input}/>
        <textarea name="description" placeholder={t("addEquipment.fields.description")}
          value={form.description} onChange={handleChange} required style={styles.textarea}/>
        <input type="number" name="pricePerDay" placeholder={t("addEquipment.fields.pricePerDay")}
          value={form.pricePerDay} onChange={handleChange} required style={styles.input}/>
        <input type="number" name="pricePerHour" placeholder={t("addEquipment.fields.pricePerHour")}
          value={form.pricePerHour} onChange={handleChange} style={styles.input}/>
        <input type="text" name="imageUrl" placeholder={t("addEquipment.fields.imageUrl")}
          value={form.imageUrl} onChange={handleChange} required style={styles.input}/>
        <button type="submit" style={styles.button}>{t("addEquipment.button")}</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "500px", margin: "auto", padding: "20px", background: "#fff", borderRadius: "10px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  textarea: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "80px" },
  button: { padding: "10px", border: "none", borderRadius: "5px", background: "#581c87", color: "white", fontWeight: "bold", cursor: "pointer" }
};