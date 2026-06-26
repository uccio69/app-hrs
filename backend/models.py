from sqlalchemy import Column, Integer, String
from database import Base

class Utente(Base):
    __tablename__ = "utenti"

    id = Column(Integer, primary_key=True, index=True, name="ID")
    username = Column(String(50), unique=True, index=True, name="utente")
    # In assenza di info, definisco un set standard
    password = Column(String(255))
    e_mail = Column(String(255), name="e_mail")

class Anagrafica(Base):
    __tablename__ = "anagrafica"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), index=True)
    cognome = Column(String(100), index=True)
