INSERT INTO
    clubs (
        zip_code,
        code,
        name,
        city,
        committee_id
    )
VALUES (
        '48000',
        'OCC0048503',
        'BASKET CAUSSES MENDOIS',
        'MENDE',
        (
            SELECT id
            FROM committees
            WHERE
                name = 'COMITE DE LA LOZERE BASKET-BALL'
        )
    );