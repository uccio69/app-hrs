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
import auth

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

class TabellaTipologiaResponse(BaseModel):
    codice: Union[str, int]
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
