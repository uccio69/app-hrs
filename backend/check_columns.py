import pyodbc
import os
from database import DB_SERVER, DB_NAME, DB_USER, DB_PASS

conn = pyodbc.connect(
    f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={DB_SERVER};DATABASE={DB_NAME};UID={DB_USER};PWD={DB_PASS}"
)
cursor = conn.cursor()
cursor.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Anagrafica_Matricole_INPS'")
for row in cursor.fetchall():
    print(row.COLUMN_NAME)
conn.close()
