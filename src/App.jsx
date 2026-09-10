import { useState, useMemo } from "react";

const SECTORS = [
  "🍽️ Restaurant / Café / Snack",
  "🏨 Hôtel / Dar / Maison d'hôtes",
  "🛍️ Boutique / Artisanat / Souvenirs",
  "🏥 Clinique / Cabinet médical",
  "🦷 Cabinet dentaire",
  "🏋️ Salle de sport / Bien-être / Hammam",
  "🎓 École / Centre de formation",
  "🚗 Garage / Carrosserie",
  "⚖️ Avocat / Notaire / Comptable",
  "🏠 Agence immobilière",
  "✈️ Agence de voyage",
  "💈 Coiffeur / Salon de beauté",
  "🏪 Épicerie / Superette",
  "🐟 Poissonnier / Boucherie",
  "🎭 Salle de fêtes / Event",
  "Autre",
];

const ZONES = [
  "Houmt Souk", "Midoun", "Aghir", "Guellala",
  "Ajim", "El May", "Ghizen", "Mezraya",
  "Erriadh", "Sedouikech", "Beni Makhlouf", "Autre"
];

const STATUSES = [
  { key: "nouveau",     label: "Nouveau",        color: "#6366f1", bg: "#ede9fe" },
  { key: "contacté",   label: "Contacté",        color: "#0ea5e9", bg: "#e0f2fe" },
  { key: "rdv",        label: "RDV fixé",        color: "#f59e0b", bg: "#fef3c7" },
  { key: "proposition",label: "Proposition",     color: "#8b5cf6", bg: "#f3e8ff" },
  { key: "converti",   label: "✅ Client",        color: "#10b981", bg: "#d1fae5" },
  { key: "refusé",     label: "❌ Refusé",        color: "#ef4444", bg: "#fee2e2" },
  { key: "relance",    label: "🔄 À relancer",    color: "#f97316", bg: "#ffedd5" },
];

const SOURCES = [
  "Google Maps", "Facebook", "Terrain", "Bouche à oreille", "Autre"
];

const INITIAL_LEADS = [
  { id: 1, nom: "Restaurant Dar Djerba", secteur: "🍽️ Restaurant / Café / Snack", zone: "Houmt Souk", tel: "+216 75 XXX XXX", facebook: "oui", website: "non", source: "Google Maps", status: "nouveau", notes: "Grande salle, bonne fréquentation touristique", date: "2026-09-10" },
  { id: 2, nom: "Boutique Tapis El Henna", secteur: "🛍️ Boutique / Artisanat / Souvenirs", zone: "Midoun", tel: "", facebook: "oui", website: "non", source: "Terrain", status: "contacté", notes: "Propriétaire intéressé, rappeler semaine prochaine", date: "2026-09-08" },
  { id: 3, nom: "Salle de fêtes Al Farah", secteur: "🎭 Salle de fêtes / Event", zone: "Aghir", tel: "+216 75 XXX XXX", facebook: "non", website: "non", source: "Bouche à oreille", status: "rdv", notes: "RDV jeudi 12 sept à 15h", date: "2026-09-07" },
];

let nextId = 4;

const EMPTY_FORM = {
  nom: "", secteur: SECTORS[0], zone: ZONES[0],
  tel: "", facebook: "non", website: "non",
  source: SOURCES[0], status: "nouveau", notes: ""
};

function Badge({ status }) {
  const s = STATUSES.find(x => x.key === status) || STATUSES[0];
  return (
    <span style={{
      background: s.bg, color: s.color,
      borderRadius: 20, padding: "2px 12px",
      fontSize: 12, fontWeight: 600, whiteSpace: "nowrap"
    }}>{s.label}</span>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "18px 20px",
      boxShadow: "0 1px 6px rgba(0,0,0,.07)",
      display: "flex", alignItems: "center", gap: 14, minWidth: 130, flex: 1
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: color + "20", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 20
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#111", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

function Modal({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#fff", borderRadius: 18, width: "100%", maxWidth: 520,
        maxHeight: "90vh", overflow: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,.2)"
      }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const inp = {
  width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 9,
  padding: "9px 12px", fontSize: 14, outline: "none", boxSizing: "border-box",
  background: "#fafafa", fontFamily: "inherit"
};

export default function App() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("tous");
  const [filterSector, setFilterSector] = useState("tous");
  const [filterZone, setFilterZone] = useState("tous");
  const [search, setSearch] = useState("");
  const [showDetail, setShowDetail] = useState(null);
  const [sortBy, setSortBy] = useState("date");

  const filtered = useMemo(() => {
    let res = leads.filter(l => {
      if (filterStatus !== "tous" && l.status !== filterStatus) return false;
      if (filterSector !== "tous" && l.secteur !== filterSector) return false;
      if (filterZone !== "tous" && l.zone !== filterZone) return false;
      if (search && !l.nom.toLowerCase().includes(search.toLowerCase()) &&
          !l.zone.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    if (sortBy === "date") res = [...res].sort((a, b) => b.date.localeCompare(a.date));
    if (sortBy === "nom") res = [...res].sort((a, b) => a.nom.localeCompare(b.nom));
    if (sortBy === "status") res = [...res].sort((a, b) => STATUSES.findIndex(s => s.key === a.status) - STATUSES.findIndex(s => s.key === b.status));
    return res;
  }, [leads, filterStatus, filterSector, filterZone, search, sortBy]);

  const stats = useMemo(() => ({
    total: leads.length,
    clients: leads.filter(l => l.status === "converti").length,
    rdv: leads.filter(l => l.status === "rdv").length,
    contactés: leads.filter(l => ["contacté", "proposition", "rdv"].includes(l.status)).length,
    pipeline: leads.filter(l => !["converti", "refusé"].includes(l.status)).length,
  }), [leads]);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.nom.trim()) return;
    if (editId !== null) {
      setLeads(ls => ls.map(l => l.id === editId ? { ...form, id: editId, date: l.date } : l));
      setEditId(null);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setLeads(ls => [{ ...form, id: nextId++, date: today }, ...ls]);
    }
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleEdit = (lead) => {
    setForm({ ...lead });
    setEditId(lead.id);
    setShowForm(true);
    setShowDetail(null);
  };

  const handleDelete = (id) => {
    setLeads(ls => ls.filter(l => l.id !== id));
    setShowDetail(null);
  };

  const setStatusQuick = (id, status) => {
    setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l));
  };

  const detail = leads.find(l => l.id === showDetail);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
        padding: "24px 28px 20px", color: "#fff"
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, opacity: .7, textTransform: "uppercase", marginBottom: 4 }}>OMARSOFT — Jlidi Network Solutions</div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>🎯 Prospection Djerba</h1>
              <p style={{ margin: "4px 0 0", opacity: .8, fontSize: 13 }}>
                Établissements sans site web · Offre de création de site
              </p>
            </div>
            <button onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); }} style={{
              background: "#fff", color: "#1e40af", border: "none", borderRadius: 11,
              padding: "11px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer"
            }}>
              + Ajouter un prospect
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            <StatCard label="Total prospects" value={stats.total} color="#6366f1" icon="📋" />
            <StatCard label="En pipeline" value={stats.pipeline} color="#0ea5e9" icon="🔄" />
            <StatCard label="RDV fixés" value={stats.rdv} color="#f59e0b" icon="📅" />
            <StatCard label="✅ Clients" value={stats.clients} color="#10b981" icon="🤝" />
          </div>
        </div>
      </div>

      {/* Methodology banner */}
      <div style={{ background: "#1e3a8a", color: "#bfdbfe", fontSize: 12.5, padding: "10px 28px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          💡 <strong style={{ color: "#fff" }}>Comment trouver des prospects :</strong>{" "}
          Google Maps → chercher "restaurant Djerba" → repérer ceux sans site web · Facebook sans lien website · Prospection terrain Houmt Souk / Midoun · Annuaires tunisiens (pages.tn, tunisie-annuaire.com)
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>

        {/* Filters */}
        <div style={{
          background: "#fff", borderRadius: 14, padding: "14px 18px",
          marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,.06)",
          display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center"
        }}>
          <input
            placeholder="🔍 Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inp, width: 180, background: "#f8f9ff" }}
          />

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inp, width: "auto" }}>
            <option value="tous">Tous statuts</option>
            {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>

          <select value={filterSector} onChange={e => setFilterSector(e.target.value)} style={{ ...inp, width: "auto" }}>
            <option value="tous">Tous secteurs</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={filterZone} onChange={e => setFilterZone(e.target.value)} style={{ ...inp, width: "auto" }}>
            <option value="tous">Toutes zones</option>
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inp, width: "auto", marginLeft: "auto" }}>
            <option value="date">↓ Date</option>
            <option value="nom">A → Z</option>
            <option value="status">Statut</option>
          </select>

          <span style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Kanban quick-status */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
          {["tous", ...STATUSES.map(s => s.key)].map(k => {
            const s = STATUSES.find(x => x.key === k);
            const count = k === "tous" ? leads.length : leads.filter(l => l.status === k).length;
            return (
              <button key={k} onClick={() => setFilterStatus(k)} style={{
                padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                background: filterStatus === k ? (s ? s.bg : "#1e40af") : "#fff",
                color: filterStatus === k ? (s ? s.color : "#fff") : "#666",
                boxShadow: filterStatus === k ? `0 0 0 2px ${s ? s.color : "#1e40af"}` : "0 1px 4px rgba(0,0,0,.08)"
              }}>
                {k === "tous" ? "Tous" : s.label} <span style={{ opacity: .7 }}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Lead cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontWeight: 600 }}>Aucun prospect trouvé</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Ajoutez votre premier prospect avec le bouton ci-dessus</div>
            </div>
          )}
          {filtered.map(lead => (
            <div key={lead.id} style={{
              background: "#fff", borderRadius: 14, padding: "14px 18px",
              boxShadow: "0 1px 6px rgba(0,0,0,.06)",
              display: "flex", alignItems: "center", gap: 14,
              cursor: "pointer", transition: "box-shadow .15s",
              borderLeft: `4px solid ${STATUSES.find(s => s.key === lead.status)?.color || "#6366f1"}`
            }}
              onClick={() => setShowDetail(lead.id)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 3 }}>
                  {lead.nom}
                </div>
                <div style={{ fontSize: 12, color: "#888", display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span>📍 {lead.zone}</span>
                  <span>{lead.secteur.split(" ").slice(0, 3).join(" ")}</span>
                  {lead.tel && <span>📞 {lead.tel}</span>}
                  <span>📣 {lead.source}</span>
                  <span style={{ color: lead.facebook === "oui" ? "#1877f2" : "#ccc" }}>
                    {lead.facebook === "oui" ? "f Facebook ✓" : "f Pas de Facebook"}
                  </span>
                </div>
                {lead.notes && (
                  <div style={{ fontSize: 12, color: "#666", marginTop: 5, fontStyle: "italic" }}>
                    💬 {lead.notes.slice(0, 80)}{lead.notes.length > 80 ? "…" : ""}
                  </div>
                )}
              </div>

              {/* Quick status change */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                <Badge status={lead.status} />
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {["contacté", "rdv", "converti", "refusé"].map(s => (
                    <button key={s} onClick={e => { e.stopPropagation(); setStatusQuick(lead.id, s); }} style={{
                      fontSize: 10, padding: "3px 8px", border: "1px solid #e5e7eb",
                      borderRadius: 6, background: lead.status === s ? STATUSES.find(x => x.key === s)?.bg : "#f9f9f9",
                      cursor: "pointer", color: "#444", fontWeight: 600
                    }}>
                      {STATUSES.find(x => x.key === s)?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Export hint */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#999" }}>
          {leads.length > 0 && (
            <button onClick={() => {
              const rows = [
                ["Nom", "Secteur", "Zone", "Téléphone", "Facebook", "Source", "Statut", "Notes", "Date"],
                ...leads.map(l => [l.nom, l.secteur, l.zone, l.tel, l.facebook, l.source, l.status, l.notes, l.date])
              ];
              const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "prospects-djerba.csv"; a.click();
            }} style={{
              background: "transparent", border: "1.5px solid #d1d5db",
              borderRadius: 9, padding: "8px 18px", cursor: "pointer",
              fontSize: 12, color: "#555", fontWeight: 600
            }}>
              ⬇️ Exporter CSV ({leads.length} prospects)
            </button>
          )}
        </div>
      </div>

      {/* === FORM MODAL === */}
      <Modal show={showForm} onClose={() => { setShowForm(false); setEditId(null); }}>
        <div style={{ padding: "24px 24px 20px" }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 18, color: "#111" }}>
            {editId ? "✏️ Modifier le prospect" : "➕ Nouveau prospect"}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Nom de l'établissement *">
                <input style={inp} value={form.nom} onChange={e => setF("nom", e.target.value)} placeholder="Ex: Restaurant Dar Djerba" />
              </Field>
            </div>
            <div style={{ paddingRight: 8 }}>
              <Field label="Secteur d'activité">
                <select style={inp} value={form.secteur} onChange={e => setF("secteur", e.target.value)}>
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ paddingLeft: 8 }}>
              <Field label="Zone / Localité">
                <select style={inp} value={form.zone} onChange={e => setF("zone", e.target.value)}>
                  {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ paddingRight: 8 }}>
              <Field label="Téléphone">
                <input style={inp} value={form.tel} onChange={e => setF("tel", e.target.value)} placeholder="+216 XX XXX XXX" />
              </Field>
            </div>
            <div style={{ paddingLeft: 8 }}>
              <Field label="Source de découverte">
                <select style={inp} value={form.source} onChange={e => setF("source", e.target.value)}>
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ paddingRight: 8 }}>
              <Field label="A une page Facebook ?">
                <select style={inp} value={form.facebook} onChange={e => setF("facebook", e.target.value)}>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </Field>
            </div>
            <div style={{ paddingLeft: 8 }}>
              <Field label="Statut">
                <select style={inp} value={form.status} onChange={e => setF("status", e.target.value)}>
                  {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Notes">
                <textarea style={{ ...inp, resize: "vertical", minHeight: 70 }}
                  value={form.notes} onChange={e => setF("notes", e.target.value)}
                  placeholder="Infos importantes, contact, date de rappel..."
                />
              </Field>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={() => { setShowForm(false); setEditId(null); }} style={{
              padding: "10px 20px", borderRadius: 9, border: "1.5px solid #e5e7eb",
              background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#666"
            }}>Annuler</button>
            <button onClick={handleSubmit} disabled={!form.nom.trim()} style={{
              padding: "10px 24px", borderRadius: 9, border: "none",
              background: form.nom.trim() ? "#1e40af" : "#c7d2fe",
              color: "#fff", cursor: form.nom.trim() ? "pointer" : "not-allowed",
              fontSize: 14, fontWeight: 700
            }}>{editId ? "Enregistrer" : "Ajouter"}</button>
          </div>
        </div>
      </Modal>

      {/* === DETAIL MODAL === */}
      <Modal show={!!showDetail && !!detail} onClose={() => setShowDetail(null)}>
        {detail && (
          <div>
            <div style={{
              background: "linear-gradient(135deg, #1e40af, #3b82f6)",
              padding: "22px 24px", color: "#fff", borderRadius: "18px 18px 0 0"
            }}>
              <div style={{ fontSize: 11, opacity: .7, marginBottom: 4 }}>{detail.secteur}</div>
              <div style={{ fontWeight: 800, fontSize: 19 }}>{detail.nom}</div>
              <div style={{ opacity: .8, fontSize: 13, marginTop: 4 }}>📍 {detail.zone}</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ marginBottom: 16 }}>
                <Badge status={detail.status} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", marginBottom: 16 }}>
                {[
                  ["📞 Téléphone", detail.tel || "Non renseigné"],
                  ["📣 Source", detail.source],
                  ["f Facebook", detail.facebook === "oui" ? "✅ Oui" : "❌ Non"],
                  ["🌐 Site web", "❌ Non (à créer)"],
                  ["📅 Ajouté le", detail.date],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#222" }}>{v}</div>
                  </div>
                ))}
              </div>

              {detail.notes && (
                <div style={{
                  background: "#f8f9ff", borderRadius: 10, padding: "12px 14px",
                  fontSize: 13, color: "#444", marginBottom: 16, lineHeight: 1.6
                }}>
                  💬 {detail.notes}
                </div>
              )}

              {/* Quick status */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>Changer le statut rapidement :</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {STATUSES.map(s => (
                    <button key={s.key} onClick={() => { setStatusQuick(detail.id, s.key); setShowDetail(null); setShowDetail(detail.id); }} style={{
                      padding: "6px 12px", borderRadius: 8,
                      border: `2px solid ${detail.status === s.key ? s.color : "#e5e7eb"}`,
                      background: detail.status === s.key ? s.bg : "#fff",
                      color: detail.status === s.key ? s.color : "#555",
                      fontSize: 12, fontWeight: 600, cursor: "pointer"
                    }}>{s.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => handleEdit(detail)} style={{
                  flex: 1, padding: "11px", border: "1.5px solid #3b82f6",
                  borderRadius: 10, background: "#eff6ff", color: "#1e40af",
                  fontWeight: 700, cursor: "pointer", fontSize: 14
                }}>✏️ Modifier</button>
                <button onClick={() => handleDelete(detail.id)} style={{
                  padding: "11px 18px", border: "1.5px solid #fee2e2",
                  borderRadius: 10, background: "#fff5f5", color: "#ef4444",
                  fontWeight: 700, cursor: "pointer", fontSize: 14
                }}>🗑️</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
