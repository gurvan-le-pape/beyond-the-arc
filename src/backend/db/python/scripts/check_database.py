import sys
from utils.db_utils import get_connection, release_connection

def check_table_has_rows(table_name):
    """Return the row count for a table, or None on error."""
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(f"SELECT COUNT(*) FROM {table_name};")  # noqa: S608 - table name is controlled input
            return cursor.fetchone()[0]
    except Exception as e:
        print(f"Error checking table '{table_name}': {e}")
        return None
    finally:
        release_connection(conn)

def main():
    if len(sys.argv) < 2:
        print("Usage: python check_database.py <table_name>")
        sys.exit(1)

    table_name = sys.argv[1]
    count = check_table_has_rows(table_name)

    if count is None:
        print(f"Failed to check table '{table_name}'.")
        sys.exit(2)
    elif count > 0:
        print(f"Table '{table_name}' already has {count} rows.")
        sys.exit(0)
    else:
        print(f"Table '{table_name}' is empty.")
        sys.exit(1)


if __name__ == "__main__":
    main()