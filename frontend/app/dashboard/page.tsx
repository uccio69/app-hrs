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
  tipo: string | null;
}

export default function DashboardPage() {
  const [data, setData] = useState<Anagrafica[]>([]);
  const [tipologie, setTipologie] = useState<TabellaTipologia[]>([]);

  // Filters
  const [codicePaghe, setCodicePaghe] = useState("");
  const [codiceUnivoco, setCodiceUnivoco] = useState("");
  const [nominativo, setNominativo] = useState("");
  const [tipo, setTipo] = useState("");

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

  const fetchAnagrafica = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (codicePaghe) params.append("codice_paghe", codicePaghe);
      if (codiceUnivoco) params.append("codice_univoco", codiceUnivoco);
      if (nominativo) params.append("nominativo", nominativo);
      if (tipo) params.append("tipo", tipo);

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
    fetchAnagrafica();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnagrafica();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Elenco Anagrafica</h1>
          <p className="text-text-muted mt-1">Gestione e consultazione anagrafiche dipendenti e aziende.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-bg-base p-6 rounded-lg shadow-sm border border-border-divider">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-text-main mb-1">Codice Paghe</label>
            <input
              type="text"
              value={codicePaghe}
              onChange={e => setCodicePaghe(e.target.value)}
              className="w-full rounded border border-border-divider p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Cerca per codice paghe..."
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-text-main mb-1">Codice Univoco</label>
            <input
              type="text"
              value={codiceUnivoco}
              onChange={e => setCodiceUnivoco(e.target.value)}
              className="w-full rounded border border-border-divider p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Cerca per codice univoco..."
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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-main">
            <thead className="bg-secondary text-text-main font-bold border-b border-border-divider">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Codice Paghe</th>
                <th className="px-6 py-4 whitespace-nowrap">Codice Univoco</th>
                <th className="px-6 py-4 whitespace-nowrap">Ragione Sociale</th>
                <th className="px-6 py-4 whitespace-nowrap">Cognome</th>
                <th className="px-6 py-4 whitespace-nowrap">Nome</th>
                <th className="px-6 py-4 whitespace-nowrap">Tipo Anagrafica</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                    Caricamento in corso...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
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
                      <td className="px-6 py-3">{item.cognome || "—"}</td>
                      <td className="px-6 py-3">{item.nome || "—"}</td>
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
