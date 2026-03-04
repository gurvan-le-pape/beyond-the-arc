def insert_championship(cursor, name, category, gender, level, season_year, division=None, committee_id=None, league_id=None):
    """
    Insert a championship into the database and return its ID.
    NOTE: Does NOT commit — caller is responsible for committing the transaction.
    """
    cursor.execute(
        """
        INSERT INTO championships (name, category, gender, level, season_year, division, committee_id, league_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """,
        (name, category, gender, level, season_year, division, committee_id, league_id),
    )
    championship_id = cursor.fetchone()[0]
    return championship_id