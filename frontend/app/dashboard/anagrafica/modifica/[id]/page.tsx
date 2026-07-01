"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// =============================================================================
// TYPES
// =============================================================================

interface TabellaTipologia {
  codice: string;
  descrizione: string | null;
}

interface TabellaSettori {
  id: number;
  descrizione: string | null;
}

interface TabellaCCNL {
  id: number;
  codice: string | null;
  descrizione: string | null;
  settore: string | null;
}

interface Utente {
  username: string;
  nome: string | null;
  cognome: string | null;
}

interface MatricolaINPS {
  matricola: string;
  sede: string;
  descrizione: string;
}

interface PATINAIL {
  pat: string;
  descrizione: string;
}

interface LetteraIntento {
  numero: string;
  data: string;
  scadenza: string;
  importo: number;
  descrizione: string;
}

// =============================================================================
// TAB CONFIGURATION
// =============================================================================

const TABS = [
  { id: "generali", label: "Dati Generali", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { id: "sedi", label: "Sedi", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "fiscali", label: "Dati Fiscali", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: "contatti", label: "Contatti", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
  { id: "referenti", label: "Referenti", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "rp", label: "Rappr. Legale", icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "delegato", label: "Delegato Firma", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" },
  { id: "titolare", label: "Titolare Eff.", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { id: "banca", label: "Dati Bancari", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { id: "fornitore", label: "Fornitore", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { id: "costi", label: "Costo Dip.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "fatturazione", label: "Fatturazione", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" },
  { id: "note", label: "Note & Flag", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
  { id: "subtabelle", label: "Sub-tabelle", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function InputField({ label, name, value, onChange, type = "text", placeholder = "", required = false, className = "" }: {
  label: string; name: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string; required?: boolean; className?: string;
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-semibold text-text-main">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-border-divider p-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, children, className = "" }: {
  label: string; name: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-semibold text-text-main">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-border-divider p-2.5 text-sm bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
      >
        {children}
      </select>
    </div>
  );
}

function CheckboxField({ label, name, checked, onChange }: {
  label: string; name: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-text-main cursor-pointer py-1">
      <input type="checkbox" name={name} checked={checked} onChange={onChange}
        className="w-4 h-4 rounded border-border-divider text-primary focus:ring-primary" />
      <span>{label}</span>
    </label>
  );
}

function TextAreaField({ label, name, value, onChange, rows = 3 }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-text-main">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full rounded-md border border-border-divider p-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-y"
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-bold text-primary border-b border-border-divider pb-2 mb-4">{children}</h3>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ModificaAnagraficaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState("generali");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Lookup data
  const [tipologie, setTipologie] = useState<TabellaTipologia[]>([]);
  const [settori, setSettori] = useState<TabellaSettori[]>([]);
  const [ccnlList, setCcnlList] = useState<TabellaCCNL[]>([]);
  const [utenti, setUtenti] = useState<Utente[]>([]);

  // Sub-tabelle (inline editing)
  const [matricoleINPS, setMatricoleINPS] = useState<MatricolaINPS[]>([]);
  const [patINAIL, setPatINAIL] = useState<PATINAIL[]>([]);
  const [lettereIntento, setLettereIntento] = useState<LetteraIntento[]>([]);

  // =========================================================================
  // FORM STATE — tutti i campi dell'Anagrafica
  // =========================================================================
  const [f, setF] = useState({
    // Dati Generali
    cod_inaz: "", cod_zucchetti: "000", forma: "Spett.le", rag_sociale: "",
    tipologia: 0, settore: 0, attivita: "", cod_ateco: "",
    data_costituzione: "", data_ini_attivita: "",
    registrazione: "", registrazione_citta: "", registrazione_data: "",
    ccnl: "000", pa: false,
    titolo: "", cognome: "", nome: "", reparto: "",
    // Sede Legale
    indirizzo: "", cap: "", citta: "", provincia: "",
    // Sede 1
    sede1_indirizzo: "", sede1_cap: "", sede1_citta: "", sede1_provincia: "",
    // Sede 2
    sede2_indirizzo: "", sede2_cap: "", sede2_citta: "", sede2_provincia: "",
    // Dati Fiscali
    partita_iva: "", codice_fiscale: "", indirizzo_residenza: "",
    luogo_nascita: "", data_nascita: "", estremi_documento: "",
    // Secondo Indirizzo
    forma2: "Spett.le", rag_sociale2: "", titolo2: "", cognome2: "", nome2: "",
    indirizzo2: "", cap2: "", citta2: "", provincia2: "",
    // Tipo
    tipo: "",
    // Contatti
    telefono1: "", telefono2: "", fax1: "", fax2: "",
    cellulare1: "", cellulare2: "", pec: "", email1: "", email2: "",
    // Contatti Cliente 1-7
    contatto_cliente1: "", qualifica1: "", tel_contatto1: "", cell_contatto1: "", email_contatto1: "",
    contatto_cliente2: "", qualifica2: "", tel_contatto2: "", cell_contatto2: "", email_contatto2: "",
    contatto_cliente3: "", qualifica3: "", tel_contatto3: "", cell_contatto3: "", email_contatto3: "",
    contatto_cliente4: "", qualifica4: "", tel_contatto4: "", cell_contatto4: "", email_contatto4: "",
    contatto_cliente5: "", qualifica5: "", tel_contatto5: "", cell_contatto5: "", email_contatto5: "",
    contatto_cliente6: "", qualifica6: "", tel_contatto6: "", cell_contatto6: "", email_contatto6: "",
    contatto_cliente7: "", qualifica7: "", tel_contatto7: "", cell_contatto7: "", email_contatto7: "",
    // Referenti
    referente_interno1: "", referente_interno2: "", referente_interno3: "",
    // Banca
    banca: "", cin: "", cab: "", abi: "", cc: "",
    nazione: "IT", prefisso_nazione: "", iban: "",
    // Flag & Note
    privacy: false, sospeso: false, cr_hold: false, comm_hold: "",
    esposizione: 0, commento1: "", commento2: "",
    flag1: false, flag2: false, flag3: false,
    indic_agg: false, utente: "",
    // Intento
    intento_numero: "", intento_data: "", intento_scadenza: "",
    // Rappresentante Legale
    rp_nome: "", rp_cognome: "", rp_cf: "", rp_email: "", rp_pec: "",
    rp_indirizzo_residenza: "", rp_cap_residenza: "", rp_citta_residenza: "", rp_prov_residenza: "",
    rp_luogo_nascita: "", rp_data_nascita: "", rp_nazionalita: "",
    rp_tipo_documento: "", rp_estremi_documento: "", rp_rilasciato_da_documento: "",
    rp_rilasciato_il_documento: "", rp_scadenza_documento: "", rp_carica: "",
    // Delegato
    dl_nome: "", dl_cognome: "", dl_cf: "",
    dl_indirizzo_residenza: "", dl_luogo_nascita: "", dl_data_nascita: "",
    dl_estremi_documento: "", dl_carica: "",
    // Titolare Effettivo
    te_nome: "", te_cognome: "", te_cf: "",
    te_indirizzo_residenza: "", te_luogo_nascita: "", te_data_nascita: "",
    // Anti
    data_invio_anti: "",
    // Fornitore
    forn_fornitura: "", forn_data_stipula: "", forn_data_scadenza: "",
    forn_comm_nominativo: "", forn_comm_email: "", forn_comm_tel: "", forn_comm_cel: "",
    forn_tipo_fat: 0, forn_tipo_pag: 0,
    forn_iban_1: "", forn_iban_2: "", forn_commento: "", forn_commento_2: "",
    // Fatturazione
    codice_destinatario: "",
    // Costo Dipendenti
    cp_mensilita: 0,
    cp_ctr_ipns_azi_imp: 0, cp_ctr_ipns_azi_dir: 0, cp_ctr_ipns_azi_op: 0,
    cp_ctr_ipns_dip_imp: 0, cp_ctr_ipns_dip_dir: 0, cp_ctr_ipns_dip_op: 0,
    cp_inail: 0, cp_irap: 0, cp_num_buoni_pasto: 0,
    cp_fondo_san_azi: 0, cp_fondo_san_dip: 0,
    cp_ctr_prev_integr_azi: 0, cp_ctr_prev_integr_dir: 0,
    cp_ctr_ass_integr_azi: 0, cp_ctr_ass_integr_dir: 0,
    codice_ditta_inail: "", cassa_edile: "", codice_ditta: "", ccod: "",
  });

  // =========================================================================
  // FETCH LOOKUP DATA
  // =========================================================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    const headers = { Authorization: `Bearer ${token}` };

    fetch("http://localhost:8000/api/tipologia-anagrafica", { headers }).then(async r => { if (r.ok) setTipologie(await r.json()); }).catch(console.error);
    fetch("http://localhost:8000/api/tabella-settori", { headers }).then(async r => { if (r.ok) setSettori(await r.json()); }).catch(console.error);
    fetch("http://localhost:8000/api/tabella-ccnl", { headers }).then(async r => { if (r.ok) setCcnlList(await r.json()); }).catch(console.error);
    fetch("http://localhost:8000/api/utenti?abilitazione=true", { headers }).then(async r => { if (r.ok) setUtenti(await r.json()); }).catch(console.error);

    if (id) {
      fetch(`http://localhost:8000/api/anagrafica/full/${id}`, { headers })
        .then(async r => {
          if (r.ok) {
            const data = await r.json();

            // Clean up data to avoid nulls overwriting empty strings and format dates
            const sanitizedData: Record<string, any> = {};
            for (const key in data) {
              if (data[key] !== null && data[key] !== undefined) {
                if (typeof data[key] === 'string' && data[key].match(/^\d{4}-\d{2}-\d{2}T/)) {
                  sanitizedData[key] = data[key].split('T')[0];
                } else {
                  sanitizedData[key] = data[key];
                }
              }
            }

            // set form data
            setF(prev => {
              const updated = { ...prev, ...sanitizedData };
              return updated;
            });
            if (data.matricole_inps) setMatricoleINPS(data.matricole_inps);
            if (data.pat_inail) setPatINAIL(data.pat_inail);
            if (data.lettere_intento) setLettereIntento(data.lettere_intento);
          }
        })
        .catch(console.error);
    }
  }, [router, id]);

  // =========================================================================
  // HANDLERS
  // =========================================================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setF(prev => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setF(prev => ({ ...prev, [name]: value === "" ? 0 : parseFloat(value) }));
    } else {
      setF(prev => ({ ...prev, [name]: value }));
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async () => {
    // Validazione basilare
    if (!f.rag_sociale && !f.cognome) {
      showToast("Inserisci almeno la Ragione Sociale o il Cognome.", "error");
      setActiveTab("generali");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      // Prepara payload — converte date vuote in null
      const payload: Record<string, unknown> = { ...f };
      const dateFields = [
        "data_costituzione", "data_ini_attivita", "registrazione_data",
        "data_nascita", "intento_data", "intento_scadenza",
        "rp_data_nascita", "rp_rilasciato_il_documento", "rp_scadenza_documento",
        "dl_data_nascita", "te_data_nascita", "data_invio_anti",
        "forn_data_stipula", "forn_data_scadenza",
      ];
      for (const df of dateFields) {
        if (!payload[df]) payload[df] = null;
      }

      // Aggiungi sub-tabelle
      payload.matricole_inps = matricoleINPS;
      payload.pat_inail = patINAIL;
      payload.lettere_intento = lettereIntento.map(l => ({
        ...l,
        data: l.data || null,
        scadenza: l.scadenza || null,
      }));

      const res = await fetch(`http://localhost:8000/api/anagrafica/full/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Errore durante il salvataggio");
      }

      showToast("Anagrafica modificata con successo!", "success");
      setTimeout(() => router.push("/dashboard/anagrafica"), 1500);
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Errore durante il salvataggio", "error");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================================
  // TAB CONTENT RENDERERS
  // =========================================================================

  const renderGenerali = () => (
    <div className="space-y-6">
      <SectionTitle>Dati Identificativi</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Ragione Sociale" name="rag_sociale" value={f.rag_sociale} onChange={handleChange} required />
        <SelectField label="Forma" name="forma" value={f.forma} onChange={handleChange}>
          <option value="Spett.le">Spett.le</option>
          <option value="Egregio">Egregio</option>
          <option value="Gentile">Gentile</option>
          <option value="Sig.">Sig.</option>
          <option value="Sig.ra">Sig.ra</option>
        </SelectField>
        <InputField label="Codice INAZ" name="cod_inaz" value={f.cod_inaz} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Codice Zucchetti" name="cod_zucchetti" value={f.cod_zucchetti} onChange={handleChange} />
        <InputField label="Titolo" name="titolo" value={f.titolo} onChange={handleChange} />
        <InputField label="Cognome" name="cognome" value={f.cognome} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Nome" name="nome" value={f.nome} onChange={handleChange} />
        <InputField label="Reparto" name="reparto" value={f.reparto} onChange={handleChange} />
      </div>

      <SectionTitle>Attività & Classificazione</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectField label="Tipologia" name="tipologia" value={f.tipologia} onChange={handleChange}>
          <option value={0}>Seleziona...</option>
          {tipologie.map(t => <option key={t.codice} value={t.codice}>{t.descrizione}</option>)}
        </SelectField>
        <SelectField label="Settore" name="settore" value={f.settore} onChange={handleChange}>
          <option value={0}>Seleziona...</option>
          {settori.map(s => <option key={s.id} value={s.id}>{s.descrizione}</option>)}
        </SelectField>
        <SelectField label="CCNL" name="ccnl" value={f.ccnl} onChange={handleChange}>
          <option value="000">Seleziona...</option>
          {Array.isArray(ccnlList) && ccnlList.map(c => (
            <option key={`ccnl-${c.id}`} value={c.codice?.trim() || ""}>
              {c.descrizione}
            </option>
          ))}
        </SelectField>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Attività" name="attivita" value={f.attivita} onChange={handleChange} />
        <InputField label="Codice ATECO" name="cod_ateco" value={f.cod_ateco} onChange={handleChange} />
        <CheckboxField label="Pubblica Amministrazione (PA)" name="pa" checked={f.pa} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Data Costituzione" name="data_costituzione" value={f.data_costituzione} onChange={handleChange} type="date" />
        <InputField label="Data Inizio Attività" name="data_ini_attivita" value={f.data_ini_attivita} onChange={handleChange} type="date" />
      </div>

      <SectionTitle>Registrazione</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="N. Registrazione" name="registrazione" value={f.registrazione} onChange={handleChange} />
        <InputField label="Città Registrazione" name="registrazione_citta" value={f.registrazione_citta} onChange={handleChange} />
        <InputField label="Data Registrazione" name="registrazione_data" value={f.registrazione_data} onChange={handleChange} type="date" />
      </div>

      <SectionTitle>Referente / Utente</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectField label="Referente Interno" name="utente" value={f.utente} onChange={handleChange}>
          <option value="">Seleziona...</option>
          {utenti.map(u => (
            <option key={u.username} value={u.username}>
              {[u.nome, u.cognome].filter(Boolean).join(" ") || u.username}
            </option>
          ))}
        </SelectField>
      </div>
    </div>
  );

  const renderSedi = () => (
    <div className="space-y-6">
      <SectionTitle>Sede Legale</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Indirizzo" name="indirizzo" value={f.indirizzo} onChange={handleChange} className="md:col-span-2" />
        <InputField label="CAP" name="cap" value={f.cap} onChange={handleChange} />
        <InputField label="Città" name="citta" value={f.citta} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Provincia" name="provincia" value={f.provincia} onChange={handleChange} />
      </div>

      <SectionTitle>Sede Operativa 1</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Indirizzo" name="sede1_indirizzo" value={f.sede1_indirizzo} onChange={handleChange} className="md:col-span-2" />
        <InputField label="CAP" name="sede1_cap" value={f.sede1_cap} onChange={handleChange} />
        <InputField label="Città" name="sede1_citta" value={f.sede1_citta} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Provincia" name="sede1_provincia" value={f.sede1_provincia} onChange={handleChange} />
      </div>

      <SectionTitle>Sede Operativa 2</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Indirizzo" name="sede2_indirizzo" value={f.sede2_indirizzo} onChange={handleChange} className="md:col-span-2" />
        <InputField label="CAP" name="sede2_cap" value={f.sede2_cap} onChange={handleChange} />
        <InputField label="Città" name="sede2_citta" value={f.sede2_citta} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Provincia" name="sede2_provincia" value={f.sede2_provincia} onChange={handleChange} />
      </div>

      <SectionTitle>Secondo Indirizzo / Spedizione</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectField label="Forma" name="forma2" value={f.forma2} onChange={handleChange}>
          <option value="Spett.le">Spett.le</option>
          <option value="Egregio">Egregio</option>
          <option value="Gentile">Gentile</option>
        </SelectField>
        <InputField label="Ragione Sociale" name="rag_sociale2" value={f.rag_sociale2} onChange={handleChange} />
        <InputField label="Titolo" name="titolo2" value={f.titolo2} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Cognome" name="cognome2" value={f.cognome2} onChange={handleChange} />
        <InputField label="Nome" name="nome2" value={f.nome2} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Indirizzo" name="indirizzo2" value={f.indirizzo2} onChange={handleChange} className="md:col-span-2" />
        <InputField label="CAP" name="cap2" value={f.cap2} onChange={handleChange} />
        <InputField label="Città" name="citta2" value={f.citta2} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Provincia" name="provincia2" value={f.provincia2} onChange={handleChange} />
      </div>
    </div>
  );

  const renderFiscali = () => (
    <div className="space-y-6">
      <SectionTitle>Dati Fiscali</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Partita IVA" name="partita_iva" value={f.partita_iva} onChange={handleChange} />
        <InputField label="Codice Fiscale" name="codice_fiscale" value={f.codice_fiscale} onChange={handleChange} />
        <InputField label="Codice Destinatario (SDI)" name="codice_destinatario" value={f.codice_destinatario} onChange={handleChange} />
      </div>

      <SectionTitle>Dati Personali</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Indirizzo Residenza" name="indirizzo_residenza" value={f.indirizzo_residenza} onChange={handleChange} />
        <InputField label="Luogo di Nascita" name="luogo_nascita" value={f.luogo_nascita} onChange={handleChange} />
        <InputField label="Data di Nascita" name="data_nascita" value={f.data_nascita} onChange={handleChange} type="date" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Estremi Documento" name="estremi_documento" value={f.estremi_documento} onChange={handleChange} />
      </div>
    </div>
  );

  const renderContatti = () => (
    <div className="space-y-6">
      <SectionTitle>Recapiti Principali</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Telefono 1" name="telefono1" value={f.telefono1} onChange={handleChange} />
        <InputField label="Telefono 2" name="telefono2" value={f.telefono2} onChange={handleChange} />
        <InputField label="Fax 1" name="fax1" value={f.fax1} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Fax 2" name="fax2" value={f.fax2} onChange={handleChange} />
        <InputField label="Cellulare 1" name="cellulare1" value={f.cellulare1} onChange={handleChange} />
        <InputField label="Cellulare 2" name="cellulare2" value={f.cellulare2} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="PEC" name="pec" value={f.pec} onChange={handleChange} type="email" />
        <InputField label="Email 1" name="email1" value={f.email1} onChange={handleChange} type="email" />
        <InputField label="Email 2" name="email2" value={f.email2} onChange={handleChange} type="email" />
      </div>

      {/* Contatti Cliente 1-7 */}
      {[1, 2, 3, 4, 5, 6, 7].map(n => (
        <div key={n}>
          <SectionTitle>Contatto Cliente {n}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <InputField label="Nominativo" name={`contatto_cliente${n}`} value={(f as Record<string, unknown>)[`contatto_cliente${n}`] as string} onChange={handleChange} />
            <InputField label="Qualifica" name={`qualifica${n}`} value={(f as Record<string, unknown>)[`qualifica${n}`] as string} onChange={handleChange} />
            <InputField label="Telefono" name={`tel_contatto${n}`} value={(f as Record<string, unknown>)[`tel_contatto${n}`] as string} onChange={handleChange} />
            <InputField label="Cellulare" name={`cell_contatto${n}`} value={(f as Record<string, unknown>)[`cell_contatto${n}`] as string} onChange={handleChange} />
            <InputField label="Email" name={`email_contatto${n}`} value={(f as Record<string, unknown>)[`email_contatto${n}`] as string} onChange={handleChange} type="email" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderReferenti = () => (
    <div className="space-y-6">
      <SectionTitle>Referenti Interni</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Referente Interno 1" name="referente_interno1" value={f.referente_interno1} onChange={handleChange} />
        <InputField label="Referente Interno 2" name="referente_interno2" value={f.referente_interno2} onChange={handleChange} />
        <InputField label="Referente Interno 3" name="referente_interno3" value={f.referente_interno3} onChange={handleChange} />
      </div>
    </div>
  );

  const renderRappresentanteLegale = () => (
    <div className="space-y-6">
      <SectionTitle>Rappresentante Legale</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Nome" name="rp_nome" value={f.rp_nome} onChange={handleChange} />
        <InputField label="Cognome" name="rp_cognome" value={f.rp_cognome} onChange={handleChange} />
        <InputField label="Codice Fiscale" name="rp_cf" value={f.rp_cf} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Email" name="rp_email" value={f.rp_email} onChange={handleChange} type="email" />
        <InputField label="PEC" name="rp_pec" value={f.rp_pec} onChange={handleChange} type="email" />
        <InputField label="Carica" name="rp_carica" value={f.rp_carica} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Indirizzo Residenza" name="rp_indirizzo_residenza" value={f.rp_indirizzo_residenza} onChange={handleChange} className="md:col-span-2" />
        <InputField label="CAP" name="rp_cap_residenza" value={f.rp_cap_residenza} onChange={handleChange} />
        <InputField label="Città" name="rp_citta_residenza" value={f.rp_citta_residenza} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Provincia" name="rp_prov_residenza" value={f.rp_prov_residenza} onChange={handleChange} />
        <InputField label="Luogo di Nascita" name="rp_luogo_nascita" value={f.rp_luogo_nascita} onChange={handleChange} />
        <InputField label="Data di Nascita" name="rp_data_nascita" value={f.rp_data_nascita} onChange={handleChange} type="date" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Nazionalità" name="rp_nazionalita" value={f.rp_nazionalita} onChange={handleChange} />
      </div>

      <SectionTitle>Documento di Identità</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Tipo Documento" name="rp_tipo_documento" value={f.rp_tipo_documento} onChange={handleChange} />
        <InputField label="Numero Documento" name="rp_estremi_documento" value={f.rp_estremi_documento} onChange={handleChange} />
        <InputField label="Rilasciato da" name="rp_rilasciato_da_documento" value={f.rp_rilasciato_da_documento} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Rilasciato il" name="rp_rilasciato_il_documento" value={f.rp_rilasciato_il_documento} onChange={handleChange} type="date" />
        <InputField label="Scadenza Documento" name="rp_scadenza_documento" value={f.rp_scadenza_documento} onChange={handleChange} type="date" />
      </div>
    </div>
  );

  const renderDelegato = () => (
    <div className="space-y-6">
      <SectionTitle>Delegato alla Firma</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Nome" name="dl_nome" value={f.dl_nome} onChange={handleChange} />
        <InputField label="Cognome" name="dl_cognome" value={f.dl_cognome} onChange={handleChange} />
        <InputField label="Codice Fiscale" name="dl_cf" value={f.dl_cf} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Indirizzo Residenza" name="dl_indirizzo_residenza" value={f.dl_indirizzo_residenza} onChange={handleChange} />
        <InputField label="Luogo di Nascita" name="dl_luogo_nascita" value={f.dl_luogo_nascita} onChange={handleChange} />
        <InputField label="Data di Nascita" name="dl_data_nascita" value={f.dl_data_nascita} onChange={handleChange} type="date" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Estremi Documento" name="dl_estremi_documento" value={f.dl_estremi_documento} onChange={handleChange} />
        <InputField label="Carica" name="dl_carica" value={f.dl_carica} onChange={handleChange} />
      </div>
    </div>
  );

  const renderTitolare = () => (
    <div className="space-y-6">
      <SectionTitle>Titolare Effettivo</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Nome" name="te_nome" value={f.te_nome} onChange={handleChange} />
        <InputField label="Cognome" name="te_cognome" value={f.te_cognome} onChange={handleChange} />
        <InputField label="Codice Fiscale" name="te_cf" value={f.te_cf} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Indirizzo Residenza" name="te_indirizzo_residenza" value={f.te_indirizzo_residenza} onChange={handleChange} />
        <InputField label="Luogo di Nascita" name="te_luogo_nascita" value={f.te_luogo_nascita} onChange={handleChange} />
        <InputField label="Data di Nascita" name="te_data_nascita" value={f.te_data_nascita} onChange={handleChange} type="date" />
      </div>

      <SectionTitle>Antiriciclaggio</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Data Invio Email Antiriciclaggio" name="data_invio_anti" value={f.data_invio_anti} onChange={handleChange} type="date" />
      </div>
    </div>
  );

  const renderBanca = () => (
    <div className="space-y-6">
      <SectionTitle>Coordinate Bancarie</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Banca" name="banca" value={f.banca} onChange={handleChange} className="md:col-span-2" />
        <InputField label="Nazione" name="nazione" value={f.nazione} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <InputField label="ABI" name="abi" value={f.abi} onChange={handleChange} />
        <InputField label="CAB" name="cab" value={f.cab} onChange={handleChange} />
        <InputField label="CIN" name="cin" value={f.cin} onChange={handleChange} />
        <InputField label="Conto Corrente" name="cc" value={f.cc} onChange={handleChange} />
        <InputField label="Prefisso Nazione" name="prefisso_nazione" value={f.prefisso_nazione} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <InputField label="IBAN" name="iban" value={f.iban} onChange={handleChange} />
      </div>
    </div>
  );

  const renderFornitore = () => (
    <div className="space-y-6">
      <SectionTitle>Dati Fornitore</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Fornitura" name="forn_fornitura" value={f.forn_fornitura} onChange={handleChange} />
        <InputField label="Data Stipula" name="forn_data_stipula" value={f.forn_data_stipula} onChange={handleChange} type="date" />
        <InputField label="Data Scadenza" name="forn_data_scadenza" value={f.forn_data_scadenza} onChange={handleChange} type="date" />
      </div>

      <SectionTitle>Contatto Commerciale</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Nominativo" name="forn_comm_nominativo" value={f.forn_comm_nominativo} onChange={handleChange} />
        <InputField label="Email" name="forn_comm_email" value={f.forn_comm_email} onChange={handleChange} type="email" />
        <InputField label="Telefono" name="forn_comm_tel" value={f.forn_comm_tel} onChange={handleChange} />
        <InputField label="Cellulare" name="forn_comm_cel" value={f.forn_comm_cel} onChange={handleChange} />
      </div>

      <SectionTitle>Pagamento & IBAN</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Tipo Fatturazione" name="forn_tipo_fat" value={f.forn_tipo_fat} onChange={handleChange} type="number" />
        <InputField label="Tipo Pagamento" name="forn_tipo_pag" value={f.forn_tipo_pag} onChange={handleChange} type="number" />
        <InputField label="IBAN 1" name="forn_iban_1" value={f.forn_iban_1} onChange={handleChange} />
        <InputField label="IBAN 2" name="forn_iban_2" value={f.forn_iban_2} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextAreaField label="Commento Fornitore 1" name="forn_commento" value={f.forn_commento} onChange={handleChange} />
        <TextAreaField label="Commento Fornitore 2" name="forn_commento_2" value={f.forn_commento_2} onChange={handleChange} />
      </div>
    </div>
  );

  const renderCosti = () => (
    <div className="space-y-6">
      <SectionTitle>Parametri Costo Dipendenti</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Mensilità" name="cp_mensilita" value={f.cp_mensilita} onChange={handleChange} type="number" />
        <InputField label="N. Buoni Pasto" name="cp_num_buoni_pasto" value={f.cp_num_buoni_pasto} onChange={handleChange} type="number" />
        <InputField label="INAIL %" name="cp_inail" value={f.cp_inail} onChange={handleChange} type="number" />
        <InputField label="IRAP %" name="cp_irap" value={f.cp_irap} onChange={handleChange} type="number" />
      </div>

      <SectionTitle>Contributi INPS Azienda</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Impiegati %" name="cp_ctr_ipns_azi_imp" value={f.cp_ctr_ipns_azi_imp} onChange={handleChange} type="number" />
        <InputField label="Dirigenti %" name="cp_ctr_ipns_azi_dir" value={f.cp_ctr_ipns_azi_dir} onChange={handleChange} type="number" />
        <InputField label="Operai %" name="cp_ctr_ipns_azi_op" value={f.cp_ctr_ipns_azi_op} onChange={handleChange} type="number" />
      </div>

      <SectionTitle>Contributi INPS Dipendente</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Impiegati %" name="cp_ctr_ipns_dip_imp" value={f.cp_ctr_ipns_dip_imp} onChange={handleChange} type="number" />
        <InputField label="Dirigenti %" name="cp_ctr_ipns_dip_dir" value={f.cp_ctr_ipns_dip_dir} onChange={handleChange} type="number" />
        <InputField label="Operai %" name="cp_ctr_ipns_dip_op" value={f.cp_ctr_ipns_dip_op} onChange={handleChange} type="number" />
      </div>

      <SectionTitle>Fondi Sanitari & Previdenza</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Fondo San. Azienda" name="cp_fondo_san_azi" value={f.cp_fondo_san_azi} onChange={handleChange} type="number" />
        <InputField label="Fondo San. Dipendente" name="cp_fondo_san_dip" value={f.cp_fondo_san_dip} onChange={handleChange} type="number" />
        <InputField label="Prev. Integrativa Azi." name="cp_ctr_prev_integr_azi" value={f.cp_ctr_prev_integr_azi} onChange={handleChange} type="number" />
        <InputField label="Prev. Integrativa Dir." name="cp_ctr_prev_integr_dir" value={f.cp_ctr_prev_integr_dir} onChange={handleChange} type="number" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Ass. Integrativa Azi." name="cp_ctr_ass_integr_azi" value={f.cp_ctr_ass_integr_azi} onChange={handleChange} type="number" />
        <InputField label="Ass. Integrativa Dir." name="cp_ctr_ass_integr_dir" value={f.cp_ctr_ass_integr_dir} onChange={handleChange} type="number" />
      </div>

      <SectionTitle>Codici INAIL & Cassa Edile</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField label="Codice Ditta INAIL" name="codice_ditta_inail" value={f.codice_ditta_inail} onChange={handleChange} />
        <InputField label="Cassa Edile" name="cassa_edile" value={f.cassa_edile} onChange={handleChange} />
        <InputField label="Codice Ditta" name="codice_ditta" value={f.codice_ditta} onChange={handleChange} />
        <InputField label="CCOD" name="ccod" value={f.ccod} onChange={handleChange} />
      </div>
    </div>
  );

  const renderFatturazione = () => (
    <div className="space-y-6">
      <SectionTitle>Fatturazione Elettronica</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Codice Destinatario (SDI)" name="codice_destinatario" value={f.codice_destinatario} onChange={handleChange} />
      </div>

      <SectionTitle>Dichiarazione d&apos;Intento</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Numero Intento" name="intento_numero" value={f.intento_numero} onChange={handleChange} />
        <InputField label="Data Intento" name="intento_data" value={f.intento_data} onChange={handleChange} type="date" />
        <InputField label="Scadenza Intento" name="intento_scadenza" value={f.intento_scadenza} onChange={handleChange} type="date" />
      </div>
    </div>
  );

  const renderNote = () => (
    <div className="space-y-6">
      <SectionTitle>Note e Commenti</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextAreaField label="Commento 1" name="commento1" value={f.commento1} onChange={handleChange} rows={4} />
        <TextAreaField label="Commento 2" name="commento2" value={f.commento2} onChange={handleChange} rows={4} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Commento Cr Hold" name="comm_hold" value={f.comm_hold} onChange={handleChange} />
        <InputField label="Esposizione" name="esposizione" value={f.esposizione} onChange={handleChange} type="number" />
      </div>

      <SectionTitle>Flag e Stato</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CheckboxField label="Privacy" name="privacy" checked={f.privacy} onChange={handleChange} />
        <CheckboxField label="Sospeso" name="sospeso" checked={f.sospeso} onChange={handleChange} />
        <CheckboxField label="Cr Hold" name="cr_hold" checked={f.cr_hold} onChange={handleChange} />
        <CheckboxField label="Indicatore Agg." name="indic_agg" checked={f.indic_agg} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CheckboxField label="Flag 1" name="flag1" checked={f.flag1} onChange={handleChange} />
        <CheckboxField label="Flag 2" name="flag2" checked={f.flag2} onChange={handleChange} />
        <CheckboxField label="Flag 3" name="flag3" checked={f.flag3} onChange={handleChange} />
      </div>
    </div>
  );

  const renderSubtabelle = () => (
    <div className="space-y-8">
      {/* Matricole INPS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>Matricole INPS</SectionTitle>
          <button type="button" onClick={() => setMatricoleINPS([...matricoleINPS, { matricola: "", sede: "", descrizione: "" }])}
            className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Aggiungi
          </button>
        </div>
        {matricoleINPS.length === 0 ? (
          <p className="text-sm text-text-muted italic">Nessuna matricola INPS inserita.</p>
        ) : (
          <div className="bg-bg-base rounded-lg border border-border-divider overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary"><tr><th className="px-4 py-2 text-left">Matricola</th><th className="px-4 py-2 text-left">Sede</th><th className="px-4 py-2 text-left">Descrizione</th><th className="px-4 py-2 w-12"></th></tr></thead>
              <tbody>
                {matricoleINPS.map((m, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-bg-base" : "bg-surface"}>
                    <td className="px-4 py-1"><input className="w-full rounded border border-border-divider p-1.5 text-sm" value={m.matricola} onChange={e => { const u = [...matricoleINPS]; u[i].matricola = e.target.value; setMatricoleINPS(u); }} /></td>
                    <td className="px-4 py-1"><input className="w-full rounded border border-border-divider p-1.5 text-sm" value={m.sede} onChange={e => { const u = [...matricoleINPS]; u[i].sede = e.target.value; setMatricoleINPS(u); }} /></td>
                    <td className="px-4 py-1"><input className="w-full rounded border border-border-divider p-1.5 text-sm" value={m.descrizione} onChange={e => { const u = [...matricoleINPS]; u[i].descrizione = e.target.value; setMatricoleINPS(u); }} /></td>
                    <td className="px-4 py-1 text-center">
                      <button type="button" onClick={() => setMatricoleINPS(matricoleINPS.filter((_, j) => j !== i))} className="text-danger hover:text-red-700 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAT INAIL */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>PAT INAIL</SectionTitle>
          <button type="button" onClick={() => setPatINAIL([...patINAIL, { pat: "", descrizione: "" }])}
            className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Aggiungi
          </button>
        </div>
        {patINAIL.length === 0 ? (
          <p className="text-sm text-text-muted italic">Nessuna PAT INAIL inserita.</p>
        ) : (
          <div className="bg-bg-base rounded-lg border border-border-divider overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary"><tr><th className="px-4 py-2 text-left">PAT</th><th className="px-4 py-2 text-left">Descrizione</th><th className="px-4 py-2 w-12"></th></tr></thead>
              <tbody>
                {patINAIL.map((p, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-bg-base" : "bg-surface"}>
                    <td className="px-4 py-1"><input className="w-full rounded border border-border-divider p-1.5 text-sm" value={p.pat} onChange={e => { const u = [...patINAIL]; u[i].pat = e.target.value; setPatINAIL(u); }} /></td>
                    <td className="px-4 py-1"><input className="w-full rounded border border-border-divider p-1.5 text-sm" value={p.descrizione} onChange={e => { const u = [...patINAIL]; u[i].descrizione = e.target.value; setPatINAIL(u); }} /></td>
                    <td className="px-4 py-1 text-center">
                      <button type="button" onClick={() => setPatINAIL(patINAIL.filter((_, j) => j !== i))} className="text-danger hover:text-red-700 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lettere d'Intento */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>Lettere d&apos;Intento</SectionTitle>
          <button type="button" onClick={() => setLettereIntento([...lettereIntento, { numero: "", data: "", scadenza: "", importo: 0, descrizione: "" }])}
            className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Aggiungi
          </button>
        </div>
        {lettereIntento.length === 0 ? (
          <p className="text-sm text-text-muted italic">Nessuna lettera d&apos;intento inserita.</p>
        ) : (
          <div className="bg-bg-base rounded-lg border border-border-divider overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary"><tr><th className="px-4 py-2 text-left">Numero</th><th className="px-4 py-2 text-left">Data</th><th className="px-4 py-2 text-left">Scadenza</th><th className="px-4 py-2 text-left">Importo</th><th className="px-4 py-2 text-left">Descrizione</th><th className="px-4 py-2 w-12"></th></tr></thead>
              <tbody>
                {lettereIntento.map((l, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-bg-base" : "bg-surface"}>
                    <td className="px-4 py-1"><input className="w-full rounded border border-border-divider p-1.5 text-sm" value={l.numero} onChange={e => { const u = [...lettereIntento]; u[i].numero = e.target.value; setLettereIntento(u); }} /></td>
                    <td className="px-4 py-1"><input type="date" className="w-full rounded border border-border-divider p-1.5 text-sm" value={l.data} onChange={e => { const u = [...lettereIntento]; u[i].data = e.target.value; setLettereIntento(u); }} /></td>
                    <td className="px-4 py-1"><input type="date" className="w-full rounded border border-border-divider p-1.5 text-sm" value={l.scadenza} onChange={e => { const u = [...lettereIntento]; u[i].scadenza = e.target.value; setLettereIntento(u); }} /></td>
                    <td className="px-4 py-1"><input type="number" className="w-full rounded border border-border-divider p-1.5 text-sm" value={l.importo} onChange={e => { const u = [...lettereIntento]; u[i].importo = parseFloat(e.target.value) || 0; setLettereIntento(u); }} /></td>
                    <td className="px-4 py-1"><input className="w-full rounded border border-border-divider p-1.5 text-sm" value={l.descrizione} onChange={e => { const u = [...lettereIntento]; u[i].descrizione = e.target.value; setLettereIntento(u); }} /></td>
                    <td className="px-4 py-1 text-center">
                      <button type="button" onClick={() => setLettereIntento(lettereIntento.filter((_, j) => j !== i))} className="text-danger hover:text-red-700 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // =========================================================================
  // TAB CONTENT ROUTER
  // =========================================================================
  const renderTabContent = () => {
    switch (activeTab) {
      case "generali": return renderGenerali();
      case "sedi": return renderSedi();
      case "fiscali": return renderFiscali();
      case "contatti": return renderContatti();
      case "referenti": return renderReferenti();
      case "rp": return renderRappresentanteLegale();
      case "delegato": return renderDelegato();
      case "titolare": return renderTitolare();
      case "banca": return renderBanca();
      case "fornitore": return renderFornitore();
      case "costi": return renderCosti();
      case "fatturazione": return renderFatturazione();
      case "note": return renderNote();
      case "subtabelle": return renderSubtabelle();
      default: return null;
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[60] px-6 py-3 rounded-lg shadow-lg text-white font-medium text-sm animate-[slideIn_0.3s_ease-out] ${toast.type === "success" ? "bg-success" : "bg-danger"}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Modifica Anagrafica</h1>
          <p className="text-text-muted mt-1">Modifica un&apos;anagrafica esistente con tutti i dettagli.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push("/dashboard/anagrafica")}
            className="rounded border border-border-divider bg-bg-base px-4 py-2 font-semibold text-text-main hover:bg-surface transition-colors">
            ← Torna alla Lista
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="rounded bg-primary px-6 py-2 font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2">
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                Salvataggio...
              </>
            ) : "Salva Anagrafica"}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-bg-base rounded-lg shadow-sm border border-border-divider">
        <div className="border-b border-border-divider overflow-x-auto">
          <nav className="flex min-w-max">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-text-muted hover:text-text-main hover:border-border-divider"
                  }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Bottom Save Bar (sticky) */}
      <div className="sticky bottom-0 bg-bg-base border-t border-border-divider p-4 flex justify-between items-center rounded-lg shadow-sm">
        <span className="text-sm text-text-muted">
          Tab attiva: <strong className="text-text-main">{TABS.find(t => t.id === activeTab)?.label}</strong>
        </span>
        <div className="flex gap-2">
          <button onClick={() => router.push("/dashboard/anagrafica")}
            className="rounded border border-border-divider bg-bg-base px-4 py-2 text-sm font-semibold text-text-main hover:bg-surface transition-colors">
            Annulla
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="rounded bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-50">
            {saving ? "Salvataggio..." : "Salva Anagrafica"}
          </button>
        </div>
      </div>
    </div>
  );
}
