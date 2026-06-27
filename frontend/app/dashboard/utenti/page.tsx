"use client";

import { useState, useEffect, useCallback } from "react";

// =============================================================================
// TYPES
// =============================================================================
interface Utente {
  id: number;
  nome: string | null;
  cognome: string | null;
  username: string | null;
  livello: number | null;
  sede: string | null;
  interno: string | null;
  e_mail: string | null;
  costo_studio: number | null;
  costo_clienti: number | null;
  flg_abilitazione: boolean | null;
  flg_filtro_clienti: boolean | null;
  scad_pswd: string | null;
}

interface UtenteForm {
  nome: string;
  cognome: string;
  username: string;
  password: string;
  scad_pswd: string;
  livello: string;
  sede: string;
  interno: string;
  e_mail: string;
  costo_studio: string;
  costo_clienti: string;
  flg_abilitazione: boolean;
  flg_filtro_clienti: boolean;
}

const emptyForm: UtenteForm = {
  nome: "",
  cognome: "",
  username: "",
  password: "",
  scad_pswd: "",
  livello: "",
  sede: "",
  interno: "",
  e_mail: "",
  costo_studio: "",
  costo_clienti: "",
  flg_abilitazione: true,
  flg_filtro_clienti: false,
};

// =============================================================================
// ICONS
// =============================================================================
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const IconToggle = ({ enabled }: { enabled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    {enabled ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    )}
  </svg>
);

const IconDelete = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// =============================================================================
// TOAST NOTIFICATION
// =============================================================================
interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium
            animate-slide-in min-w-[280px]
            ${toast.type === "success" ? "bg-success" : toast.type === "error" ? "bg-danger" : "bg-info"}
          `}
        >
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => onDismiss(toast.id)} className="opacity-70 hover:opacity-100 transition-opacity">
            <IconClose />
          </button>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function UtentiPage() {
  const [utenti, setUtenti] = useState<Utente[]>([]);
  const [loading, setLoading] = useState(false);
  const [nomeFilter, setNomeFilter] = useState("");
  const [cognomeFilter, setCognomeFilter] = useState("");
  const [abilitazioneFilter, setAbilitazioneFilter] = useState<string>("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<UtenteForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  let toastIdCounter = 0;

  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Date.now() + (toastIdCounter++);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // -------------------------------------------------------------------------
  // FETCH
  // -------------------------------------------------------------------------
  const fetchUtenti = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (nomeFilter) params.append("nome", nomeFilter);
      if (cognomeFilter) params.append("cognome", cognomeFilter);
      if (abilitazioneFilter !== "") params.append("abilitazione", abilitazioneFilter);

      const res = await fetch(`http://localhost:8000/api/utenti?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setUtenti(await res.json());
      } else {
        addToast("Errore nel caricamento utenti", "error");
      }
    } catch {
      addToast("Errore di connessione al server", "error");
    } finally {
      setLoading(false);
    }
  }, [nomeFilter, cognomeFilter, abilitazioneFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    fetchUtenti();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUtenti();
  };

  // -------------------------------------------------------------------------
  // MODAL (Create / Edit)
  // -------------------------------------------------------------------------
  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (u: Utente) => {
    setEditingId(u.id);
    setForm({
      nome: u.nome || "",
      cognome: u.cognome || "",
      username: u.username || "",
      password: "",
      scad_pswd: u.scad_pswd ? u.scad_pswd.substring(0, 10) : "",
      livello: u.livello != null ? String(u.livello) : "",
      sede: u.sede || "",
      interno: u.interno || "",
      e_mail: u.e_mail || "",
      costo_studio: u.costo_studio != null ? String(u.costo_studio) : "",
      costo_clienti: u.costo_clienti != null ? String(u.costo_clienti) : "",
      flg_abilitazione: u.flg_abilitazione ?? true,
      flg_filtro_clienti: u.flg_filtro_clienti ?? false,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.username.trim()) {
      addToast("Il campo Username è obbligatorio", "error");
      return;
    }
    if (!editingId && !form.password.trim()) {
      addToast("Il campo Password è obbligatorio per un nuovo utente", "error");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const isEdit = editingId !== null;
      const url = isEdit
        ? `http://localhost:8000/api/utenti/${editingId}`
        : `http://localhost:8000/api/utenti`;

      const body: Record<string, unknown> = {
        nome: form.nome || null,
        cognome: form.cognome || null,
        username: form.username,
        scad_pswd: form.scad_pswd ? `${form.scad_pswd}T00:00:00` : null,
        livello: form.livello ? parseInt(form.livello) : null,
        sede: form.sede || null,
        interno: form.interno || null,
        e_mail: form.e_mail || null,
        costo_studio: form.costo_studio ? parseFloat(form.costo_studio) : null,
        costo_clienti: form.costo_clienti ? parseFloat(form.costo_clienti) : null,
        flg_abilitazione: form.flg_abilitazione,
        flg_filtro_clienti: form.flg_filtro_clienti,
      };

      // Only send password if filled in
      if (form.password.trim()) {
        body.password = form.password;
      }

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        addToast(isEdit ? "Utente aggiornato con successo" : "Utente creato con successo");
        setModalOpen(false);
        fetchUtenti();
      } else {
        const err = await res.json().catch(() => ({ detail: "Errore sconosciuto" }));
        addToast(err.detail || "Errore nel salvataggio", "error");
      }
    } catch {
      addToast("Errore di connessione al server", "error");
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // TOGGLE
  // -------------------------------------------------------------------------
  const handleToggle = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/utenti/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        addToast("Stato utente aggiornato");
        fetchUtenti();
      } else {
        addToast("Errore nell'aggiornamento", "error");
      }
    } catch {
      addToast("Errore di connessione", "error");
    }
  };

  // -------------------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------------------
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/utenti/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        addToast("Utente eliminato con successo");
        setDeleteConfirm(null);
        fetchUtenti();
      } else {
        addToast("Errore nell'eliminazione", "error");
      }
    } catch {
      addToast("Errore di connessione", "error");
    }
  };

  // -------------------------------------------------------------------------
  // FORM HELPERS
  // -------------------------------------------------------------------------
  const updateField = (field: keyof UtenteForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <>
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
      `}</style>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main">Gestione Utenti</h1>
            <p className="text-text-muted mt-1">
              Visualizza, crea e gestisci gli utenti del sistema.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-hover transition-colors shadow-sm"
          >
            <IconPlus />
            Nuovo Utente
          </button>
        </div>

        {/* Filters */}
        <div className="bg-bg-base p-5 rounded-lg shadow-sm border border-border-divider">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-semibold text-text-main mb-1">Nome</label>
              <input
                type="text"
                value={nomeFilter}
                onChange={(e) => setNomeFilter(e.target.value)}
                className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                placeholder="Cerca per nome..."
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-semibold text-text-main mb-1">Cognome</label>
              <input
                type="text"
                value={cognomeFilter}
                onChange={(e) => setCognomeFilter(e.target.value)}
                className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                placeholder="Cerca per cognome..."
              />
            </div>
            <div className="w-full sm:w-44">
              <label className="block text-sm font-semibold text-text-main mb-1">Stato</label>
              <select
                value={abilitazioneFilter}
                onChange={(e) => setAbilitazioneFilter(e.target.value)}
                className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm bg-white"
              >
                <option value="">Tutti</option>
                <option value="true">Abilitati</option>
                <option value="false">Disabilitati</option>
              </select>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-hover transition-colors h-[42px] shrink-0"
            >
              <IconSearch />
              Filtra
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-bg-base rounded-lg shadow-sm border border-border-divider overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-main">
              <thead className="bg-secondary text-text-main font-bold border-b border-border-divider">
                <tr>
                  <th className="px-4 py-3.5 whitespace-nowrap">ID</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Nome</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Cognome</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Utente</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Livello</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Sede</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Email</th>
                  <th className="px-4 py-3.5 whitespace-nowrap text-center">Stato</th>
                  <th className="px-4 py-3.5 whitespace-nowrap text-center">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-text-muted">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Caricamento in corso...
                      </div>
                    </td>
                  </tr>
                ) : utenti.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-text-muted">
                      Nessun utente trovato.
                    </td>
                  </tr>
                ) : (
                  utenti.map((u, i) => (
                    <tr
                      key={u.id}
                      className={`${
                        i % 2 === 0 ? "bg-bg-base" : "bg-surface"
                      } hover:bg-primary/5 transition-colors`}
                    >
                      <td className="px-4 py-3 font-medium text-text-muted">{u.id}</td>
                      <td className="px-4 py-3">{u.nome || "—"}</td>
                      <td className="px-4 py-3">{u.cognome || "—"}</td>
                      <td className="px-4 py-3 font-mono font-bold text-sm">{u.username || "—"}</td>
                      <td className="px-4 py-3 text-center">{u.livello ?? "—"}</td>
                      <td className="px-4 py-3">{u.sede || "—"}</td>
                      <td className="px-4 py-3 text-sm">{u.e_mail || "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.flg_abilitazione
                              ? "bg-success/15 text-success"
                              : "bg-danger/15 text-danger"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.flg_abilitazione ? "bg-success" : "bg-danger"}`} />
                          {u.flg_abilitazione ? "Attivo" : "Disattivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(u)}
                            title="Modifica"
                            className="p-2 rounded-md text-primary hover:bg-primary/10 transition-colors"
                          >
                            <IconEdit />
                          </button>
                          <button
                            onClick={() => handleToggle(u.id)}
                            title={u.flg_abilitazione ? "Disabilita" : "Abilita"}
                            className={`p-2 rounded-md transition-colors ${
                              u.flg_abilitazione
                                ? "text-warning hover:bg-warning/10"
                                : "text-success hover:bg-success/10"
                            }`}
                          >
                            <IconToggle enabled={u.flg_abilitazione ?? false} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(u.id)}
                            title="Elimina"
                            className="p-2 rounded-md text-danger hover:bg-danger/10 transition-colors"
                          >
                            <IconDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Row count */}
          {!loading && utenti.length > 0 && (
            <div className="px-4 py-3 border-t border-border-divider text-sm text-text-muted bg-surface/50">
              {utenti.length} utent{utenti.length === 1 ? "e" : "i"} trovato{utenti.length === 1 ? "" : "i"}
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* CREATE / EDIT MODAL */}
      {/* ================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border-divider px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
              <h2 className="text-lg font-bold text-text-main">
                {editingId ? "Modifica Utente" : "Nuovo Utente"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-md text-text-muted hover:bg-surface transition-colors"
              >
                <IconClose />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Row: Nome + Cognome */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Nome</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => updateField("nome", e.target.value)}
                    className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Cognome</label>
                  <input
                    type="text"
                    value={form.cognome}
                    onChange={(e) => updateField("cognome", e.target.value)}
                    className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
              </div>

              {/* Row: Username + Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">
                    Username <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => updateField("username", e.target.value)}
                    className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">
                    Password {!editingId && <span className="text-danger">*</span>}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    placeholder={editingId ? "Lascia vuoto per non cambiare" : ""}
                  />
                </div>
              </div>

              {/* Row: Livello */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1">Livello</label>
                <input
                  type="number"
                  value={form.livello}
                  onChange={(e) => updateField("livello", e.target.value)}
                  className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  min="0"
                />
              </div>

              {/* Row: Sede + Interno */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Sede</label>
                  <input
                    type="text"
                    value={form.sede}
                    onChange={(e) => updateField("sede", e.target.value)}
                    className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Interno (Tel.)</label>
                  <input
                    type="text"
                    value={form.interno}
                    onChange={(e) => updateField("interno", e.target.value)}
                    className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
              </div>

              {/* Row: Email */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1">Email</label>
                <input
                  type="email"
                  value={form.e_mail}
                  onChange={(e) => updateField("e_mail", e.target.value)}
                  className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>

              {/* Row: Costi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Costo Studio (€/h)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.costo_studio}
                    onChange={(e) => updateField("costo_studio", e.target.value)}
                    className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Costo Clienti (€/h)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.costo_clienti}
                    onChange={(e) => updateField("costo_clienti", e.target.value)}
                    className="w-full rounded-md border border-border-divider p-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
              </div>

              {/* Row: Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border-divider hover:bg-surface/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.flg_abilitazione}
                    onChange={(e) => updateField("flg_abilitazione", e.target.checked)}
                    className="w-4 h-4 rounded border-border-divider text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-sm font-semibold text-text-main">Abilitato</span>
                    <p className="text-xs text-text-muted">L&apos;utente può accedere al sistema</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border-divider hover:bg-surface/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.flg_filtro_clienti}
                    onChange={(e) => updateField("flg_filtro_clienti", e.target.checked)}
                    className="w-4 h-4 rounded border-border-divider text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-sm font-semibold text-text-main">Filtro Clienti</span>
                    <p className="text-xs text-text-muted">Abilita il filtro clienti</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-border-divider px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-md border-2 border-border-divider text-sm font-semibold text-text-main hover:bg-surface transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {editingId ? "Salva Modifiche" : "Crea Utente"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ================================================================= */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                <IconDelete />
              </div>
              <div>
                <h3 className="font-bold text-text-main">Conferma Eliminazione</h3>
                <p className="mt-1 text-sm text-text-muted">
                  Sei sicuro di voler eliminare questo utente? Questa azione è irreversibile.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 rounded-md border-2 border-border-divider text-sm font-semibold text-text-main hover:bg-surface transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-5 py-2.5 rounded-md bg-danger text-white text-sm font-semibold hover:bg-danger/90 transition-colors"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
