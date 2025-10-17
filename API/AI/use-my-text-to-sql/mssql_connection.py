# mssql_connection.py
import os
import pyodbc

MSSQL_CONN = os.getenv(
    "MSSQL_CONN",
    "DRIVER={ODBC Driver 17 for SQL Server};SERVER=MSI;DATABASE=learning_system_DB;UID=sa;PWD=123;TrustServerCertificate=Yes"
)

def get_connection():
    return pyodbc.connect(MSSQL_CONN)
