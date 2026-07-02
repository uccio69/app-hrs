"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TabellaTipologia {
  codice: string;
  descrizione: string | null;
}

interface Anagrafica {
  codice: string | null;
  cod_inaz: string | null;
  rag_sociale: string | null;
  cognome: string | null;
  nome: string | null;
  reparto: string | null;
  tipo: string | null;
  utente: string | null;
  sospeso: boolean | null;
  telefono1: string | null;
  cellulare1: string | null;
  email1: string | null;
  pec: string | null;
}

interface Utente {
  username: string;
  nome: string | null;
  cognome: string | null;
}

import AnagraficaModal from "./AnagraficaModal";

export default function AnagraficaPage() {
  const router = useRouter();
  const [data, setData] = useState<Anagrafica[]>([]);
  const [tipologie, setTipologie] = useState<TabellaTipologia[]>([]);

  // Filters
  const [codicePaghe, setCodicePaghe] = useState("");
  const [codiceUnivoco, setCodiceUnivoco] = useState("");
  const [nominativo, setNominativo] = useState("");
  const [tipo, setTipo] = useState("");
  const [utente, setUtente] = useState("");
  const [utenti, setUtenti] = useState<Utente[]>([]);
  const [aziendeAttive, setAziendeAttive] = useState(true);

  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnagrafica, setEditingAnagrafica] = useState<Anagrafica | null>(null);

  // Fetch tipologie per la combobox
  const fetchTipologie = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/tipologia-anagrafica`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setTipologie(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUtenti = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/utenti?abilitazione=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUtenti(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnagrafica = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (codicePaghe) params.append("codice_paghe", codicePaghe);
      if (codiceUnivoco) params.append("codice_univoco", codiceUnivoco);
      if (nominativo) params.append("nominativo", nominativo);
      if (tipo) params.append("tipo", tipo);
      if (utente) params.append("utente", utente);
      if (aziendeAttive) params.append("aziende_attive", "true");

      const res = await fetch(`http://localhost:8000/api/anagrafica?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipologie();
    fetchUtenti();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnagrafica();
  };

  const openNewModal = () => {
    router.push("/dashboard/anagrafica/nuova");
  };

  const openEditModal = (item: Anagrafica) => {
    if (item.codice) {
      router.push(`/dashboard/anagrafica/modifica/${encodeURIComponent(item.codice)}`);
    }
  };

  const handleSaveAnagrafica = async (formData: Partial<Anagrafica>, codice?: string | null) => {
    const token = localStorage.getItem("token");
    const method = codice ? "PUT" : "POST";
    const url = codice 
      ? `http://localhost:8000/api/anagrafica/${codice}` 
      : `http://localhost:8000/api/anagrafica`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      throw new Error("Errore durante il salvataggio");
    }

    // Ricarica la lista dopo il salvataggio
    fetchAnagrafica();
  };

  const handleDeleteAnagrafica = async (item: Anagrafica) => {
    const ragSociale = item.rag_sociale || "Sconosciuta";
    const firstConfirm = window.confirm(`Sei sicuro di voler eliminare l'anagrafica "${ragSociale}"?`);
    if (!firstConfirm) return;

    const secondConfirm = window.confirm(`ATTENZIONE: L'eliminazione dell'anagrafica "${ragSociale}" è irreversibile. Confermi di nuovo l'eliminazione?`);
    if (!secondConfirm) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/anagrafica/${item.codice}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Errore durante l'eliminazione");
      }

      // Ricarica la lista dopo l'eliminazione
      fetchAnagrafica();
    } catch (err) {
      console.error(err);
      alert("Si è verificato un errore durante l'eliminazione.");
    }
  };

  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = [
      "Codice",
      "Codice INAZ",
      "Ragione Sociale",
      "Cognome",
      "Nome",
      "Reparto",
      "Telefono",
      "Cellulare",
      "Email",
      "PEC",
      "Tipo Anagrafica",
      "Utente",
      "Sospeso"
    ];

    const rows = data.map(item => {
      const tipoItem = tipologie.find(t => t.codice === item.tipo);
      return [
        item.codice || "",
        item.cod_inaz || "",
        item.rag_sociale || "",
        item.cognome || "",
        item.nome || "",
        item.reparto || "",
        item.telefono1 || "",
        item.cellulare1 || "",
        item.email1 || "",
        item.pec || "",
        tipoItem?.descrizione || item.tipo || "",
        item.utente || "",
        item.sospeso ? "Si" : "No"
      ];
    });

    const csvContent = [
      headers.join(";"),
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "anagrafiche.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Elenco Anagrafica</h1>
          <p className="text-text-muted mt-1">Gestione e consultazione anagrafiche dipendenti e aziende.</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={openNewModal}
            className="rounded bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nuova Anagrafica
          </button>
          <button
            onClick={handlePrint}
            className="rounded border border-border-divider bg-bg-base px-4 py-2 font-semibold text-text-main hover:bg-surface transition-colors"
          >
            Stampa
          </button>
          <button
            onClick={exportToCSV}
            className="rounded border border-border-divider bg-bg-base px-4 py-2 font-semibold text-text-main hover:bg-surface transition-colors"
          >
            Esporta CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-bg-base p-6 rounded-lg shadow-sm border border-border-divider print:hidden">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-text-main mb-1">ID</label>
            <input
              type="text"
              value={codiceUnivoco}
              onChange={e => setCodiceUnivoco(e.target.value)}
              className="w-full rounded border border-border-divider p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Cerca per codice univoco..."
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-text-main mb-1">Codice</label>
            <input
              type="text"
              value={codicePaghe}
              onChange={e => setCodicePaghe(e.target.value)}
              className="w-full rounded border border-border-divider p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Cerca per codice paghe..."
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-text-main mb-1">Nominativo</label>
            <input
              type="text"
              value={nominativo}
              onChange={e => setNominativo(e.target.value)}
              className="w-full rounded border border-border-divider p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Cerca per Rag. Sociale, Nome o Cognome..."
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-text-main mb-1">Tipo Anagrafica</label>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              className="w-full rounded border border-border-divider p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            >
              <option value="">Tutti</option>
              {tipologie.map(t => (
                <option key={t.codice} value={t.codice}>{t.descrizione}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-text-main mb-1">Referente</label>
            <select
              value={utente}
              onChange={e => setUtente(e.target.value)}
              className="w-full rounded border border-border-divider p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            >
              <option value="">Tutti</option>
              {utenti.map(u => (
                <option key={u.username} value={u.username}>
                  {[u.nome, u.cognome].filter(Boolean).join(" ") || u.username}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-none flex items-center mb-1">
            <label className="flex items-center space-x-2 text-sm font-semibold text-text-main cursor-pointer h-[42px]">
              <input
                type="checkbox"
                checked={aziendeAttive}
                onChange={e => setAziendeAttive(e.target.checked)}
                className="w-4 h-4 rounded border-border-divider text-primary focus:ring-primary"
              />
              <span>Aziende Attive</span>
            </label>
          </div>
          <button
            type="submit"
            className="rounded bg-primary px-5 py-2 font-semibold text-white hover:bg-primary-hover transition-colors h-[42px]"
          >
            Filtra
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-bg-base rounded-lg shadow-sm border border-border-divider overflow-hidden">
        <div className="overflow-auto max-h-[calc(100vh-320px)]">
          <table className="w-full text-left text-sm text-text-main relative">
            <thead className="bg-secondary text-text-main font-bold sticky top-0 z-10 shadow-[0_1px_0_0_theme(colors.border.divider)]">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">#</th>
                <th className="px-6 py-4 whitespace-nowrap">Codice</th>
                <th className="px-6 py-4 whitespace-nowrap">ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Ragione Sociale</th>
                <th className="px-6 py-4 whitespace-nowrap">Nominativo</th>
                <th className="px-6 py-4 whitespace-nowrap">Note</th>
                <th className="px-6 py-4 whitespace-nowrap">Telefono</th>
                <th className="px-6 py-4 whitespace-nowrap">Cellulare</th>
                <th className="px-6 py-4 whitespace-nowrap">Email</th>
                <th className="px-6 py-4 whitespace-nowrap">PEC</th>
                <th className="px-6 py-4 whitespace-nowrap">Tipo Anagrafica</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-text-muted">
                    Caricamento in corso...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-text-muted">
                    Nessuna anagrafica trovata.
                  </td>
                </tr>
              ) : (
                data.map((item, i) => {
                  const tipoItem = tipologie.find(t => t.codice === item.tipo);
                  return (
                    <tr key={item.codice} className={i % 2 === 0 ? "bg-bg-base" : "bg-surface"}>
                      <td className="px-6 py-3 font-medium text-text-muted">{item.codice}</td>
                      <td className="px-6 py-3 font-mono text-sm">{item.cod_inaz || "—"}</td>
                      <td className="px-6 py-3 font-mono text-sm">{item.codice || "—"}</td>
                      <td className="px-6 py-3 font-semibold">{item.rag_sociale || "—"}</td>
                      <td className="px-6 py-3">{[item.cognome, item.nome].filter(Boolean).join(" ") || "—"}</td>
                      <td className="px-6 py-3">{item.reparto || "—"}</td>
                      <td className="px-6 py-3">{item.telefono1 || "—"}</td>
                      <td className="px-6 py-3">{item.cellulare1 || "—"}</td>
                      <td className="px-6 py-3">{item.email1 || "—"}</td>
                      <td className="px-6 py-3">{item.pec || "—"}</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tipoItem?.descrizione || "Sconosciuto"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-text-muted hover:text-primary transition-colors p-1"
                          title="Modifica Anagrafica"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteAnagrafica(item)}
                          className="text-text-muted hover:text-red-600 transition-colors p-1 ml-2"
                          title="Elimina Anagrafica"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnagraficaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        anagrafica={editingAnagrafica}
        tipologie={tipologie}
        utenti={utenti}
        onSave={handleSaveAnagrafica}
      />
    </div>
  );
}
