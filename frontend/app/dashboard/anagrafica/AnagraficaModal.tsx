"use client";

import { useState, useEffect } from "react";

interface TabellaTipologia {
  codice: string;
  descrizione: string | null;
}

interface Utente {
  username: string;
  nome: string | null;
  cognome: string | null;
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  anagrafica: Anagrafica | null;
  tipologie: TabellaTipologia[];
  utenti: Utente[];
  onSave: (data: Partial<Anagrafica>, codice?: string | null) => Promise<void>;
}

export default function AnagraficaModal({ isOpen, onClose, anagrafica, tipologie, utenti, onSave }: Props) {
  const [formData, setFormData] = useState<Partial<Anagrafica>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (anagrafica) {
        setFormData({ ...anagrafica });
      } else {
        setFormData({
          cod_inaz: "",
          rag_sociale: "",
          cognome: "",
          nome: "",
          reparto: "",
          tipo: "",
          utente: "",
          sospeso: false,
          telefono1: "",
          cellulare1: "",
          email1: "",
          pec: "",
        });
      }
    }
  }, [isOpen, anagrafica]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData, anagrafica?.codice);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-bg-base rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-border-divider">
          <h2 className="text-xl font-bold text-text-main">
            {anagrafica ? "Modifica Anagrafica" : "Nuova Anagrafica"}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="anagrafica-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-main">Ragione Sociale</label>
              <input type="text" name="rag_sociale" value={formData.rag_sociale || ""} onChange={handleChange} className="w-full rounded border border-border-divider p-2" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-main">Codice INAZ</label>
              <input type="text" name="cod_inaz" value={formData.cod_inaz || ""} onChange={handleChange} className="w-full rounded border border-border-divider p-2" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-main">Nome</label>
              <input type="text" name="nome" value={formData.nome || ""} onChange={handleChange} className="w-full rounded border border-border-divider p-2" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-main">Cognome</label>
              <input type="text" name="cognome" value={formData.cognome || ""} onChange={handleChange} className="w-full rounded border border-border-divider p-2" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-main">Reparto</label>
              <input type="text" name="reparto" value={formData.reparto || ""} onChange={handleChange} className="w-full rounded border border-border-divider p-2" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-main">Tipo Anagrafica</label>
              <select name="tipo" value={formData.tipo || ""} onChange={handleChange} className="w-full rounded border border-border-divider p-2 bg-white">
                <option value="">Seleziona...</option>
                {tipologie.map(t => (
                  <option key={t.codice} value={t.codice}>{t.descrizione}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-main">Referente / Utente</label>
              <select name="utente" value={formData.utente || ""} onChange={handleChange} className="w-full rounded border border-border-divider p-2 bg-white">
                <option value="">Seleziona...</option>
                {utenti.map(u => (
                  <option key={u.username} value={u.username}>
                    {[u.nome, u.cognome].filter(Boolean).join(" ") || u.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-main">Telefono</label>
              <input type="text" name="telefono1" value={formData.telefono1 || ""} onChange={handleChange} className="w-full rounded border border-border-divider p-2" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-main">Cellulare</label>
              <input type="text" name="cellulare1" value={formData.cellulare1 || ""} onChange={handleChange} className="w-full rounded border border-border-divider p-2" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-main">Email</label>
              <input type="email" name="email1" value={formData.email1 || ""} onChange={handleChange} className="w-full rounded border border-border-divider p-2" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-main">PEC</label>
              <input type="email" name="pec" value={formData.pec || ""} onChange={handleChange} className="w-full rounded border border-border-divider p-2" />
            </div>

            <div className="flex items-center mt-6">
              <label className="flex items-center space-x-2 text-sm font-semibold text-text-main cursor-pointer">
                <input type="checkbox" name="sospeso" checked={formData.sospeso || false} onChange={handleChange} className="w-4 h-4 rounded border-border-divider text-primary focus:ring-primary" />
                <span>Anagrafica Sospesa</span>
              </label>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-border-divider flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-border-divider text-text-main hover:bg-surface transition-colors">
            Annulla
          </button>
          <button type="submit" form="anagrafica-form" disabled={saving} className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50">
            {saving ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
}
