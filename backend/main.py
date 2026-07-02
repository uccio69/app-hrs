from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional, Union
from datetime import timedelta, datetime
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import msal
import requests
from dotenv import load_dotenv

load_dotenv()

import models
from database import engine, get_db

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HR Support Backend")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

# Pydantic Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    password_expired: bool = False
    user: Optional[dict] = None

# =============================================================================
# ANAGRAFICA SCHEMAS - Modello completo con tutti i campi
# =============================================================================

class AnagraficaFullResponse(BaseModel):
    """Response completa con tutti i campi dell'anagrafica."""
    codice: Optional[Union[str, int]] = None
    cod_inaz: Optional[str] = None
    cod_zucchetti: Optional[str] = None
    forma: Optional[str] = None
    rag_sociale: Optional[str] = None
    tipologia: Optional[int] = None
    settore: Optional[int] = None
    attivita: Optional[str] = None
    cod_ateco: Optional[str] = None
    data_costituzione: Optional[datetime] = None
    data_ini_attivita: Optional[datetime] = None
    registrazione: Optional[str] = None
    registrazione_citta: Optional[str] = None
    registrazione_data: Optional[datetime] = None
    ccnl: Optional[str] = None
    pa: Optional[bool] = None
    titolo: Optional[str] = None
    cognome: Optional[str] = None
    nome: Optional[str] = None
    reparto: Optional[str] = None
    indirizzo: Optional[str] = None
    cap: Optional[str] = None
    citta: Optional[str] = None
    provincia: Optional[str] = None
    sede1_indirizzo: Optional[str] = None
    sede1_cap: Optional[str] = None
    sede1_citta: Optional[str] = None
    sede1_provincia: Optional[str] = None
    sede2_indirizzo: Optional[str] = None
    sede2_cap: Optional[str] = None
    sede2_citta: Optional[str] = None
    sede2_provincia: Optional[str] = None
    partita_iva: Optional[str] = None
    codice_fiscale: Optional[str] = None
    indirizzo_residenza: Optional[str] = None
    luogo_nascita: Optional[str] = None
    data_nascita: Optional[datetime] = None
    estremi_documento: Optional[str] = None
    forma2: Optional[str] = None
    rag_sociale2: Optional[str] = None
    titolo2: Optional[str] = None
    cognome2: Optional[str] = None
    nome2: Optional[str] = None
    indirizzo2: Optional[str] = None
    cap2: Optional[str] = None
    citta2: Optional[str] = None
    provincia2: Optional[str] = None
    tipo: Optional[str] = None
    telefono1: Optional[str] = None
    telefono2: Optional[str] = None
    fax1: Optional[str] = None
    fax2: Optional[str] = None
    cellulare1: Optional[str] = None
    cellulare2: Optional[str] = None
    pec: Optional[str] = None
    email1: Optional[str] = None
    email2: Optional[str] = None
    contatto_cliente1: Optional[str] = None
    qualifica1: Optional[str] = None
    tel_contatto1: Optional[str] = None
    cell_contatto1: Optional[str] = None
    email_contatto1: Optional[str] = None
    contatto_cliente2: Optional[str] = None
    qualifica2: Optional[str] = None
    tel_contatto2: Optional[str] = None
    cell_contatto2: Optional[str] = None
    email_contatto2: Optional[str] = None
    contatto_cliente3: Optional[str] = None
    qualifica3: Optional[str] = None
    tel_contatto3: Optional[str] = None
    cell_contatto3: Optional[str] = None
    email_contatto3: Optional[str] = None
    contatto_cliente4: Optional[str] = None
    qualifica4: Optional[str] = None
    tel_contatto4: Optional[str] = None
    cell_contatto4: Optional[str] = None
    email_contatto4: Optional[str] = None
    contatto_cliente5: Optional[str] = None
    qualifica5: Optional[str] = None
    tel_contatto5: Optional[str] = None
    cell_contatto5: Optional[str] = None
    email_contatto5: Optional[str] = None
    contatto_cliente6: Optional[str] = None
    qualifica6: Optional[str] = None
    tel_contatto6: Optional[str] = None
    cell_contatto6: Optional[str] = None
    email_contatto6: Optional[str] = None
    contatto_cliente7: Optional[str] = None
    qualifica7: Optional[str] = None
    tel_contatto7: Optional[str] = None
    cell_contatto7: Optional[str] = None
    email_contatto7: Optional[str] = None
    referente_interno1: Optional[str] = None
    referente_interno2: Optional[str] = None
    referente_interno3: Optional[str] = None
    banca: Optional[str] = None
    cin: Optional[str] = None
    cab: Optional[str] = None
    abi: Optional[str] = None
    cc: Optional[str] = None
    nazione: Optional[str] = None
    prefisso_nazione: Optional[str] = None
    iban: Optional[str] = None
    privacy: Optional[bool] = None
    sospeso: Optional[bool] = None
    cr_hold: Optional[bool] = None
    comm_hold: Optional[str] = None
    esposizione: Optional[float] = None
    commento1: Optional[str] = None
    commento2: Optional[str] = None
    flag1: Optional[bool] = None
    flag2: Optional[bool] = None
    flag3: Optional[bool] = None
    data_ultima_mod: Optional[datetime] = None
    indic_agg: Optional[bool] = None
    utente: Optional[str] = None
    intento_numero: Optional[str] = None
    intento_data: Optional[datetime] = None
    intento_scadenza: Optional[datetime] = None
    rp_nome: Optional[str] = None
    rp_cognome: Optional[str] = None
    rp_cf: Optional[str] = None
    rp_email: Optional[str] = None
    rp_pec: Optional[str] = None
    rp_indirizzo_residenza: Optional[str] = None
    rp_cap_residenza: Optional[str] = None
    rp_citta_residenza: Optional[str] = None
    rp_prov_residenza: Optional[str] = None
    rp_luogo_nascita: Optional[str] = None
    rp_data_nascita: Optional[datetime] = None
    rp_nazionalita: Optional[str] = None
    rp_tipo_documento: Optional[str] = None
    rp_estremi_documento: Optional[str] = None
    rp_rilasciato_da_documento: Optional[str] = None
    rp_rilasciato_il_documento: Optional[datetime] = None
    rp_scadenza_documento: Optional[datetime] = None
    rp_carica: Optional[str] = None
    dl_nome: Optional[str] = None
    dl_cognome: Optional[str] = None
    dl_cf: Optional[str] = None
    dl_indirizzo_residenza: Optional[str] = None
    dl_luogo_nascita: Optional[str] = None
    dl_data_nascita: Optional[datetime] = None
    dl_estremi_documento: Optional[str] = None
    dl_carica: Optional[str] = None
    te_nome: Optional[str] = None
    te_cognome: Optional[str] = None
    te_cf: Optional[str] = None
    te_indirizzo_residenza: Optional[str] = None
    te_luogo_nascita: Optional[str] = None
    te_data_nascita: Optional[datetime] = None
    data_invio_anti: Optional[datetime] = None
    forn_fornitura: Optional[str] = None
    forn_data_stipula: Optional[datetime] = None
    forn_data_scadenza: Optional[datetime] = None
    forn_comm_nominativo: Optional[str] = None
    forn_comm_email: Optional[str] = None
    forn_comm_tel: Optional[str] = None
    forn_comm_cel: Optional[str] = None
    forn_tipo_fat: Optional[int] = None
    forn_tipo_pag: Optional[int] = None
    forn_iban_1: Optional[str] = None
    forn_iban_2: Optional[str] = None
    forn_commento: Optional[str] = None
    forn_commento_2: Optional[str] = None
    codice_destinatario: Optional[str] = None
    cp_mensilita: Optional[int] = None
    cp_ctr_ipns_azi_imp: Optional[float] = None
    cp_ctr_ipns_azi_dir: Optional[float] = None
    cp_ctr_ipns_azi_op: Optional[float] = None
    cp_ctr_ipns_dip_imp: Optional[float] = None
    cp_ctr_ipns_dip_dir: Optional[float] = None
    cp_ctr_ipns_dip_op: Optional[float] = None
    cp_inail: Optional[float] = None
    cp_irap: Optional[float] = None
    cp_num_buoni_pasto: Optional[int] = None
    cp_fondo_san_azi: Optional[float] = None
    cp_fondo_san_dip: Optional[float] = None
    cp_ctr_prev_integr_azi: Optional[float] = None
    cp_ctr_prev_integr_dir: Optional[float] = None
    cp_ctr_ass_integr_azi: Optional[float] = None
    cp_ctr_ass_integr_dir: Optional[float] = None
    codice_ditta_inail: Optional[str] = None
    cassa_edile: Optional[str] = None
    codice_ditta: Optional[str] = None
    ccod: Optional[str] = None
    matricole_inps: Optional[List[dict]] = []
    pat_inail: Optional[List[dict]] = []
    lettere_intento: Optional[List[dict]] = []

    class Config:
        from_attributes = True


class AnagraficaCreateFullRequest(BaseModel):
    """Request per la creazione completa di una nuova anagrafica."""
    cod_inaz: Optional[str] = ""
    cod_zucchetti: Optional[str] = "000"
    forma: Optional[str] = "Spett.le"
    rag_sociale: Optional[str] = ""
    tipologia: Optional[int] = 0
    settore: Optional[int] = 0
    attivita: Optional[str] = ""
    cod_ateco: Optional[str] = ""
    data_costituzione: Optional[datetime] = None
    data_ini_attivita: Optional[datetime] = None
    registrazione: Optional[str] = ""
    registrazione_citta: Optional[str] = ""
    registrazione_data: Optional[datetime] = None
    ccnl: Optional[str] = "000"
    pa: Optional[bool] = False
    titolo: Optional[str] = ""
    cognome: Optional[str] = ""
    nome: Optional[str] = ""
    reparto: Optional[str] = ""
    indirizzo: Optional[str] = ""
    cap: Optional[str] = ""
    citta: Optional[str] = ""
    provincia: Optional[str] = ""
    sede1_indirizzo: Optional[str] = ""
    sede1_cap: Optional[str] = ""
    sede1_citta: Optional[str] = ""
    sede1_provincia: Optional[str] = ""
    sede2_indirizzo: Optional[str] = ""
    sede2_cap: Optional[str] = ""
    sede2_citta: Optional[str] = ""
    sede2_provincia: Optional[str] = ""
    partita_iva: Optional[str] = ""
    codice_fiscale: Optional[str] = ""
    indirizzo_residenza: Optional[str] = ""
    luogo_nascita: Optional[str] = ""
    data_nascita: Optional[datetime] = None
    estremi_documento: Optional[str] = ""
    forma2: Optional[str] = "Spett.le"
    rag_sociale2: Optional[str] = ""
    titolo2: Optional[str] = ""
    cognome2: Optional[str] = ""
    nome2: Optional[str] = ""
    indirizzo2: Optional[str] = ""
    cap2: Optional[str] = ""
    citta2: Optional[str] = ""
    provincia2: Optional[str] = ""
    tipo: Optional[str] = ""
    telefono1: Optional[str] = ""
    telefono2: Optional[str] = ""
    fax1: Optional[str] = ""
    fax2: Optional[str] = ""
    cellulare1: Optional[str] = ""
    cellulare2: Optional[str] = ""
    pec: Optional[str] = ""
    email1: Optional[str] = ""
    email2: Optional[str] = ""
    contatto_cliente1: Optional[str] = ""
    qualifica1: Optional[str] = ""
    tel_contatto1: Optional[str] = ""
    cell_contatto1: Optional[str] = ""
    email_contatto1: Optional[str] = ""
    contatto_cliente2: Optional[str] = ""
    qualifica2: Optional[str] = ""
    tel_contatto2: Optional[str] = ""
    cell_contatto2: Optional[str] = ""
    email_contatto2: Optional[str] = ""
    contatto_cliente3: Optional[str] = ""
    qualifica3: Optional[str] = ""
    tel_contatto3: Optional[str] = ""
    cell_contatto3: Optional[str] = ""
    email_contatto3: Optional[str] = ""
    contatto_cliente4: Optional[str] = ""
    qualifica4: Optional[str] = ""
    tel_contatto4: Optional[str] = ""
    cell_contatto4: Optional[str] = ""
    email_contatto4: Optional[str] = ""
    contatto_cliente5: Optional[str] = ""
    qualifica5: Optional[str] = ""
    tel_contatto5: Optional[str] = ""
    cell_contatto5: Optional[str] = ""
    email_contatto5: Optional[str] = ""
    contatto_cliente6: Optional[str] = ""
    qualifica6: Optional[str] = ""
    tel_contatto6: Optional[str] = ""
    cell_contatto6: Optional[str] = ""
    email_contatto6: Optional[str] = ""
    contatto_cliente7: Optional[str] = ""
    qualifica7: Optional[str] = ""
    tel_contatto7: Optional[str] = ""
    cell_contatto7: Optional[str] = ""
    email_contatto7: Optional[str] = ""
    referente_interno1: Optional[str] = ""
    referente_interno2: Optional[str] = ""
    referente_interno3: Optional[str] = ""
    banca: Optional[str] = ""
    cin: Optional[str] = ""
    cab: Optional[str] = ""
    abi: Optional[str] = ""
    cc: Optional[str] = ""
    nazione: Optional[str] = "IT"
    prefisso_nazione: Optional[str] = ""
    iban: Optional[str] = ""
    privacy: Optional[bool] = False
    sospeso: Optional[bool] = False
    cr_hold: Optional[bool] = False
    comm_hold: Optional[str] = ""
    esposizione: Optional[float] = 0
    commento1: Optional[str] = ""
    commento2: Optional[str] = ""
    flag1: Optional[bool] = False
    flag2: Optional[bool] = False
    flag3: Optional[bool] = False
    indic_agg: Optional[bool] = False
    utente: Optional[str] = ""
    intento_numero: Optional[str] = ""
    intento_data: Optional[datetime] = None
    intento_scadenza: Optional[datetime] = None
    rp_nome: Optional[str] = ""
    rp_cognome: Optional[str] = ""
    rp_cf: Optional[str] = ""
    rp_email: Optional[str] = ""
    rp_pec: Optional[str] = ""
    rp_indirizzo_residenza: Optional[str] = ""
    rp_cap_residenza: Optional[str] = ""
    rp_citta_residenza: Optional[str] = ""
    rp_prov_residenza: Optional[str] = ""
    rp_luogo_nascita: Optional[str] = ""
    rp_data_nascita: Optional[datetime] = None
    rp_nazionalita: Optional[str] = ""
    rp_tipo_documento: Optional[str] = ""
    rp_estremi_documento: Optional[str] = ""
    rp_rilasciato_da_documento: Optional[str] = ""
    rp_rilasciato_il_documento: Optional[datetime] = None
    rp_scadenza_documento: Optional[datetime] = None
    rp_carica: Optional[str] = ""
    dl_nome: Optional[str] = ""
    dl_cognome: Optional[str] = ""
    dl_cf: Optional[str] = ""
    dl_indirizzo_residenza: Optional[str] = ""
    dl_luogo_nascita: Optional[str] = ""
    dl_data_nascita: Optional[datetime] = None
    dl_estremi_documento: Optional[str] = ""
    dl_carica: Optional[str] = ""
    te_nome: Optional[str] = ""
    te_cognome: Optional[str] = ""
    te_cf: Optional[str] = ""
    te_indirizzo_residenza: Optional[str] = ""
    te_luogo_nascita: Optional[str] = ""
    te_data_nascita: Optional[datetime] = None
    data_invio_anti: Optional[datetime] = None
    forn_fornitura: Optional[str] = ""
    forn_data_stipula: Optional[datetime] = None
    forn_data_scadenza: Optional[datetime] = None
    forn_comm_nominativo: Optional[str] = ""
    forn_comm_email: Optional[str] = ""
    forn_comm_tel: Optional[str] = ""
    forn_comm_cel: Optional[str] = ""
    forn_tipo_fat: Optional[int] = 0
    forn_tipo_pag: Optional[int] = 0
    forn_iban_1: Optional[str] = ""
    forn_iban_2: Optional[str] = ""
    forn_commento: Optional[str] = ""
    forn_commento_2: Optional[str] = ""
    codice_destinatario: Optional[str] = ""
    cp_mensilita: Optional[int] = 0
    cp_ctr_ipns_azi_imp: Optional[float] = 0
    cp_ctr_ipns_azi_dir: Optional[float] = 0
    cp_ctr_ipns_azi_op: Optional[float] = 0
    cp_ctr_ipns_dip_imp: Optional[float] = 0
    cp_ctr_ipns_dip_dir: Optional[float] = 0
    cp_ctr_ipns_dip_op: Optional[float] = 0
    cp_inail: Optional[float] = 0
    cp_irap: Optional[float] = 0
    cp_num_buoni_pasto: Optional[int] = 0
    cp_fondo_san_azi: Optional[float] = 0
    cp_fondo_san_dip: Optional[float] = 0
    cp_ctr_prev_integr_azi: Optional[float] = 0
    cp_ctr_prev_integr_dir: Optional[float] = 0
    cp_ctr_ass_integr_azi: Optional[float] = 0
    cp_ctr_ass_integr_dir: Optional[float] = 0
    codice_ditta_inail: Optional[str] = ""
    cassa_edile: Optional[str] = ""
    codice_ditta: Optional[str] = ""
    ccod: Optional[str] = ""

    # Sub-tabelle inline per creazione batch
    matricole_inps: Optional[List[dict]] = []
    pat_inail: Optional[List[dict]] = []
    lettere_intento: Optional[List[dict]] = []


# Risposta ridotta per la lista (compatibilità con frontend esistente)
class AnagraficaResponse(BaseModel):
    codice: Optional[Union[str, int]] = None
    cod_inaz: Optional[Union[str, int]] = None
    rag_sociale: Optional[str] = None
    cognome: Optional[str] = None
    nome: Optional[str] = None
    tipo: Optional[Union[str, int]] = None
    utente: Optional[str] = None
    reparto: Optional[str] = None
    sospeso: Optional[bool] = None
    telefono1: Optional[str] = None
    cellulare1: Optional[str] = None
    email1: Optional[str] = None
    pec: Optional[str] = None

    class Config:
        from_attributes = True

class AnagraficaCreateRequest(BaseModel):
    cod_inaz: Optional[Union[str, int]] = None
    rag_sociale: Optional[str] = None
    cognome: Optional[str] = None
    nome: Optional[str] = None
    tipo: Optional[Union[str, int]] = None
    utente: Optional[str] = None
    reparto: Optional[str] = None
    sospeso: Optional[bool] = False
    telefono1: Optional[str] = None
    cellulare1: Optional[str] = None
    email1: Optional[str] = None
    pec: Optional[str] = None

class AnagraficaUpdateRequest(BaseModel):
    cod_inaz: Optional[Union[str, int]] = None
    rag_sociale: Optional[str] = None
    cognome: Optional[str] = None
    nome: Optional[str] = None
    tipo: Optional[Union[str, int]] = None
    utente: Optional[str] = None
    reparto: Optional[str] = None
    sospeso: Optional[bool] = None
    telefono1: Optional[str] = None
    cellulare1: Optional[str] = None
    email1: Optional[str] = None
    pec: Optional[str] = None

class TabellaTipologiaResponse(BaseModel):
    codice: Union[str, int]
    descrizione: Optional[str] = None

    class Config:
        from_attributes = True

class TabellaSettoriResponse(BaseModel):
    id: int
    descrizione: Optional[str] = None

    class Config:
        from_attributes = True

class TabellaCCNLResponse(BaseModel):
    id: int
    codice: Optional[str] = None
    descrizione: Optional[str] = None
    settore: Optional[str] = None

    class Config:
        from_attributes = True

# --- Sub-tabelle Schemas ---
class MatricoleINPSCreateRequest(BaseModel):
    matricola: Optional[str] = ""
    sede: Optional[str] = ""
    descrizione: Optional[str] = ""

class MatricoleINPSResponse(BaseModel):
    id: int
    id_anagrafica: int
    matricola: Optional[str] = None
    sede: Optional[str] = None
    descrizione: Optional[str] = None

    class Config:
        from_attributes = True

class PATINAILCreateRequest(BaseModel):
    pat: Optional[str] = ""
    descrizione: Optional[str] = ""

class PATINAILResponse(BaseModel):
    id: int
    id_anagrafica: int
    pat: Optional[str] = None
    descrizione: Optional[str] = None

    class Config:
        from_attributes = True

class LetteraIntentoCreateRequest(BaseModel):
    numero: Optional[str] = ""
    data: Optional[datetime] = None
    scadenza: Optional[datetime] = None
    importo: Optional[float] = 0
    descrizione: Optional[str] = ""

class LetteraIntentoResponse(BaseModel):
    id: int
    id_anagrafica: int
    numero: Optional[str] = None
    data: Optional[datetime] = None
    scadenza: Optional[datetime] = None
    importo: Optional[float] = None
    descrizione: Optional[str] = None

    class Config:
        from_attributes = True


# --- Utenti Schemas ---
class UtenteListResponse(BaseModel):
    id: int
    nome: Optional[str] = None
    cognome: Optional[str] = None
    username: Optional[str] = None
    livello: Optional[int] = None
    sede: Optional[str] = None
    interno: Optional[Union[str, int]] = None
    e_mail: Optional[str] = None
    costo_studio: Optional[float] = None
    costo_clienti: Optional[float] = None
    flg_abilitazione: Optional[bool] = None
    flg_filtro_clienti: Optional[bool] = None
    scad_pswd: Optional[datetime] = None

    class Config:
        from_attributes = True

class UtenteCreateRequest(BaseModel):
    nome: Optional[str] = None
    cognome: Optional[str] = None
    username: str
    password: str
    scad_pswd: Optional[datetime] = None
    livello: Optional[int] = None
    sede: Optional[str] = None
    interno: Optional[Union[str, int]] = None
    e_mail: Optional[str] = None
    costo_studio: Optional[float] = None
    costo_clienti: Optional[float] = None
    flg_abilitazione: Optional[bool] = True
    flg_filtro_clienti: Optional[bool] = False

class UtenteUpdateRequest(BaseModel):
    nome: Optional[str] = None
    cognome: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    scad_pswd: Optional[datetime] = None
    livello: Optional[int] = None
    sede: Optional[str] = None
    interno: Optional[Union[str, int]] = None
    e_mail: Optional[str] = None
    costo_studio: Optional[float] = None
    costo_clienti: Optional[float] = None
    flg_abilitazione: Optional[bool] = None
    flg_filtro_clienti: Optional[bool] = None

class ChangePasswordRequest(BaseModel):
    username: str
    old_password: str
    new_password: str

# Dependency for current user
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from jose import JWTError, jwt
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Normally we'd look up the user again, but checking token is enough for now
    return username

import auth

@app.post("/api/login")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        user = db.query(models.Utente).filter(models.Utente.username == form_data.username).first()
    except Exception:
        raise HTTPException(status_code=500, detail="Database schema mismatch for 'utenti'")

    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenziali non valide",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Controllo abilitazione utente
    if not user.flg_abilitazione:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Utente non abilitato",
        )

    # Dati utente da restituire al frontend
    user_data = {
        "id": user.id,
        "nome": user.nome,
        "cognome": user.cognome,
        "username": user.username,
        "livello": user.livello,
        "e_mail": user.e_mail,
        "flg_filtro_clienti": user.flg_filtro_clienti,
    }

    # Controllo scadenza password
    password_expired = False
    if user.scad_pswd and user.scad_pswd < datetime.now():
        password_expired = True

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "password_expired": password_expired,
        "user": user_data,
    }


# --- Change Password (dopo scadenza) ---
@app.post("/api/change-password")
def change_password(req: ChangePasswordRequest, db: Session = Depends(get_db)):
    """Cambia la password dopo aver verificato quella vecchia. Imposta scadenza a +3 mesi."""
    user = db.query(models.Utente).filter(models.Utente.username == req.username).first()

    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    # Verifica la vecchia password
    if not auth.verify_password(req.old_password, user.password):
        raise HTTPException(status_code=401, detail="La password attuale non è corretta")

    # Cifra e salva la nuova password
    user.password = auth.encrypt_password(req.new_password)

    # Imposta scadenza password a 3 mesi da oggi
    from dateutil.relativedelta import relativedelta
    user.scad_pswd = datetime.now() + relativedelta(months=3)

    db.commit()
    db.refresh(user)

    return {"message": "Password aggiornata con successo. La nuova scadenza è tra 3 mesi."}

# --- Forgot Password ---
class ForgotPasswordRequest(BaseModel):
    username: str

@app.post("/api/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Cerca l'utente per username, decripta la password e la invia all'e_mail."""
    user = db.query(models.Utente).filter(models.Utente.username == req.username).first()

    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    if not user.e_mail or not user.e_mail.strip():
        raise HTTPException(status_code=400, detail="Nessun indirizzo email associato a questo utente")

    # Decripta la password dal DB
    try:
        plain_password = auth.decrypt_password(user.password)
    except Exception:
        raise HTTPException(status_code=500, detail="Impossibile recuperare la password")

    # Invia email con la password in chiaro tramite OAuth 2.0 e Microsoft Graph API
    try:
        tenant_id = os.getenv("OAUTH2_TENANT_ID", "")
        client_id = os.getenv("OAUTH2_CLIENT_ID", "")
        client_secret = os.getenv("OAUTH2_CLIENT_SECRET", "")
        smtp_from = os.getenv("SMTP_FROM", "")

        if not all([tenant_id, client_id, client_secret, smtp_from]):
            raise HTTPException(status_code=500, detail="Credenziali OAuth 2.0 non configurate correttamente.")

        authority = f"https://login.microsoftonline.com/{tenant_id}"
        app_msal = msal.ConfidentialClientApplication(
            client_id, authority=authority,
            client_credential=client_secret
        )

        result = app_msal.acquire_token_silent(["https://graph.microsoft.com/.default"], account=None)
        if not result:
            result = app_msal.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])

        if "access_token" in result:
            access_token = result["access_token"]
        else:
            raise Exception(f"Impossibile ottenere il token: {result.get('error_description')}")

        endpoint = f"https://graph.microsoft.com/v1.0/users/{smtp_from}/sendMail"
        email_msg = {
            "message": {
                "subject": "HR Support - Recupero Password",
                "body": {
                    "contentType": "Text",
                    "content": f"Gentile {user.username},\n\nhai richiesto il recupero della tua password.\n\nLa tua password è: {plain_password}\n\nTi consigliamo di cambiarla al primo accesso.\n\nCordiali saluti,\nHR Support"
                },
                "toRecipients": [
                    {
                        "emailAddress": {
                            "address": user.e_mail.strip()
                        }
                    }
                ]
            },
            "saveToSentItems": "false"
        }

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        response = requests.post(endpoint, headers=headers, json=email_msg)
        if response.status_code >= 400:
            raise Exception(f"Errore API Graph: {response.text}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore nell'invio dell'email: {str(e)}")

    return {"message": "Password inviata all'indirizzo email associato al tuo account."}

from sqlalchemy import or_

# =============================================================================
# ANAGRAFICA ENDPOINTS
# =============================================================================

@app.get("/api/anagrafica", response_model=List[AnagraficaResponse])
def get_anagrafiche(
    codice_paghe: Optional[str] = None, 
    codice_univoco: Optional[str] = None, 
    nominativo: Optional[str] = None,
    tipo: Optional[str] = None,
    utente: Optional[str] = None,
    aziende_attive: Optional[bool] = None,
    current_user: str = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    query = db.query(models.Anagrafica)
    
    if codice_paghe:
        query = query.filter(models.Anagrafica.cod_inaz.contains(codice_paghe))
    if codice_univoco:
        query = query.filter(models.Anagrafica.codice.contains(codice_univoco))
    if tipo:
        query = query.filter(models.Anagrafica.tipo == tipo)
    if utente:
        query = query.filter(models.Anagrafica.utente == utente)
    if aziende_attive:
        query = query.filter(models.Anagrafica.sospeso == False)
    if nominativo:
        terms = nominativo.strip().split()
        for term in terms:
            query = query.filter(
                or_(
                    models.Anagrafica.rag_sociale.contains(term),
                    models.Anagrafica.cognome.contains(term),
                    models.Anagrafica.nome.contains(term)
                )
            )
        
    return query.all()

@app.get("/api/tipologia-anagrafica", response_model=List[TabellaTipologiaResponse])
def get_tipologia_anagrafica(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Tabella_Tipologia).order_by(models.Tabella_Tipologia.descrizione).all()

@app.get("/api/tabella-settori", response_model=List[TabellaSettoriResponse])
def get_tabella_settori(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    """Restituisce l'elenco dei settori per popolare il dropdown."""
    return db.query(models.TabellaSettori).order_by(models.TabellaSettori.descrizione).all()

@app.get("/api/tabella-ccnl", response_model=List[TabellaCCNLResponse])
def get_tabella_ccnl(db: Session = Depends(get_db)):
    """Restituisce l'elenco dei CCNL per popolare il dropdown."""
    return db.query(models.TabellaCCNL).filter(
        models.TabellaCCNL.descrizione.isnot(None),
        models.TabellaCCNL.abilitazione == True
    ).order_by(models.TabellaCCNL.settore, models.TabellaCCNL.descrizione).all()

# --- Inserimento completo Anagrafica (dalla nuova maschera full-page) ---
@app.post("/api/anagrafica/full", response_model=AnagraficaFullResponse, status_code=status.HTTP_201_CREATED)
def create_anagrafica_full(
    req: AnagraficaCreateFullRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crea una nuova anagrafica con tutti i campi, replicando la logica INSERT del VB.NET."""
    from sqlalchemy import cast, Integer

    # Calcola il prossimo codice (come nel VB.NET: MAX(Codice) + 1)
    try:
        max_codice = db.query(func.max(models.Anagrafica.codice)).scalar() or 0
    except Exception:
        max_codice = 0

    next_codice = int(max_codice) + 1

    # Estrai sub-tabelle dal request prima di creare l'oggetto principale
    matricole_data = req.matricole_inps or []
    pat_data = req.pat_inail or []
    lettere_data = req.lettere_intento or []

    # Prepara i dati per l'anagrafica principale (escludi sub-tabelle)
    anag_data = req.model_dump(exclude={"matricole_inps", "pat_inail", "lettere_intento"})

    # Forza il tipo a uppercase e max 3 caratteri (come nel VB.NET)
    if anag_data.get("tipo"):
        anag_data["tipo"] = anag_data["tipo"][:3].upper()

    # Imposta la data di ultima modifica
    anag_data["data_ultima_mod"] = datetime.now()

    new_anag = models.Anagrafica(
        codice=next_codice,
        **anag_data
    )
    db.add(new_anag)
    db.flush()  # Flush per ottenere il codice prima di inserire le sub-tabelle

    # Inserisci Matricole INPS
    for m in matricole_data:
        new_m = models.AnagraficaMatricoleINPS(
            id_anagrafica=next_codice,
            descrizione=m.get("descrizione", ""),
        )
        db.add(new_m)

    # Inserisci PAT INAIL
    for p in pat_data:
        new_p = models.AnagraficaPATINAIL(
            id_anagrafica=next_codice,
            descrizione=p.get("descrizione", ""),
        )
        db.add(new_p)

    # Inserisci Lettere d'Intento
    for l in lettere_data:
        new_l = models.AnagraficaLetteraIntento(
            id_anagrafica=next_codice,
            numero=l.get("numero", ""),
            data=l.get("data"),
            scadenza=l.get("scadenza"),
        )
        db.add(new_l)

    db.commit()
    db.refresh(new_anag)
    return new_anag


@app.get("/api/anagrafica/full/{codice}", response_model=AnagraficaFullResponse)
def get_anagrafica_full(
    codice: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Restituisce l'anagrafica completa con tutte le sub-tabelle."""
    anag = db.query(models.Anagrafica).filter(models.Anagrafica.codice == codice).first()
    if not anag:
        raise HTTPException(status_code=404, detail="Anagrafica non trovata")
    
    # Costruisci dizionario base
    result = {k: v for k, v in anag.__dict__.items() if not k.startswith('_')}
    
    # Aggiungi sub-tabelle
    result["matricole_inps"] = [{k: v for k, v in m.__dict__.items() if not k.startswith('_')} for m in db.query(models.AnagraficaMatricoleINPS).filter(models.AnagraficaMatricoleINPS.id_anagrafica == codice).all()]
    result["pat_inail"] = [{k: v for k, v in p.__dict__.items() if not k.startswith('_')} for p in db.query(models.AnagraficaPATINAIL).filter(models.AnagraficaPATINAIL.id_anagrafica == codice).all()]
    result["lettere_intento"] = [{k: v for k, v in l.__dict__.items() if not k.startswith('_')} for l in db.query(models.AnagraficaLetteraIntento).filter(models.AnagraficaLetteraIntento.id_anagrafica == codice).all()]
    
    return result

@app.put("/api/anagrafica/full/{codice}", status_code=status.HTTP_200_OK)
def update_anagrafica_full(
    codice: str,
    req: AnagraficaCreateFullRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Aggiorna un'anagrafica esistente con tutti i campi e ricrea le sub-tabelle."""
    anag = db.query(models.Anagrafica).filter(models.Anagrafica.codice == codice).first()
    if not anag:
        raise HTTPException(status_code=404, detail="Anagrafica non trovata")
    
    # Estrai sub-tabelle dal request prima di aggiornare l'oggetto principale
    matricole_data = req.matricole_inps or []
    pat_data = req.pat_inail or []
    lettere_data = req.lettere_intento or []

    # Prepara i dati per l'anagrafica principale (escludi sub-tabelle)
    anag_data = req.model_dump(exclude={"matricole_inps", "pat_inail", "lettere_intento"})

    # Forza il tipo a uppercase e max 3 caratteri
    if anag_data.get("tipo"):
        anag_data["tipo"] = anag_data["tipo"][:3].upper()

    # Imposta la data di ultima modifica
    anag_data["data_ultima_mod"] = datetime.now()

    for field, value in anag_data.items():
        setattr(anag, field, value)

    # Elimina vecchie sub-tabelle
    db.query(models.AnagraficaMatricoleINPS).filter(models.AnagraficaMatricoleINPS.id_anagrafica == codice).delete()
    db.query(models.AnagraficaPATINAIL).filter(models.AnagraficaPATINAIL.id_anagrafica == codice).delete()
    db.query(models.AnagraficaLetteraIntento).filter(models.AnagraficaLetteraIntento.id_anagrafica == codice).delete()

    # Inserisci nuove sub-tabelle
    for m in matricole_data:
        db.add(models.AnagraficaMatricoleINPS(
            id_anagrafica=codice,
            descrizione=m.get("descrizione", "")
        ))

    for p in pat_data:
        db.add(models.AnagraficaPATINAIL(
            id_anagrafica=codice,
            descrizione=p.get("descrizione", "")
        ))

    for l in lettere_data:
        db.add(models.AnagraficaLetteraIntento(
            id_anagrafica=codice,
            numero=l.get("numero", ""),
            data=l.get("data"),
            scadenza=l.get("scadenza")
        ))

    db.commit()
    db.refresh(anag)
    return {"message": "Anagrafica aggiornata con successo"}


# --- CRUD semplificato (compatibilità con frontend esistente) ---
@app.post("/api/anagrafica", response_model=AnagraficaResponse, status_code=status.HTTP_201_CREATED)
def create_anagrafica(
    req: AnagraficaCreateRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from sqlalchemy import cast, Integer
    
    try:
        max_codice = db.query(func.max(models.Anagrafica.codice)).scalar() or 0
    except Exception:
        max_codice = 0
        
    next_codice = int(max_codice) + 1
    
    new_anag = models.Anagrafica(
        codice=next_codice,
        **req.model_dump()
    )
    db.add(new_anag)
    db.commit()
    db.refresh(new_anag)
    return new_anag

@app.put("/api/anagrafica/{codice}", response_model=AnagraficaResponse)
def update_anagrafica(
    codice: str,
    req: AnagraficaUpdateRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    anag = db.query(models.Anagrafica).filter(models.Anagrafica.codice == codice).first()
    if not anag:
        raise HTTPException(status_code=404, detail="Anagrafica non trovata")
    
    update_data = req.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(anag, field, value)
        
    db.commit()
    db.refresh(anag)
    return anag

@app.delete("/api/anagrafica/{codice}")
def delete_anagrafica(
    codice: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    anag = db.query(models.Anagrafica).filter(models.Anagrafica.codice == codice).first()
    if not anag:
        raise HTTPException(status_code=404, detail="Anagrafica non trovata")
    
    db.delete(anag)
    db.commit()
    return {"message": "Anagrafica eliminata con successo"}


# =============================================================================
# SUB-TABELLE ENDPOINTS (Matricole INPS, PAT INAIL, Lettere Intento)
# =============================================================================

@app.post("/api/anagrafica/{codice}/matricole-inps", response_model=MatricoleINPSResponse, status_code=status.HTTP_201_CREATED)
def create_matricola_inps(
    codice: int,
    req: MatricoleINPSCreateRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Inserisce una nuova Matricola INPS associata all'anagrafica."""
    anag = db.query(models.Anagrafica).filter(models.Anagrafica.codice == codice).first()
    if not anag:
        raise HTTPException(status_code=404, detail="Anagrafica non trovata")

    new_m = models.AnagraficaMatricoleINPS(
        id_anagrafica=codice,
        matricola=req.matricola,
        sede=req.sede,
        descrizione=req.descrizione,
    )
    db.add(new_m)
    db.commit()
    db.refresh(new_m)
    return new_m


@app.post("/api/anagrafica/{codice}/pat-inail", response_model=PATINAILResponse, status_code=status.HTTP_201_CREATED)
def create_pat_inail(
    codice: int,
    req: PATINAILCreateRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Inserisce una nuova PAT INAIL associata all'anagrafica."""
    anag = db.query(models.Anagrafica).filter(models.Anagrafica.codice == codice).first()
    if not anag:
        raise HTTPException(status_code=404, detail="Anagrafica non trovata")

    new_p = models.AnagraficaPATINAIL(
        id_anagrafica=codice,
        pat=req.pat,
        descrizione=req.descrizione,
    )
    db.add(new_p)
    db.commit()
    db.refresh(new_p)
    return new_p


@app.post("/api/anagrafica/{codice}/lettere-intento", response_model=LetteraIntentoResponse, status_code=status.HTTP_201_CREATED)
def create_lettera_intento(
    codice: int,
    req: LetteraIntentoCreateRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Inserisce una nuova Lettera d'Intento associata all'anagrafica."""
    anag = db.query(models.Anagrafica).filter(models.Anagrafica.codice == codice).first()
    if not anag:
        raise HTTPException(status_code=404, detail="Anagrafica non trovata")

    new_l = models.AnagraficaLetteraIntento(
        id_anagrafica=codice,
        numero=req.numero,
        data=req.data,
        scadenza=req.scadenza,
        importo=req.importo,
        descrizione=req.descrizione,
    )
    db.add(new_l)
    db.commit()
    db.refresh(new_l)
    return new_l


# =============================================================================
# UTENTI CRUD ENDPOINTS
# =============================================================================

@app.get("/api/utenti", response_model=List[UtenteListResponse])
def get_utenti(
    nome: Optional[str] = None,
    cognome: Optional[str] = None,
    abilitazione: Optional[bool] = None,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lista utenti con filtri opzionali per nome, cognome e stato abilitazione."""
    query = db.query(models.Utente)
    if nome:
        query = query.filter(models.Utente.nome.ilike(f"%{nome}%"))
    if cognome:
        query = query.filter(models.Utente.cognome.ilike(f"%{cognome}%"))
    if abilitazione is not None:
        query = query.filter(models.Utente.flg_abilitazione == abilitazione)
    return query.order_by(models.Utente.cognome, models.Utente.nome).all()


@app.get("/api/utenti/{utente_id}", response_model=UtenteListResponse)
def get_utente(
    utente_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Dettaglio singolo utente per ID."""
    user = db.query(models.Utente).filter(models.Utente.id == utente_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    return user


@app.post("/api/utenti", response_model=UtenteListResponse, status_code=status.HTTP_201_CREATED)
def create_utente(
    req: UtenteCreateRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Crea un nuovo utente. La password viene cifrata con TripleDES."""
    # Verifica username unico
    existing = db.query(models.Utente).filter(models.Utente.username == req.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username già esistente")

    encrypted_pwd = auth.encrypt_password(req.password)

    from dateutil.relativedelta import relativedelta
    new_scad_pswd = datetime.now() + relativedelta(months=3)

    max_id = db.query(func.max(models.Utente.id)).scalar() or 0
    next_id = max_id + 1

    new_user = models.Utente(
        id=next_id,
        nome=req.nome,
        cognome=req.cognome,
        username=req.username,
        password=encrypted_pwd,
        scad_pswd=new_scad_pswd,
        livello=req.livello,
        sede=req.sede,
        interno=req.interno,
        e_mail=req.e_mail,
        costo_studio=req.costo_studio,
        costo_clienti=req.costo_clienti,
        flg_abilitazione=req.flg_abilitazione,
        flg_filtro_clienti=req.flg_filtro_clienti,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.put("/api/utenti/{utente_id}", response_model=UtenteListResponse)
def update_utente(
    utente_id: int,
    req: UtenteUpdateRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Aggiorna un utente esistente. Solo i campi inviati vengono aggiornati."""
    user = db.query(models.Utente).filter(models.Utente.id == utente_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    update_data = req.model_dump(exclude_unset=True)

    # Se viene inviata una nuova password, cifrarla
    if "password" in update_data and update_data["password"]:
        update_data["password"] = auth.encrypt_password(update_data["password"])

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


@app.patch("/api/utenti/{utente_id}/toggle", response_model=UtenteListResponse)
def toggle_utente(
    utente_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Toggle abilitazione/disabilitazione utente."""
    user = db.query(models.Utente).filter(models.Utente.id == utente_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    user.flg_abilitazione = not user.flg_abilitazione
    db.commit()
    db.refresh(user)
    return user


@app.delete("/api/utenti/{utente_id}")
def delete_utente(
    utente_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Elimina un utente dal database."""
    user = db.query(models.Utente).filter(models.Utente.id == utente_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    db.delete(user)
    db.commit()
    return {"message": f"Utente {utente_id} eliminato con successo"}

# =============================================================================
# NEWS RSS ENDPOINT
# =============================================================================
import sys
import os
import time

# Aggiungi cartella execution al sys.path
execution_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'execution'))
if execution_path not in sys.path:
    sys.path.append(execution_path)

try:
    from fetch_work_news import fetch_work_news
except ImportError:
    fetch_work_news = None

# Cache in memory
_news_cache = {"data": [], "timestamp": 0}
CACHE_TTL = 12 * 3600  # 12 hours in seconds

@app.get("/api/news/lavoro")
def get_lavoro_news():
    global _news_cache
    current_time = time.time()
    
    if _news_cache["data"] and (current_time - _news_cache["timestamp"] < CACHE_TTL):
        return _news_cache["data"]
        
    if fetch_work_news:
        news = fetch_work_news(limit=6)
        if news:
            _news_cache["data"] = news
            _news_cache["timestamp"] = current_time
        return news
    else:
        return []
