from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean
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

class Anagrafica(Base):
    __tablename__ = "anagrafica"

    codice = Column(String(50), primary_key=True, name="Codice")
    cod_inaz = Column(String(50), name="CodINAZ")
    rag_sociale = Column(String(255), name="RagSociale")
    cognome = Column(String(100), name="Cognome")
    nome = Column(String(100), name="Nome")
    tipo = Column(String(50), name="Tipo")
    utente = Column(String(50), name="utente")
    reparto = Column(String(255), name="Reparto")
    sospeso = Column(Boolean, name="Sospeso")
