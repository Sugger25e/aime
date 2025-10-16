import { useEffect, useMemo, useRef, useState } from "react";
import "./Home.css";
import floorplan from '../assets/floorpan.jpg'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [hazards, setHazards] = useState([]);
  const [draft, setDraft] = useState(null); // {xPct, yPct, hazardType, section, photoDataUrl, targetId?}
  const [activeId, setActiveId] = useState(null);
  // Zoom state (scroll to move)
  const [scale, setScale] = useState(1);
  const wrapRef = useRef(null);

  const HAZARDS = useMemo(() => [
    "Wet floor",
    "Obstruction",
    "Electrical",
    "Structural",
    "Other",
  ], []);
  const SECTIONS = useMemo(() => [
    "Grade 7 - Hydrogen",
    "Grade 7 - Oxygen",
    "Grade 7 - Carbon",
    "Grade 8 - Arthropoda",
    "Grade 8 - Mollusca",
    "Grade 8 - Chordata",
    "Grade 8 - Porifera",
    "Grade 9 - Dalton",
    "Grade 9 - Mendeleev",
    "Grade 9 - Thomson",
    "Grade 9 - Rutherford",
    "Grade 10 - Neutron",
    "Grade 10 - Photon",
    "Grade 10 - Graviton",
    "Grade 10 - Fermion",
    "Grade 11 - Mercury",
    "Grade 11 - Mars",
    "Grade 11 - Venus",
    "Grade 11- Earth",
    "Grade 12 - Capricorn",
    "Grade 12 - Pisces",
    "Grade 12 - Scorpio",
    "Grade 12 - Aries",
    "Grade 12 - Gemini"
  ], []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Smaller default zoom on small screens, then bump it +3 steps for mobile (0.7 + 0.3 = 1.0)
  useEffect(() => {
    const isPhone = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
    if (isPhone) setScale(1.0);
  }, []);

  // Helpers
  const formatDate = (iso) => {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "" : d.toLocaleString();
  };
  const pinColor = (h) => {
    const reports = h.reports && h.reports.length ? h.reports : [{ createdAt: h.createdAt || new Date().toISOString() }];
    const times = reports
      .map(r => Date.parse(r.createdAt || ""))
      .filter(t => !Number.isNaN(t));
    const oldest = times.length ? Math.min(...times) : Date.now();
    const w = (Date.now() - oldest) / (1000 * 60 * 60 * 24 * 7);
    if (w < 1) return "#2144bf"; // blue
    if (w < 2) return "#fbbf24"; // yellow
    if (w < 3) return "#fb923c"; // orange
    return "#ef4444"; // red
  };


  return (
    <div className="home-root">
      <header className="navbar" role="banner">
        <div className="nav-left">
          <button
            className="icon-button hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="6" width="18" height="2" rx="1" fill="#ffffff" />
              <rect x="3" y="11" width="18" height="2" rx="1" fill="#ffffff" />
              <rect x="3" y="16" width="18" height="2" rx="1" fill="#ffffff" />
            </svg>
          </button>
          <h1 className="app-title">APP NAME</h1>
        </div>
        <div className="navbar-spacer" />
        <div className="navbar-actions" aria-label="Primary actions">
          <button className="icon-button" aria-label="Network">
            <i className="fa-solid fa-signal" aria-hidden="true"></i>
          </button>
          <button className="icon-button" aria-label="Trophies">
            <i className="fa-solid fa-trophy" aria-hidden="true"></i>
          </button>
          <button className="icon-button" aria-label="Location">
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
          </button>
        </div>
      </header>

      <aside className={`side-drawer ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <nav className="drawer-nav" aria-label="App menu">
          <div className="menu-card" role="group" aria-label="Menu card">
            <button
              className="menu-close icon-button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
            <div className="menu-header">MENU</div>
            <div className="menu-profile">
              <div className="menu-avatar" aria-hidden="true">
                <i className="fa-solid fa-circle-question"></i>
              </div>
              <div>
                <div className="menu-name">User Name</div>
                <div className="menu-role">Student</div>
                <div className="menu-meta">Grade 12 • Section</div>
              </div>
            </div>
            <ul className="menu-list">
              <li>
                <a href="#problems" className="menu-item" onClick={() => setMenuOpen(false)}>
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>Problems Marked</span>
                </a>
              </li>
              <li>
                <a href="#customize" className="menu-item" onClick={() => setMenuOpen(false)}>
                  <i className="fa-solid fa-gear"></i>
                  <span>Customize</span>
                </a>
              </li>
              <li>
                <a href="#notifications" className="menu-item" onClick={() => setMenuOpen(false)}>
                  <i className="fa-solid fa-bell"></i>
                  <span>Notifications</span>
                </a>
              </li>
              <li>
                <a href="#help" className="menu-item" onClick={() => setMenuOpen(false)}>
                  <i className="fa-regular fa-circle-question"></i>
                  <span>Help</span>
                </a>
              </li>
              <li>
                <a href="#credits" className="menu-item" onClick={() => setMenuOpen(false)}>
                  <i className="fa-regular fa-circle-user"></i>
                  <span>Credits</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      <div className={`content ${adding ? "add-mode" : ""}`}>
  <div className="floor-wrap" ref={wrapRef}>
          <div
            className="floor-stage"
            style={{ "--zoom": scale }}
            onClick={(e) => {
              if (!adding) return;
              const stage = e.currentTarget;
              const rect = stage.getBoundingClientRect();
              // rect already accounts for scroll, so do NOT add scrollLeft/Top again
              const offsetX = e.clientX - rect.left;
              const offsetY = e.clientY - rect.top;
              const totalW = stage.offsetWidth || 1;
              const totalH = stage.offsetHeight || 1;
              const xPct = Math.min(1, Math.max(0, offsetX / totalW));
              const yPct = Math.min(1, Math.max(0, offsetY / totalH));
              setDraft({ xPct, yPct, hazardType: HAZARDS[0], section: SECTIONS[0], photoDataUrl: null, targetId: null });
            }}
            // Scroll (in parent) is used to move around; no pointer handlers here
          >
            <img src={floorplan} alt="Floor" className="floor" />

            {/* Existing pins */}
            {hazards.map((h) => (
              <button
                key={h.id}
                className="pin"
                style={{ left: `${h.xPct * 100}%`, top: `${h.yPct * 100}%`, color: pinColor(h) }}
                aria-label="Hazard pin"
                onClick={(ev) => { ev.stopPropagation(); setActiveId(h.id); }}
              >
                <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
              </button>
            ))}

            {/* Draft pin preview */}
            {draft && (
              <div className="pin pin--preview" style={{ left: `${draft.xPct * 100}%`, top: `${draft.yPct * 100}%` }}>
                <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
              </div>
            )}
          </div>

          {/* Zoom controls (fixed like FAB) */}
          <div className="zoom-controls" aria-label="Zoom controls">
            <button className="zoom-btn" onClick={() => setScale((s) => Math.max(0.5, s - 0.1))} aria-label="Zoom out">
              <i className="fa-solid fa-magnifying-glass-minus" aria-hidden="true"></i>
            </button>
            <button className="zoom-btn" onClick={() => setScale((s) => Math.min(3, s + 0.1))} aria-label="Zoom in">
              <i className="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i>
            </button>
            <button className="zoom-btn" onClick={() => { setScale(1); if (wrapRef.current) { wrapRef.current.scrollTo({ left: 0, top: 0, behavior: 'auto' }); } }} aria-label="Reset view">
              <i className="fa-solid fa-rotate" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      <footer className="bottom-bar" role="contentinfo">
        <div className="bottom-bar-inner">
          <button className="icon-button" aria-label="Network">
            <i className="fa-solid fa-signal" aria-hidden="true"></i>
          </button>
          <button className="icon-button" aria-label="Trophies">
            <i className="fa-solid fa-trophy" aria-hidden="true"></i>
          </button>
          <button className="icon-button" aria-label="Location">
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
          </button>
          <button className="icon-button" aria-label="Navigate">
            <i className="fa-solid fa-angle-up" aria-hidden="true"></i>
          </button>
        </div>
      </footer>

      <button className={`fab ${adding ? 'fab--active' : ''}`} aria-label={adding ? 'Cancel add' : 'Add'} onClick={() => {
        setAdding((a) => !a);
        setDraft(null);
        setActiveId(null);
      }}>
        <span className="fab-ring" />
        {adding ? (
          <i className="fa-solid fa-xmark fab-icon" aria-hidden="true"></i>
        ) : (
          <svg width="52" height="52" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="#ffd23f" />
            <path d="M12 6v12M6 12h12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Modal: Add or View */}
      {(draft !== null || activeId !== null) && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-card">
            {draft ? (
              <>
                <h2 className="modal-title">Report a hazard</h2>
                <form className="modal-form" onSubmit={(e) => {
                  e.preventDefault();
                  const report = { hazardType: draft.hazardType, section: draft.section, photoDataUrl: draft.photoDataUrl || null, createdAt: new Date().toISOString() };
                  if (draft.targetId) {
                    // Append to existing pin
                    setHazards((arr) => arr.map(h => h.id === draft.targetId ? { ...h, reports: [ ...(h.reports || []), report ] } : h));
                    setActiveId(draft.targetId);
                  } else {
                    const id = Date.now();
                    setHazards((arr) => [...arr, { id, xPct: draft.xPct, yPct: draft.yPct, reports: [report] }]);
                  }
                  setDraft(null);
                  setAdding(false);
                }}>
                  <label className="field">
                    <span>Hazard</span>
                    <select className="select-input" value={draft.hazardType} onChange={(e) => setDraft((d) => ({ ...d, hazardType: e.target.value }))}>
                      {HAZARDS.map((hz) => (
                        <option key={hz} value={hz}>{hz}</option>
                      ))}
                    </select>
                  </label>
                  {draft.targetId ? (
                    <div className="field">
                      <span>Grade/Section</span>
                      <div>{draft.section}</div>
                    </div>
                  ) : (
                    <label className="field">
                      <span>Grade/Section</span>
                      <select className="select-input" value={draft.section} onChange={(e) => setDraft((d) => ({ ...d, section: e.target.value }))}>
                        {SECTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="field">
                    <span>Photo (camera only)</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (!file) return;
                        if (!file.type.startsWith('image/')) return;
                        const reader = new FileReader();
                        reader.onload = () => setDraft((d) => ({ ...d, photoDataUrl: reader.result }));
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  {draft.photoDataUrl && (
                    <img src={draft.photoDataUrl} alt="Preview" className="photo-preview" />
                  )}
                  <div className="modal-actions">
                    <button type="button" className="btn" onClick={() => { setDraft(null); setAdding(false); }}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save</button>
                  </div>
                </form>
              </>
            ) : (
              (() => {
                const h = hazards.find(x => x.id === activeId);
                if (!h) return null;
                const reports = h.reports && h.reports.length ? h.reports : [{ hazardType: h.hazardType, section: h.section, photoDataUrl: h.photoDataUrl, createdAt: h.createdAt || new Date().toISOString() }];
                return (
                  <>
                    <h2 className="modal-title">Hazard details</h2>
                    <ul className="details-list">
                      {reports.map((r, idx) => (
                        <li key={idx} className="details-item">
                          <div><strong>Type:</strong> {r.hazardType}</div>
                          <div><strong>Section:</strong> {r.section}</div>
                          <div><strong>Date:</strong> {formatDate(r.createdAt)}</div>
                          {r.photoDataUrl && <img src={r.photoDataUrl} alt="Attachment" className="photo-preview" />}
                        </li>
                      ))}
                    </ul>
                    <div className="modal-actions">
                      <button type="button" className="btn" onClick={() => {
                        // Start a new report on this same pin; reuse the same section as already marked
                        const lastSection = (reports[reports.length - 1] && reports[reports.length - 1].section) || SECTIONS[0];
                        setDraft({ xPct: h.xPct, yPct: h.yPct, hazardType: HAZARDS[0], section: lastSection, photoDataUrl: null, targetId: h.id });
                      }}>Add another hazard</button>
                      <button type="button" className="btn btn-danger" onClick={() => { setHazards(arr => arr.filter(x => x.id !== activeId)); setActiveId(null); }}>Delete</button>
                      <button type="button" className="btn" onClick={() => setActiveId(null)}>Close</button>
                      <button type="button" className="btn btn-primary" onClick={() => alert('View details (prototype)')}>View details</button>
                    </div>
                  </>
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
}
