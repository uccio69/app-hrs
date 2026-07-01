from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, SmallInteger
from database import Base

class Utente(Base):
    __tablename__ = "utenti"

    id = Column(Integer, primary_key=True, index=True, name="ID", autoincrement=False)
    nome = Column(String(100), name="nome")
    cognome = Column(String(100), name="cognome")
    username = Column(String(50), unique=True, index=True, name="utente")
    password = Column(String(255), name="password")
    scad_pswd = Column(DateTime, name="Scad_PSWD")
    livello = Column(Integer, name="livello")
    sede = Column(String(100), name="Sede")
    interno = Column(String(50), name="Interno")
    e_mail = Column(String(255), name="e_mail")
    costo_studio = Column(Float, name="CostoStudio")
    costo_clienti = Column(Float, name="CostoClienti")
    flg_abilitazione = Column(Boolean, name="flgAbilitazione")
    flg_filtro_clienti = Column(Boolean, name="flgFiltroClienti")

class Tabella_Tipologia(Base):
    __tablename__ = "Tabella_Tipologia"
    
    id = Column(Integer, primary_key=True, index=True, name="ID")
    codice = Column(String(50), name="Codice")
    descrizione = Column(String(255), name="Descrizione")

class TabellaSettori(Base):
    __tablename__ = "Tabella_Settori"

    id = Column(Integer, primary_key=True, name="ID")
    descrizione = Column(String(255), name="Descrizione")

class TabellaCCNL(Base):
    __tablename__ = "Tabella_CCNL"

    id = Column(Integer, primary_key=True, name="ID")
    codice = Column(String(50), name="Codice", nullable=True)
    descrizione = Column(String(255), name="Descrizione")
    settore = Column(String(255), name="Settore")


# =============================================================================
# ANAGRAFICA - Modello completo con tutti i campi dal VB.NET
# =============================================================================
class Anagrafica(Base):
    __tablename__ = "anagrafica"

    # --- Identificazione ---
    codice = Column(Integer, primary_key=True, name="Codice", autoincrement=False)
    cod_inaz = Column(String(50), name="CodINAZ")
    cod_zucchetti = Column(String(50), name="CodZucchetti")

    # --- Dati Generali ---
    forma = Column(String(50), name="Forma")
    rag_sociale = Column(String(255), name="RagSociale")
    tipologia = Column(SmallInteger, name="Tipologia")
    settore = Column(SmallInteger, name="Settore")
    attivita = Column(String(255), name="Attivita")
    cod_ateco = Column(String(50), name="CodAteco")
    data_costituzione = Column(DateTime, name="Data_costituzione")
    data_ini_attivita = Column(DateTime, name="Data_ini_attivita")
    registrazione = Column(String(255), name="Registrazione")
    registrazione_citta = Column(String(255), name="Registrazione_citta")
    registrazione_data = Column(DateTime, name="Registrazione_data")
    ccnl = Column(String(50), name="CCNL")
    pa = Column(Boolean, name="PA")

    # --- Nominativo ---
    titolo = Column(String(50), name="Titolo")
    cognome = Column(String(100), name="Cognome")
    nome = Column(String(100), name="Nome")
    reparto = Column(String(255), name="Reparto")

    # --- Sede Legale ---
    indirizzo = Column(String(255), name="Indirizzo")
    cap = Column(String(10), name="CAP")
    citta = Column(String(100), name="Citta")
    provincia = Column(String(10), name="Provincia")

    # --- Sede Operativa 1 ---
    sede1_indirizzo = Column(String(255), name="sede1_indirizzo")
    sede1_cap = Column(String(10), name="sede1_CAP")
    sede1_citta = Column(String(100), name="sede1_citta")
    sede1_provincia = Column(String(10), name="sede1_provincia")

    # --- Sede Operativa 2 ---
    sede2_indirizzo = Column(String(255), name="sede2_indirizzo")
    sede2_cap = Column(String(10), name="sede2_CAP")
    sede2_citta = Column(String(100), name="sede2_citta")
    sede2_provincia = Column(String(10), name="sede2_provincia")

    # --- Dati Fiscali ---
    partita_iva = Column(String(20), name="PartitaIVA")
    codice_fiscale = Column(String(20), name="CodiceFiscale")
    indirizzo_residenza = Column(String(255), name="Indirizzo_residenza")
    luogo_nascita = Column(String(100), name="Luogo_nascita")
    data_nascita = Column(DateTime, name="Data_nascita")
    estremi_documento = Column(String(255), name="Estremi_documento")

    # --- Secondo Indirizzo / Spedizione ---
    forma2 = Column(String(50), name="Forma2")
    rag_sociale2 = Column(String(255), name="RagSociale2")
    titolo2 = Column(String(50), name="Titolo2")
    cognome2 = Column(String(100), name="Cognome2")
    nome2 = Column(String(100), name="Nome2")
    indirizzo2 = Column(String(255), name="Indirizzo2")
    cap2 = Column(String(10), name="CAP2")
    citta2 = Column(String(100), name="Citta2")
    provincia2 = Column(String(10), name="Provincia2")

    # --- Tipo ---
    tipo = Column(String(50), name="Tipo")

    # --- Contatti ---
    telefono1 = Column(String(50), name="Telefono1")
    telefono2 = Column(String(50), name="Telefono2")
    fax1 = Column(String(50), name="Fax1")
    fax2 = Column(String(50), name="Fax2")
    cellulare1 = Column(String(50), name="Cellulare1")
    cellulare2 = Column(String(50), name="Cellulare2")
    pec = Column(String(255), name="PEC")
    email1 = Column(String(255), name="EMail1")
    email2 = Column(String(255), name="EMail2")

    # --- Contatti Cliente 1-7 ---
    contatto_cliente1 = Column(String(255), name="ContattoCliente1")
    qualifica1 = Column(String(255), name="Qualifica1")
    tel_contatto1 = Column(String(50), name="TelContatto1")
    cell_contatto1 = Column(String(50), name="CellContatto1")
    email_contatto1 = Column(String(255), name="EmailContatto1")

    contatto_cliente2 = Column(String(255), name="ContattoCliente2")
    qualifica2 = Column(String(255), name="Qualifica2")
    tel_contatto2 = Column(String(50), name="TelContatto2")
    cell_contatto2 = Column(String(50), name="CellContatto2")
    email_contatto2 = Column(String(255), name="EmailContatto2")

    contatto_cliente3 = Column(String(255), name="ContattoCliente3")
    qualifica3 = Column(String(255), name="Qualifica3")
    tel_contatto3 = Column(String(50), name="TelContatto3")
    cell_contatto3 = Column(String(50), name="CellContatto3")
    email_contatto3 = Column(String(255), name="EmailContatto3")

    contatto_cliente4 = Column(String(255), name="ContattoCliente4")
    qualifica4 = Column(String(255), name="Qualifica4")
    tel_contatto4 = Column(String(50), name="TelContatto4")
    cell_contatto4 = Column(String(50), name="CellContatto4")
    email_contatto4 = Column(String(255), name="EmailContatto4")

    contatto_cliente5 = Column(String(255), name="ContattoCliente5")
    qualifica5 = Column(String(255), name="Qualifica5")
    tel_contatto5 = Column(String(50), name="TelContatto5")
    cell_contatto5 = Column(String(50), name="CellContatto5")
    email_contatto5 = Column(String(255), name="EmailContatto5")

    contatto_cliente6 = Column(String(255), name="ContattoCliente6")
    qualifica6 = Column(String(255), name="Qualifica6")
    tel_contatto6 = Column(String(50), name="TelContatto6")
    cell_contatto6 = Column(String(50), name="CellContatto6")
    email_contatto6 = Column(String(255), name="EmailContatto6")

    contatto_cliente7 = Column(String(255), name="ContattoCliente7")
    qualifica7 = Column(String(255), name="Qualifica7")
    tel_contatto7 = Column(String(50), name="TelContatto7")
    cell_contatto7 = Column(String(50), name="CellContatto7")
    email_contatto7 = Column(String(255), name="EmailContatto7")

    # --- Referenti Interni ---
    referente_interno1 = Column(String(255), name="ReferenteInterno1")
    referente_interno2 = Column(String(255), name="ReferenteInterno2")
    referente_interno3 = Column(String(255), name="ReferenteInterno3")

    # --- Dati Bancari ---
    banca = Column(String(255), name="Banca")
    cin = Column(String(5), name="CIN")
    cab = Column(String(10), name="CAB")
    abi = Column(String(10), name="ABI")
    cc = Column(String(20), name="CC")
    nazione = Column(String(5), name="Nazione")
    prefisso_nazione = Column(String(10), name="PrefissoNazione")
    iban = Column(String(34), name="IBAN")

    # --- Stato & Flag ---
    privacy = Column(Boolean, name="Privacy")
    sospeso = Column(Boolean, name="Sospeso")
    cr_hold = Column(Boolean, name="CrHold")
    comm_hold = Column(String(255), name="CommHold")
    esposizione = Column(Float, name="Esposizione")
    commento1 = Column(String(4000), name="Commento1")
    commento2 = Column(String(4000), name="Commento2")
    flag1 = Column(Boolean, name="Flag1")
    flag2 = Column(Boolean, name="Flag2")
    flag3 = Column(Boolean, name="Flag3")
    data_ultima_mod = Column(DateTime, name="DataUltimaMod")
    indic_agg = Column(Boolean, name="IndicAgg")
    utente = Column(String(50), name="utente")

    # --- Intento ---
    intento_numero = Column(String(50), name="IntentoNumero")
    intento_data = Column(DateTime, name="IntentoData")
    intento_scadenza = Column(DateTime, name="IntentoScadenza")

    # --- Rappresentante Legale ---
    rp_nome = Column(String(100), name="rp_nome")
    rp_cognome = Column(String(100), name="rp_cognome")
    rp_cf = Column(String(20), name="rp_CF")
    rp_email = Column(String(255), name="rp_email")
    rp_pec = Column(String(255), name="rp_PEC")
    rp_indirizzo_residenza = Column(String(255), name="rp_indirizzo_residenza")
    rp_cap_residenza = Column(String(10), name="rp_cap_residenza")
    rp_citta_residenza = Column(String(100), name="rp_citta_residenza")
    rp_prov_residenza = Column(String(10), name="rp_prov_residenza")
    rp_luogo_nascita = Column(String(100), name="rp_luogo_nascita")
    rp_data_nascita = Column(DateTime, name="rp_data_nascita")
    rp_nazionalita = Column(String(50), name="rp_nazionalita")
    rp_tipo_documento = Column(String(50), name="rp_tipo_documento")
    rp_estremi_documento = Column(String(255), name="rp_estremi_documento")
    rp_rilasciato_da_documento = Column(String(255), name="rp_rilasciato_da_documento")
    rp_rilasciato_il_documento = Column(DateTime, name="rp_rilasciato_il_documento")
    rp_scadenza_documento = Column(DateTime, name="rp_scadenza_documento")
    rp_carica = Column(String(100), name="rp_carica")

    # --- Delegato alla Firma ---
    dl_nome = Column(String(100), name="dl_nome")
    dl_cognome = Column(String(100), name="dl_cognome")
    dl_cf = Column(String(20), name="dl_CF")
    dl_indirizzo_residenza = Column(String(255), name="dl_indirizzo_residenza")
    dl_luogo_nascita = Column(String(100), name="dl_luogo_nascita")
    dl_data_nascita = Column(DateTime, name="dl_data_nascita")
    dl_estremi_documento = Column(String(255), name="dl_estremi_documento")
    dl_carica = Column(String(100), name="dl_carica")

    # --- Titolare Effettivo ---
    te_nome = Column(String(100), name="te_nome")
    te_cognome = Column(String(100), name="te_cognome")
    te_cf = Column(String(20), name="te_CF")
    te_indirizzo_residenza = Column(String(255), name="te_indirizzo_residenza")
    te_luogo_nascita = Column(String(100), name="te_luogo_nascita")
    te_data_nascita = Column(DateTime, name="te_data_nascita")

    # --- Antiriciclaggio ---
    data_invio_anti = Column(DateTime, name="data_invio_anti")

    # --- Fornitore ---
    forn_fornitura = Column(String(255), name="forn_fornitura")
    forn_data_stipula = Column(DateTime, name="forn_data_stipula")
    forn_data_scadenza = Column(DateTime, name="forn_data_scadenza")
    forn_comm_nominativo = Column(String(255), name="forn_comm_nominativo")
    forn_comm_email = Column(String(255), name="forn_comm_email")
    forn_comm_tel = Column(String(50), name="forn_comm_tel")
    forn_comm_cel = Column(String(50), name="forn_comm_cel")
    forn_tipo_fat = Column(SmallInteger, name="forn_tipo_fat")
    forn_tipo_pag = Column(SmallInteger, name="forn_tipo_pag")
    forn_iban_1 = Column(String(34), name="forn_iban_1")
    forn_iban_2 = Column(String(34), name="forn_iban_2")
    forn_commento = Column(String(4000), name="forn_commento")
    forn_commento_2 = Column(String(4000), name="forn_commento_2")

    # --- Fatturazione Elettronica ---
    codice_destinatario = Column(String(10), name="CodiceDestinatario")

    # --- Costo Dipendenti ---
    cp_mensilita = Column(SmallInteger, name="cp_mensilita")
    cp_ctr_ipns_azi_imp = Column(Float, name="cp_ctr_ipns_azi_imp")
    cp_ctr_ipns_azi_dir = Column(Float, name="cp_ctr_ipns_azi_dir")
    cp_ctr_ipns_azi_op = Column(Float, name="cp_ctr_ipns_azi_op")
    cp_ctr_ipns_dip_imp = Column(Float, name="cp_ctr_ipns_dip_imp")
    cp_ctr_ipns_dip_dir = Column(Float, name="cp_ctr_ipns_dip_dir")
    cp_ctr_ipns_dip_op = Column(Float, name="cp_ctr_ipns_dip_op")
    cp_inail = Column(Float, name="cp_inail")
    cp_irap = Column(Float, name="cp_irap")
    cp_num_buoni_pasto = Column(SmallInteger, name="cp_num_buoni_pasto")
    cp_fondo_san_azi = Column(Float, name="cp_fondo_san_azi")
    cp_fondo_san_dip = Column(Float, name="cp_fondo_san_dip")
    cp_ctr_prev_integr_azi = Column(Float, name="cp_ctr_prev_integr_azi")
    cp_ctr_prev_integr_dir = Column(Float, name="cp_ctr_prev_integr_dir")
    cp_ctr_ass_integr_azi = Column(Float, name="cp_ctr_ass_integr_azi")
    cp_ctr_ass_integr_dir = Column(Float, name="cp_ctr_ass_integr_dir")
    codice_ditta_inail = Column(String(50), name="codice_ditta_INAIL")
    cassa_edile = Column(String(50), name="cassa_edile")
    codice_ditta = Column(String(50), name="codice_ditta")
    ccod = Column(String(50), name="ccod")


# =============================================================================
# SUB-TABELLE ANAGRAFICA
# =============================================================================

class AnagraficaMatricoleINPS(Base):
    __tablename__ = "Anagrafica_Matricole_INPS"

    id = Column(Integer, primary_key=True, name="ID", autoincrement=True)
    id_anagrafica = Column(Integer, name="ID_Anagrafica")
    descrizione = Column(String(255), name="Descrizione")


class AnagraficaPATINAIL(Base):
    __tablename__ = "Anagrafica_PAT_INAIL"

    id = Column(Integer, primary_key=True, name="ID", autoincrement=True)
    id_anagrafica = Column(Integer, name="ID_Anagrafica")
    descrizione = Column(String(255), name="Descrizione")


class AnagraficaLetteraIntento(Base):
    __tablename__ = "Anagrafica_Lettera_Intento"

    id = Column(Integer, primary_key=True, name="ID", autoincrement=True)
    id_anagrafica = Column(Integer, name="ID_Anagrafica")
    descrizione = Column(String(255), name="Descrizione")
