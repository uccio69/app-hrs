"use client";

import { useState, useEffect } from "react";

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

export default function AnagraficaPage() {
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
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    fetchAnagrafica();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnagrafica();
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-text-muted">
                    Caricamento in corso...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-text-muted">
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
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
