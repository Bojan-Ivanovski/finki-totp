import os
from psycopg2 import pool
from psycopg2.extensions import connection
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        dbname = os.getenv("OMAS_DB")
        username = os.getenv("OMAS_DB_USERNAME")
        password = os.getenv("OMAS_DB_PASSWORD")
        host = os.getenv("OMAS_DB_HOST")
        port = os.getenv("OMAS_DB_PORT")
        self.pool = pool.SimpleConnectionPool(
            minconn=1,
            maxconn=10,
            dbname=dbname,
            user=username,
            password=password,
            host=host,
            port=port
        )

    def retrieve_query(self, query):  
        _connection: connection = self.pool.getconn()
        _connection.autocommit = True
        _cursor = _connection.cursor()
        _cursor.execute(query)
        output = _cursor.fetchall()
        _cursor.close()
        self.pool.putconn(_connection)
        return output

    def execute_query(self, query):  
        _connection: connection = self.pool.getconn()
        _connection.autocommit = True
        _cursor = _connection.cursor()
        _cursor.execute(query)
        _cursor.close()
        self.pool.putconn(_connection)

    def create_user(self, email: str, google_id: str):
        return self.execute_query(f"INSERT INTO users (email, google_id) VALUES ('{email}', '{google_id}');")

    def create_secret(self, google_id: str, secret: str, title: str):
        return self.execute_query(f"INSERT INTO secrets (google_id, otp_secret, title) VALUES ('{google_id}', '{secret}', '{title}');")
    
    def user_exists(self, google_id: str):
        result = self.retrieve_query(f"SELECT * FROM users WHERE google_id = '{google_id}';")
        return len(result) > 0

    def get_user_codes(self, google_id: str):
        out = []
        result = self.retrieve_query(f"SELECT * FROM secrets WHERE google_id = '{google_id}';")
        for user_code in result:
            out.append({
                "id": user_code[0],
                "otp_secret": user_code[3],
                "title": user_code[1]
            })
        return out
    
    def remove_secret(self, secret_id: int):
        return self.execute_query(f"DELETE FROM secrets WHERE id = '{secret_id}';")