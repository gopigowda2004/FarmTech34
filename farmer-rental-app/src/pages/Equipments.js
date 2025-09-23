import React from "react";
import { useI18n } from "../i18n/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";

function Equipments() {
  const { t } = useI18n();
  const equipments = [
    { id: 1, name: t("equip.tractor.name"), price: t("common.priceDay").replace("{price}", "1500") },
    { id: 2, name: t("equip.plough.name"), price: t("common.priceDay").replace("{price}", "500") },
    { id: 3, name: t("equip.seedDrill.name"), price: t("common.priceDay").replace("{price}", "800") },
    { id: 4, name: t("equip.harvester.name"), price: t("common.priceDay").replace("{price}", "2500") },
  ];

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>🚜 {t("equipmentList.title")}</h2>
        <LanguageSwitcher inline />
      </div>
      <div style={styles.grid}>
        {equipments.map((eq) => (
          <div key={eq.id} style={styles.card}>
            <h3>{eq.name}</h3>
            <p>{eq.price}</p>
            <button style={styles.button}>{t("btn.rentNow")}</button>
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