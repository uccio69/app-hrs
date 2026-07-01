from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# "HREDP" on server "192.168.1.156" with user "SA" and password "mt1524lg*"
DB_USER = os.getenv("DB_USER", "SA")
DB_PASS = os.getenv("DB_PASS", "mt1524lg*")
DB_SERVER = os.getenv("DB_SERVER", "192.168.1.108")
DB_NAME = os.getenv("DB_NAME", "HREDP")

# Requires ODBC Driver 17 for SQL Server
SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc://{DB_USER}:{DB_PASS}@{DB_SERVER}:1433/{DB_NAME}?driver=ODBC+Driver+17+for+SQL+Server"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
