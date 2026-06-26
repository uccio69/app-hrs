from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import timedelta
import os
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

class AnagraficaResponse(BaseModel):
    id: int
    nome: Optional[str]
    cognome: Optional[str]

    class Config:
        orm_mode = True

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

@app.post("/api/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Try multiple possible column names just in case
    # Often it's 'username' or 'nome utente'
    try:
        user = db.query(models.Utente).filter(models.Utente.username == form_data.username).first()
    except Exception:
        # If the column is literally "nome utente" and mapped incorrectly, or similar error
        raise HTTPException(status_code=500, detail="Database schema mismatch for 'utenti'")

    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

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

    # Invia email con Microsoft Graph API
    try:
        smtp_from = os.getenv("SMTP_FROM")
        if not smtp_from:
            raise Exception("Mittente SMTP_FROM non configurato nel file .env")

        # OAuth2 settings
        tenant_id = os.getenv("OAUTH2_TENANT_ID")
        client_id = os.getenv("OAUTH2_CLIENT_ID")
        client_secret = os.getenv("OAUTH2_CLIENT_SECRET")

        if not all([tenant_id, client_id, client_secret]):
            raise Exception("Variabili OAUTH2 non configurate nel file .env")

        authority = f"https://login.microsoftonline.com/{tenant_id}"
        msal_app = msal.ConfidentialClientApplication(
            client_id, authority=authority, client_credential=client_secret
        )

        scopes = ["https://graph.microsoft.com/.default"]
        result = msal_app.acquire_token_silent(scopes, account=None)
        if not result:
            result = msal_app.acquire_token_for_client(scopes=scopes)

        if "access_token" not in result:
            raise Exception("Impossibile ottenere l'access token OAuth2: " + str(result.get("error_description", "Errore sconosciuto")))

        access_token = result["access_token"]

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

        response = requests.post(endpoint, json=email_msg, headers=headers)
        if response.status_code != 202:
            raise Exception(f"Errore Microsoft Graph API ({response.status_code}): {response.text}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore nell'invio dell'email: {str(e)}")

    return {"message": "Password inviata all'indirizzo email associato al tuo account."}

@app.get("/api/anagrafica", response_model=List[AnagraficaResponse])
def get_anagrafica(nome: Optional[str] = None, cognome: Optional[str] = None, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(models.Anagrafica)
    
    if nome:
        query = query.filter(models.Anagrafica.nome.ilike(f"%{nome}%"))
    if cognome:
        query = query.filter(models.Anagrafica.cognome.ilike(f"%{cognome}%"))
        
    return query.all()
