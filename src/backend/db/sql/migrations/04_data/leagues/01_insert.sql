INSERT INTO
    leagues (
        name,
        phone,
        email,
        address,
        president_id,
        region_id
    )
VALUES (
        'LIGUE REGIONALE D''AUVERGNE-RHÔNE-ALPES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'ARA'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'ARA'
        )
    ),
    (
        'LIGUE REGIONALE DE BOURGOGNE-FRANCHE-COMTE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'BFC'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'BFC'
        )
    ),
    (
        'LIGUE REGIONALE DE BRETAGNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'BRE'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'BRE'
        )
    ),
    (
        'LIGUE REGIONALE DE CORSE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'COR'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'COR'
        )
    ),
    (
        'LIGUE REGIONALE DU CENTRE-VAL-DE-LOIRE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'CVL'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'CVL'
        )
    ),
    (
        'LIGUE REGIONALE GRAND EST DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'GES'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'GES'
        )
    ),
    (
        'LIGUE REGIONALE DE GUADELOUPE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'GUA'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'GUA'
        )
    ),
    (
        'LIGUE REGIONALE DE GUYANE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'GUY'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'GUY'
        )
    ),
    (
        'LIGUE REGIONALE DES HAUTS-DE-FRANCE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'HDF'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'HDF'
        )
    ),
    (
        'LIGUE REGIONALE D''ILE-DE-FRANCE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'IDF'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'IDF'
        )
    ),
    (
        'LIGUE REGIONALE DE MARTINIQUE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'MAR'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'MAR'
        )
    ),
    (
        'LIGUE REGIONALE DE MAYOTTE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'MAY'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'MAY'
        )
    ),
    (
        'LIGUE REGIONALE DE NOUVELLE-AQUITAINE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'NAQ'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'NAQ'
        )
    ),
    (
        'LIGUE REGIONALE DE NORMANDIE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'NOR'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'NOR'
        )
    ),
    (
        'LIGUE REGIONALE D''OCCITANIE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'OCC'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'OCC'
        )
    ),
    (
        'LIGUE REGIONALE DES PAYS-DE-LA-LOIRE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'PDL'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'PDL'
        )
    ),
    (
        'LIGUE REGIONALE DE LA REUNION DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'REU'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'REU'
        )
    ),
    (
        'LIGUE REGIONALE DE PROVENCE-ALPES-COTE-D''AZUR DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'PCA'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'PCA'
        )
    ),
    (
        'LIGUE REGIONALE DE SAINT-PIERRE-ET-MIQUELON DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'SPM'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'SPM'
        )
    ),
    (
        'LIGUE REGIONALE DE SAINT-BARTHÉLEMY DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'STB'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'STB'
        )
    ),
    (
        'LIGUE REGIONALE DE SAINT-MARTIN DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'STM'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'STM'
        )
    ),
    (
        'LIGUE REGIONALE DE WALLIS-ET-FUTUNA DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'WLF'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'WLF'
        )
    ),
    (
        'LIGUE REGIONALE DE POLYNESIE FRANCAISE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'PYF'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'PYF'
        )
    ),
    (
        'LIGUE REGIONALE DE NOUVELLE-CALEDONIE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'NCL'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'NCL'
        )
    ),
    (
        'LIGUE REGIONALE DES TERRES AUSTRALES ET ANTARCTIQUES FRANÇAISES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = 'TAA'
        ),
        (
            SELECT id
            FROM regions
            WHERE
                code = 'TAA'
        )
    )