import pyodbc

conn = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};SERVER=SIRIO1;DATABASE=HREDP;UID=SA;PWD=mt1524lg*"
)
cursor = conn.cursor()
cursor.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'utenti'")
for row in cursor.fetchall():
    print(row.COLUMN_NAME)
conn.close()
