"use client";

import { useState, useEffect } from "react";

interface Anagrafica {
  id: number;
  nome: string | null;
  cognome: string | null;
}

export default function DashboardPage() {
  const [data, setData] = useState<Anagrafica[]>([]);
  const [nomeFilter, setNomeFilter] = useState("");
  const [cognomeFilter, setCognomeFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAnagrafica = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (nomeFilter) params.append("nome", nomeFilter);
      if (cognomeFilter) params.append("cognome", cognomeFilter);

      const res = await fetch(`http://localhost:8000/api/anagrafica?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnagrafica();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnagrafica();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Elenco Anagrafica</h1>
          <p className="text-text-muted mt-1">Gestione e consultazione anagrafiche dipendenti.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-bg-base p-6 rounded-lg shadow-sm border border-border-divider">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-text-main mb-1">Nome</label>
            <input 
              type="text" 
              value={nomeFilter}
              onChange={e => setNomeFilter(e.target.value)}
              className="w-full rounded border border-border-divider p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Cerca per nome..."
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-text-main mb-1">Cognome</label>
            <input 
              type="text" 
              value={cognomeFilter}
              onChange={e => setCognomeFilter(e.target.value)}
              className="w-full rounded border border-border-divider p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Cerca per cognome..."
            />
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
        <table className="w-full text-left text-sm text-text-main">
          <thead className="bg-secondary text-text-main font-bold border-b border-border-divider">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Cognome</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-text-muted">
                  Caricamento in corso...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-text-muted">
                  Nessuna anagrafica trovata.
                </td>
              </tr>
            ) : (
              data.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? "bg-bg-base" : "bg-surface"}>
                  <td className="px-6 py-3 font-medium">{item.id}</td>
                  <td className="px-6 py-3">{item.nome}</td>
                  <td className="px-6 py-3 font-semibold">{item.cognome}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
