"""Module Dockstring"""
import os

from dotenv import load_dotenv
from psycopg2 import pool
from psycopg2.extensions import connection

load_dotenv()


class Database:
    """Dockstring"""
    def __init__(self):
        """Dockstring"""
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
            port=port,
        )

    def retrieve_query(self, query):
        """Dockstring"""
        _connection: connection = self.pool.getconn()
        _connection.autocommit = True
        _cursor = _connection.cursor()
        _cursor.execute(query)
        output = _cursor.fetchall()
        _cursor.close()
        self.pool.putconn(_connection)
        return output

    def execute_query(self, query):
        """Dockstring"""
        _connection: connection = self.pool.getconn()
        _connection.autocommit = True
        _cursor = _connection.cursor()
        _cursor.execute(query)
        _cursor.close()
        self.pool.putconn(_connection)

    def create_user(self, email: str, google_id: str):
        """Dockstring"""
        query = ""
        query += "INSERT INTO users (email, google_id)"
        query += f" VALUES ('{email}', '{google_id}');"
        return self.execute_query(query)

    def create_secret(self, google_id: str, secret: str, title: str):
        """Dockstring"""
        query = ""
        query += "INSERT INTO secrets (google_id, otp_secret, title)"
        query += f" VALUES ('{google_id}', '{secret}', '{title}');"
        return self.execute_query(query)

    def user_exists(self, google_id: str):
        """Dockstring"""
        result = self.retrieve_query(
            f"SELECT * FROM users WHERE google_id = '{google_id}';"
        )
        return len(result) > 0

    def get_user_codes(self, google_id: str):
        """Dockstring"""
        out = []
        result = self.retrieve_query(
            f"SELECT * FROM secrets WHERE google_id = '{google_id}';"
        )
        for user_code in result:
            out.append(
                {
                    "id": user_code[0],
                    "otp_secret": user_code[3],
                    "title": user_code[1],
                }
            )
        return out

    def remove_secret(self, secret_id: int):
        """Dockstring"""
        return self.execute_query(
            f"DELETE FROM secrets WHERE id = '{secret_id}';"
        )
