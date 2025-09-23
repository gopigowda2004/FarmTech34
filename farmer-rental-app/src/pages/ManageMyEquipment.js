import React, { useEffect, useMemo, useState, useCallback } from "react";
import api from "../api/axiosInstance";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";

// Single page to list, edit, and delete the logged-in farmer's equipment (no add here)
export default function ManageMyEquipment() {
  const { t } = useI18n();
  const farmerId = localStorage.getItem("farmerId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = useMemo(() => ({
    name: "",
    description: "",
    pricePerDay: "",
    pricePerHour: "",
    imageUrl: "",
  }), []);

  const [form, setForm] = useState(emptyForm);

  // Load my equipment
  const load = useCallback(async () => {
    if (!farmerId) {
      setError(t("addEquipment.alerts.missingFarmer"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/equipments/my/${farmerId}`);
      setItems(res.data || []);
    } catch (e) {
      setError(t("manageMy.updateFailed"));
    } finally {
      setLoading(false);
    }
  }, [farmerId, t]);

  useEffect(() => { load(); }, [load]);

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      description: item.description || "",
      pricePerDay: item.price != null ? String(item.price) : "",
      pricePerHour: item.pricePerHour != null ? String(item.pricePerHour) : "",
      imageUrl: item.image || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!farmerId) {
      setError(t("addEquipment.alerts.missingFarmer"));
      return;
    }
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.pricePerDay),
      pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : null,
      image: form.imageUrl,
    };
    try {
      await api.put(`/equipments/${editingId}`, payload, { params: { farmerId } });
      await load();
      cancelEdit();
    } catch (e) {
      setError(t("manageMy.updateFailed"));
    }
  };

  const remove = async (id) => {
    if (!window.confirm(t("manageMy.deleteConfirm"))) return;
    try {
      await api.delete(`/equipments/${id}`, { params: { farmerId } });
      await load();
    } catch (e) {
      setError(t("manageMy.deleteFailed"));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>{t("manageMy.title")}</h2>
        <LanguageSwitcher inline />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? <p>{t("manageMy.loading")}</p> : (
        <div style={styles.grid}>
          {items.map((it) => (
            <div key={it.id} style={styles.card}>
              {editingId === it.id ? (
                <EditForm form={form} onChange={onChange} onCancel={cancelEdit} onSave={save} />
              ) : (
                <ViewCard item={it} onEdit={() => startEdit(it)} onDelete={() => remove(it.id)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ViewCard({ item, onEdit, onDelete }) {
  const { t } = useI18n();
  return (
    <div>
      {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />}
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p>
        <strong>{t("common.priceDay").replace("{price}", item.price)}</strong>
        {item.pricePerHour != null && (
          <>
            <span> · </span>
            <strong>{t("common.priceHour").replace("{price}", item.pricePerHour)}</strong>
          </>
        )}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onEdit} style={styles.secondaryBtn}>{t("common.edit")}</button>
        <button onClick={onDelete} style={styles.dangerBtn}>{t("common.delete")}</button>
      </div>
    </div>
  );
}

function EditForm({ form, onChange, onCancel, onSave }) {
  const { t } = useI18n();
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input name="name" placeholder={t("manageMy.placeholders.name")} value={form.name} onChange={onChange} style={styles.input} />
      <textarea name="description" placeholder={t("manageMy.placeholders.description")} value={form.description} onChange={onChange} style={styles.textarea} />
      <input name="pricePerDay" type="number" placeholder={t("manageMy.placeholders.pricePerDay")} value={form.pricePerDay} onChange={onChange} style={styles.input} />
      <input name="pricePerHour" type="number" placeholder={t("manageMy.placeholders.pricePerHour")} value={form.pricePerHour} onChange={onChange} style={styles.input} />
      <input name="imageUrl" placeholder={t("manageMy.placeholders.imageUrl")} value={form.imageUrl} onChange={onChange} style={styles.input} />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onSave} style={styles.primaryBtn}>{t("common.save")}</button>
        <button onClick={onCancel} style={styles.secondaryBtn}>{t("common.cancel")}</button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1000, margin: "20px auto", padding: 16 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 },
  card: { background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  input: { padding: 10, borderRadius: 6, border: "1px solid #ccc" },
  textarea: { padding: 10, borderRadius: 6, border: "1px solid #ccc", minHeight: 80 },
  primaryBtn: { padding: "8px 12px", border: "none", borderRadius: 6, background: "#581c87", color: "#fff", cursor: "pointer" },
  secondaryBtn: { padding: "8px 12px", border: "1px solid #581c87", borderRadius: 6, background: "transparent", color: "#581c87", cursor: "pointer" },
  dangerBtn: { padding: "8px 12px", border: "none", borderRadius: 6, background: "#dc2626", color: "#fff", cursor: "pointer" },
  error: { color: "#dc2626", marginBottom: 8 },
};