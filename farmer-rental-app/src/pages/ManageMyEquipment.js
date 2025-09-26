import React, { useEffect, useMemo, useState, useCallback } from "react";
import api from "../api/axiosInstance";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function ManageMyEquipment() {
  const { t } = useI18n();
  const farmerId = localStorage.getItem("farmerId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [items, setItems] = useState([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");

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

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    if (!window.confirm(t("manageMy.deleteConfirm"))) return;
    try {
      await api.delete(`/equipments/${id}`, { params: { farmerId } });
      await load();
      setToast(t("manageMy.deleteSuccess"));
    } catch (e) {
      setError(t("manageMy.deleteFailed"));
    }
  };

  // ✅ filter + sort
  const filteredItems = useMemo(() => {
    let list = [...items];
    if (search) {
      list = list.filter(
        (it) =>
          it.name.toLowerCase().includes(search.toLowerCase()) ||
          it.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sort === "lowPrice") list.sort((a, b) => a.price - b.price);
    if (sort === "highPrice") list.sort((a, b) => b.price - a.price);
    return list;
  }, [items, search, sort]);

  return (
    <div style={styles.container}>
      {/* Banner Header */}
      <div style={styles.banner}>
        <h2 style={styles.pageTitle}>{t("manageMy.title")}</h2>
        <LanguageSwitcher inline />
      </div>

      {/* Search + Sort */}
      <div style={styles.searchSort}>
        <input
          type="text"
          placeholder={t("manageMy.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={styles.input}
        >
          <option value="recent">{t("manageMy.sortRecent")}</option>
          <option value="lowPrice">{t("manageMy.sortLowPrice")}</option>
          <option value="highPrice">{t("manageMy.sortHighPrice")}</option>
        </select>
      </div>

      {/* Error */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Toast */}
      {toast && (
        <div style={styles.toast} onClick={() => setToast("")}>
          {toast}
        </div>
      )}

      {/* List */}
      {loading ? (
        <p>{t("manageMy.loading")}</p>
      ) : filteredItems.length === 0 ? (
        <p style={styles.empty}>{t("manageMy.noEquipment")}</p>
      ) : (
        <div style={styles.grid}>
          {filteredItems.map((it) => (
            <div
              key={it.id}
              style={styles.card}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {it.image && (
                <img src={it.image} alt={it.name} style={styles.image} />
              )}
              <h3 style={styles.cardTitle}>{it.name}</h3>
              <p style={styles.cardDesc}>{it.description}</p>
              <p style={styles.price}>
                <strong>{t("common.priceDay").replace("{price}", it.price)}</strong>
                {it.pricePerHour != null && (
                  <>
                    <span> · </span>
                    <strong>
                      {t("common.priceHour").replace("{price}", it.pricePerHour)}
                    </strong>
                  </>
                )}
              </p>
              <div style={styles.actions}>
                <button onClick={() => remove(it.id)} style={styles.dangerBtn}>
                  {t("common.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "20px",
    background: "#f9fafb",
    minHeight: "100vh",
  },
  banner: {
    background: "linear-gradient(135deg, #2f855a, #38a169)",
    padding: "30px 20px",
    borderRadius: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    color: "#fff",
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  searchSort: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #d1d5db",
    outline: "none",
    flex: 1,
    fontSize: "0.95rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 28,
  },
  card: {
    background: "#fff",
    padding: 18,
    borderRadius: 20,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 14,
    marginBottom: 14,
  },
  cardTitle: {
    margin: "8px 0",
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#374151",
  },
  cardDesc: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: 10,
    minHeight: 48,
  },
  price: {
    margin: "8px 0",
    fontWeight: "700",
    color: "#2f855a",
    fontSize: "1.05rem",
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 14,
  },
  dangerBtn: {
    flex: 1,
    padding: "10px 16px",
    border: "none",
    borderRadius: 9999, // pill button
    background: "linear-gradient(135deg,#dc2626,#b91c1c)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
  },
  error: { color: "#dc2626", marginBottom: 12, fontWeight: "600" },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 40 },
  toast: {
    background: "#2f855a",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: 12,
    marginBottom: 18,
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "600",
    boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
  },
};
