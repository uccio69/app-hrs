from database import engine
from sqlalchemy import inspect

insp = inspect(engine)

for table_name in ["Anagrafica_Lettera_Intento", "Anagrafica_Matricole_INPS", "Anagrafica_PAT_INAIL"]:
    print(f"\n=== {table_name} ===")
    try:
        cols = insp.get_columns(table_name)
        for c in cols:
            print(f"  {c['name']} ({c['type']})")
    except Exception as e:
        print(f"  ERROR: {e}")
