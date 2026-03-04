from psycopg2 import pool
import psycopg2
import os
import time

DATABASE_URL = os.environ["DATABASE_URL"]

def initialize_connection_pool(retries=5, delay=5):
    """Initialize the connection pool with retries."""
    for i in range(retries):
        try:
            connection_pool = pool.ThreadedConnectionPool(
                minconn=2,
                maxconn=20,
                dsn=DATABASE_URL
            )
            print("Connection pool initialized successfully!")
            return connection_pool
        except psycopg2.OperationalError as e:
            print(f"Attempt {i + 1} to initialize connection pool failed: {e}")
            if i < retries - 1:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                print("All retry attempts to initialize connection pool failed. Exiting.")
                raise e

connection_pool = initialize_connection_pool()

def get_connection():
    """Get a connection from the pool."""
    return connection_pool.getconn()

def release_connection(conn):
    """Release a connection back to the pool."""
    connection_pool.putconn(conn)