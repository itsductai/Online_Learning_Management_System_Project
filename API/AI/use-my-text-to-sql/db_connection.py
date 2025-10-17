import pyodbc

def get_connection():
    connection = pyodbc.connect(
        "Driver={SQL Server};"
        "Server=MSI;"
        "Database=learning_system_DB;"
        "UID=sa;"
        "PWD=123;"
        "TrustServerCertificate=yes;"
    )
    return connection
