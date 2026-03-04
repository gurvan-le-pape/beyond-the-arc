def insert_pool(cursor, championship_id, letter, name):
    """
    Insert a pool into the database and return its ID.
    NOTE: Does NOT commit — caller is responsible for committing the transaction.
    """
    cursor.execute(
        """
        INSERT INTO pools (championship_id, letter, name)
        VALUES (%s, %s, %s)
        RETURNING id;
        """,
        (championship_id, letter, name),
    )
    pool_id = cursor.fetchone()[0]
    return pool_id