-- Static reference data (competition structure, geography), formerly
-- db/sql/migrations/04_data applied by the database entrypoint.
-- Order respects foreign keys: regions -> departments -> presidents
-- -> leagues -> committees -> gyms -> clubs.

-- from regions/01_insert_regions.sql
INSERT INTO regions (code, name) VALUES
-- Metropolitan France
('IDF', 'Île-de-France'),
('CVL', 'Centre-Val de Loire'),
('BFC', 'Bourgogne-Franche-Comté'),
('NOR', 'Normandie'),
('HDF', 'Hauts-de-France'),
('GES', 'Grand Est'),
('PDL', 'Pays de la Loire'),
('BRE', 'Bretagne'),
('NAQ', 'Nouvelle-Aquitaine'),
('OCC', 'Occitanie'),
('ARA', 'Auvergne-Rhône-Alpes'),
('PCA', 'Provence-Alpes-Côte d''Azur'),
('COR', 'Corse'),
-- DROM
('GUA', 'Guadeloupe'),
('MAR', 'Martinique'),
('GUY', 'Guyane'),
('REU', 'Réunion'),
('MAY', 'Mayotte'),
-- COM
('SPM', 'Saint-Pierre-et-Miquelon'),
('STB', 'Saint-Barthélemy'),
('STM', 'Saint-Martin'),
('WLF', 'Wallis-et-Futuna'),
('PYF', 'Polynésie Française'),
-- sui generis collectivity
('NCL', 'Nouvelle-Calédonie'),
-- TAAF
('TAA', 'Terres australes et antarctiques françaises');

-- from departments/01_insert_departments.sql
INSERT INTO departments (code, name, region_id) VALUES
('01', 'Ain', (SELECT id FROM regions WHERE code = 'ARA')),
('02', 'Aisne', (SELECT id FROM regions WHERE code = 'HDF')),
('03', 'Allier', (SELECT id FROM regions WHERE code = 'ARA')),
('04', 'Alpes-de-Haute-Provence', (SELECT id FROM regions WHERE code = 'PCA')),
('05', 'Hautes-Alpes', (SELECT id FROM regions WHERE code = 'PCA')),
('06', 'Alpes-Maritimes', (SELECT id FROM regions WHERE code = 'PCA')),
('2A', 'Corse-du-Sud', (SELECT id FROM regions WHERE code = 'COR')),
('2B', 'Haute-Corse', (SELECT id FROM regions WHERE code = 'COR')),
('07', 'Ardèche', (SELECT id FROM regions WHERE code = 'ARA')),
('08', 'Ardennes', (SELECT id FROM regions WHERE code = 'GES')),
('09', 'Ariège', (SELECT id FROM regions WHERE code = 'OCC')),
('10', 'Aube', (SELECT id FROM regions WHERE code = 'GES')),
('11', 'Aude', (SELECT id FROM regions WHERE code = 'OCC')),
('12', 'Aveyron', (SELECT id FROM regions WHERE code = 'OCC')),
('13', 'Bouches-du-Rhône', (SELECT id FROM regions WHERE code = 'PCA')),
('14', 'Calvados', (SELECT id FROM regions WHERE code = 'NOR')),
('15', 'Cantal', (SELECT id FROM regions WHERE code = 'ARA')),
('16', 'Charente', (SELECT id FROM regions WHERE code = 'NAQ')),
('17', 'Charente-Maritime', (SELECT id FROM regions WHERE code = 'NAQ')),
('18', 'Cher', (SELECT id FROM regions WHERE code = 'CVL')),
('19', 'Corrèze', (SELECT id FROM regions WHERE code = 'NAQ')),
('21', 'Côte-d''Or', (SELECT id FROM regions WHERE code = 'BFC')),
('22', 'Côtes-d''Armor', (SELECT id FROM regions WHERE code = 'BRE')),
('23', 'Creuse', (SELECT id FROM regions WHERE code = 'NAQ')),
('24', 'Dordogne', (SELECT id FROM regions WHERE code = 'NAQ')),
('25', 'Doubs', (SELECT id FROM regions WHERE code = 'BFC')),
('26', 'Drôme', (SELECT id FROM regions WHERE code = 'ARA')),
('27', 'Eure', (SELECT id FROM regions WHERE code = 'NOR')),
('28', 'Eure-et-Loir', (SELECT id FROM regions WHERE code = 'CVL')),
('29', 'Finistère', (SELECT id FROM regions WHERE code = 'BRE')),
('30', 'Gard', (SELECT id FROM regions WHERE code = 'OCC')),
('31', 'Haute-Garonne', (SELECT id FROM regions WHERE code = 'OCC')),
('32', 'Gers', (SELECT id FROM regions WHERE code = 'OCC')),
('33', 'Gironde', (SELECT id FROM regions WHERE code = 'NAQ')),
('34', 'Hérault', (SELECT id FROM regions WHERE code = 'OCC')),
('35', 'Ille-et-Vilaine', (SELECT id FROM regions WHERE code = 'BRE')),
('36', 'Indre', (SELECT id FROM regions WHERE code = 'CVL')),
('37', 'Indre-et-Loire', (SELECT id FROM regions WHERE code = 'CVL')),
('38', 'Isère', (SELECT id FROM regions WHERE code = 'ARA')),
('39', 'Jura', (SELECT id FROM regions WHERE code = 'BFC')),
('40', 'Landes', (SELECT id FROM regions WHERE code = 'NAQ')),
('41', 'Loir-et-Cher', (SELECT id FROM regions WHERE code = 'CVL')),
('42', 'Loire', (SELECT id FROM regions WHERE code = 'ARA')),
('43', 'Haute-Loire', (SELECT id FROM regions WHERE code = 'ARA')),
('44', 'Loire-Atlantique', (SELECT id FROM regions WHERE code = 'PDL')),
('45', 'Loiret', (SELECT id FROM regions WHERE code = 'CVL')),
('46', 'Lot', (SELECT id FROM regions WHERE code = 'OCC')),
('47', 'Lot-et-Garonne', (SELECT id FROM regions WHERE code = 'NAQ')),
('48', 'Lozère', (SELECT id FROM regions WHERE code = 'OCC')),
('49', 'Maine-et-Loire', (SELECT id FROM regions WHERE code = 'PDL')),
('50', 'Manche', (SELECT id FROM regions WHERE code = 'NOR')),
('51', 'Marne', (SELECT id FROM regions WHERE code = 'GES')),
('52', 'Haute-Marne', (SELECT id FROM regions WHERE code = 'GES')),
('53', 'Mayenne', (SELECT id FROM regions WHERE code = 'PDL')),
('54', 'Meurthe-et-Moselle', (SELECT id FROM regions WHERE code = 'GES')),
('55', 'Meuse', (SELECT id FROM regions WHERE code = 'GES')),
('56', 'Morbihan', (SELECT id FROM regions WHERE code = 'BRE')),
('57', 'Moselle', (SELECT id FROM regions WHERE code = 'GES')),
('58', 'Nièvre', (SELECT id FROM regions WHERE code = 'BFC')),
('59', 'Nord', (SELECT id FROM regions WHERE code = 'HDF')),
('60', 'Oise', (SELECT id FROM regions WHERE code = 'HDF')),
('61', 'Orne', (SELECT id FROM regions WHERE code = 'NOR')),
('62', 'Pas-de-Calais', (SELECT id FROM regions WHERE code = 'HDF')),
('63', 'Puy-de-Dôme', (SELECT id FROM regions WHERE code = 'ARA')),
('64', 'Pyrénées-Atlantiques', (SELECT id FROM regions WHERE code = 'NAQ')),
('65', 'Hautes-Pyrénées', (SELECT id FROM regions WHERE code = 'OCC')),
('66', 'Pyrénées-Orientales', (SELECT id FROM regions WHERE code = 'OCC')),
('67', 'Bas-Rhin', (SELECT id FROM regions WHERE code = 'GES')),
('68', 'Haut-Rhin', (SELECT id FROM regions WHERE code = 'GES')),
('69', 'Rhône', (SELECT id FROM regions WHERE code = 'ARA')),
('70', 'Haute-Saône', (SELECT id FROM regions WHERE code = 'BFC')),
('71', 'Saône-et-Loire', (SELECT id FROM regions WHERE code = 'BFC')),
('72', 'Sarthe', (SELECT id FROM regions WHERE code = 'PDL')),
('73', 'Savoie', (SELECT id FROM regions WHERE code = 'ARA')),
('74', 'Haute-Savoie', (SELECT id FROM regions WHERE code = 'ARA')),
('75', 'Paris', (SELECT id FROM regions WHERE code = 'IDF')),
('76', 'Seine-Maritime', (SELECT id FROM regions WHERE code = 'NOR')),
('77', 'Seine-et-Marne', (SELECT id FROM regions WHERE code = 'IDF')),
('78', 'Yvelines', (SELECT id FROM regions WHERE code = 'IDF')),
('79', 'Deux-Sèvres', (SELECT id FROM regions WHERE code = 'NAQ')),
('80', 'Somme', (SELECT id FROM regions WHERE code = 'HDF')),
('81', 'Tarn', (SELECT id FROM regions WHERE code = 'OCC')),
('82', 'Tarn-et-Garonne', (SELECT id FROM regions WHERE code = 'OCC')),
('83', 'Var', (SELECT id FROM regions WHERE code = 'PCA')),
('84', 'Vaucluse', (SELECT id FROM regions WHERE code = 'PCA')),
('85', 'Vendée', (SELECT id FROM regions WHERE code = 'PDL')),
('86', 'Vienne', (SELECT id FROM regions WHERE code = 'NAQ')),
('87', 'Haute-Vienne', (SELECT id FROM regions WHERE code = 'NAQ')),
('88', 'Vosges', (SELECT id FROM regions WHERE code = 'GES')),
('89', 'Yonne', (SELECT id FROM regions WHERE code = 'BFC')),
('90', 'Territoire de Belfort', (SELECT id FROM regions WHERE code = 'BFC')),
('91', 'Essonne', (SELECT id FROM regions WHERE code = 'IDF')),
('92', 'Hauts-de-Seine', (SELECT id FROM regions WHERE code = 'IDF')),
('93', 'Seine-Saint-Denis', (SELECT id FROM regions WHERE code = 'IDF')),
('94', 'Val-de-Marne', (SELECT id FROM regions WHERE code = 'IDF')),
('95', 'Val-d''Oise', (SELECT id FROM regions WHERE code = 'IDF')),
('00971', 'Guadeloupe', (SELECT id FROM regions WHERE code = 'GUA')),
('00972', 'Martinique', (SELECT id FROM regions WHERE code = 'MAR')),
('00973', 'Guyane', (SELECT id FROM regions WHERE code = 'GUY')),
('00974', 'La Réunion', (SELECT id FROM regions WHERE code = 'REU')),
('00975', 'Saint-Pierre-et-Miquelon', (SELECT id FROM regions WHERE code = 'SPM')),
('00976', 'Mayotte', (SELECT id FROM regions WHERE code = 'MAY')),
('00977', 'Saint-Barthélemy', (SELECT id FROM regions WHERE code = 'STB')),
('00978', 'Saint-Martin', (SELECT id FROM regions WHERE code = 'STM')),
('00984', 'Terres australes et antarctiques françaises', (SELECT id FROM regions WHERE code = 'TAA')),
('00986', 'Wallis-et-Futuna', (SELECT id FROM regions WHERE code = 'WLF')),
('09871', 'Polynésie française - Archipel de la Société', (SELECT id FROM regions WHERE code = 'PYF')),
('09872', 'Polynésie française - Archipel des Tuamotu', (SELECT id FROM regions WHERE code = 'PYF')),
('09873', 'Polynésie française - Archipel des Gambier', (SELECT id FROM regions WHERE code = 'PYF')),
('09874', 'Polynésie française - Archipel des Australes', (SELECT id FROM regions WHERE code = 'PYF')),
('09875', 'Polynésie française - Archipel des Marquises', (SELECT id FROM regions WHERE code = 'PYF')),
('00988', 'Nouvelle-Calédonie', (SELECT id FROM regions WHERE code = 'NCL'));

-- from leagues/01_insert.sql
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
    );

-- from committees/01_insert.sql
INSERT INTO
    committees (
        name,
        phone,
        email,
        address,
        president_id,
        department_id,
        league_id
    )
VALUES (
        'COMITE DE L''AIN DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00001'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Ain'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'ARA'
        )
    ),
    (
        'COMITE DE L''AISNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00002'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Aisne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'HDF'
        )
    ),
    (
        'COMITE DE L''ALLIER DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00003'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Allier'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'ARA'
        )
    ),
    (
        'COMITE DES ALPES-DE-HAUTE-PROVENCE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00004'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Alpes-de-Haute-Provence'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PCA'
        )
    ),
    (
        'COMITE DES HAUTES-ALPES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00005'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Hautes-Alpes'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PCA'
        )
    ),
    (
        'COMITE DES ALPES-MARITIMES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00006'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Alpes-Maritimes'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PCA'
        )
    ),
    (
        'COMITE DE L''ARDECHE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00007'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Ardèche'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'ARA'
        )
    ),
    (
        'COMITE DES ARDENNES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00008'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Ardennes'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GES'
        )
    ),
    (
        'COMITE DE L''ARIEGE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00009'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Ariège'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITE DE L''AUBE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00010'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Aube'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GES'
        )
    ),
    (
        'COMITE DE L''AUDE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00011'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Aude'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITE DE L''AVEYRON BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00012'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Aveyron'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00013'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Bouches-du-Rhône'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PCA'
        )
    ),
    (
        'COMITE DU CALVADOS DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00014'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Calvados'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NOR'
        )
    ),
    (
        'COMITE DU CANTAL DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00015'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Cantal'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'ARA'
        )
    ),
    (
        'COMITE DE LA CHARENTE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00016'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Charente'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NAQ'
        )
    ),
    (
        'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00017'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Charente-Maritime'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NAQ'
        )
    ),
    (
        'COMITE DU CHER DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00018'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Cher'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'CVL'
        )
    ),
    (
        'COMITE DE LA CORREZE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00019'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Corrèze'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NAQ'
        )
    ),
    (
        'COMITE DE LA CORSE DU SUD DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '0002A'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Corse-du-Sud'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'COR'
        )
    ),
    (
        'COMITE DE LA HAUTE-CORSE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '0002B'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Haute-Corse'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'COR'
        )
    ),
    (
        'COMITE DE LA COTE-D''OR DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00021'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Côte-d''Or'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'BFC'
        )
    ),
    (
        'COMITE DES COTES-D''ARMOR DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00022'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Côtes-d''Armor'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'BRE'
        )
    ),
    (
        'COMITE DE LA CREUSE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00023'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Creuse'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NAQ'
        )
    ),
    (
        'COMITE DE LA DORDOGNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00024'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Dordogne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NAQ'
        )
    ),
    (
        'COMITE DU DOUBS DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00025'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Doubs'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'BFC'
        )
    ),
    (
        'COMITE DE LA DROME DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00026'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Drôme'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'ARA'
        )
    ),
    (
        'COMITE DE L''EURE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00027'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Eure'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NOR'
        )
    ),
    (
        'COMITE D''EURE-ET-LOIR DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00028'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Eure-et-Loir'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'CVL'
        )
    ),
    (
        'COMITE DU FINISTERE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00029'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Finistère'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'BRE'
        )
    ),
    (
        'COMITE DU GARD DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00030'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Gard'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00031'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Haute-Garonne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITE DU GERS DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00032'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Gers'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITE DE LA GIRONDE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00033'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Gironde'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NAQ'
        )
    ),
    (
        'COMITE DE L''HERAULT DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00034'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Hérault'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00035'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Ille-et-Vilaine'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'BRE'
        )
    ),
    (
        'COMITE DE L''INDRE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00036'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Indre'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'CVL'
        )
    ),
    (
        'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00037'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Indre-et-Loire'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'CVL'
        )
    ),
    (
        'COMITE D''ISERE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00038'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Isère'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'ARA'
        )
    ),
    (
        'COMITE DU JURA DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00039'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Jura'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'BFC'
        )
    ),
    (
        'COMITE DES LANDES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00040'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Landes'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NAQ'
        )
    ),
    (
        'COMITE DU LOIR-ET-CHER DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00041'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Loir-et-Cher'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'CVL'
        )
    ),
    (
        'COMITE DE LA LOIRE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00042'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Loire'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'ARA'
        )
    ),
    (
        'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00043'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Haute-Loire'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'ARA'
        )
    ),
    (
        'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00044'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Loire-Atlantique'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PDL'
        )
    ),
    (
        'COMITE DU LOIRET DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00045'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Loiret'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'CVL'
        )
    ),
    (
        'COMITE DU LOT de BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00046'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Lot'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITE DU LOT-ET-GARONNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00047'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Lot-et-Garonne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NAQ'
        )
    ),
    (
        'COMITE DE LA LOZERE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00048'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Lozère'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00049'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Maine-et-Loire'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PDL'
        )
    ),
    (
        'COMITE DE LA MANCHE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00050'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Manche'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NOR'
        )
    ),
    (
        'COMITE DE LA MARNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00051'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Marne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GES'
        )
    ),
    (
        'COMITE DE L''HAUTE-MARNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00052'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Haute-Marne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GES'
        )
    ),
    (
        'COMITÉ DE LA MAYENNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00053'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Mayenne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PDL'
        )
    ),
    (
        'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00054'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Meurthe-et-Moselle'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GES'
        )
    ),
    (
        'COMITE DE LA MEUSE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00055'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Meuse'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GES'
        )
    ),
    (
        'COMITE DU MORBIHAN DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00056'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Morbihan'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'BRE'
        )
    ),
    (
        'COMITE DE MOSELLE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00057'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Moselle'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GES'
        )
    ),
    (
        'COMITE DE LA NIEVRE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00058'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Nièvre'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'BFC'
        )
    ),
    (
        'COMITE DU NORD DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00059'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Nord'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'HDF'
        )
    ),
    (
        'COMITE DE L''OISE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00060'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Oise'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'HDF'
        )
    ),
    (
        'COMITE DE L''ORNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00061'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Orne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NOR'
        )
    ),
    (
        'COMITE DU PAS-DE-CALAIS DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00062'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Pas-de-Calais'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'HDF'
        )
    ),
    (
        'COMITE DU PUY-DE-DOME DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00063'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Puy-de-Dôme'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'ARA'
        )
    ),
    (
        'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00064'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Pyrénées-Atlantiques'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NAQ'
        )
    ),
    (
        'COMITE DES HAUTES-PYRENEES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00065'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Hautes-Pyrénées'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00066'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Pyrénées-Orientales'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITE DU BAS-RHIN DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00067'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Bas-Rhin'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GES'
        )
    ),
    (
        'COMITE DU HAUT-RHIN DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00068'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Haut-Rhin'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GES'
        )
    ),
    (
        'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00069'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Rhône'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'ARA'
        )
    ),
    (
        'COMITE DE HAUTE-SAONE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00070'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Haute-Saône'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'BFC'
        )
    ),
    (
        'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00071'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Saône-et-Loire'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'BFC'
        )
    ),
    (
        'COMITE DE LA SARTHE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00072'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Sarthe'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PDL'
        )
    ),
    (
        'COMITE DE SAVOIE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00073'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Savoie'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'ARA'
        )
    ),
    (
        'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00074'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Haute-Savoie'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'ARA'
        )
    ),
    (
        'COMITE DE PARIS DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00075'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Paris'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'IDF'
        )
    ),
    (
        'COMITE DE SEINE-MARITIME DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00076'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Seine-Maritime'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NOR'
        )
    ),
    (
        'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00077'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Seine-et-Marne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'IDF'
        )
    ),
    (
        'COMITE DES YVELINES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00078'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Yvelines'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'IDF'
        )
    ),
    (
        'COMITE DES DEUX SEVRES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00079'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Deux-Sèvres'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NAQ'
        )
    ),
    (
        'COMITE DE LA SOMME DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00080'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Somme'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'HDF'
        )
    ),
    (
        'COMITE DU TARN DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00081'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Tarn'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITE DE TARN-ET-GARONNE de BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00082'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Tarn-et-Garonne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'OCC'
        )
    ),
    (
        'COMITE DU VAR DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00083'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Var'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PCA'
        )
    ),
    (
        'COMITE DU VAUCLUSE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00084'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Vaucluse'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PCA'
        )
    ),
    (
        'COMITE DE LA VENDEE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00085'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Vendée'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PDL'
        )
    ),
    (
        'COMITE DE LA VIENNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00086'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Vienne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NAQ'
        )
    ),
    (
        'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00087'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Haute-Vienne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NAQ'
        )
    ),
    (
        'COMITE DES VOSGES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00088'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Vosges'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GES'
        )
    ),
    (
        'COMITE DE L''YONNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00089'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Yonne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'BFC'
        )
    ),
    (
        'COMITE DU TERRITOIRE-DE-BELFORT DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00090'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Territoire de Belfort'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'BFC'
        )
    ),
    (
        'COMITE DE L''ESSONNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00091'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Essonne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'IDF'
        )
    ),
    (
        'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00092'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Hauts-de-Seine'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'IDF'
        )
    ),
    (
        'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00093'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Seine-Saint-Denis'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'IDF'
        )
    ),
    (
        'COMITE DU VAL-DE-MARNE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00094'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Val-de-Marne'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'IDF'
        )
    ),
    (
        'COMITE DU VAL-D''OISE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00095'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Val-d''Oise'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'IDF'
        )
    ),
    (
        'COMITE DE LA GUADELOUPE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '000971'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Guadeloupe'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GUA'
        )
    ),
    (
        'COMITE DE LA MARTINIQUE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00972'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Martinique'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'MAR'
        )
    ),
    (
        'COMITE DE LA GUYANE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00973'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Guyane'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GUY'
        )
    ),
    (
        'COMITE DE LA REUNION DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00974'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'La Réunion'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'REU'
        )
    ),
    (
        'COMITE DE SAINT-PIERRE-ET-MIQUELON DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00975'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Saint-Pierre-et-Miquelon'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'SPM'
        )
    ),
    (
        'COMITE DE MAYOTTE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00976'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Mayotte'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'MAY'
        )
    ),
    (
        'COMITE DE SAINT-BARTHELEMY DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00977'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Saint-Barthélemy'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GUA'
        )
    ),
    (
        'COMITE DE SAINT-MARTIN DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00978'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Saint-Martin'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'GUA'
        )
    ),
    (
        'COMITE DES TERRES AUSTRALES ET ANTARCTIQUES FRANÇAISES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00984'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Terres australes et antarctiques françaises'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'TAA'
        )
    ),
    (
        'COMITE DE WALLIS-ET-FUTUNA DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00986'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Wallis-et-Futuna'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'WLF'
        )
    ),
    (
        'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '09871'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Polynésie française - Archipel de la Société'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PYF'
        )
    ),
    (
        'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DES TUAMOTU DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '09872'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Polynésie française - Archipel des Tuamotu'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PYF'
        )
    ),
    (
        'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DES GAMBIER DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '09873'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Polynésie française - Archipel des Gambier'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PYF'
        )
    ),
    (
        'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DES AUSTRALES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '09874'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Polynésie française - Archipel des Australes'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PYF'
        )
    ),
    (
        'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DES MARQUISES DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '09875'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Polynésie française - Archipel des Marquises'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'PYF'
        )
    ),
    (
        'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL',
        NULL,
        NULL,
        NULL,
        (
            SELECT id
            FROM presidents
            WHERE
                code = '00988'
        ),
        (
            SELECT id
            FROM departments
            WHERE
                name = 'Nouvelle-Calédonie'
        ),
        (
            SELECT lr.id
            FROM leagues lr
            JOIN regions r ON lr.region_id = r.id
            WHERE r.code = 'NCL'
        )
    );

-- from gyms/01_ain.sql
INSERT INTO gyms (name, address, code)
VALUES
('SALLE DES SPORTS CEYZERIAT', 'Rue Pierre de Coubertin, 01250 Ceyzériat', 'ARA0001013'),
('SALLE DES SPORTS', 'Rue de l''Église, 01340 Attignat', 'ARA0001005'),
('SALLE AMEDEE MERCIER', 'Boulevard Saint-Nicolas, 01000 Bourg-en-Bresse', 'ARA0001001'),
('SALLE POLYVALENTE', 'Rue de la Schappe, 01230 Saint-Rambert-en-Bugey', 'ARA0001002'),
('SALLE MONTBLANC', 'Route de Meximieux, 01390 Saint-André-de-Corcy', 'ARA0001058'),
('SALLE POLYVALENTE FEILLENS', 'Route des Dîmes, 01570 Feillens', 'ARA0001021'),
('GYMNASE CEDRIC BURDET', 'Chemin de la Camusette, 01300 Belley', 'ARA0001007'),
('Complexe multi sports salle 1', 'Rue du Stade, 01340 Foissiat', 'ARA0001003'),
('CENTRE SPORTIF COMMUNAL', 'D45, 01310 Saint-Rémy', 'ARA0001034'),
('GYMNASE JACQUES VERZIER', 'Au village, 01240 Saint-André-le-Bouchoux', 'ARA0001015'),
('GYMNASE DE LA 3CM', 'Rue de Bressolles, 01120 Dagneux', 'ARA0001059'),
('SALLE POLYVALENTE', 'Rue du Stade, 01510 Artemare', 'ARA0001004'),
('PARC VISIOSPORT', '166 route de Francheleins, 01090 Montceaux', 'ARA0001064'),
('GYMNASE CORDIER', 'Avenue de Méring, 01500 Ambérieu-en-Bugey', 'ARA0001056'),
('GYMNASE LA VIGNETTE', 'RD 85 - Vignette, 01580 Izernore', 'ARA0001065'),
('ESPACE ROBERT BUSNEL', 'Route de Curtafond, 01310 Confrançon', 'ARA0001016'),
('SALLE JEAN FALCONNIER', 'Avenue Jean Falconnier, 01350 Culoz-Béon', 'ARA0001019'),
('SALLE PIERRE DE COUBERTIN', 'Allée de la Grange Magnien, 01960 Péronnas', 'ARA0001052'),
('SALLE DES SPORTS 2 MEXIMIEUX', 'Avenue Docteur Berthier, 01800 Meximieux', 'ARA0001025'),
('Salle de sports de Chaneins', 'Grande Rue, 01990 Chaneins', 'ARA0001035'),
('L''ESCALE', 'Lieu-dit La Fontaine de Fer, 01290 Saint-Jean-sur-Veyle', 'ARA0001063'),
('GYMNASE MUNICIPAL MARBOZ', 'Route de Pirajoux, 01851 Marboz', 'ARA0001061'),
('SALLE SAINT ROCH', 'Rue Charles Demia, 01000 Bourg-en-Bresse', 'ARA0001011'),
('TERRAIN EXTERIEUR', 'PARC DE LA GAVINIERE, 01350 Ceyzérieu', 'ARA0001014'),
('GYMNASE MUNICIPAL', 'Rue de Dombes, 01330 Villars-les-Dombes', 'ARA0001055'),
('GYMNASE DES CARRONNIERS', 'Place du Gymnase, 01440 Viriat', 'ARA0001039'),
('GYMNASE J.Pierre CELLIER 1', 'Rue des Tournelles, 01150 Lagnieu', 'ARA0001049'),
('GYMNASE CHATEAUVIEUX', 'Rue Louis Antoine Duriat, 01600 Reyrieux', 'ARA0001044'),
('Espace Paul Colombel', 'Rue des Marronniers, 01480 Jassans-Riottier', 'ARA0001042'),
('Centre sportif du moullin', 'Chemin des Tattes du Moulin, 01280 Prévessin-Moëns', 'ARA0001204');

-- from gyms/02_aisne.sql
INSERT INTO gyms (name, address, code)
VALUES
('GYMNASE GODART', 'Rue Pierre Brossolette, 02320 Anizy-le-Grand', 'hdf0002032'),
('GYMNASE LESUR', 'Place Lesur, 02120 Guise', 'hdf0002011'),
('GYMNASE GERMAIN THIBAUT', 'Rue Alfred Juneaux, 02600 Villers-Cotterêts', 'hdf0002022'),
('SALLE F. QUEQUIGNON', 'Rue de Champagne, 02680 Grugies', 'hdf0002038'),
('ROLAND LEROY', 'Rue de la Forge, 02100 Gricourt', 'hdf0002010'),
('SALLE DU C.E.S.', 'Rue Léon Blum, 02200 Belleu', 'hdf0002003'),
('SALLE POLYVALENTE', 'Avenue de la Gare, 02820 Saint-Erme-Outre-et-Ramecourt', 'hdf0002015'),
('GYMNASE DELAUNE', 'Rue Auguste Delaune, 02430 Gauchy', 'hdf0002009'),
('SALLE OMNISPORTS', 'Rue du Bourbonnais, 02510 Étreux', 'hdf0002048'),
('YVAN ROJO', 'Route de Seboncourt, 02110 Bohain-en-Vermandois', 'hdf0002004'),
('SALLE DES SPORTS', 'Rue de la Forgette, 02830 Saint-Michel', 'hdf0002017'),
('HALLE DES SPORTS L.LAGRANGE', 'Rue Albert Camus, 02700 Tergnier', 'hdf0002021'),
('SALLE COUBERTIN', 'Rue Jean-Pierre Timbaud, 02000 Laon', 'hdf0002026'),
('SALLE PIERRE DE COUBERTIN', 'Boulevard de Bergheim, 02300 Chauny', 'hdf0002006'),
('BERTRAND GAMESS', 'Rue d''Alembert, 02100 Saint-Quentin', 'hdf0002018'),
('PARC DE LA MARQUETTE', 'Rue du Bosquet, 02240 Itancourt', 'hdf0002043'),
('SALLE JEAN DAVESNE', 'Rue Bara, 02200 Soissons', 'hdf0002020'),
('GYMNASE BROSSOLETTE', 'Quai Coutellier, 02400 Château-Thierry', 'hdf0002005');

-- from clubs/01_ain.sql
INSERT INTO clubs (
    code,
    name,
    address,
    phone,
    email,
    website,
    president_id,
    gym_id,
    committee_id,
    zip_code,
    city,
    latitude,
    longitude
) VALUES
    (
        'ARA0001001',
        'CD01 - HORS ASSOCIATION - AIN',
        '29 Bis Avenue de Bad Kreuznach, 01000 BOURG-EN-BRESSE',
        '0474236296',
        'basket-ain@wanadoo.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001001'),
        (SELECT id FROM gyms WHERE code = 'ARA0001001'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01000',
        'BOURG-EN-BRESSE',
        46.2076,
        5.2258
    ),
    (
        'ARA0001002',
        'ALBARINE BC',
        'Mairie, 01230 SAINT-RAMBERT-EN-BUGEY',
        '0768740037',
        'sandrine.mesbahi@orange.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001002'),
        (SELECT id FROM gyms WHERE code = 'ARA0001002'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01230',
        'SAINT-RAMBERT-EN-BUGEY',
        45.9567,
        5.4372
    ),
    (
        'ARA0001004',
        'US ARTEMARE',
        '17 Rue du Bugey, 01510 ARTEMARE',
        '0665036337',
        'kn.belli@yahoo.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001004'),
        (SELECT id FROM gyms WHERE code = 'ARA0001004'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01510',
        'ARTEMARE',
        45.8572,
        5.7342
    ),
    (
        'ARA0001005',
        'BC ATTIGNAT',
        '305 Grande Rue , 01340 ATTIGNAT',
        '0474259195',
        'tmarinet@wanadoo.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001005'),
        (SELECT id FROM gyms WHERE code = 'ARA0001005'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01340',
        'ATTIGNAT',
        46.2736,
        5.1306
    ),
    (
        'ARA0001006',
        'EV BELLEGARDE',
        '34 Rue de la République , 01200 VALSERHONE',
        '0450485577',
        'evbbasket01@wanadoo.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001006'),
        (SELECT id FROM gyms WHERE code = 'ARA0001006'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01200',
        'VALSERHONE',
        46.1122,
        5.8256
    ),
    (
        'ARA0001007',
        'FJ BELLEY BASKET',
        '598 Route de Fesne, 01300 CUZIEU',
        '0618453510',
        'fjbelleybasket@outlook.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001007'),
        (SELECT id FROM gyms WHERE code = 'ARA0001007'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01300',
        'CUZIEU',
        45.6467,
        5.3936
    ),
    (
        'ARA0001011',
        'GS CARRIAT',
        '20 Rue Charles Demia, 01000 BOURG-EN-BRESSE',
        '0474322146',
        'gscarriat01@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001011'),
        (SELECT id FROM gyms WHERE code = 'ARA0001011'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01000',
        'BOURG-EN-BRESSE',
        46.2044,
        5.2258
    ),
    (
        'ARA0001012',
        'JEUNESSE LAIQUE BOURG EN BRESSE',
        '42 Rue Charles Robin, 01000 BOURG-EN-BRESSE',
        '04 74 22 89 76',
        'Presidence@jlbourg-basket-amateurs.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001012'),
        (SELECT id FROM gyms WHERE code = 'ARA0001012'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01000',
        'BOURG-EN-BRESSE',
        46.2022,
        5.2258
    ),
    (
        'ARA0001013',
        'CS CEYZERIAT BASKET',
        'Place Jean Moulin, 01250 CEYZERIAT',
        '0474250835',
        'csc@ceplorientbasket.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001013'),
        (SELECT id FROM gyms WHERE code = 'ARA0001013'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01250',
        'CEYZERIAT',
        46.1536,
        5.3303
    ),
    (
        'ARA0001014',
        'ASA CEYZERIEU',
        '(SELECT id FROM committees WHERE name = '') Place de la Mairie, 01350 CEYZERIEU',
        '04 79 87 92 60',
        'stephanemat@wanadoo.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001014'),
        (SELECT id FROM gyms WHERE code = 'ARA0001014'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01350',
        'CEYZERIEU',
        45.8247,
        5.7761
    ),
    (
        'ARA0001015',
        'BOUCHOUX CONDEISSIAT B',
        'centre village, 01240 SAINT-ANDRE-LE-BOUCHOUX',
        '04 74 42 56 37',
        'bouchoux.condeissiat.basket@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001015'),
        (SELECT id FROM gyms WHERE code = 'ARA0001015'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01240',
        'SAINT-ANDRE-LE-BOUCHOUX',
        46.0972,
        5.0572
    ),
    (
        'ARA0001016',
        'UNION SPORTIVE DE CONFRANCON VONNAS – USCV',
        '36 rue du capitaine Montréal, 01540 VONNAS',
        '04 74 25 27 82',
        'uscvbasket@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001016'),
        (SELECT id FROM gyms WHERE code = 'ARA0001016'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01540',
        'VONNAS',
        46.2172,
        4.9992
    ),
    (
        'ARA0001019',
        'CULOZ BC',
        '6 Les Ravières, 01350 CULOZ',
        '04 79 87 11 31',
        'culozbasketclub@sfr.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001019'),
        (SELECT id FROM gyms WHERE code = 'ARA0001019'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01350',
        'CULOZ',
        45.8497,
        5.7822
    ),
    (
        'ARA0001021',
        'FEILLENS REPLONGES BASKETBALL',
        '575 Route des Dîmes, 01570 FEILLENS',
        '0385310599',
        'frbb.club@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001021'),
        (SELECT id FROM gyms WHERE code = 'ARA0001021'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01570',
        'FEILLENS',
        46.3406,
        4.8836
    ),
    (
        'ARA0001022',
        'ES FOISSIAT',
        '196 RUE DU STADE , 01340 FOISSIAT',
        '0474523601',
        'bernardsylvie.pauget@orange.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001022'),
        (SELECT id FROM gyms WHERE code = 'ARA0001022'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01340',
        'FOISSIAT',
        46.3556,
        5.1681
    ),
    (
        'ARA0001024',
        'BASKET CLUB CHÂTILLONNAIS',
        '16 RUE PASTEUR, 01400 CHATILLON-SUR-CHALARONNE',
        '0614138959',
        'b2c01@orange.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001024'),
        (SELECT id FROM gyms WHERE code = 'ARA0001024'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01400',
        'CHATILLON-SUR-CHALARONNE',
        46.1206,
        4.9758
    ),
    (
        'ARA0001025',
        'BC MEXIMIEUX',
        '9 Rue du Dr Berthier, 01800 MEXIMIEUX',
        '0636951773',
        'bcmeximieux@free.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001025'),
        (SELECT id FROM gyms WHERE code = 'ARA0001025'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01800',
        'MEXIMIEUX',
        45.9047,
        5.1936
    ),
    (
        'ARA0001028',
        'Ent BC Dombes - ASC Mionnay',
        '178 rue des pommiers, 01390 SAINT-ANDRE-DE-CORCY',
        '0633908760',
        'secretariat@bcdombes.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001028'),
        (SELECT id FROM gyms WHERE code = 'ARA0001028'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01390',
        'SAINT-ANDRE-DE-CORCY',
        45.9958,
        4.9542
    ),
    (
        'ARA0001029',
        'US OYONNAX',
        '125 Cours de Verdun, 01100 OYONNAX',
        '0608213037',
        'Correspondant.usobasket01@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001029'),
        (SELECT id FROM gyms WHERE code = 'ARA0001029'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01100',
        'OYONNAX',
        46.2592,
        5.6572
    ),
    (
        'ARA0001032',
        'ES St JEAN LE VIEUX',
        '9 Rue de la Gare, 01640 SAINT-JEAN-LE-VIEUX',
        '0474368199',
        'correspondantsaintjeanlevieux@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001032'),
        (SELECT id FROM gyms WHERE code = 'ARA0001032'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01640',
        'SAINT-JEAN-LE-VIEUX',
        46.0992,
        5.4311
    ),
    (
        'ARA0001033',
        'AVENIR ST MAURICE DE GDS',
        '1 Route de Lyon, 01800 SAINT-MAURICE-DE-GOURDANS',
        '04 74 61 81 53',
        'asmgbasket01800@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001033'),
        (SELECT id FROM gyms WHERE code = 'ARA0001033'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01800',
        'SAINT-MAURICE-DE-GOURDANS',
        45.8006,
        5.1442
    ),
    (
        'ARA0001034',
        'St REMY SPORTS BASKET',
        '999 Route de St Rémy, 01310 SAINT-REMY',
        '06 89 32 23 44',
        'presidencesrsb@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001034'),
        (SELECT id FROM gyms WHERE code = 'ARA0001034'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01310',
        'SAINT-REMY',
        46.2222,
        5.1081
    ),
    (
        'ARA0001035',
        'ISN BASKET CLUB CHANEINS',
        '73 Place de l''Eglise, 01240 SAINT-PAUL-DE-VARAX',
        '0673809233',
        'basketclubchaneins@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001035'),
        (SELECT id FROM gyms WHERE code = 'ARA0001035'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01240',
        'SAINT-PAUL-DE-VARAX',
        46.0722,
        5.0572
    ),
    (
        'ARA0001037',
        'US SULIGNAT',
        'Le Village, 01400 SULIGNAT',
        '0786388191',
        'florian.monterrat@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001037'),
        (SELECT id FROM gyms WHERE code = 'ARA0001037'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01400',
        'SULIGNAT',
        46.1536,
        4.9000
    ),
    (
        'ARA0001039',
        'BC VIRIAT',
        '58 Place du Gymnase, 01440 VIRIAT',
        '0672772410',
        'bcviriat@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001039'),
        (SELECT id FROM gyms WHERE code = 'ARA0001039'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01440',
        'VIRIAT',
        46.2106,
        5.2281
    ),
    (
        'ARA0001041',
        'BCT BASKET CLUB TRIVICOURTOIS',
        '111 Grande Rue, 01560 SAINT-TRIVIER-DE-COURTES',
        '0681725245',
        'basketclub.trivicourtois@yahoo.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001041'),
        (SELECT id FROM gyms WHERE code = 'ARA0001041'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01560',
        'SAINT-TRIVIER-DE-COURTES',
        46.4181,
        5.1681
    ),
    (
        'ARA0001042',
        'US JASSANS',
        '70 Rue de la Saône, 01480 JASSANS-RIOTTIER',
        '0469174054',
        'usjassansbasket@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001042'),
        (SELECT id FROM gyms WHERE code = 'ARA0001042'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01480',
        'JASSANS-RIOTTIER',
        45.9906,
        4.7500
    ),
    (
        'ARA0001043',
        'ASC MIONNAY',
        'Place Alain Chapel, 01390 MIONNAY',
        '04 72 26 20 20',
        'mionnaybasket@yahoo.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001043'),
        (SELECT id FROM gyms WHERE code = 'ARA0001043'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01390',
        'MIONNAY',
        45.9000,
        4.9000
    ),
    (
        'ARA0001044',
        'CS REYRIEUX SAONE VALLEE BASKET',
        '105 Grande Rue, 01600 REYRIEUX',
        '0603158634',
        'reyrieux.basket@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001044'),
        (SELECT id FROM gyms WHERE code = 'ARA0001044'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01600',
        'REYRIEUX',
        45.9906,
        4.8000
    ),
    (
        'ARA0001049',
        'ASS LAGNIEU BASKET',
        '6 Rue du Dr Mehier, 01150 LAGNIEU',
        '06 32 23 95 49',
        'secret-assl@orange.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001049'),
        (SELECT id FROM gyms WHERE code = 'ARA0001049'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01150',
        'LAGNIEU',
        45.9000,
        5.3500
    ),
    (
        'ARA0001052',
        'AS PERONNAS',
        '89 Rue de la Poste, 01960 PERONNAS',
        '0621162253',
        'basketperonnas@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001052'),
        (SELECT id FROM gyms WHERE code = 'ARA0001052'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01960',
        'PERONNAS',
        46.1833,
        5.2167
    ),
    (
        'ARA0001055',
        'BC VILLARDOIS',
        '15 Place de l''Hôtel de Ville, 01330 VILLARS-LES-DOMBES',
        '0683069530',
        'jjjlog@aol.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001055'),
        (SELECT id FROM gyms WHERE code = 'ARA0001055'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01330',
        'VILLARS-LES-DOMBES',
        45.9906,
        5.0000
    ),
    (
        'ARA0001056',
        'AMBERIEU BB',
        '60 Avenue Général Sarrail, 01500 AMBERIEU-EN-BUGEY',
        '06 16 28 85 84',
        'pauget.ge@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001056'),
        (SELECT id FROM gyms WHERE code = 'ARA0001056'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01500',
        'AMBERIEU-EN-BUGEY',
        45.9500,
        5.3500
    ),
    (
        'ARA0001058',
        'BC DOMBES',
        '167 Allée des Sports, 01390 SAINT-ANDRE-DE-CORCY',
        '0630136446',
        'contact@bcdombes.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001058'),
        (SELECT id FROM gyms WHERE code = 'ARA0001058'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01390',
        'SAINT-ANDRE-DE-CORCY',
        45.9958,
        4.9542
    ),
    (
        'ARA0001059',
        'RC MONTLUEL',
        '124 Rue d''Ostfildern, 01120 MONTLUEL',
        '0609786217',
        'rcmbasket.correspondance@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001059'),
        (SELECT id FROM gyms WHERE code = 'ARA0001059'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01120',
        'MONTLUEL',
        45.8500,
        5.0500
    ),
    (
        'ARA0001061',
        'BB REVERMONT',
        'Place de la résistance, 01340 MONTREVEL-EN-BRESSE',
        '0609794011',
        'technique.bbr@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001061'),
        (SELECT id FROM gyms WHERE code = 'ARA0001061'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01340',
        'MONTREVEL-EN-BRESSE',
        46.3500,
        5.1667
    ),
    (
        'ARA0001063',
        'BC DE LA VEYLE',
        '5 Route d''Illiat, 01290 CRUZILLES-LES-MEPILLAT',
        '03 85 31 52 27',
        'bcveyle@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001063'),
        (SELECT id FROM gyms WHERE code = 'ARA0001063'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01290',
        'CRUZILLES-LES-MEPILLAT',
        46.3167,
        4.9333
    ),
    (
        'ARA0001064',
        'BC MONTMERLE 3 RIVIERES',
        'au village, 01090 MONTCEAUX',
        '0779827468',
        'bc3r.secretaire@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001064'),
        (SELECT id FROM gyms WHERE code = 'ARA0001064'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01090',
        'MONTCEAUX',
        46.0833,
        4.7833
    ),
    (
        'ARA0001065',
        'BC IZERNORE',
        'Place de la résistance, 01580 IZERNORE',
        '0659716941',
        'contact.bcizernore@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001065'),
        (SELECT id FROM gyms WHERE code = 'ARA0001065'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01580',
        'IZERNORE',
        46.2000,
        5.5167
    ),
    (
        'ARA0001204',
        'BASKET PAYS DE GEX',
        'Rue de l''horloge, 01170 GEX',
        '+33671181888',
        'Mathieu.basketpaysdegex@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'ARA0001204'),
        (SELECT id FROM gyms WHERE code = 'ARA0001204'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AIN DE BASKET-BALL'),
        '01170',
        'GEX',
        46.3333,
        6.0667
    );

-- from clubs/02_aisne.sql
INSERT INTO clubs (
    code,
    name,
    address,
    phone,
    email,
    website,
    president_id,
    gym_id,
    committee_id,
    zip_code,
    city,
    latitude,
    longitude
) VALUES
    (
        'hdf0002001',
        'CD 02 HORS ASSOCIATION',
        '203 RUE DE PARIS, 02100 SAINT-QUENTIN',
        '03 23 67 10 65',
        'comite-aisne-basket@wanadoo.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002001'),
        NULL,
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02100',
        'SAINT-QUENTIN',
        49.8486,
        3.2896
    ),
    (
        'hdf0002003',
        'FC BELLEU BASKET BALL',
        'RUE JOLIOT CURIE, 02200 BELLEU',
        '0684579434',
        'angel.cappoen@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002003'),
        (SELECT id FROM gyms WHERE code = 'hdf0002003'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02200',
        'BELLEU',
        49.3717,
        3.3332
    ),
    (
        'hdf0002004',
        'AAE BOHAIN',
        'SALLE DES SPORTS RUE HENNEQUIN, 02110 BOHAIN-EN-VERMANDOIS',
        '0323071112',
        'manueloget@orange.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002004'),
        (SELECT id FROM gyms WHERE code = 'hdf0002004'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02110',
        'BOHAIN-EN-VERMANDOIS',
        49.9952,
        3.4452
    ),
    (
        'hdf0002005',
        'CHATEAU THIERRY BASKET BALL',
        '16 place de l''Hôtel de Ville, 02400 CHATEAU-THIERRY',
        '0668297795',
        'president.ctbb@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002005'),
        (SELECT id FROM gyms WHERE code = 'hdf0002005'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02400',
        'CHATEAU-THIERRY',
        49.0456,
        3.4002
    ),
    (
        'hdf0002006',
        'BB CHAUNY AUTREVILLE',
        '3, rue Saint Fiacre, 02300 CHAUNY',
        '0607711250',
        'Chaunybasketball@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002006'),
        (SELECT id FROM gyms WHERE code = 'hdf0002006'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02300',
        'CHAUNY',
        49.6132,
        3.2172
    ),
    (
        'hdf0002009',
        'ASG GAUCHY',
        '8 Avenue Adrien Renard, 02430 GAUCHY',
        '06 49 78 46 21',
        'asggbasketball@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002009'),
        (SELECT id FROM gyms WHERE code = 'hdf0002009'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02430',
        'GAUCHY',
        49.8232,
        3.2902
    ),
    (
        'hdf0002010',
        'GRICOURT BASKET',
        'PLACE JULES FERRY, 02100 GRICOURT',
        '0777721717',
        'bridgitt@hotmail.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002010'),
        (SELECT id FROM gyms WHERE code = 'hdf0002010'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02100',
        'GRICOURT',
        49.8852,
        3.2462
    ),
    (
        'hdf0002011',
        'PALS ATHLETIC CLUB GUISE',
        '174 PLACE D''ARMES, 02120 GUISE',
        '0617421812',
        'yveschatelain@wanadoo.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002011'),
        (SELECT id FROM gyms WHERE code = 'hdf0002011'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02120',
        'GUISE',
        49.8942,
        3.6272
    ),
    (
        'hdf0002015',
        'SAINT ERME BASKET BALL',
        '1 RUE DES ANNOIS, 02820 SAINT-ERME-OUTRE-ET-RAMECOURT',
        '0778874273',
        'sebb.ensemble@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002015'),
        (SELECT id FROM gyms WHERE code = 'hdf0002015'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02820',
        'SAINT-ERME-OUTRE-ET-RAMECOURT',
        49.4972,
        3.9782
    ),
    (
        'hdf0002017',
        'BC SAINT MICHEL',
        '8 PLACE ROCHEFORT, 02830 SAINT-MICHEL',
        '0780602249',
        'l.nouvion@orange.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002017'),
        (SELECT id FROM gyms WHERE code = 'hdf0002017'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02830',
        'SAINT-MICHEL',
        49.9772,
        4.0992
    ),
    (
        'hdf0002018',
        'SQBB - JSC',
        '2 rue du Président JF Kennedy, 02100 SAINT-QUENTIN',
        '03 23 08 16 00',
        'sqbb.jsc@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002018'),
        (SELECT id FROM gyms WHERE code = 'hdf0002018'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02100',
        'SAINT-QUENTIN',
        49.8482,
        3.2872
    ),
    (
        'hdf0002020',
        'SOISSONS CUFFIES AISNE B.B',
        '10 rue Paul Deviolaine, 02200 SOISSONS',
        '0670932825',
        'abracq9@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002020'),
        (SELECT id FROM gyms WHERE code = 'hdf0002020'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02200',
        'SOISSONS',
        49.3782,
        3.3232
    ),
    (
        'hdf0002021',
        'ESC TERGNIER',
        'PLACE P.DOUMER, 02700 TERGNIER',
        '0323576204',
        'bruno.macadre@wanadoo.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002021'),
        (SELECT id FROM gyms WHERE code = 'hdf0002021'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02700',
        'TERGNIER',
        49.6612,
        3.3272
    ),
    (
        'hdf0002022',
        'BB COTTEREZIEN',
        '16 rue d''En Bas, 02600 DAMPLEUX',
        '03 23 72 65 93',
        'pascal.haine@orange.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002022'),
        (SELECT id FROM gyms WHERE code = 'hdf0002022'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02600',
        'DAMPLEUX',
        49.2522,
        3.1812
    ),
    (
        'hdf0002026',
        'LAON BB',
        '31 RUE DE LA PISCINE, 02000 AULNOIS-SOUS-LAON',
        '0323208422',
        'laon.basketball@laposte.net',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002026'),
        (SELECT id FROM gyms WHERE code = 'hdf0002026'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02000',
        'AULNOIS-SOUS-LAON',
        49.5632,
        3.6272
    ),
    (
        'hdf0002032',
        'CLUB CANTONAL ANIZIEN BASKET',
        'Place Rochechouard, 02320 ANIZY-LE-CHATEAU',
        '0644298199',
        'philippepotier@orange.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002032'),
        (SELECT id FROM gyms WHERE code = 'hdf0002032'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02320',
        'ANIZY-LE-CHATEAU',
        49.4972,
        3.4402
    ),
    (
        'hdf0002038',
        'GRUGIES BASKET-BALL',
        '29 Rue de Picardie, 02680 Grugie, 02680 GRUGIES',
        '0625006579',
        'dens.lloyd@hotmail.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002038'),
        (SELECT id FROM gyms WHERE code = 'hdf0002038'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02680',
        'GRUGIES',
        49.8232,
        3.2902
    ),
    (
        'hdf0002043',
        'BB ITANCOURT',
        '9 RUE DU MOULIN, 02240 ITANCOURT',
        '0613510288',
        'itancourtbb@outlook.fr',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002043'),
        (SELECT id FROM gyms WHERE code = 'hdf0002043'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02240',
        'ITANCOURT',
        49.7652,
        3.2782
    ),
    (
        'hdf0002048',
        'B.C.E BASKET CLUB ETREUX',
        'rue de l''Oise, 02510 ETREUX',
        '0661724031',
        'basketclubetreux@gmail.com',
        NULL,
        (SELECT id FROM presidents WHERE code = 'hdf0002048'),
        (SELECT id FROM gyms WHERE code = 'hdf0002048'),
        (SELECT id FROM committees WHERE name = 'COMITE DE L''AISNE DE BASKET-BALL'),
        '02510',
        'ETREUX',
        49.9852,
        3.6272
    );

-- from clubs/03_allier.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('ARA0003001', 'CD03 HORS ASSOCIATION', '03200', 'VICHY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003002', 'BASKET CLUB SAINT YORRE', '03270', 'SAINT-YORRE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003004', 'BE COMMENTRY', '03600', 'COMMENTRY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003005', 'SCA CUSSET', '03300', 'CUSSET', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003006', 'DOYET BASKET CLUB', '03170', 'DOYET', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003007', 'BC GANNAT', '03800', 'GANNAT', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003008', 'BC LAPALISSE', '03120', 'LAPALISSE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003009', 'AS MONTLUCON', '03410', 'DOMERAT', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003011', 'STADE MONTLUCON BASKET', '03100', 'MONTLUCON', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003013', 'MOULINS BASKET', '03000', 'MOULINS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003014', 'SC SAINT POURCAIN', '03500', 'SAINT-POURCAIN-SUR-SIOULE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003016', 'JEANNE D''ARC DE VICHY', '03200', 'VICHY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003018', 'C YZEURE BASKET', '03400', 'YZEURE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003019', 'AS DOMPIERRE BEAULON BASKET', '03230', 'BEAULON', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003021', 'BELLERIVE BASKET CLUB', '03700', 'BELLERIVE-SUR-ALLIER', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003023', 'BOURBON SPORTIF BASKET', '03160', 'BOURBON-L''ARCHAMBAULT', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003024', 'BASKET CLUB VARENNES', '03150', 'VARENNES-SUR-ALLIER', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003026', 'SBC DESERTINES', '03630', 'DESERTINES', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003030', 'CREUZIER BASKET BALL', '03300', 'CREUZIER-LE-VIEUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL')),
    ('ARA0003039', 'ENTENTE DBC /SMB', '03170', 'DOYET', (SELECT id FROM committees WHERE name = 'COMITE DE L''ALLIER DE BASKET-BALL'));

-- from clubs/04_alpes-de-haute-provence.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('04400', 'SUD0004007', 'Entente Blanche Ubaye', 'BARCELONNETTE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-DE-HAUTE-PROVENCE DE BASKET-BALL')),
    ('04160', 'SUD0004104', 'US CHATEAU ARNOUX ST AUBAN', 'CHATEAU-ARNOUX', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-DE-HAUTE-PROVENCE DE BASKET-BALL')),
    ('04100', 'SUD0004106', 'HAUTE PROVENCE BASKET', 'MANOSQUE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-DE-HAUTE-PROVENCE DE BASKET-BALL')),
    ('04140', 'SUD0004107', 'US SEYNE LES ALPES', 'SEYNE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-DE-HAUTE-PROVENCE DE BASKET-BALL')),
    ('04200', 'SUD0004112', 'SISTERON BC', 'SISTERON', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-DE-HAUTE-PROVENCE DE BASKET-BALL')),
    ('04000', 'SUD0004113', 'DIGNE LES BAINS BASKET CLUB', 'DIGNE-LES-BAINS', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-DE-HAUTE-PROVENCE DE BASKET-BALL')),
    ('04400', 'SUD0004114', 'BASKET CLUB BARCELONNETTE', 'THUILES', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-DE-HAUTE-PROVENCE DE BASKET-BALL')),
    ('04700', 'SUD0004116', 'CLUB BASKET BALL FORCALQUIER', 'ORAISON', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-DE-HAUTE-PROVENCE DE BASKET-BALL'));

-- from clubs/05_hautes-alpes.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('05000', 'SUD0005002', 'CD HORS ASSOCIATION', 'GAP', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-ALPES DE BASKET-BALL')),
    ('05000', 'SUD0005006', 'Entente Charance - Le Piolit', 'GAP', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-ALPES DE BASKET-BALL')),
    ('05500', 'SUD0005008', 'Entente BBCV GASB05', 'SAINT-BONNET-EN-CHAMPSAUR', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-ALPES DE BASKET-BALL')),
    ('05100', 'SUD0005202', 'BRIANCON BASKET BALL', 'BRIANCON', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-ALPES DE BASKET-BALL')),
    ('05000', 'SUD0005204', 'GAP ALPES DU SUD BASKET 05', 'GAP', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-ALPES DE BASKET-BALL')),
    ('05300', 'SUD0005206', 'LARAGNE SPORTS BASKET', 'LARAGNE-MONTEGLIN', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-ALPES DE BASKET-BALL')),
    ('05400', 'SUD0005208', 'US VEYNES SNCF SECTION BASKET-B.', 'VEYNES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-ALPES DE BASKET-BALL')),
    ('05500', 'SUD0005209', 'BB CHAMPSAUR VALGAUDEMAR', 'SAINT-BONNET-EN-CHAMPSAUR', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-ALPES DE BASKET-BALL')),
    ('05200', 'SUD0005210', 'BASKETBALL EMBRUNAIS', 'EMBRUN', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-ALPES DE BASKET-BALL')),
    ('05230', 'SUD0005215', 'BATIE BASKET CLUB', 'LABATIE-NEUVE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-ALPES DE BASKET-BALL'));

-- from clubs/06_alpes-maritimes.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('SUD0006001', 'CD06 HORS ASSOCIATION', '06200', 'NICE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006003', 'ES VILLENEUVE LOUBET BASKET', '06270', 'VILLENEUVE-LOUBET', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006004', 'BASKET CLUB DES BAOUS', '06640', 'SAINT-JEANNET', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006006', 'AS MONACO BASKET', '98000', 'MONACO', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006007', 'US GRASSOISE', '06130', 'GRASSE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006008', 'AC GOLFE JUAN VALLAURIS', '06220', 'VALLAURIS/GOLFE JUAN', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006009', 'STADE LAURENTIN BASKET', '06700', 'SAINT-LAURENT-DU-VAR', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006010', 'BASKET AZUR CLUB', '06310', 'BEAULIEU-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006012', 'OL. ANTIBES BASKET AMA', '06600', 'ANTIBES', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006015', 'CLUB TENNIS ET BASKETBALL NICE', '06000', 'NICE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006016', 'BASKET CLUB VAL DE SIAGNE', '06580', 'PEGOMAS', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006017', 'US CAGNES SUR MER', '06800', 'CAGNES-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006018', 'MENTON BASKET CLUB', '06500', 'MENTON', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006020', 'LE CANNET COTE D''AZUR BASKET', '06250', 'MOUGINS', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006021', 'VENCE BASKET CLUB', '06140', 'VENCE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006022', 'ROQUEBRUNE CAP MARTIN BASKET', '06190', 'ROQUEBRUNE-CAP-MARTIN', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006023', 'TRINITE SPORTS PAILLON', '06340', 'TRINITE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006026', 'ETOILE SAINT BARTHELEMY NICE BASKET', '06100', 'NICE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006027', 'VAUBAN BASKETBALL', '06200', 'NICE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006028', 'GSE METROPOLITAINS DE NICE', '06000', 'NICE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006029', 'AS SAPEURS POMPIERS DE NICE', '06000', 'NICE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006030', 'SPORTS ET LOISIRS MOUGINOIS BASKET', '06250', 'MOUGINS', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006031', 'COV VALBONNE', '06560', 'VALBONNE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006032', 'OLYMPIQUE CARROS BASKET BALL', '06510', 'CARROS', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006033', 'SPORTING CLUB OLYMPIQUE COLLOIS BASKET (SPCOC BASKET)', '06480', 'COLLE-SUR-LOUP', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006035', 'UNION SPORTIVE SOPHIA BASKET', '06560', 'VALBONNE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006036', 'C.S.L GENDARMERIE ANTIBES', '06250', 'MOUGINS', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006037', 'LE CINQ MAJEUR TOURRETTE LEVENS', '06690', 'TOURRETTE-LEVENS', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006038', 'CANNES BASKET OLYMPIQUE', '06400', 'CANNES', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006039', 'SC MOUANS SARTOUX BASKET BALL', '06370', 'MOUANS-SARTOUX', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006041', 'ENTENTE MBA - ASM', '98000', 'MONACO', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006042', 'UNION SPORTIVE ARMENIENNE', '06000', 'NICE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006045', 'CAVIGAL NICE BASKET 06', '06300', 'NICE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006046', 'NICE BASKET ASSOCIATION OUEST', '06200', 'NICE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006049', 'CANSA BASKET', '06620', 'LE BAR-SUR-LOUP', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006054', 'MONACO BASKET ASSOCIATION', '98000', 'MONACO', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006060', 'SAINT MARTIN BASKET CLUB', '06670', 'SAINT-MARTIN-DU-VAR', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL')),
    ('SUD0006061', 'MANDELIEU LA NAPOULE BASKET AVENIR', '06210', 'MANDELIEU-LA-NAPOULE', (SELECT id FROM committees WHERE name = 'COMITE DES ALPES-MARITIMES DE BASKET-BALL'));

-- from clubs/07_ardeche.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('07200', 'ARA0007002', 'AUBENAS US', 'AUBENAS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07160', 'ARA0007004', 'LE CHEYLARD BC', 'CHEYLARD', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07210', 'ARA0007005', 'CHOMERAC B.C.', 'CHOMERAC', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07370', 'ARA0007007', 'ECLASSAN EO', 'ECLASSAN', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07000', 'ARA0007009', 'PRIVAS BASKET', 'PRIVAS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07340', 'ARA0007012', 'SERRIERES SABLONS BOC', 'SERRIERES', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07300', 'ARA0007013', 'ELAN SPORTIF MUZOLAIS', 'SAINT-JEAN-DE-MUZOLS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07100', 'ARA0007014', 'ST MARCEL LES ANNONAY ES', 'SAINT-MARCEL-LES-ANNONAY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07500', 'ARA0007015', 'CRUSSOL BASKET 07', 'GUILHERAND', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07340', 'ARA0007016', 'ST PIERRE DE BOEUF RIV SPORT', 'LIMONY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07690', 'ARA0007019', 'VANAU SPORTS', 'VANOSC', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07800', 'ARA0007021', 'LA VOULTE SPORTIF BASKET', 'VOULTE-SUR-RHONE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07110', 'ARA0007022', 'BC LARGENTIERE VAL DE LIGNE', 'LARGENTIERE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07100', 'ARA0007024', 'BASKET CLUB NORD ARDECHE', 'ANNONAY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07100', 'ARA0007028', 'DEUME BASKET', 'BOULIEU-LES-ANNONAY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07400', 'ARA0007029', 'LE TEIL BASKET CLUB', 'TEIL', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07300', 'ARA0007036', 'TAIN TOURNON AG', 'TOURNON-SUR-RHONE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07240', 'ARA0007061', 'BASKET CLUB VERNOUX', 'VERNOUX-EN-VIVARAIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07430', 'ARA0007736', 'VERNOSC DAVEZIEUX BASKET', 'DAVEZIEUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL')),
    ('07340', 'ARA0007737', 'ANDANCE-ANDANCETTE B', 'ANDANCE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARDECHE DE BASKET-BALL'));

-- from clubs/08_ardennes.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('GES0008001', 'CD 08 HORS ASSOCIATION', '08000', 'CHARLEVILLE-MEZIERES', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008002', 'BASKET CLUB BARAQUIN', '08800', 'MONTHERME', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008004', 'FLAMMES CAROLO BASKET ARDENNES', '08000', 'CHARLEVILLE-MEZIERES', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008005', 'ETOILE DE CHARLEVILLE MEZIERES', '08000', 'CHARLEVILLE-MEZIERES', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008011', 'BASKET CLUB GIVETOIS', '08600', 'GIVET', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008012', 'BASKET CLUB DE HARAUCOURT', '08450', 'HARAUCOURT', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008013', 'UNION SPORTIVE DE LAIFOUR', '08800', 'LAIFOUR', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008016', 'AMICAL CLUB MOUZONNAIS', '08210', 'MOUZON', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008018', 'RETHEL SPORTIF BASKET', '08300', 'RETHEL', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008019', 'MARCASSINS DE REVIN', '08500', 'REVIN', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008021', 'BASKET CLUB SEDANAIS', '08200', 'SEDAN', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008024', 'EA VAILLANTE VRIGNE AUX BOIS', '08330', 'VRIGNE AUX BOIS', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008033', 'VIREUX BASKET CLUB', '08320', 'VIREUX-WALLERAND', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL')),
    ('GES0008034', 'VILLERS SEMEUSE BASKET', '08000', 'VILLERS-SEMEUSE', (SELECT id FROM committees WHERE name = 'COMITE DES ARDENNES DE BASKET-BALL'));

-- from clubs/09_ariege.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('OCC0009001', 'CD HORS ASSOCIATION', '09100', 'PAMIERS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARIEGE DE BASKET-BALL')),
    ('OCC0009002', 'UN. OL. DE PAMIERS', '09100', 'PAMIERS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARIEGE DE BASKET-BALL')),
    ('OCC0009003', 'COQUELICOT LEZATOIS', '09210', 'LEZAT-SUR-LEZE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARIEGE DE BASKET-BALL')),
    ('OCC0009004', 'STADE LAVELANETIEN BASKET', '09300', 'LAVELANET', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARIEGE DE BASKET-BALL')),
    ('OCC0009006', 'LE COQ CARLANAIS', '09130', 'CARLA BAYLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARIEGE DE BASKET-BALL')),
    ('OCC0009007', 'U.A. SAVERDUNOISE BASKET', '09700', 'SAVERDUN', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARIEGE DE BASKET-BALL')),
    ('OCC0009012', 'BASKET CLUB VARILHOIS', '09120', 'VARILHES', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARIEGE DE BASKET-BALL')),
    ('OCC0009015', 'SAINT GIRONS BASKET CLUB', '09200', 'SAINT-GIRONS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARIEGE DE BASKET-BALL')),
    ('OCC0009022', 'PAYS DE FOIX BASKET', '09000', 'VERNAJOUL', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARIEGE DE BASKET-BALL')),
    ('OCC0009030', 'ENT FOIX PAMIERS BASKET', '09000', 'VERNAJOUL', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARIEGE DE BASKET-BALL')),
    ('OCC0009056', 'MAZERES BASKET CLUB', '09270', 'MAZERES', (SELECT id FROM committees WHERE name = 'COMITE DE L''ARIEGE DE BASKET-BALL'));

-- from clubs/10_aube.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('10000', 'GES0010001', 'CD HORS ASSOCIATION - COMITE DE L''AUBE', 'TROYES', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10150', 'GES0010003', 'BASKET CLUB COEURLEQUIN', 'CRENEY-PRES-TROYES', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10100', 'GES0010005', 'ASF ROMILLY', 'ROMILLY-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10300', 'GES0010007', 'SAINTE SAVINE BASKET', 'SAINTE-SAVINE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10400', 'GES0010009', 'ESPERANCE NOGENT SUR SEINE', 'NOGENT-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10120', 'GES0010012', 'BC SAINT ANDRE LES VERGERS', 'SAINT-ANDRE-LES-VERGERS', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10000', 'GES0010013', 'BASKET SANCEO TROYEN', 'TROYES', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10370', 'GES0010014', 'UNION SPORTIVE VILLENAUXE LA GRANDE BASKETBALL (USV BASKET)', 'VILLENAUXE-LA-GRANDE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10000', 'GES0010015', 'ENERGIE TROYENNE', 'TROYES', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10350', 'GES0010019', 'MJC MARIGNY LE CHATEL', 'MARIGNY-LE-CHATEL', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10200', 'GES0010021', 'PATRONAGE LAIQUE BAR SUR AUBE', 'BAR-SUR-AUBE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10600', 'GES0010028', 'A. J. FERRY. F. BUISSON BASKET', 'LA CHAPELLE-SAINT-LUC', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10170', 'GES0010031', 'MERY BASKET CLUB', 'MERY-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10000', 'GES0010032', 'FRIENDS BASKETBALL TEAM', 'TROYES', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10000', 'GES0010034', 'ASSOCIATION BASKETBALL DES CHARTREUX (A.B.C)', 'TROYES', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10600', 'GES0010035', 'ASSOCIATION SPORTIVE PAYNS BASKET (ASPB)', 'PAYNS', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL')),
    ('10140', 'GES0010037', 'BASKET CLUB VENDEUVRE', 'VENDEUVRE-SUR-BARSE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUBE DE BASKET-BALL'));

-- from clubs/11_aude.sql
INSERT INTO clubs (code, zip_code, name, city, committee_id)
VALUES
    ('OCC0011010', '11300', 'BASKET CLUB LIMOUXIN', 'LIMOUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUDE DE BASKET-BALL')),
    ('OCC0011012', '11600', 'SO CARCASSONNE', 'CONQUES-SUR-ORBIEL', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUDE DE BASKET-BALL')),
    ('OCC0011013', '11110', 'SO COURSAN - Gd NARBONNE', 'COURSAN', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUDE DE BASKET-BALL')),
    ('OCC0011017', '11200', 'LEZI BASKET', 'LEZIGNAN-CORBIERES', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUDE DE BASKET-BALL')),
    ('OCC0011018', '11100', 'BC NARBONNE MEDITERRANEE', 'NARBONNE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUDE DE BASKET-BALL')),
    ('OCC0011024', '11400', 'BO CASTELNAUDARY', 'CASTELNAUDARY', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUDE DE BASKET-BALL')),
    ('OCC0011030', '11130', 'SAS SIGEAN', 'SIGEAN', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUDE DE BASKET-BALL')),
    ('OCC0011032', '11120', 'BC SUD MINERVOIS', 'SAINT-NAZAIRE-D''AUDE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AUDE DE BASKET-BALL'));

-- from clubs/12_aveyron.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('12450', 'OCC0012001', 'CD0012– HORS ASSOCIATION – AVEYRON-LOZERE', 'LUC/PRIMAUBE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12160', 'OCC0012002', 'BASKET EN SEGALA', 'BARAQUEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12340', 'OCC0012003', 'AO BOZOULS BASKET', 'BOZOULS', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12700', 'OCC0012004', 'AVEYRON LOT BASKET ASS.', 'CAPDENAC-GARE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12300', 'OCC0012007', 'BASKET CLUB BASSIN HOUILLER', 'FIRMI', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12270', 'OCC0012008', 'ES DES SERENES', 'LUNAC', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12100', 'OCC0012009', 'SO MILLAU', 'MILLAU', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12240', 'OCC0012010', 'BASKET CLUB RIEUPEYROUSAIN', 'RIEUPEYROUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12200', 'OCC0012012', 'MARTIEL VILLENEUVE VILLEFRANCHE BASKETBALL 12', 'VILLEFRANCHE-DE-ROUERGUE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12390', 'OCC0012016', 'RIGNAC BASKET CLUB', 'RIGNAC', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12510', 'OCC0012017', 'BASKET CLUB D''OLEMPS', 'OLEMPS', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12450', 'OCC0012020', 'LUC PRIMAUBE BASKET', 'LUC/PRIMAUBE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12510', 'OCC0012022', 'EN - OLEMPS-DRUELLE', 'OLEMPS', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12240', 'OCC0012024', 'EN - RIEUPEYROUX-SERENES', 'CASTANET', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12800', 'OCC0012026', 'EN - BB NAUCELLOIS/BE SEGALA', 'NAUCELLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12340', 'OCC0012028', 'EN - BOZOULS/LAISSAC', 'BOZOULS', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12850', 'OCC0012030', 'ONET BASKET CLUB', 'ONET-LE-CHATEAU', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12160', 'OCC0012033', 'EN - BASKET EN SEGALA/NAUCELLE', 'BARAQUEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12270', 'OCC0012034', 'EN - SERENES-RIEUPEYROUX', 'LUNAC', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12310', 'OCC0012035', 'BASKET BALL LAISSAGAIS', 'LAISSAC', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12000', 'OCC0012037', 'RODEZ BASKET AVEYRON', 'RODEZ', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12430', 'OCC0012040', 'BASKET CLUB DES LACS', 'VILLEFRANCHE-DE-PANAT', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12800', 'OCC0012042', 'BASKET BALL NAUCELLOIS', 'NAUCELLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12400', 'OCC0012044', 'BASKET CLUB ST AFFRICAIN', 'SAINT-AFFRIQUE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12510', 'OCC0012045', 'As. BASKET CLUB DRUELLE', 'Druelle Balsac', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12310', 'OCC0012047', 'EN - LAISSAC/BOZOULS', 'LAISSAC', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12000', 'OCC0012048', 'AVEYRON BASKETBALL ACADEMIE', 'RODEZ', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12130', 'OCC0012050', 'SAINT GENIEZ BASKET', 'SAINT-GENIEZ-D''OLT', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12330', 'OCC0012054', 'CLUB BASKET VALLON', 'CLAIRVAUX-D''AVEYRON', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12510', 'OCC0012059', 'EN - OLEMPS/LAPRIMAUBE/DRUELLE', 'OLEMPS', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12000', 'OCC0012060', 'EN - RODEZ/ONET', 'RODEZ', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12850', 'OCC0012061', 'EN - ONET/RODEZ', 'ONET-LE-CHATEAU', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12390', 'OCC0012063', 'GOUTRENS BASKET CLUB', 'GOUTRENS', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12510', 'OCC0012064', 'EN - DRUELLE/RIGNAC', 'Druelle Balsac', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12450', 'OCC0012065', 'ENT - LA PRIMAUBE/OLEMPS', 'LUC/PRIMAUBE', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL')),
    ('12510', 'OCC0012066', 'ENT - DRUELLE/OLEMPS', 'Druelle Balsac', (SELECT id FROM committees WHERE name = 'COMITE DE L''AVEYRON BASKET-BALL'));

-- from clubs/13_bouches-du-rhone.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('SUD0013001', 'HORS ASSOCIATION C.D 13', '13320', 'BOUC-BEL-AIR', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013006', 'O CABRIES CALAS', '13480', 'CABRIES', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013007', 'B.C. CANAILLE', '13470', 'CARNOUX-EN-PROVENCE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013008', 'CRAU BC', '13310', 'SAINT-MARTIN-DE-CRAU', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013009', 'BASKET CLUB ENTRESSEN', '13118', 'ENTRESSEN', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013010', 'EGUILLES CLUB OMNISPORTS', '13510', 'EGUILLES', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013011', 'AIL DE FUVEAU', '13710', 'FUVEAU', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013013', 'ISTRES SPORTS BC', '13800', 'ISTRES', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013015', 'OLYMPIQUE ROVENAIN', '13740', 'ROVE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013016', 'BASKET CLUB MILLOIS', '13290', 'LES MILLES', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013017', 'LA CIOTAT SPORT BASKET', '13600', 'LA CIOTAT', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013018', 'CMS MARIGNANE BASKETBALL', '13700', 'MARIGNANE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013019', 'ASPTT MARSEILLE', '13008', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013020', 'AS BENGALIS MARSEILLE', '13001', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013021', 'AIL BLANCARDE', '13001', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013022', 'BASKET CLUB ALLAUDIEN', '13190', 'ALLAUCH', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013024', 'ASSOCIATION LES 2A', '13015', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013026', 'ESR BASKET BALL AURIOL ROQUEVAIRE', '13112', 'LA DESTROUSSE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013027', 'MARSEILLE BASKET METROPOLE', '13010', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013029', 'BASKET CLUB VALENTINOIS', '13011', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013030', 'MARSEILLE 5 BASKET-BALL', '13004', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013031', 'STADE MARSEILLAIS UC', '13008', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013033', 'SAINT-MARCEL BASKET', '13011', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013034', 'SCO STE MARGUERITE', '13009', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013035', 'US TRAMWAYS DE MARSEILLE', '13013', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013036', 'USPEG MARSEILLE', '13010', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013039', 'MARTIGUES SPORTS', '13500', 'MARTIGUES', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013040', 'BASKET CLUB DE L''ETOILE', '13850', 'GREASQUE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013042', 'BASKET CLUB PENNOIS', '13821', 'PENNE-SUR-HUVEAUNE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013043', 'ES PENNES MIRABEAU', '13170', 'LES PENNES-MIRABEAU', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013044', 'AS ROGNAC BASKET', '13340', 'ROGNAC', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013045', 'USO ROGNONAISE', '13870', 'ROGNONAS', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013046', 'AIL DE ROUSSET', '13790', 'ROUSSET', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013047', 'PAYS SALONAIS BASKET 13 (PSB 13)', '13300', 'SALON-DE-PROVENCE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013048', 'BASKET CLUB DES REMPARTS SAINT MITRE', '13920', 'SAINT-MITRE-LES-REMPARTS', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013049', 'SENAS BASKET BALL', '13560', 'SENAS', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013050', 'UNION SPORTIVE ET CULTURELLE DE LA ROUVIERE MARSEILLE', '13009', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013051', 'BC TARASCONNAIS', '13150', 'TARASCON', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013052', 'VITROLLES SPORT BASKET BALL', '13127', 'VITROLLES', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013053', 'HAPPY DAY', '13014', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013054', 'BASKET CLUB ARLESIEN', '13200', 'ARLES', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013055', 'LL GARDANNE BASKET', '13120', 'GARDANNE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013056', 'US SIMIANE BOUC BEL AIR', '13320', 'BOUC-BEL-AIR', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013057', 'PELISSANNE BASKET AVENIR', '13330', 'PELISSANNE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013058', 'CSM PORT ST LOUIS DU RHONE', '13230', 'PORT-SAINT-LOUIS-DU-RHONE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013059', 'VENELLES BASKET CLUB', '13770', 'VENELLES', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013060', 'BASSE VALLEE DE L''ARC BC', '13580', 'FARE-LES-OLIVIERS', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013063', 'SAINT REMY SPORT BASKET', '13210', 'SAINT-REMY-DE-PROVENCE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013065', 'BERRE BASKET CLUB', '13130', 'BERRE-L''ETANG', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013066', 'CHATEAUNEUF BASKET-BALL', '13220', 'CHATEAUNEUF-LES-MARTIGUES', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013068', 'BASKET CLUB SAUSSETOIS', '13960', 'SAUSSET-LES-PINS', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL')),
    ('SUD0013125', 'UNION MARSEILLE BASKET BALL (UMBB)', '13013', 'MARSEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES BOUCHES-DU-RHONE DE BASKET-BALL'));

-- from clubs/14_calvados.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id) 
VALUES
    ('NOR0014001', 'CD 14 HORS ASSOCIATION', '14200', 'HEROUVILLE-SAINT-CLAIR', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014003', 'AVANT GARDE CAEN', '14000', 'CAEN', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014004', 'AJS OUISTREHAM', '14150', 'OUISTREHAM', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014005', 'AVENIR JEUNESSE CAGNY', '14630', 'CAGNY', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014006', 'AS GIBERVILLE', '14730', 'GIBERVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014007', 'CAEN SUD BASKET', '14000', 'CAEN', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014008', 'CLUB BASKET D''IFS', '14123', 'IFS', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014015', 'ASPTT CAEN', '14000', 'CAEN', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014019', 'DOUVRES BASKET COEUR DE NACRE', '14440', 'DOUVRES-LA-DELIVRANDE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014021', 'CLUB ATHLETIQUE LEXOVIEN', '14100', 'LISIEUX', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014022', 'CABOURG BASKET', '14390', 'CABOURG', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014024', 'CAEN BASKET CALVADOS', '14000', 'CAEN', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014026', 'CAEN NORD BASKET', '14000', 'CAEN', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014027', 'CERCLE SPORTIF BAYEUX', '14400', 'BAYEUX', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014028', 'CLUB SPORTIF HONFLEUR BASKET', '14600', 'HONFLEUR', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014029', 'CLUB SPORTIF VESPIERE ORBEC BASKET-BALL', '14290', 'VESPIERE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014034', 'ELAN SPORTIF CARPIQUET BASKET', '14650', 'CARPIQUET', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014035', 'ENTENTE SPORTIVE FALAISIENNE', '14700', 'FALAISE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014037', 'THURY BASKET SUISSE NORMANDE', '14220', 'THURY-HARCOURT', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014038', 'ENTENTE SPORTIVE ARGENCAISE', '14370', 'ARGENCES', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014039', 'BASKET ENTENTE SPORTIVE TROARN', '14670', 'Saline', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014042', 'LE CLUB DE BRETTEVILLE-SUR-ODON BASKET', '14760', 'BRETTEVILLE-SUR-ODON', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014043', 'LOISIRS POUR TOUS ISIGNY/MER', '14230', 'ISIGNY-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014044', 'HEROUVILLE BASKET', '14200', 'HEROUVILLE-SAINT-CLAIR', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014046', 'SPORTIVE POTIGNY USSY PEPINIER', '14420', 'POTIGNY', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014051', 'UNION LAIQUE DIVAISE', '14160', 'DIVES-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014052', 'BRETTEVILLE BASKET CINGAL', '14680', 'BRETTEVILLE-SUR-LAIZE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014053', 'AS BRETTEVILLE L''ORGUEILLEUSE', '14740', 'THUE ET MUE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014055', 'UNION SPORT CHEMINOTS MEZIDON', '14270', 'Mézidon Vallée d''Auge', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014057', 'USM VIROISE', '14500', 'VIRE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014059', 'USO MONDEVILLE BASKET', '14120', 'MONDEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014061', 'PAYS D''AUGE BASKETBALL', '14130', 'PONT-L''EVEQUE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014062', 'US SOLIDAIRE AMICALE 14 BASKET', '14320', 'SAINT-MARTIN-DE-FONTENAY', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014070', 'CAEN VENOIX BASKET', '14000', 'CAEN', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014071', 'USM BLAINVILLE', '14550', 'BLAINVILLE-SUR-ORNE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014080', 'Entente MIB / CCBC', '14590', 'MOYAUX', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014082', 'CLUB LAIQUE COLOMBELLOIS', '14460', 'COLOMBELLES', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014084', 'BASKET CLUB BIEVILLE BEUVILLE', '14112', 'BIEVILLE-BEUVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014086', 'FLEURY SUR ORNE BASKET', '14123', 'FLEURY-SUR-ORNE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014089', 'AS DEMOUVILLE BASKET', '14840', 'DEMOUVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014090', 'NORMANDIE BASKET ASSOCIATION', '14280', 'SAINT-CONTEST', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014092', 'AB MERVILLE FRANCEVILLE', '14810', 'MERVILLE-FRANCEVILLE-PLAGE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014093', 'PRE BOCAGE BASKET', '14310', 'VILLERS-BOCAGE', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL')),
    ('NOR0014095', 'MOYAUX INTERCOMM BASKET', '14590', 'MOYAUX', (SELECT id FROM committees WHERE name = 'COMITE DU CALVADOS DE BASKET-BALL'));

-- from clubs/15_cantal.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('ARA0015001', 'CD 15 HORS ASSOCIATION', '15000', 'AURILLAC', (SELECT id FROM committees WHERE name = 'COMITE DU CANTAL DE BASKET-BALL')),
    ('ARA0015004', 'CANTALIENNE AURILLAC', '15000', 'AURILLAC', (SELECT id FROM committees WHERE name = 'COMITE DU CANTAL DE BASKET-BALL')),
    ('ARA0015006', 'SANFLORAINE BASKET-BALL', '15100', 'SAINT-FLOUR', (SELECT id FROM committees WHERE name = 'COMITE DU CANTAL DE BASKET-BALL')),
    ('ARA0015007', 'AFR BASKET PIERREFORT', '15230', 'PIERREFORT', (SELECT id FROM committees WHERE name = 'COMITE DU CANTAL DE BASKET-BALL')),
    ('ARA0015008', 'NAUCELLES BASKET ASSOCIATION', '15250', 'NAUCELLES', (SELECT id FROM committees WHERE name = 'COMITE DU CANTAL DE BASKET-BALL')),
    ('ARA0015010', 'BASKET CLUB DU CARLADEZ', '15130', 'VEZELS-ROUSSY', (SELECT id FROM committees WHERE name = 'COMITE DU CANTAL DE BASKET-BALL'));

-- from clubs/16_charente.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id) 
VALUES
    ('NAQ0016001', 'CD 16 HORS ASSOCIATION', '16710', 'SAINT-YRIEIX-SUR-CHARENTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016002', 'CS LEROY SOMER CHAMPNIERS BASKET', '16000', 'ANGOULEME', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016003', 'VALECHEL BASKET BALL', '16410', 'DIRAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016004', 'ANGOULEME BASKET CLUB', '16000', 'ANGOULEME', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016005', 'BARBEZIEUX BASKET BALL', '16300', 'BARBEZIEUX-SAINT-HILAIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016008', 'BC CHATEAUNEUF', '16120', 'CHATEAUNEUF-SUR-CHARENTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016010', 'LA COURONNE BASKET', '16400', 'LA COURONNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016011', 'COGNAC BASKET AVENIR', '16100', 'CHATEAUBERNARD', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016013', 'JARNAC SPORTS', '16200', 'JARNAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016014', 'BASKET CLUB MANSLOIS', '16230', 'MANSLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016016', 'AL MESNAC', '16370', 'MESNAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016018', 'AMICALE JEUNESSE MOULIDARS BASKET-BALL', '16290', 'MOULIDARS', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016019', 'RUELLE BASKET CLUB', '16600', 'RUELLE-SUR-TOUVRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016023', 'BASKET CLUB PUYMOYEN', '16400', 'PUYMOYEN', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016024', 'REVEIL SAINT SORNIN', '16220', 'SAINT-SORNIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016032', 'ENTENTE VALECHEL GA BASKET - BC PUYMOYEN', '16410', 'BOUEX', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016033', 'CSCS SAINT YRIEIX', '16710', 'SAINT-YRIEIX-SUR-CHARENTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016034', 'ENTENTE LEROY CHAMPNIERS - SAINT YRIEIX', '16000', 'ANGOULEME', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL')),
    ('NAQ0016035', 'ASBB SOYAUX', '16800', 'SOYAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE DE BASKET-BALL'));

-- from clubs/17_charente_maritime.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('NAQ0017001', 'CD17 - HORS ASSOCIATION - CHARENTE MARITIME', '17138', 'PUILBOREAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017002', 'ARS UNION SPORTIVE ARSAISE', '17590', 'ARS-EN-RE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017003', 'AYTRE BASKET BALL', '17440', 'AYTRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017004', 'CIRE SPORTS', '17290', 'CIRE-D''AUNIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017005', 'ANGOULINS UBAC', '17690', 'ANGOULINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017008', 'MARENNES BOURCEFRANC BBMB', '17320', 'MARENNES', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017012', 'LA JARRIE', '17220', 'LA JARRIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017014', 'OLERON BASKET CLUB', '17310', 'SAINT-PIERRE-D''OLERON', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017015', 'MARSILLY', '17137', 'MARSILLY', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017018', 'PORT D''ENVAUX', '17350', 'PORT-D''ENVAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017019', 'BASKET-BALL AND SUN/BB''NS', '17640', 'VAUX-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017020', 'AUNIS ATLANTIQUE BASKET', '17170', 'SAINT-JEAN-DE-LIVERSAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017021', 'ROCHEFORT BASKET CLUB', '17300', 'ROCHEFORT', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017022', 'HAUTE SAINTONGE BASKET', '17500', 'JONZAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017023', 'ROYAN BASKET COTE DE BEAUTE', '17200', 'ROYAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017025', 'STADE ROCHELAIS BASKET', '17000', 'LA ROCHELLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017026', 'LA ROCHELLE TASDON BASKET', '17000', 'LA ROCHELLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017027', 'LA ROCHELLE VILLENEUVE LES S', '17000', 'LA ROCHELLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017031', 'ST AGNANT BASKET CLUB', '17620', 'SAINT-AGNANT', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017035', 'ST JEAN D''ANGELY JLA', '17400', 'SAINT-JEAN-D''ANGELY', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017036', 'ST MARTIN DE RE', '17000', 'LA ROCHELLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017041', 'SAINT-XANDRE', '17138', 'SAINT-XANDRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017042', 'JARNAC CHAMPAGNE', '17520', 'JARNAC-CHAMPAGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017043', 'ST ROGATIEN FOYER RURAL', '17220', 'SAINT-ROGATIEN', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017044', 'US SAINTES BASKET BALL', '17100', 'SAINTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017046', 'SAUJON BASKET CLUB', '17600', 'SAUJON', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017048', 'TONNAY CHARENTE', '17430', 'TONNAY-CHARENTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017052', 'SAINTE MARIE BASKET', '17740', 'SAINTE-MARIE-DE-RE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017054', 'SURGERES', '17700', 'SURGERES', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017060', 'ATHLETIQUE BASKET CLUB BURIE', '17770', 'BURIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL')),
    ('NAQ0017067', 'ST CLEMENT BASKET 17', '17670', 'COUARDE-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DE LA CHARENTE-MARITIME DE BASKET-BALL'));

-- from clubs/18_cher.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('CVL0018001', 'CD18 HORS ASSOCIATION - CHER', '18000', 'BOURGES', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018003', 'CLUB SPORTIF DE BOURGES', '18000', 'BOURGES', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018004', 'CERCLE JEAN MACE BOURGES B', '18000', 'BOURGES', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018005', 'UNION SPORTIVE FLORENTAISE', '18400', 'SAINT-FLORENT-SUR-CHER', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018007', 'UNION SPORTIVE VIERZONNAISE', '18100', 'VIERZON', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018008', 'BASKET CLUB MEHUNOIS', '18500', 'MEHUN-SUR-YEVRE', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018009', 'GRAPPE CHAVIGNOLAISE', '18300', 'SANCERRE', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018011', 'SAINT AMAND BASKET', '18200', 'SAINT-AMAND-MONTROND', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018012', 'SAB / ABCD', '18200', 'SAINT-AMAND-MONTROND', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018015', 'BCC / SAB / ABCD', '18370', 'CHATEAUMEILLANT', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018016', 'POLE ESPOIRS F LIGUE CVL', '18000', 'BOURGES', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018017', 'ASNIÈRES-LÈS-BOURGES BASKET BALL', '18000', 'BOURGES', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018018', 'Entente ABCD/NBC/SAB', '18130', 'DUN-SUR-AURON', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018019', 'BASKET CLUB CASTELMEILLANTAIS', '18370', 'CHATEAUMEILLANT', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018023', 'ST DOULCHARD BASKET BALL', '18230', 'SAINT-DOULCHARD', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018024', 'ATHLETIC BASKET CLUB DUNOIS', '18130', 'DUN-SUR-AURON', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018027', 'ES AUBIGNY SUR NERE', '18700', 'AUBIGNY-SUR-NERE', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018030', 'TERRES DU HAUT BERRY BASKET', '18110', 'SAINT-MARTIN-D''AUXIGNY', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL')),
    ('CVL0018039', 'NÉRONDES BASKET CLUB', '18520', 'BENGY-SUR-CRAON', (SELECT id FROM committees WHERE name = 'COMITE DU CHER DE BASKET-BALL'));

-- from clubs/19_correze.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('NAQ0019002', 'ARGENTAT BASKET CLUB', '19400', 'Argentat-sur-Dordogne', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORREZE DE BASKET-BALL')),
    ('NAQ0019003', 'UNION SPORTIVE BEAULIEU BASKET', '19120', 'BEAULIEU-SUR-DORDOGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORREZE DE BASKET-BALL')),
    ('NAQ0019005', 'CA BRIVE CORREZE SECTION BASKET', '19100', 'BRIVE-LA-GAILLARDE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORREZE DE BASKET-BALL')),
    ('NAQ0019007', 'BASKET BALL AUVEZERE', '19210', 'LUBERSAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORREZE DE BASKET-BALL')),
    ('NAQ0019012', 'AS SAINT PANTALEON', '19600', 'SAINT-PANTALEON-DE-LARCHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORREZE DE BASKET-BALL')),
    ('NAQ0019014', 'UNION SPORTIVE TULLE CORREZE', '19000', 'TULLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORREZE DE BASKET-BALL')),
    ('NAQ0019015', 'BASKET CLUB UZERCHOIS', '19140', 'UZERCHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORREZE DE BASKET-BALL')),
    ('NAQ0019016', 'CD19 HORS ASSOCIATION - CORREZE', '19000', 'TULLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORREZE DE BASKET-BALL')),
    ('NAQ0019017', 'SEILHAC ATHLETIC CLUB', '19700', 'SEILHAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORREZE DE BASKET-BALL')),
    ('NAQ0019018', 'USSEL BASKET CLUB', '19200', 'USSEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORREZE DE BASKET-BALL')),
    ('NAQ0019020', 'DYNAMIC BASKET LOT CORREZE', '19500', 'MEYSSAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORREZE DE BASKET-BALL')),
    ('NAQ0019029', 'BASKET CLUB MARCILLAC', '19320', 'CHAMPAGNAC-LA-NOAILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORREZE DE BASKET-BALL'));

-- from clubs/21_cote_dor.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('BFC0021001', 'CD21 – HORS ASSOCIATION – CÔTE D’OR', '21000', 'DIJON', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021003', 'BASKET CLUB DE CHENOVE', '21300', 'CHENOVE', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021004', 'AL NUITS SAINT GEORGES', '21700', 'NUITS-SAINT-GEORGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021005', 'BASKET CLUB MARSANNAY LA COTE', '21160', 'MARSANNAY-LA-COTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021006', 'CSL DIJONNAIS', '21000', 'DIJON', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021007', 'AS L''AIGLON AUXONNE', '21130', 'AUXONNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021009', 'DIJON FEMININ BASKET', '21000', 'DIJON', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021010', 'UNION SPORTIVE DE PLOMBIERES', '21370', 'PLOMBIERES-LES-DIJON', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021011', 'ASC SAINT APOLLINAIRE', '21850', 'SAINT-APOLLINAIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021012', 'DA DIJON 21', '21000', 'DIJON', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021013', 'BASKET CLUB SEMUROIS', '21140', 'SEMUR-EN-AUXOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021014', 'ENTENTE BASKET FENAY GEVREY', '21600', 'FENAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021015', 'AVANT GARDE SEURROISE', '21250', 'SEURRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021016', 'ASSOCIATION GENLISIENNE BASKET', '21110', 'GENLIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021017', 'AMICALE SPORTIVE DE LA VOUGE', '21640', 'GILLY-LES-CITEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021018', 'MONTBARD BASKET CLUB', '21500', 'MONTBARD', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021019', 'FONTAINE BASKET CLUB', '21121', 'FONTAINE-LES-DIJON', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021021', 'BASKET CLUB BLIGNY LES BEAUNE', '21200', 'BLIGNY-LES-BEAUNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021022', 'ASS SPORTIVE DE QUETIGNY', '21800', 'QUETIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021024', 'REVEIL BASKET IS SUR TILLE', '21120', 'MARCILLY-SUR-TILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021025', 'AJCB PONTAILLER MIREBEAU', '21270', 'PONTAILLER-SUR-SAONE', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021026', 'JDA DIJON BOURGOGNE', '21000', 'DIJON', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021027', 'CHEVIGNY SAINT SAUVEUR BASKET', '21800', 'CHEVIGNY-SAINT-SAUVEUR', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021029', 'LA CHATILLONNAISE BASKETBALL', '21400', 'CHATILLON-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021034', 'BASKET OLYMPIQUE BEAUNOIS', '21200', 'BEAUNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021035', 'SPORTING CLUB SELONGEEN', '21260', 'SELONGEY', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021036', 'AS POUILLY BASKET', '21320', 'MACONGE', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL')),
    ('BFC0021038', 'SAULIEU BASKET CLUB', '21210', 'SAULIEU', (SELECT id FROM committees WHERE name = 'COMITE DE LA COTE-D''OR DE BASKET-BALL'));

-- from clubs/22_cotes_darmor.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('BRE0022001', 'CD 22 HORS ASSOCIATION', '22440', 'PLOUFRAGAN', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022003', 'US BREHAND', '22510', 'BREHAND', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022007', 'ABC GUINGAMP', '22200', 'PABU', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022009', 'BC LAMBALLE', '22400', 'LAMBALLE', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022010', 'LANNION TREGOR BASKET', '22300', 'LANNION', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022012', 'AL LOUDEAC', '22600', 'LOUDEAC', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022014', 'GUERLEDAN BASKET CLUB', '22530', 'Guerlédan', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022016', 'VIG. PLEMET', '22210', 'PLEMET', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022018', 'BC PLENEE JUGON', '22640', 'PLENEE-JUGON', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022020', 'US PLESSALA', '22330', 'COLLINEE', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022022', 'CS MERDRIGNAC', '22230', 'LAURENAN', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022023', 'GOELANDS BASKET PLOUEZEC', '22470', 'PLOUEZEC', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022024', 'AL PLOUFRAGAN', '22440', 'PLOUFRAGAN', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022025', 'ENT PAIMPOL PLOUEZEC', '22500', 'PAIMPOL', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022026', 'AL ST BRIEUC', '22000', 'SAINT-BRIEUC', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022028', 'ST BRIEUC ASPTT', '22190', 'PLERIN', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022030', 'WEST EMERAUDE BASKET', '22130', 'PLUDUNO', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022031', 'ENT PLOUEZEC PAIMPOL', '22470', 'PLOUEZEC', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022037', 'ENT QUINTIN UZEL', '22800', 'QUINTIN', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022039', 'AS UZEL', '22460', 'UZEL', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022040', 'US YFFINIAC', '22120', 'YFFINIAC', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022041', 'EB ST-BRIEUC', '22000', 'SAINT-BRIEUC', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022046', 'TREGUEUX LANGUEUX BASKET ARMOR 22', '22360', 'LANGUEUX', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022048', 'ENT LAMBALLE BREHAND', '22400', 'LAMBALLE', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022050', 'KREIZ BREIZH BASKETBALL', '22110', 'ROSTRENEN', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022051', 'JS PLOUGUENAST', '22150', 'PLOUGUENAST', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022054', 'BC BROONS', '22250', 'BROONS', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022056', 'PLAINTEL SP BASKET', '22940', 'PLAINTEL', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022060', 'AL PLELO', '22170', 'PLELO', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022061', 'BB PORDIC', '22590', 'PORDIC', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022064', 'TREGASTEL OS', '22730', 'TREGASTEL', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022065', 'ENT BREHAND LAMBALLE', '22510', 'BREHAND', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022066', 'ENT ROSTRENEN GUERLEDAN', '22110', 'ROSTRENEN', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022068', 'ARMEL BC HENON', '22150', 'HENON', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022069', 'PLOULEC''H BASKET BALL', '22300', 'PLOULEC''H', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022071', 'ENT MERDRIGNAC PLENEE JUGON', '22230', 'MERDRIGNAC', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022074', 'OCTOPUS BASKET PLOUHA', '22580', 'PLOUHA', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022076', 'BEAUSSAIS BASKET CLUB', '22650', 'Beaussais-sur-Mer', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022077', 'MJC QUINTIN', '22800', 'QUINTIN', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022078', 'BB LANDEHEN', '22400', 'LANDEHEN', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022080', 'ELAN BASKET PAIMPOLAIS', '22500', 'PAIMPOL', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022083', 'DINAN BASKET SAMSONNAIS', '22100', 'SAINT-SAMSON-SUR-RANCE', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022085', 'BC POMMERET', '22120', 'POMMERET', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022101', 'ETOILE SUD ARMOR PORHOET', '22210', 'PLUMIEUX', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL')),
    ('BRE0022109', 'PLOUMILLIAU PLOUBEZRE BASKET CLUB', '22300', 'PLOUBEZRE', (SELECT id FROM committees WHERE name = 'COMITE DES COTES-D''ARMOR DE BASKET-BALL'));

-- from clubs/23_creuse.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('NAQ0023001', 'Comité départemental de basket de la Creuse', '23000', 'GUERET', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023002', 'Aubusson felletin Basket', '23200', 'AUBUSSON', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023003', 'AMICALE LAIQUE BENEVENT', '23210', 'BENEVENT-L''ABBAYE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023006', 'BASKET CLUB DUNOIS', '23800', 'DUN-LE-PALESTEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023007', 'AEL GUERET', '23000', 'GUERET', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023008', 'AMICALE LAIQUE LAVAUFRANCHE', '23600', 'LAVAUFRANCHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023015', 'BASKET CLUB AUZANCES', '23700', 'AUZANCES', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023017', 'SOCIETE SPORTIVE DE BONNAT BASKET-BALL', '23220', 'BONNAT', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023018', 'BASKET-BALL SAINTE-FEYROIS', '23000', 'SAINTE-FEYRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023020', 'BASKETBALL AHUNOIS', '23150', 'AHUN', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023023', 'LA SOUTERRAINE BASKET BALL', '23300', 'LA SOUTERRAINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023026', 'BOURGANEUF BASKET CLUB', '23400', 'BOURGANEUF', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023028', 'CO CHATELUS MALVALEIX', '23270', 'CHATELUS-MALVALEIX', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023030', 'BASKET CLUB CHAMBON EVAUX', '23170', 'CHAMBON-SUR-VOUEIZE', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023034', 'BASKET CLUB ST VAURY', '23320', 'SAINT-VAURY', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL')),
    ('NAQ0023038', 'ENTENTE BC DUN - LA SOUTERRAIN BASKET BALL', '23800', 'DUN-LE-PALESTEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA CREUSE DE BASKET-BALL'));

-- from clubs/24_dordogne.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('NAQ0024001', 'CD 24 HORS ASSOCIATION', '24000', 'PERIGUEUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024002', 'AS ISSAC', '24400', 'ISSAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024004', 'AL EYZERAC', '24800', 'EYZERAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024005', 'JEUNES DU NAUSSANNAIS', '24440', 'NAUSSANNES', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024008', 'ASPTT GRAND PERIGUEUX', '24660', 'COULOUNIEIX-CHAMIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024009', 'US BERGERAC BASKET', '24100', 'BERGERAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024012', 'AS MONESTIER SAUSSIGNAC', '24240', 'MONESTIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024013', 'GIPS BASKET-BALL', '24350', 'TOCANE-SAINT-APRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024015', 'AOL BASKET', '24000', 'PERIGUEUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024018', 'BOULAZAC BASKET DORDOGNE', '24750', 'BOULAZAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024024', 'AS TOURTOIRAC', '24390', 'TOURTOIRAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024026', 'GARDONNE BASKET CLUB', '24680', 'GARDONNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024027', 'SAINT AIGULIN BASKET', '24490', 'ROCHE-CHALAIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024028', 'LARDIN BASKET CLUB', '24570', 'LARDIN-SAINT-LAZARE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024029', 'MOULIN NEUF MONTPON BASKET', '24700', 'MOULIN-NEUF', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024030', 'ES ST FRONT DE PRADOUX', '24400', 'SAINT-FRONT-DE-PRADOUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024035', 'SC NEUVIC', '24190', 'NEUVIC', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024039', 'LALINDE BASKET-BALL', '24150', 'LALINDE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024042', 'ETOILE SPORTIVE VILLEFRANCHOIS', '24550', 'VILLEFRANCHE-DU-PERIGORD', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024044', 'S.A.SANILHACOIS BASKET', '24660', 'Sanilhac', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024047', 'PERIGUEUX BASKET CLUB', '24000', 'PERIGUEUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024048', 'RAZAC BASKET CLUB', '24430', 'RAZAC-SUR-L''ISLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024051', 'PERIGORD NOIR SARLAT BASKET', '24200', 'SARLAT-LA-CANEDA', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024054', 'US BASKET BASSILLACOIS', '24330', 'Bassillac et Auberoche', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL')),
    ('NAQ0024056', 'AUVEZERE BASKETCLUB', '24270', 'SAVIGNAC-LEDRIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA DORDOGNE DE BASKET-BALL'));

-- from clubs/25_doubs.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('BFC0025001', 'CD DOUBS HORS ASSOCIATION', '25000', 'BESANCON', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025003', 'BESANCON AVENIR COMTOIS', '25000', 'BESANCON', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025005', 'CA PONTARLIER BASKETBALL', '25300', 'PONTARLIER', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025007', 'ARC ET SENANS BASKET CLUB', '25610', 'ARC-ET-SENANS', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025009', 'ASSOCIATION BISONTINE VAUBAN BASKET', '25000', 'BESANCON', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025011', 'AS EXINCOURT', '25400', 'EXINCOURT', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025012', 'STAR BASKET SAINT-VIT', '25410', 'SAINT-VIT', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025016', 'AS VALDAHON', '25800', 'VALDAHON', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025019', 'P.I.SAONE VALLEE D''ORNANS BASKET', '25660', 'SAONE', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025023', 'AS VALENTIGNEY BASKET', '25400', 'AUDINCOURT', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025028', 'BAUME LES DAMES BASKETBALL', '25110', 'BAUME-LES-DAMES', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025029', 'VAL DE MORTEAU BASKET', '25130', 'VILLERS-LE-LAC', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025031', 'BASKET CLUB L''ISLOIS', '25250', 'ISLE-SUR-LE-DOUBS', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL')),
    ('BFC0025038', 'THISE DEVECEY BASKET CLUB', '25870', 'VIEILLEY', (SELECT id FROM committees WHERE name = 'COMITE DU DOUBS DE BASKET-BALL'));

-- from clubs/26_drome.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('26000', 'ARA0026001', 'CD0026 - HA', 'VALENCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26400', 'ARA0026011', 'USB CREST-SAILLANS', 'CREST', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26140', 'ARA0026017', 'MANTAILLE SPORTIF', 'ANNEYRON', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26200', 'ARA0026020', 'MONTELIMAR UMS', 'MONTELIMAR', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26700', 'ARA0026023', 'PIERRELATTE BASKET ENTENTE ATOM’SPORTS', 'PIERRELATTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26270', 'ARA0026027', 'US SAULCE', 'SAULCE-SUR-RHONE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26130', 'ARA0026030', 'ASSOCIATION SPORTIVE TRICASTINE', 'SAINT-PAUL-TROIS-CHATEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26210', 'ARA0026031', 'SAINT SORLIN JARCIEU SPORTIF BASKET', 'SAINT-SORLIN-EN-VALLOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26390', 'ARA0026050', 'HAUTERIVES BASKET', 'HAUTERIVES', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26740', 'ARA0026052', 'SPORTING CLUB SAVASSON BASKET', 'SAVASSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26240', 'ARA0026054', 'LAVEYRON BASKET', 'LAVEYRON', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26120', 'ARA0026055', 'MONTELIER BC', 'MONTELIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26240', 'ARA0026056', 'SAINT VALLIER BASKET DROME', 'SAINT-VALLIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26760', 'ARA0026057', 'A.S.B. BEAUMONT', 'BEAUMONT-LES-VALENCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26140', 'ARA0026063', 'ENTENTE ANNEYRON - ST SORLIN JARCIEU', 'ANNEYRON', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26140', 'ARA0026738', 'BC ANNEYRON', 'ANNEYRON', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26300', 'ARA0026739', 'BOURG DE PEAGE UGAP', 'BOURG-DE-PEAGE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26500', 'ARA0026740', 'VALENCE BOURG BASKET', 'BOURG-LES-VALENCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26300', 'ARA0026741', 'CHATEAUNEUF SUR ISERE BC', 'CHATEAUNEUF-SUR-ISERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26600', 'ARA0026742', 'CHANTEMERLE LES BLES AS', 'TAIN-L''HERMITAGE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26210', 'ARA0026743', 'EPINOUZE BC', 'EPINOUZE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26750', 'ARA0026745', 'BC GENISSIEUX ROMANS', 'GENISSIEUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26600', 'ARA0026747', 'MERCUROL CHANOS CURSON BC', 'MERCUROL', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26110', 'ARA0026748', 'NYONS BASKET CLUB', 'NYONS', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26400', 'ARA0026749', 'PIEGROS LA CLASTRE FB', 'PIEGROS-LA-CLASTRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL')),
    ('26800', 'ARA0026750', 'PORTES LES VALENCE USC', 'PORTES-LES-VALENCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA DROME DE BASKET-BALL'));

-- from clubs/27_eure.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id) VALUES
('NOR0027001', 'CD27 – HORS ASSOCIATION – EURE', '27000', 'EVREUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027002', 'AL MADELEINE EVREUX', '27000', 'EVREUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027003', 'AS BASKET DU ROUMOIS', '27670', 'BOSC ROGER EN ROUMOIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027004', 'AS ST ANDRE BB', '27220', 'SAINT-ANDRE-DE-L''EURE', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027005', 'CS LA BONNEVILLE', '27190', 'LA BONNEVILLE-SUR-ITON', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027006', 'EVREUX NETREVILLE BB', '27000', 'EVREUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027009', 'SAINT MARCEL BB', '27950', 'SAINT-MARCEL', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027010', 'BEUZEVILLE ACOS', '27210', 'BEUZEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027011', 'ENT. CORMEILLES / MOYAUX', '27260', 'CORMEILLES', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027012', 'CS LES ANDELYS', '27700', 'LES ANDELYS', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027015', 'ESVE PACY MENILLES BASKET', '27120', 'PACY-SUR-EURE', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027016', 'EVREUX ATHLETIC CLUB BASKET', '27000', 'EVREUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027017', 'AL SAINT MICHEL EVREUX', '27000', 'EVREUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027018', 'STADE VERNEUIL / AVRE', '27130', 'Verneuil d''Avre et d''Iton', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027020', 'SC BERNAY BASKET', '27300', 'BERNAY', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027021', 'SPN VERNON', '27200', 'VERNON', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027022', 'US LOUVERSEY PAYS D''OUCHE', '27190', 'LOUVERSEY', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027023', 'BC PERRIERS / ANDELLE', '27910', 'PERRIERS-SUR-ANDELLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027024', 'US ETREPAGNY BASKET', '27150', 'ETREPAGNY', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027025', 'SAINT SEBASTIEN SPORTS', '27180', 'SAINT-SEBASTIEN-DE-MORSENT', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027027', 'US GRAVIGNY', '27930', 'GRAVIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027028', 'A LOUVIERS HBCI', '27400', 'LOUVIERS', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027030', 'AFS ST OUEN DE THOUBERVIL', '27310', 'SAINT-OUEN-DE-THOUBERVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027032', 'PONT AUDEMER BB', '27500', 'PONT-AUDEMER', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027033', 'CCBC CORMEILLES', '27260', 'CORMEILLES', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027034', 'DB VAL DE REUIL', '27100', 'VAL-DE-REUIL', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027035', 'BC GAILLON AUBEVOYE EURE MADRIE SEINE', '27600', 'GAILLON', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027037', 'LE NEUBOURG BASKET CLUB', '27110', 'LE NEUBOURG', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027038', 'Entente AS Bosc Roger - Vallée d''Oison B', '27670', 'BOSC ROGER EN ROUMOIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027039', 'BASKET TALENT ACADEMY', '27630', 'ECOS', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027040', 'BC PONT DE L''ARCHE', '27340', 'PONT-DE-L''ARCHE', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027041', 'THIBERVILLE BASKET CLUB', '27230', 'THIBERVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027043', 'VALLEE DE L''OISON BASKET', '27370', 'SAUSSAYE', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027044', 'BOURG ACHARD BASKET BALL', '27310', 'BOURG-ACHARD', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027045', 'ENT GISORS', '27140', 'GISORS', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL')),
('NOR0027046', 'ENT. CS LES ANDELYS / BC GAILLON', '27700', 'LES ANDELYS', (SELECT id FROM committees WHERE name = 'COMITE DE L''EURE DE BASKET-BALL'));

-- from clubs/28_eure_et_loir.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('CVL0028001', 'CD28 HORS ASSOCIATION - EURE ET LOIR', '28300', 'LEVES', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028004', 'C''CHARTRES BASKET M', '28000', 'CHARTRES', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028005', 'C''CHARTRES BASKET FEMININ', '28000', 'CHARTRES', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028007', 'CHATEAUDUN BASKET CLUB', '28200', 'CHATEAUDUN', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028009', 'ALLIANCE DE DREUX', '28500', 'TREON', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028010', 'AMICALE DE GALLARDON', '28320', 'GALLARDON', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028011', 'L''ENTENTE BELHOMERT LA LOUPE', '28240', 'BELHOMERT-GUEHOUVILLE', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028012', 'AMICALE DE LUCE', '28110', 'LUCE', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028013', 'ES MAINTENON PIERRES BB', '28130', 'PIERRES', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028014', 'ENTENTE SPORTIVE NOGENTAISE', '28210', 'NOGENT-LE-ROI', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028016', 'NOGENT BASKET CLUB', '28400', 'NOGENT-LE-ROTROU', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028017', 'BARJOUVILLE SCL', '28630', 'BARJOUVILLE', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028019', 'LAC BASKET CLUB DE LUISANT', '28600', 'LUISANT', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028021', 'BASKET CLUB JANVILLE', '28310', 'JANVILLE', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028022', 'COURVILLE BASKET CLUB', '28190', 'COURVILLE-SUR-EURE', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028024', 'BASKET CLUB PONTOIS', '28200', 'SAINT-DENIS-LES-PONTS', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028026', 'ENTENTE AUNEAU - ABLIS', '28700', 'AUNEAU', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028027', 'BASKET CLUB DE VALLEE D''AVRE', '28380', 'SAINT-REMY-SUR-AVRE', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028028', 'BASKET CLUB BONNEVALAIS', '28800', 'BONNEVAL', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028029', 'CLUB SPORTIF DE MAINVILLIERS', '28300', 'MAINVILLIERS', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028030', 'BASKET CLUB SENONCHES ET DU PERCHE', '28250', 'SENONCHES', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028031', 'ENTENTE SPORTIVE ALNELOISE', '28700', 'AUNEAU', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028032', 'AMICALE D''EPERNON', '28230', 'EPERNON', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028033', 'UNION SPORTIVE YEVRES BASKET', '28160', 'YEVRES', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL')),
    ('CVL0028036', 'FOYER JEUNES CHAMPHOL BASKET', '28300', 'CHAMPHOL', (SELECT id FROM committees WHERE name = 'COMITE D''EURE-ET-LOIR DE BASKET-BALL'));

-- from clubs/29_finistere.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('BRE0029001', 'CD 29 HORS ASSOCIATION', '29200', 'BREST', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029002', 'BASKET CLUB CROZON', '29570', 'CAMARET-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029003', 'AL PLOUZANE', '29280', 'PLOUZANE', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029004', 'AMICALE SPORTIVE ERGUE ARMEL', '29000', 'QUIMPER', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029005', 'AMICALE SPORTIVE DU GUELMEUR', '29200', 'BREST', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029006', 'KEMPERLE BC', '29300', 'QUIMPERLE', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029007', 'ARZELLIZ DE PLOUDALMEZEAU', '29830', 'PLOUDALMEZEAU', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029008', 'BC DU KERNIC', '29430', 'LANHOUARNEAU', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029009', 'PLEYBER CHRIST BASKET CLUB', '29410', 'PLEYBER-CHRIST', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029011', 'ASPTT BREST', '29200', 'BREST', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029013', 'BC PLOUGASTEL', '29470', 'PLOUGASTEL-DAOULAS', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029016', 'BASKET CLUB LEONARD', '29250', 'SAINT-POL-DE-LEON', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029017', 'BLEUETS DE GUILERS', '29820', 'GUILERS', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029018', 'CLUB DES JEUNES RENANAIS', '29290', 'SAINT-RENAN', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029022', 'ETOILE SAINT LAURENT BREST', '29200', 'BREST', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029023', 'BREST MÉTROPOLE BASKET', '29200', 'BREST', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029025', 'ARSENAL WESTBALL 3x3', '29200', 'BREST', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029026', 'Foyer Laïque de Saint Marc', '29200', 'BREST', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029028', 'GOUESNOU BASKET', '29850', 'GOUESNOU', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029029', 'GARS DU REUN DE GUIPAVAS', '29490', 'GUIPAVAS', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029030', 'ERGUE GABERIC BASKET BALL', '29500', 'ERGUE-GABERIC', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029032', 'Association Pluguffan Basket', '29700', 'PLUGUFFAN', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029036', 'PATRONAGE LAÏQUE DE SANQUER', '29200', 'BREST', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029037', 'UJAP QUIMPER', '29000', 'QUIMPER', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029039', 'PONT L''ABBE BASKET CLUB', '29120', 'PONT-L''ABBE', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029040', 'ASSOCIATION SPORTIVE PLOMELIN BASKET', '29700', 'PLOMELIN', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029041', 'MORLAIX ST MARTIN BASKET', '29600', 'MORLAIX', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029043', 'STADE RELECQUOIS', '29480', 'RELECQ-KERHUON', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029045', 'US CONCARNEAU', '29900', 'CONCARNEAU', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029046', 'BASKET CLUB DOUARNENEZ', '29100', 'DOUARNENEZ', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029048', 'PLOUIDER BASKET BALL COTE DES LEGENDES', '29260', 'PLOUIDER', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029049', 'PLABENNEC BASKET CLUB', '29860', 'PLABENNEC', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029050', 'UREM BC', '29140', 'ROSPORDEN', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029051', 'LANDI BASKET ASSOCIATION', '29400', 'LANDIVISIAU', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029053', 'BASKET BALL CONQUETOIS', '29217', 'CONQUET', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029054', 'MILIZAC BASKET CLUB', '29290', 'MILIZAC', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029057', 'PLOUARZEL BASKET CLUB', '29810', 'PLOUARZEL', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029058', 'BOHARS BASKET BALL', '29820', 'BOHARS', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029060', 'AL COATAUDON', '29490', 'GUIPAVAS', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029062', 'SAINT DIVY SPORTS BASKET', '29800', 'SAINT-DIVY', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029065', 'PLEUVEN BASKET CLUB', '29170', 'SAINT-EVARZEC', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029068', 'Basket Club du Porzay', '29550', 'PLONEVEZ-PORZAY', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029069', 'LANDERNEAU BRETAGNE BASKET', '29800', 'LANDERNEAU', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029072', 'KURUN BASKET CLUB', '29250', 'PLOUGOULM', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029073', 'SC LANNILISIEN', '29870', 'LANNILIS', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029075', 'CARHAIX BASKET', '29270', 'CARHAIX-PLOUGUER', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029076', 'PLOUVIEN BASKET DES ABERS', '29860', 'PLOUVIEN', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029077', 'LE FOLGOET BASKET CLUB', '29260', 'FOLGOET', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029086', 'TONNERRE BASKET CLUB', '29290', 'SAINT-RENAN', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029088', 'DOURGI AR C''HAB', '29780', 'PLOUHINEC', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029092', 'Association Basket COMBRIT', '29120', 'COMBRIT', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029101', 'GLAZIK PUMBASKET', '29510', 'BRIEC', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029103', 'CTC KORNOG - BMB', '29820', 'GUILERS', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL')),
    ('BRE0029533', 'MOELAN CLOHARS BASKET BALL', '29350', 'MOELAN-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DU FINISTERE DE BASKET-BALL'));

-- from clubs/2A_corse-du-sud.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('COR002A003', 'ATHLETIC CLUB AJACCIEN BASKET-BALL', '20090', 'AJACCIO', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORSE DU SUD DE BASKET-BALL')),
    ('COR002A004', 'PROPRIANO BASKET BALL', '20110', 'ARBELLARA', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORSE DU SUD DE BASKET-BALL')),
    ('COR002A105', 'AJACCIO BASKET CLUB', '20167', 'ALATA', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORSE DU SUD DE BASKET-BALL')),
    ('COR002A113', 'AS PORTO VECCHIO BASKET BALL', '20137', 'PORTO-VECCHIO', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORSE DU SUD DE BASKET-BALL')),
    ('COR002A133', 'BB CLUB DE SAINTE LUCIE DE PORTO VECCHIO (BBCSL)', '20124', 'ZONZA', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORSE DU SUD DE BASKET-BALL')),
    ('COR002A135', 'GFC AJACCIO BASKET BALL', '20090', 'AJACCIO', (SELECT id FROM committees WHERE name = 'COMITE DE LA CORSE DU SUD DE BASKET-BALL'));

-- from clubs/2B_haute-corse.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('COR002B001', 'COMITE HORS ASSOCIATION DE CORSE', '20250', 'CORTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-CORSE DE BASKET-BALL')),
    ('COR002B002', 'ETOILE FILANTE O BASTIA BB', '20200', 'SANTA-MARIA-DI-LOTA', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-CORSE DE BASKET-BALL')),
    ('COR002B006', 'INTER CORTENAIS', '20250', 'CORTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-CORSE DE BASKET-BALL')),
    ('COR002B007', 'VESCOVATO CASINCA BASKET BALL', '20213', 'CASTELLARE-DI-CASINCA', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-CORSE DE BASKET-BALL')),
    ('COR002B008', 'BASKET-BALL GHISONACCIA', '20240', 'GHISONACCIA', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-CORSE DE BASKET-BALL')),
    ('COR002B009', 'UNION CASINCA CENTRE CORSE BASKETBALL', '20290', 'BORGO', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-CORSE DE BASKET-BALL')),
    ('COR002B010', 'FURIANI BASKET CLUB', '20600', 'BASTIA', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-CORSE DE BASKET-BALL')),
    ('COR002B012', 'CLUB OMNISPORTS COSTA VERDE', '20221', 'VALLE-DI-CAMPOLORO', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-CORSE DE BASKET-BALL')),
    ('COR002B018', 'SELECTION REGIONALE CORSE', '20250', 'CORTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-CORSE DE BASKET-BALL')),
    ('COR002B019', 'GHJUVENTU BASKET BORGO', '20290', 'LUCCIANA', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-CORSE DE BASKET-BALL'));

-- from clubs/30_gard.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('OCC0030002', 'A SUMENOLE SPORT EDUCATION', '30440', 'SUMENE', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030003', 'ENTENTE METAUX ET SSP TAMARIS', '30100', 'ALES', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030005', 'SAINT GILLES BASKET CLUB', '30800', 'SAINT-GILLES', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030006', 'BAGNOLS MARCOULE BASKET BALL', '30200', 'BAGNOLS-SUR-CEZE', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030007', 'VERGEZE BASKET CLUB', '30310', 'VERGEZE', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030009', 'BC LES KANGOUROUS ST JEANNAIS', '30270', 'SAINT-JEAN-DU-GARD', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030012', 'NIMES BASKET', '30900', 'NIMES', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030013', 'MILHAUD GENERAC UCHAUD NIMES GARD BASKET-BALL', '30540', 'MILHAUD', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030019', 'BASKET CLUB ST VICTOR', '30290', 'SAINT-VICTOR-LA-COSTE', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030021', 'BASKET CLUB SPIRIPONTAIN', '30130', 'PONT-SAINT-ESPRIT', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030022', 'BESSEGES BASKET CLUB', '30160', 'BESSEGES', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030025', 'AS SALINDROISE', '30340', 'SALINDRES', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030026', 'E ABC JSA ALES', '30100', 'ALES', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030028', 'CD 30 Hors association', '30900', 'NIMES', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030029', 'ASCL SAINT CHRISTOL LEZ ALES', '30380', 'SAINT-CHRISTOL-LÈS-ALÈS', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030031', 'CONNAUX MISTRAL CLUB', '30330', 'CONNAUX', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030032', 'BASKET CLUB CIGALOIS', '30170', 'SAINT-HIPPOLYTE-DU-FORT', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030033', 'LITTORAL CAMARGUE BASKET', '30220', 'AIGUES-MORTES', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030035', 'ASSOCIATION QUISSACOISE de BASKET', '30260', 'QUISSAC', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030036', 'BELLEGARDE CLUB OMNISPORT', '30127', 'BELLEGARDE', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030037', 'GARONS BASKET', '30128', 'GARONS', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030042', 'UZES BASKET CLUB', '30700', 'MONTAREN-ET-SAINT-MEDIERS', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030051', 'SAINT JULIEN LES ROSIERS BASKET-BALL', '30340', 'SAINT-JULIEN-LES-ROSIERS', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030054', 'Association RAIA', '30100', 'ALES', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030057', 'ASSOCIATION BASKET LES VANS', '30450', 'CONCOULES', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030063', 'BASKET CLUB VIDOURLE GALLARGUES', '30660', 'GALLARGUES-LE-MONTUEUX', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030064', 'BASKET CLUB DE LA VAUNAGE', '30420', 'CALVISSON', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030084', 'ASSOCIATION SPORTIVE VAUVERT BASKET', '30600', 'VAUVERT', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL')),
    ('OCC0030089', 'Entente Bellegarde St Gilles U18F', '30127', 'BELLEGARDE', (SELECT id FROM committees WHERE name = 'COMITE DU GARD DE BASKET-BALL'));

-- from clubs/31_haute_garonne.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('OCC0031001', 'CD HORS ASSOCIATION', '31500', 'TOULOUSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031003', 'E.S. TOULOUSE CASSELARDIT', '31300', 'TOULOUSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031005', 'ASTRO BASKET CLUB', '31200', 'TOULOUSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031007', 'TLSE CHEMINOTS MARENGO SP', '31500', 'TOULOUSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031008', 'TOAC BASKET', '31200', 'TOULOUSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031009', 'BLAGNAC OCCITANIE BASKET CLUB', '31700', 'BLAGNAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031012', 'UNION SPORTIVE AUSSONNAISE', '31840', 'AUSSONNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031013', 'BESSIERES BUZET BASKET CLUB (3BC)', '31660', 'BESSIERES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031014', 'BLAGNAC BASKET CLUB', '31700', 'BLAGNAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031015', 'PINSAGUEL BASKET CLUB', '31120', 'PINSAGUEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031017', 'BRUGUIERES BASKET CLUB', '31150', 'BRUGUIERES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031018', 'AURIGNAC BASKET CLUB', '31420', 'AURIGNAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031019', 'ABB CORNEBARRIEU', '31700', 'CORNEBARRIEU', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031020', 'MJC CASTANET TOLOSAN', '31320', 'CASTANET-TOLOSAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031021', 'U.S. COLOMIERS BASKET', '31770', 'COLOMIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031022', 'J.S.C BASKET', '31270', 'CUGNAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031023', 'RACING CLUB EAUNES BASKET', '31600', 'EAUNES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031024', 'FROUZINS ATHLETIC CLUB', '31270', 'FROUZINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031025', 'GRATENTOUR BASKET 31', '31150', 'GRATENTOUR', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031026', 'B. LABEGE AUZEVILLE CLUB', '31670', 'LABEGE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031028', 'ASC AVENIR SPORTIF CAZERIEN BASKET', '31220', 'CAZERES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031029', 'BCLM', '31180', 'CASTELMAUROU', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031031', 'AVENIR MURETAIN', '31600', 'MURET', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031032', 'UNION SPORTIVE PIBRACAISE', '31820', 'PIBRAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031034', 'US RAMONVILLE BASKET', '31520', 'RAMONVILLE-SAINT-AGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031035', 'NORD EST TOULOUSAIN BC', '31240', 'SAINT-JEAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031036', 'SAINT JORY BASKET', '31790', 'SAINT-JORY', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031037', 'SAINT LYS OLYMPIQUE BASKET', '31470', 'SAINT-LYS', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031038', 'BASKET SAINT ORENS', '31650', 'SAINT-ORENS-DE-GAMEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031039', 'AS TOURNEFEUILLE', '31170', 'TOURNEFEUILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031040', 'VACQUIERS BOULOC BASKET', '31340', 'VACQUIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031042', 'BASKET CLUB VERFEILLOIS', '31590', 'VERFEIL', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031043', 'TIGERS VILLENEUVE-TOLOSANE SEYSSES', '31270', 'VILLENEUVE-TOLOSANE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031044', 'UNION SPORTIVE AUTERIVE', '31190', 'AUTERIVE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031047', 'VOLVESTRE BASKET CLUB', '31310', 'MONTESQUIEU-VOLVESTRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031050', 'POINTIS DE RIVIERE SPORTS', '31210', 'POINTIS-DE-RIVIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031051', 'B. COMMINGES SALIES DU SALAT', '31260', 'SALIES-DU-SALAT', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031052', 'BASKET BRAX', '31490', 'BRAX', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031053', 'ASSOCIATION TOULOUSERIE', '31300', 'TOULOUSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031054', 'NOE CARBONNE BASKET', '31410', 'NOE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031056', 'AS SAINT GAUDENS B.C.', '31800', 'SAINT-GAUDENS', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031057', 'CARAMAN BASKET CLUB', '31460', 'CARAMAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031058', 'RACING PORTET BASKET', '31120', 'PORTET-SUR-GARONNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031059', 'AS LABARTHE SUR LEZE', '31860', 'LABARTHE-SUR-LEZE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031061', 'VILLEMUR BASKET CLUB', '31340', 'VILLEMUR-SUR-TARN', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031062', 'CASTELBALL CITY', '31620', 'CASTELNAU-D''ESTRETEFONDS', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031063', 'BASKET CLUB QUINT FONSEGRIVES', '31130', 'QUINT', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031064', 'BASKET CLUB FOUSSERETOIS', '31430', 'LE FOUSSERET', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031065', 'BASKET REVEL SAINT-FERREOL', '31250', 'REVEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031066', 'BASKET CLUB DE ROQUETTES', '31120', 'ROQUETTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031068', 'MONTASTRUC BASKET CLUB', '31850', 'MONTRABE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031069', 'BASKET CLUB LEGUEVINOIS', '31490', 'LEGUEVIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031070', 'FENOUILLET BASKET CLUB', '31140', 'AUCAMVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031071', 'TOULOUSE LARDENNE BASKET', '31100', 'TOULOUSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031072', 'CASTELGINEST BASKET CLUB 31', '31780', 'CASTELGINEST', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031073', 'STADE TOULOUSAIN BASKETBALL', '31000', 'TOULOUSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031074', 'LAUNAGUET BASKET CLUB', '31140', 'LAUNAGUET', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031075', 'BASKET LAURAGAIS', '31250', 'REVEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031076', 'TOULOUSE METROPOLE BASKET', '31000', 'TOULOUSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031079', 'AS AYGUESVIVOISE', '31450', 'AYGUESVIVES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031081', 'BASKET AMPLITUDE', '31620', 'BOULOC', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031085', 'EN-GRATENTOUR/ST JORY', '31150', 'GRATENTOUR', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031086', 'OUEST TOULOUSAIN BASKET', '31830', 'PLAISANCE-DU-TOUCH', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031088', 'EN-ST JORY/GRATENTOUR', '31790', 'SAINT-JORY', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031089', 'BASKET MERVILLOIS', '31330', 'MERVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031090', 'FR LAVERNOSE LACASSE', '31410', 'LAVERNOSE-LACASSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL')),
    ('OCC0031120', 'MONTREJEAU PYRENEES BASKET', '31210', 'POINTIS-DE-RIVIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-GARONNE DE BASKET-BALL'));

-- from clubs/32_gers.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('OCC0032001', 'CD32 – HORS ASSOCIATION – GERS', '32000', 'AUCH', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032002', 'AUCH BASKET CLUB', '32000', 'AUCH', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032007', 'BASKET UNION CAUSSENSOIS', '32100', 'CAUSSENS', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032011', 'J.A. CONDOMOISE', '32100', 'CONDOM', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032012', 'BASKET CLUB COURRENSANAIS', '32330', 'COURRENSAN', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032014', 'ETOILE SPORTIVE GIMONTOISE BB', '32200', 'GIMONT', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032015', 'AMICALE LAIQUE GONDRINOISE', '32330', 'GONDRIN', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032016', 'BASKET CLUB L''ISLOIS', '32600', 'ISLE-JOURDAIN', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032017', 'SA JEGUN', '32360', 'JEGUN', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032021', 'ES MAS D''AUVIGNON SAINT-PUY', '32310', 'SAINT-PUY', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032022', 'BASKET CLUB MAUVEZINOIS', '32120', 'MAUVEZIN', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032023', 'BASKET CLUB DU MIRANDAIS', '32300', 'MIRANDE', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032027', 'BASKET CLUB FLEURANCE-PRECHAC', '32500', 'FLEURANCE', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032028', 'RALLIEMENT PUYCASQUIER', '32120', 'PUYCASQUIER', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032030', 'ENTENTE BARRAN RIGUEPEU', '32350', 'BARRAN', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032031', 'ETOILE SPORTIVE ROMEVIENNE', '32480', 'ROMIEU', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032033', 'VALENCE CONDOM GERS BASKET', '32310', 'VALENCE-SUR-BAISE', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032038', 'BASKET ELUSA CLUB', '32800', 'EAUZE', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032042', 'AS MONTALTAISE', '32810', 'MONTAUT-LES-CRENEAUX', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032045', 'UA VICOISE BASKETBALL', '32190', 'VIC-FEZENSAC', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032046', 'US SEMPESSEROISE', '32700', 'SEMPESSERRE', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032048', 'BASKET CLUB CASTILLON DEBATS', '32190', 'CASTILLON-DEBATS', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032051', 'JS RISCLOISE BASKET', '32400', 'RISCLE', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032056', 'BAS ARMAGNAC BASKET CLUB', '32460', 'HOUGA', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032057', 'AUZAN BASKET CLUB', '32440', 'CASTELNAU-D''AUZAN', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032061', 'US BASKET L''ISLE JOURDAIN', '32600', 'ISLE-JOURDAIN', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032062', 'AVENIR CASTERA REJAUMONT', '32410', 'CASTERA-VERDUZAN', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032087', 'ENTENTE ESR - BCFP', '32480', 'ROMIEU', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032088', 'ENTENTE RSP - BCFP', '32120', 'PUYCASQUIER', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL')),
    ('OCC0032089', 'EN BCFP-ACR', '32500', 'FLEURANCE', (SELECT id FROM committees WHERE name = 'COMITE DU GERS DE BASKET-BALL'));

-- from clubs/33_gironde.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('NAQ0033001', 'CD HORS ASSOCIATION', '33140', 'VILLENAVE-D''ORNON', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033002', 'STE EULALIE BASKET BALL', '33560', 'SAINTE-EULALIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033003', 'AL LA REOLE', '33190', 'REOLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033005', 'LE TAILLAN BASKET', '33320', 'TAILLAN-MEDOC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033007', 'AS AMBARES', '33440', 'AMBARES-ET-LAGRAVE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033009', 'CMO BASSENS', '33530', 'BASSENS', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033010', 'BIGANOS BASKET CLUB', '33380', 'BIGANOS', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033012', 'BASKET CLUB ESTUAIRE GIRONDE', '33820', 'SAINT-CIERS-SUR-GIRONDE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033013', 'AS LIBOURNE', '33500', 'LIBOURNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033014', 'AS PIAN MEDOC BASKET', '33290', 'PIAN-MEDOC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033015', 'SAINT MEDARD BASKET', '33160', 'SAINT-MEDARD-EN-JALLES', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033017', 'STADE BORDELAIS', '33200', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033018', 'AS TRESSES', '33370', 'TRESSES', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033019', 'BASKET CLUB CANEJANAIS', '33610', 'CANEJAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033020', 'AS ST DELPHIN', '33140', 'VILLENAVE-D''ORNON', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033021', 'AVENIR DE MOULON', '33420', 'MOULON', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033022', 'AGJA CAUDERAN', '33000', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033023', 'BLEUETS ILLATS', '33720', 'ILLATS', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033024', 'BORDEAUX ETUDIANTS CLUB', '33800', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033025', 'BOULIAC BASKET CLUB', '33270', 'BOULIAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033026', 'CA BEGLES', '33130', 'BEGLES', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033027', 'CA CARBON BLANC OMNISPORT', '33560', 'CARBON-BLANC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033028', 'CA CARIGNAN', '33360', 'CARIGNAN-DE-BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033029', 'CLUB LEO LAGRANGE LORMONT', '33310', 'LORMONT', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033031', 'BASKET DES PORTES DE L''ENTRE DEUX MERS', '33360', 'QUINSAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033033', 'ENTENTE PESSAC BASKET CLUB', '33600', 'PESSAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033034', 'ENTENTE SPORTIVE BLANQUEFORT', '33290', 'BLANQUEFORT', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033036', 'ESPERANCE POMPIGNAC', '33370', 'POMPIGNAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033037', 'UNION SPORTIVE BAZAS', '33430', 'BAZAS', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033038', 'ETOILE SPORTIVE EYSINAISE', '33320', 'EYSINES', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033042', 'LES FILS DE ROLAND DE BLAYE', '33390', 'BLAYE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033043', 'JSA BORDEAUX BASKET', '33000', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033044', 'LES PETITS MOUSSES LANGOIRAN', '33550', 'LANGOIRAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033046', 'AS MARTIGNAS', '33127', 'MARTIGNAS-SUR-JALLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033047', 'SAM LESPARRE BASKET', '33340', 'LESPARRE-MEDOC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033048', 'SA GAZINET CESTAS', '33610', 'CESTAS', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033049', 'SA MERIGNACAIS', '33700', 'MERIGNAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033050', 'ARTIGUES BASKET CLUB', '33370', 'ARTIGUES-PRES-BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033054', 'LANGON SUD GIRONDE BASKETBALL', '33210', 'LANGON', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033057', 'SAINT ANDRE BASKET', '33240', 'SAINT-ANDRE-DE-CUBZAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033058', 'UNION SAINT JEAN BORDEAUX', '33800', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033059', 'BARIE CASTETS BASKET CLUB', '33190', 'BARIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033061', 'US CENON RIVE DROITE', '33150', 'CENON', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033062', 'COUTRAS GUITRES BASKET', '33230', 'GUITRES', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033063', 'UNION SPORTIVE GAURIAC', '33710', 'GAURIAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033064', 'UNION SPORTIVE BREDOISE BASKET', '33650', 'LA BREDE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033065', 'US LE BOUSCAT', '33110', 'LE BOUSCAT', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033066', 'US CHARTRONS BORDEAUX', '33300', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033071', 'US TALENCE', '33400', 'TALENCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033072', 'CASTELNAU MEDOC BC', '33480', 'CASTELNAU-DE-MEDOC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033073', 'L''ELAN DIONYSIEN', '33910', 'SAINT-DENIS-DE-PILE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033075', 'AS LE HAILLAN', '33185', 'HAILLAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033078', 'B.IZON', '33450', 'IZON', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033079', 'BC ST AVIT ST NAZAIRE', '33220', 'SAINT-AVIT-SAINT-NAZAIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033082', 'AMICALE BASKETTEURS GRADIGNAN', '33170', 'GRADIGNAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033086', 'NEW BASKET ATTITUDE', '33300', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033088', 'UNION SAINT BRUNO BORDEAUX', '33000', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033089', 'LUDON BASKET CLUB', '33290', 'LUDON-MEDOC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033091', 'ENT.SPORTIVE AUDENGE LANTON', '33980', 'AUDENGE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033096', 'BASKET CLUB MARCHEPRIME', '33380', 'MARCHEPRIME', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033103', 'BORDEAUX BASTIDE BASKET', '33100', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033108', 'ENTENTE BEC / UNION SAINT JEAN', '33800', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033112', 'LACANAU BASKET CLUB', '33680', 'LACANAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033132', 'UNION SPORTIVE ET CULTURELLE SAUCATAISE', '33650', 'SAUCATS', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033143', 'ENT LE HAILLAN - AGJA CAUDERAN', '33185', 'HAILLAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033144', 'ENT UNION SAINT JEAN - US TALENCE', '33800', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033147', 'Bordeaux Métropole 3x3 Ballistik', '33800', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033148', 'EQUIPE', '33140', 'VILLENAVE-D''ORNON', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033158', 'MARSAS BASKET CLUB (MBC)', '33360', 'CARIGNAN-DE-BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033167', 'GINKO AUBIERS NOUVELLE GENERATION BASKET - G.A.N.G B', '33300', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033169', 'ARES BASKET CLUB', '33740', 'ARES', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033172', 'Entente UNION SAINT JEAN / GINKO AUBIERS NGB', '33800', 'BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033173', 'Entente BARIE CASTETS BC / LANGON SGBB', '33190', 'BARIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033178', 'Entente BOULIAC BC / ARTIGUES BC', '33270', 'BOULIAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033179', 'ENTENTE ARTIGUES - TRESSES', '33370', 'ARTIGUES-PRES-BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033180', 'ENTENTE LANGOIRAN - ILLATS', '33550', 'LANGOIRAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033181', 'ENTENTE TRESSES-ARTIGUES', '33370', 'ARTIGUES-PRES-BORDEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL')),
    ('NAQ0033600', 'BASKET BASSIN D''ARCACHON', '33470', 'GUJAN-MESTRAS', (SELECT id FROM committees WHERE name = 'COMITE DE LA GIRONDE DE BASKET-BALL'));

-- from clubs/34_herault.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('OCC0034001', 'CD HERAULT HORS ASSOCIATION', '34970', 'LATTES', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034002', 'ASPTT MONTPELLIER', '34000', 'MONTPELLIER', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034003', 'AS CHEMINOTS BEZIERS BASKET', '34500', 'BEZIERS', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034005', 'AGDE BASKET', '34300', 'AGDE', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034006', 'BASKET LATTES MONTPELLIER', '34970', 'LATTES', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034007', 'PICPOUL CLUB DE PINET', '34850', 'PINET', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034008', 'SPORT CLUB DE SETE BASKET', '34200', 'SETE', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034010', 'ETOILE SPORTIVE PAULHAN BASKET', '34230', 'PAULHAN', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034012', 'FO PISCENOIS', '34120', 'CAZOULS-D''HERAULT', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034015', 'CLUB ATHLETIQUE BASKET BEDARIEUX', '34600', 'BEDARIEUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034020', 'CASTELNAU BASKET', '34170', 'CASTELNAU-LE-LEZ', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034021', 'FRONTIGNAN LA PEYRADE BASKET', '34110', 'FRONTIGNAN', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034025', 'LE CRES BASKET', '34920', 'CRES', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034027', 'MEZE LOUPIAN BASKET ASSOCIATION', '34560', 'VILLEVEYRAC', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034028', 'ST GELY BASKETBALL', '34980', 'SAINT-GELY-DU-FESC', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034033', 'MSL OLONZAC', '34210', 'FELINES-MINERVOIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034034', 'MONTPELLIER BASKET MOSSON', '34080', 'MONTPELLIER', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034035', 'ASSOCIATION P.S.C POMPIGNANE SPORT ET CULTURE', '34000', 'MONTPELLIER', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034036', 'BC MONTADY', '34310', 'MONTADY', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034039', 'LES LOUPS DU PIC OCCIDENTAL BASKET', '34380', 'SAINT-MARTIN-DE-LONDRES', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034045', 'LA CROIX D''ARGENT B MONTPELLIER', '34000', 'MONTPELLIER', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034046', 'GRANDE MOTTE BASKET', '34280', 'GRANDE-MOTTE', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034048', 'LODEVE BASKET CLUB', '34700', 'LAUROUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034049', 'JUVIGNAC BASKET ASSOCIATION', '34990', 'JUVIGNAC', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034056', 'PALAVAS BASKET CLUB', '34250', 'PALAVAS-LES-FLOTS', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034058', 'MAUGUIO BASKET', '34130', 'MAUGUIO', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034059', 'ASSOCIATION BASKET SAUVIAN SERIGNAN LITTORAL', '34410', 'SAUVIAN', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034060', 'ASSOCIATION SPORTIVE SERVIAN BASKET', '34290', 'SERVIAN', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034061', 'BASKET CLUB FABREGUES', '34690', 'FABREGUES', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034062', 'SJVBA ST JEAN DE VEDAS BASKET', '34430', 'SAINT-JEAN-DE-VEDAS', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034064', 'ST ANDRE BASKET COEUR D HERAULT', '34725', 'SAINT-ANDRE-DE-SANGONIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034065', 'BASKET BALL LUNEL VIEL', '34400', 'LUNEL-VIEL', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034066', 'PEROLS BASKET', '34250', 'PALAVAS-LES-FLOTS', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034068', 'CLAPIERS BASKET BALL', '34830', 'CLAPIERS', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034072', 'MONTPELLIER UNIVERSITE CLUB', '34070', 'MONTPELLIER', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034075', 'BASKET PAYS DE LUNEL', '34400', 'LUNEL', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL')),
    ('OCC0034076', 'BASKET CLUB FLORENSAC', '34510', 'FLORENSAC', (SELECT id FROM committees WHERE name = 'COMITE DE L''HERAULT DE BASKET-BALL'));

-- from clubs/35_ille_et_vilaine.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('BRE0035001', 'CD35 HORS ASSOCIATION', 35065, 'RENNES Cedex', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035002', 'ACIGNE BC', 35690, 'ACIGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035004', 'ARGENTRE (LES JEUNES)', 35370, 'ARGENTRE-DU-PLESSIS', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035007', 'BALAZE JA', 35500, 'BALAZE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035009', 'BETTON CS', 35830, 'BETTON', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035010', 'BREAL BASKET EN BROCELIANDE', 35310, 'BREAL-SOUS-MONTFORT', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035011', 'BRETEIL BC', 35160, 'BRETEIL', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035012', 'BRUZ AL BASKETBALL', 35170, 'BRUZ', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035013', 'CESSON OC BASKET', 35510, 'CESSON-SEVIGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035014', 'CHANTEPIE AS', 35135, 'CHANTEPIE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035015', 'CHARTRES DE BRETAGNE (ESP)', 35131, 'CHARTRES-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035016', 'CHATEAUBOURG BC', 35220, 'CHATEAUBOURG', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035017', 'CHATEAUGIRON US', 35410, 'CHATEAUGIRON', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035018', 'NOYAL-CHATILLON US', 35230, 'NOYAL-CHATILLON-SUR-SEICHE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035019', 'CHAVAGNE ESPERANCE', 35310, 'CHAVAGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035020', 'CHAPELLE CINTRE BASKET', 35590, 'LA CHAPELLE-THOUARAULT', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035021', 'COMBOURG CHATEAUBRIAND', 35270, 'COMBOURG', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035024', 'DOL BC', 35120, 'DOL-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035025', 'IRODOUER BASKET EN MAINS', 35850, 'IRODOUER', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035026', 'DOMALAIN VOLTIGEURS', 35680, 'DOMALAIN', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035027', 'DOMLOUP SPORTS', 35410, 'DOMLOUP', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035028', 'ETRELLES ES', 35370, 'ETRELLES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035029', 'ASB DE PIPRIAC', 35550, 'PIPRIAC', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035030', 'PAYS DE FOUGERES BASKET', 35300, 'FOUGERES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035031', 'GEVEZE AS', 35850, 'GEVEZE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035034', 'JANZE (VOLONTAIRES)', 35150, 'JANZE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035036', 'KORRIGANS BASKET CLUB GUERCHAIS', 35130, 'GUERCHE-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035037', 'LANDUJAN STELLA', 35360, 'LANDUJAN', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035038', 'LE RHEU SC', 35650, 'LE RHEU', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035039', 'L''HERMITAGE AC', 35590, 'L''HERMITAGE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035042', 'LOUVIGNE BB', 35420, 'LOUVIGNE-DU-DESERT', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035047', 'MELESSE JA', 35520, 'MELESSE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035048', 'MINIAC MORVAN BC', 35540, 'MINIAC-MORVAN', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035049', 'MONTAUBAN DE BGNE OC', 35360, 'MONTAUBAN-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035051', 'MONTFORT BC', 35160, 'MONTFORT-SUR-MEU', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035052', 'MORDELLES US', 35310, 'MORDELLES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035054', 'NOYAL-SUR-VILAINE AS', 35530, 'NOYAL-SUR-VILAINE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035055', 'ORGERBLON BC', 35230, 'ORGERES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035056', 'PACE CO', 35740, 'PACE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035058', 'PLEURTUIT AL', 35730, 'PLEURTUIT', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035059', 'POCÉ LES BOIS BASKET', 35500, 'POCE-LES-BOIS', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035062', 'REDON ES', 35600, 'REDON', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035065', 'RENNES AS CHEMINOTS', 35000, 'RENNES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035068', 'RENNES AS PTT', 35000, 'RENNES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035072', 'RENNES AVENIR', 35000, 'RENNES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035073', 'CADETS DE BRETAGNE', 35000, 'RENNES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035074', 'BREIZH FOBAL KLUB', 35000, 'RENNES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035080', 'RENNES CERCLE PAUL BERT BASKET', 35000, 'RENNES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035085', 'RENNES JEANNE D''ARC', 35700, 'RENNES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035087', 'RENNES STADE BASKETBALL', 35200, 'RENNES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035088', 'RENNES TOUR D''AUVERGNE', 35000, 'RENNES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035091', 'RETIERS BASKET CLUB', 35240, 'THEIL-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035093', 'SAINT BRICE AS', 35460, 'MAEN ROCH', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035094', 'SAINT DIDIER ABC', 35220, 'SAINT-DIDIER', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035096', 'SAINT GILLES US', 35590, 'SAINT-GILLES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035098', 'SAINT GREGOIRE US', 35760, 'SAINT-GREGOIRE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035099', 'SAINT JACQUES BC', 35136, 'SAINT-JACQUES-DE-LA-LANDE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035100', 'SAINT MALO AS PTT', 35400, 'SAINT-MALO', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035102', 'SAINT MALO CJF', 35400, 'SAINT-MALO', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035106', 'SAINT MEEN LE GRAND SC', 35290, 'SAINT-MEEN-LE-GRAND', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035107', 'SERVON CS', 35530, 'SERVON-SUR-VILAINE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035108', 'VAL D''IZE (BASKETBALL)', 35450, 'VAL-D-IZE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035109', 'VEZIN LE COQUET AS', 35132, 'VEZIN-LE-COQUET', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035110', 'VITRE AURORE', 35500, 'VITRE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035118', 'GUICHEN BC', 35580, 'GUICHEN', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035121', 'BOISGERVILLY JS', 35360, 'BOISGERVILLY', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035123', 'ROMILLE AS BASKET', 35850, 'ROMILLé', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035125', 'BAGUER-MORVAN US', 35120, 'BAGUER-MORVAN', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035126', 'MONTERFIL (KORRIGANS)', 35160, 'MONTERFIL', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035129', 'THORIGNE FOUILLARD BC', 35235, 'THORIGNE-FOUILLARD', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035132', 'LA MEZIERE BC', 35520, 'LA MEZIERE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035133', 'VERN SUR SEICHE US', 35770, 'VERN-SUR-SEICHE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035134', 'LE VERGER BCV', 35160, 'VERGER', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035135', 'CHÂTILLON-EN-VENDELAIS BASKET', 35210, 'CHATILLON-EN-VENDELAIS', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035140', 'BRECE BASKET CLUB - BBC', 35530, 'BRECE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035141', 'LIFFRE US', 35340, 'LIFFRE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035144', 'BASKET CLUB DU LINON', 35270, 'MEILLAC', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035146', 'VIGNOC-HEDE-GUIPEL BASKET', 35630, 'VIGNOC', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035147', 'FRERES DE PARTHENAY BASKETBALL', 35850, 'PARTHENAY-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035150', 'ROMAGNE BC', 35133, 'ROMAGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035153', 'ILLET BC', 35250, 'CHEVAIGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035154', 'MONTGERMONT BC', 35760, 'MONTGERMONT', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035160', 'SAINT THURIAL BASKET', 35310, 'SAINT-THURIAL', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035161', 'TALENSAC ESPOIR SPORTIF', 35160, 'TALENSAC', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035162', 'MEDREAC US', 35360, 'MEDREAC', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035167', 'EMERAUDE BASKET COLOMBANAIS', 35350, 'SAINT-COULOMB', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035170', 'PLEUMELEUC-BEDEE AS', 35137, 'PLEUMELEUC', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035174', 'SAINT JOUAN BC', 35540, 'MINIAC-MORVAN', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035175', 'LAILLE US', 35890, 'LAILLE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035176', 'LA CHAPELLE DES FGTZ AL BASKET', 35520, 'LA CHAPELLE-DES-FOUGERETZ', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035178', 'RENNES POLE ASSOCIATION', 35000, 'RENNES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035181', 'PONT PEAN BASKET', 35131, 'PONT-PEAN', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035182', 'BOURGBARRE US BASKET', 35230, 'BOURGBARRE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035188', 'CHANTELOUP US', 35150, 'CHANTELOUP', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035189', 'CREVIN (LES BRUYERES)', 35320, 'CREVIN', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035190', 'GUIPRY-MESSAC BASKET', 35480, 'GUIPRY', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035191', 'UNION SPORTIVE BAIN DE BRETAGNE BASKETBALL', 35470, 'BAIN-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035195', 'ERBREE AS BASKET', 35500, 'ERBREE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035197', 'BAINS S/ OUST BASKET', 35600, 'BAINS-SUR-OUST', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035198', 'LIVRE-MECE AS BASKET', 35450, 'LIVRE-MECE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035199', 'DINARD (ETOILE)', 35800, 'DINARD', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035222', 'ENT- LE VERGER / MONTERFIL', 35160, 'MONTERFIL', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035228', 'ENT- LAILLE / BRUZ', 35890, 'LAILLE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035232', 'ENT- LA GUERCHE / DOMALAIN', 35130, 'GUERCHE-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035233', 'ENT- RENNES STADE / RENNES PA', 35200, 'RENNES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035235', 'ENT- MONTERFIL / LE VERGER', 35160, 'MONTERFIL', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035241', 'ENT- SAINT GILLES / L''HERMITE', 35590, 'SAINT-GILLES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035247', 'EURO PACÉ ASSOCIATION', 35740, 'PACE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035248', 'MAURE BASKET BALL', 35330, 'Val d''Anast', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035250', 'ENT- CHATEAUBOURG/BRECE', 35220, 'CHATEAUBOURG', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035251', 'ENT- ST THURIAL / MONTERFIL', 35310, 'SAINT-THURIAL', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035252', 'ENT- SERVON / BRÉCÉ', 35530, 'SERVON-SUR-VILAINE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035253', 'ENT- BRÉAL / MORDELLES', 35310, 'BREAL-SOUS-MONTFORT', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035254', 'ENT- ARGENTRÉ / ETRELLES', 35370, 'ARGENTRE-DU-PLESSIS', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035255', 'PARTHENAY BASKET CLUB', 35850, 'PARTHENAY-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL')),
    ('BRE0035500', 'UNION RENNES BASKET 35', 35000, 'RENNES', (SELECT id FROM committees WHERE name = 'COMITE D''ILLE-ET-VILAINE DE BASKET-BALL'));

-- from clubs/36_indre.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('CVL0036001', 'CD36 HORS ASSOCIATION - INDRE', 36000, 'CHATEAUROUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036002', 'BASKET CLUB DEOLOIS', 36130, 'DEOLS', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036003', 'ACS BUZANCAIS', 36500, 'BUZANCAIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036005', 'ASSG LE BLANC', 36300, 'LE BLANC', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036007', 'SAINT MAUR BASKET BALL', 36250, 'SAINT-MAUR', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036010', 'CS EGUZONNAIS', 36270, 'EGUZON-CHANTOME', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036013', 'ES ETRECHET', 36120, 'ETRECHET', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036017', 'SC ISSOUDUN', 36100, 'ISSOUDUN', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036019', 'SS CLUIS', 36340, 'CLUIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036021', 'US AIGURANDAISE', 36140, 'AIGURANDE', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036022', 'US ARGENTONNAISE', 36200, 'ARGENTON-SUR-CREUSE', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036023', 'US LA CHATRE', 36400, 'LA CHATRE', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036024', 'NEUVY ST SEP. BASKET CLUB', 36230, 'NEUVY-SAINT-SEPULCHRE', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036025', 'US LE POINCONNET', 36330, 'LE POINCONNET', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036026', 'BAS CHABRIS', 36210, 'CHABRIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036030', 'OBC ARDENTES', 36120, 'ARDENTES', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036036', 'AS VAL DE CREUSE', 36800, 'SAINT-GAULTIER', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036037', 'ARTHON BASKET CLUB', 36330, 'ARTHON', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036040', 'ASPTT CHATEAUROUX', 36000, 'CHATEAUROUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036056', 'NEUVY-PAILLOUX BASKET CLUB', 36100, 'NEUVY-PAILLOUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036057', 'Entente Neuvy Ardentes La Châtre', 36230, 'NEUVY-SAINT-SEPULCHRE', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036059', 'Entente Neuvy Cluis La Châtre', 36230, 'NEUVY-SAINT-SEPULCHRE', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036070', 'Entente SC Issoudun - Neuvy Pailloux BC', 36100, 'ISSOUDUN', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036078', 'Entente Cluis - La Châtre', 36340, 'CLUIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036079', 'Entente Cluis Aigurande Neuvy La Châtre', 36340, 'CLUIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036081', 'Entente La Châtre Neuvy Cluis', 36400, 'LA CHATRE', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036082', 'Entente La Châtre Neuvy Cluis Ardentes', 36400, 'LA CHATRE', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036083', 'Entente Arhon - St Maur', 36330, 'ARTHON', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL')),
    ('CVL0036084', 'BASKET TOURNON SAINT MARTIN', 36220, 'TOURNON-SAINT-MARTIN', (SELECT id FROM committees WHERE name = 'COMITE DE L''INDRE DE BASKET-BALL'));

-- from clubs/37_indre_et_loire.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('CVL0037001', 'CD37 HORS ASSOCIATION', 37210, 'PARCAY-MESLAY', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037003', 'TOURAINE BC', 37000, 'TOURS', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037004', 'TEAM BASKET ASSOCIATION', 37520, 'LA RICHE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037005', 'CES TOURS', 37000, 'TOURS', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037006', 'Entente LOCHES - LIGUEIL', 37600, 'FERRIERE-SUR-BEAULIEU', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037007', 'PL BEAUJARDIN RASPAIL TOURS', 37000, 'TOURS', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037009', 'TOURS METROPOLE BASKET PATRONAGE LAÏQUE LA RICHE LAMARTINE TOURS BASKET', 37000, 'TOURS', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037013', 'A C AMBOISE NAZELLES', 37400, 'AMBOISE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037014', 'ARTANNES BASKET CLUB', 37260, 'ARTANNES-SUR-INDRE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037015', 'USE AVOINE BEAUMONT', 37420, 'AVOINE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037016', 'BALLAN BASKET CLUB', 37510, 'BALLAN-MIRE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037018', 'ENT SPORT. BOURGUEIL', 37140, 'BOURGUEIL', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037019', 'CHATEAU RENAULT A.B.', 37110, 'CHATEAU-RENAULT', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037020', 'CHINON BASKET CLUB', 37500, 'CHINON', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037023', 'ALERTE SP. DE FONDETTES', 37230, 'FONDETTES', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037026', 'AV SP. JOCONDIEN', 37300, 'JOUE-LES-TOURS', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037027', 'LANGEAIS CINQ MARS BASKET BALL', 37130, 'LANGEAIS', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037028', 'CELTIC LA RICHE BASKET', 37520, 'LA RICHE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037029', 'UNION SPORT LIGUEIL', 37240, 'LIGUEIL', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037030', 'LOCHES ACU BEAULIEU', 37600, 'LOCHES', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037033', 'MONNAIE BASKET CLUB', 37380, 'MONNAIE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037034', 'ALERTE SP. DE MONTLOUIS', 37270, 'MONTLOUIS-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037035', 'ASS. SPORT. DE MONTS', 37260, 'MONTS', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037037', 'UNION SPORTIVE DE CHARENTILLY (U.S.C)', 37390, 'CHARENTILLY', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037038', 'AVIONNETTE PARCAY MESLAY BC', 37210, 'PARCAY-MESLAY', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037041', 'AS DE ROCHECORBON', 37210, 'ROCHECORBON', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037042', 'SAINT AVERTIN SPORTS', 37550, 'SAINT-AVERTIN', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037043', 'AS DE SAINT BRANCHS', 37320, 'SAINT-BRANCHS', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037044', 'AL RS SAINT CYR SUR LOIRE', 37540, 'SAINT-CYR-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037045', 'BASKET STE MAURIEN', 37800, 'SAINTE-MAURE-DE-TOURAINE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037046', 'US SAINT PIERRE DES CORPS', 37700, 'SAINT-PIERRE-DES-CORPS', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037049', 'US DE VERNOU SUR BRENNE', 37210, 'VERNOU-SUR-BRENNE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037050', 'ES LA VILLE AUX DAMES', 37700, 'LA VILLE-AUX-DAMES', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037051', 'GS ST PATERNE ST CHRISTOPHE', 37370, 'SAINT-PATERNE-RACAN', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037052', 'VERETZ LARCAY BASKET', 37270, 'VERETZ', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037054', 'BASKET BALL BOUCHARDAIS', 37220, 'ILE-BOUCHARD', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037055', 'CLUB SPORTIF MEMBROLLAIS', 37390, 'MEMBROLLE-SUR-CHOISILLE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037056', 'ATHLETIC B. C DE DRACHE', 37800, 'DRACHE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037057', 'VAL DE L''INDRE VEIGNE AS', 37250, 'VEIGNE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037086', 'ETOILE SPORT OESIENNE', 37390, 'NOTRE-DAME-D''OE', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037089', 'ASPO TOURS', 37000, 'TOURS', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037099', 'BASKET CLUB AZAY CHEILLE', 37190, 'AZAY-LE-RIDEAU', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL')),
    ('CVL0037332', 'GAZELEC BASKET', 37200, 'TOURS', (SELECT id FROM committees WHERE name = 'COMITE D''INDRE-ET-LOIRE DE BASKET-BALL'));

-- from clubs/38_isere.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('ARA0038001', 'CD38 – HORS ASSOCIATION – ISERE', 38000, 'GRENOBLE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038003', 'AS BASKET BEAUCROISSANT-IZEAUX-RENAGE', 38140, 'BEAUCROISSANT', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038006', 'CLUB SPORTIF DES 4 ROUTES', 38690, 'CHABONS', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038008', 'AS RHODANIENNE', 38370, 'ROCHES-DE-CONDRIEU', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038010', 'BASKET PAYS D''ALLEVARD', 38830, 'CRÊTS EN BELLEDONNE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038012', 'CHARTREUSE BASKET CLUB', 38380, 'ENTRE-DEUX-GUIERS', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038013', 'GROUPE SPORTIF CHASSE SUR RHONE', 38670, 'CHASSE-SUR-RHONE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038015', 'AVENIR BASKET DAUPHINE', 38070, 'SAINT-QUENTIN-FALLAVIER', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038016', 'BASKET SAINT MARCELLIN', 38160, 'SAINT-MARCELLIN', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038017', 'JEUNESSE SPORTIVE DE CREMIEU', 38460, 'CREMIEU', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038018', 'GRESIVAUDAN BASKET CLUB', 38920, 'CROLLES', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038019', 'AMICALE BC DOMENE', 38420, 'DOMENE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038020', 'AMICALE LAIQUE ECHIROLLES', 38130, 'ECHIROLLES', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038021', 'BBC EYBENS POISAT', 38320, 'EYBENS', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038025', 'SPORTING CLUB DE GIERES', 38610, 'GIERES', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038027', 'TERRES FROIDES BASKET', 38140, 'APPRIEU', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038028', 'ASSOCIATION SPORTIVE SAINT ANDRE BASKET', 38490, 'SAINT-ANDRE-LE-GAZ', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038029', 'GRENOBLE BASKET 38', 38000, 'GRENOBLE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038030', 'AVENIERES VEYRINS THUELLIN BASKET', 38630, 'AVENIERES', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038032', 'UJ BASKET MONSTEROUX MILIEU', 38122, 'MONSTEROUX-MILIEU', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038033', 'BASKET CLUB MARCILLOLES PAJAY', 38260, 'MARCILLOLES', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038035', 'BASKET CLUB BAVONNE', 38140, 'SAINT-BLAISE-DU-BUIS', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038037', 'RHODIA CLUB BASKET', 38150, 'SALAISE-SUR-SANNE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038038', 'ISERE SAVOIE PONT BASKET', 38480, 'PONT-DE-BEAUVOISIN', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038039', 'SO PONT DE CHERUY CHARVIEU CHAVANOZ BASKET-BALL', 38230, 'PONT-DE-CHERUY', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038041', 'ENTENTE BELLEDONNE-GRESIVAUDAN', 38570, 'GONCELIN', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038042', 'US SASSENAGEOISE', 38113, 'VEUREY-VOROIZE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038046', 'BC SAINT CLAIR SUR GALAURE', 38940, 'SAINT-CLAIR-SUR-GALAURE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038047', 'BASKET CLUB SEPTEME OYTIER', 38780, 'SEPTEME', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038048', 'UNION SPORTIVE VALDAINOISE', 38620, 'SAINT-GEOIRE-EN-VALDAINE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038049', 'AVENIR BASKET HILAIROIS', 38840, 'SAINT-HILAIRE-DU-ROSIER', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038052', 'SAINT MARTIN D''HERES BASKETBALL', 38400, 'SAINT-MARTIN-D''HERES', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038053', 'US SAINT PIERRE DE BRESSIEUX', 38870, 'SAINT-PIERRE-DE-BRESSIEUX', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038056', 'LA TRONCHE MEYLAN BASKET', 38700, 'TRONCHE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038057', 'BC LA TRONCHE MEYLAN', 38240, 'MEYLAN', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038058', 'AS TULLINS FURES', 38210, 'TULLINS', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038060', 'AS LE VERSOUD', 38420, 'VERSOUD', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038061', 'AL VOIRON BASKET', 38500, 'VOIRON', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038062', 'LES DAUPHINS DE CROSSEY BASKET', 38960, 'SAINT-ETIENNE-DE-CROSSEY', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038063', 'VOREPPE BASKET CLUB', 38340, 'VOREPPE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038065', 'US DE ST EGREVE', 38120, 'SAINT-EGREVE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038071', 'BASKET NORD ISERE', 38890, 'SAINT-CHEF', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038072', 'BIG BANG BALLERS - FRANCE (BIG BANGS)', 38100, 'GRENOBLE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038073', 'BC FAVERGES DOLOMIEU', 38110, 'DOLOMIEU', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038074', 'UNION SEYSSINET FONTAINE BASKET', 38170, 'SEYSSINET-PARISET', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038076', 'LES ARRONDS (Entente)', 38210, 'TULLINS', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038077', 'ES FRONTONAS CHAMAGNIEU', 38290, 'FRONTONAS', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038081', 'BASKET CLUB LES ABRETS', 38490, 'LES ABRETS EN DAUPHINE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038083', 'BASKET CLUB BEAUVOIR DE MARC', 38440, 'BEAUVOIR-DE-MARC', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038087', 'BASKET CLUB NIVOLAS', 38300, 'NIVOLAS-VERMELLE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038097', 'BASKET ESTRABLIN PONT EVEQUE', 38780, 'ESTRABLIN', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038098', 'ASEL ST MARTIN D''URIAGE', 38410, 'SAINT-MARTIN-D''URIAGE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038099', 'AVENIR BASKET CLUB DES COULEURS', 38630, 'CORBELIN', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038101', 'US BASKET BEAUREPAIRE', 38270, 'BEAUREPAIRE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038104', 'VEDETTE ST VICTOR DE CESSIEU', 38110, 'SAINT-VICTOR-DE-CESSIEU', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038105', 'BASKET CLUB DE RUY MONTCEAU', 38300, 'RUY', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038113', 'BASKET CLUB DIEMOZ', 38790, 'DIEMOZ', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038114', 'ELAN BASKET DES VALLONS DE LA TOUR CESSIEU', 38110, 'SAINT-JEAN-DE-SOUDAIN', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038119', 'BASKET DES CARRIERS ET DU PAYS DE LA PIERRE', 38390, 'BOUVESSE-QUIRIEU', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038120', 'BC ST AGNIN CRACHIER CHEZEN', 38300, 'SAINT-AGNIN-SUR-BION', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038121', 'BASKET GONCELIN GRESIVAUDAN', 38570, 'GONCELIN', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038122', 'ARTAS BASKET CLUB', 38440, 'ARTAS', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038124', 'CHATONNAY BC DES ETANGS', 38440, 'CHATONNAY', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038126', 'BASKET CLUB EYZIN PINET', 38780, 'EYZIN-PINET', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038127', 'ROMANCHE BASKET', 38220, 'VIZILLE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038128', 'BASKET CLUB DES PORTES DE L''ISERE', 38300, 'BOURGOIN-JALLIEU', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038133', 'AS ST GEORGES ESPERANCHE', 38790, 'SAINT-GEORGES-D''ESPERANCHE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038136', 'UNION BASKET LES AVENIERES AOSTE', 38490, 'AOSTE', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038146', 'AVENIR BASKET CHAMPIER', 38260, 'CHAMPIER', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038148', 'BASKET 2 ALPES', 38860, 'Deux Alpes (Les)', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038170', 'PAYS VOIRONNAIS BASKET CLUB', 38500, 'VOIRON', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL')),
    ('ARA0038173', 'ENTENTE BEAUVOIR DE MARC - DIEMOZ', 38790, 'DIEMOZ', (SELECT id FROM committees WHERE name = 'COMITE D''ISERE DE BASKET-BALL'));

-- from clubs/39_jura.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('BFC0039001', 'CD JURA HORS ASSOCIATION', 39250, 'DOYE', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039002', 'SAINT AMOUR BASKET', 39160, 'SAINT-AMOUR', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039003', 'POLIGNY JURA BASKET COMTE', 39800, 'POLIGNY', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039004', 'JURA DOLOIS BASKET', 39100, 'DOLE', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039005', 'EVEIL SPORTIF MONTMOROT', 39570, 'MONTMOROT', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039006', 'BASKET CUVIER FRASNE', 39250, 'CUVIER', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039007', 'AMICALE LAÏQUE LÉDONIENNE JURA BASKET', 39000, 'LONS-LE-SAUNIER', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039010', 'CHAMPAGNOLE JURA BASKET', 39300, 'CHAMPAGNOLE', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039011', 'HAUT JURA BASKET ST CLAUDE', 39200, 'SAINT-CLAUDE', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039014', 'JURA SALINS BASKET CLUB', 39110, 'SALINS-LES-BAINS', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039016', 'BASKET CLUB CLAIRVAUX LES LACS', 39130, 'CLAIRVAUX-LES-LACS', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039017', 'BASKET ORGELET CLUB', 39270, 'ORGELET', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039021', 'MOREZIENS BASKET CLUB', 39400, 'MOREZ', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL')),
    ('BFC0039022', 'ENT CHAMPAGNOLE POLIGNY', 39300, 'CHAMPAGNOLE', (SELECT id FROM committees WHERE name = 'COMITE DU JURA DE BASKET-BALL'));

-- from clubs/40_landes.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('NAQ0040001', 'CD 40 HORS ASSOCIATION', 40000, 'MONT-DE-MARSAN', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040002', 'AMOU BONNEGARDE NASSIET', 40330, 'AMOU', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040003', 'ARBOUCAVE SPORTS', 40320, 'ARBOUCAVE', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040004', 'SPORTING CLUB ARENGOSSAIS', 40110, 'ARENGOSSE', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040006', 'TURSAN BASKET CHALOSSE', 40700, 'AUBAGNAN', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040007', 'UNION SAINT-SEVER AUDIGNON MONTAUT BASKET', 40500, 'AUDIGNON', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040012', 'ROITELETS DE BENQUET', 40280, 'BENQUET', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040013', 'BISCARROSSE OLYMPIQUE BASKET', 40600, 'BISCARROSSE', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040015', 'ENTENTE RION BOOS', 40370, 'RION-DES-LANDES', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040016', 'CLUB BASKET DES PETITES LANDES', 40240, 'LOSSE', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040018', 'AVENIR BASKET CHALOSSE', 40360, 'POMAREZ', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040019', 'UNION CAMPAGNE MEILHAN', 40090, 'CAMPAGNE', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040025', 'CAUNA SOUPROSSE AURICE', 40500, 'CAUNA', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040026', 'CAUNEILLE BASKET D''ORTHE', 40300, 'CAUNEILLE', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040028', 'EN BISCARROSSE/PARENTIS', 40600, 'BISCARROSSE', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040029', 'EN VIEUX BOUCAU/MAGESCQ', 40480, 'VIEUX-BOUCAU-LES-BAINS', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040031', 'ALBRET BASKET ARMAGNAC', 40240, 'CREON-D''ARMAGNAC', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040032', 'ADOUR DAX BASKET', 40100, 'DAX', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040033', 'UNION SPORTIVE DACQUOISE', 40100, 'DAX', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL')),
    ('NAQ0040034', 'HAGETMAU DOAZIT CHALOSSE', 40700, 'DOAZIT', (SELECT id FROM committees WHERE name = 'COMITE DES LANDES DE BASKET-BALL'));

-- from clubs/41_loir_et_cher.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('NAQ0040001', 'CD 40 HORS ASSOCIATION', 40000, 'MONT-DE-MARSAN', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040002', 'AMOU BONNEGARDE NASSIET', 40330, 'AMOU', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040003', 'ARBOUCAVE SPORTS', 40320, 'ARBOUCAVE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040004', 'SPORTING CLUB ARENGOSSAIS', 40110, 'ARENGOSSE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040006', 'TURSAN BASKET CHALOSSE', 40700, 'AUBAGNAN', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040007', 'UNION SAINT-SEVER AUDIGNON MONTAUT BASKET', 40500, 'AUDIGNON', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040012', 'ROITELETS DE BENQUET', 40280, 'BENQUET', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040013', 'BISCARROSSE OLYMPIQUE BASKET', 40600, 'BISCARROSSE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040015', 'ENTENTE RION BOOS', 40370, 'RION-DES-LANDES', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040016', 'CLUB BASKET DES PETITES LANDES', 40240, 'LOSSE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040018', 'AVENIR BASKET CHALOSSE', 40360, 'POMAREZ', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040019', 'UNION CAMPAGNE MEILHAN', 40090, 'CAMPAGNE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040025', 'CAUNA SOUPROSSE AURICE', 40500, 'CAUNA', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040026', 'CAUNEILLE BASKET D''ORTHE', 40300, 'CAUNEILLE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040028', 'EN BISCARROSSE/PARENTIS', 40600, 'BISCARROSSE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040029', 'EN VIEUX BOUCAU/MAGESCQ', 40480, 'VIEUX-BOUCAU-LES-BAINS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040031', 'ALBRET BASKET ARMAGNAC', 40240, 'CREON-D''ARMAGNAC', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040032', 'ADOUR DAX BASKET', 40100, 'DAX', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040033', 'UNION SPORTIVE DACQUOISE', 40100, 'DAX', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('NAQ0040034', 'HAGETMAU DOAZIT CHALOSSE', 40700, 'DOAZIT', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041003', 'CD41 HORS ASSOCIATION - LOIR ET CHER', 41914, 'BLOIS Cedex 9', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041004', 'ADA BLOIS BASKET 41', 41000, 'BLOIS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041005', 'EVEIL DE CONTRES', 41700, 'CONTRES', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041009', 'CA MONTRICHARD', 41400, 'THENAY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041010', 'RUCHE DE NOUAN', 41600, 'NOUAN-LE-FUZELIER', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041012', 'S.M.S. ROMORANTIN', 41200, 'ROMORANTIN-LANTHENAY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041013', 'AS SALBRIS', 41300, 'SALBRIS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041015', 'AL SAINT OUEN BASKET', 41100, 'SAINT-OUEN', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041016', 'SAINT-SULPICE BASKET', 41000, 'SAINT-SULPICE-de-POMMERAY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041019', 'USCF LES MONTILS', 41120, 'LES MONTILS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041022', 'BASKET CLUB VAL DU BEUVRON', 41120, 'CORMERAY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041027', 'VINEUIL SPORTS BASKET', 41350, 'VINEUIL', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041028', 'B.C.C.BLOIS', 41000, 'BLOIS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041033', 'ASJ BASKET LA CHAUSSEE ST VICTOR', 41260, 'CHAUSSEE-SAINT-VICTOR', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041035', 'ASJ ONZAIN BASKET', 41150, 'Veuzain-sur-Loire', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041039', 'ES CHEVERNY-COUR CHEVERNY', 41700, 'COUR-CHEVERNY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041042', 'CLUB ATHLETIQUE OUZOUER LE MARCH', 41240, 'OUZOUER-LE-MARCHE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041043', 'LES ATOMIQUES DE ST LAURENT', 41220, 'SAINT-LAURENT-NOUAN', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041045', 'LAMOTTE BASKET ASSOCIATION', 41600, 'LAMOTTE-BEUVRON', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL')),
    ('CVL0041059', 'ST SULPICE BASKET - BCCB', 41000, 'SAINT-SULPICE-de-POMMERAY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIR-ET-CHER DE BASKET-BALL'));

-- from clubs/42_loire.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id) VALUES
    ('ARA0042001', 'CD42 - HORS ASSOCIATION - LOIRE', 42100, 'SAINT-ETIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042002', 'L''ETRAT BASKET', 42580, 'L''ETRAT', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042003', 'ST JEAN BONNEFONDS AVANT GARDE BASKET', 42650, 'SAINT-JEAN-BONNEFONDS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042004', 'MONTBRISON FEMININES BC', 42600, 'MONTBRISON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042007', 'ST ETIENNE COTE CHAUDE', 42000, 'SAINT-ETIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042008', 'BASKET GARGOMANCOIS SAINT MAURICE EN GOURGOIS', 42240, 'SAINT-MAURICE-EN-GOURGOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042009', 'ST ETIENNE B T S', 42000, 'SAINT-ETIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042011', 'ST MARTIN OMNISPORTS BASKET', 42800, 'SAINT-MARTIN-LA-PLAINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042012', 'SAVIGNEUX BC', 42600, 'SAVIGNEUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042013', 'LA RICAMARIE AL', 42150, 'LA RICAMARIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042015', 'ST GENEST LERPT AL', 42530, 'SAINT-GENEST-LERPT', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042016', 'ANDREZIEUX-BOUTHEON LOIRE SUD BASKET', 42160, 'ANDREZIEUX-BOUTHEON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042018', 'SURY LE COMTAL AL', 42450, 'SURY-LE-COMTAL', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042019', 'ASSOCIATION SPORTIVE MAGIQUE BASKET', 42000, 'SAINT-ETIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042020', 'PONTOISE ULR BASKET ST JUST ST RAMBERT', 42170, 'SAINT-JUST-SAINT-RAMBERT', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042021', 'JONZIEUX MARLHES BC', 42660, 'JONZIEUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042023', 'BASKET CITOYEN SAINT ETIENNE SOLEIL', 42000, 'SAINT-ETIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042025', 'NOIRETABLE BC', 42440, 'NOIRETABLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042027', 'HAUT FOREZ BC', 42380, 'ABOEN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042028', 'ST ETIENNE ASPTT', 42390, 'VILLARS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042029', 'COISE ST DENIS BC', 42140, 'SAINT-DENIS-SUR-COISE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042031', 'FIRMINY LE MAS', 42700, 'FIRMINY', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042032', 'BELMONT COUBLANC BASKET', 42670, 'BELMONT-DE-LA-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042033', 'ST ROMAIN LE PUY A', 42610, 'SAINT-ROMAIN-LE-PUY', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042034', 'MONTBRISON MASCULINS BC', 42600, 'MONTBRISON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042035', 'LA RICAMARIE BCM', 42150, 'LA RICAMARIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042038', 'PANISSIERES CA', 42360, 'PANISSIERES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042039', 'PELUSSIN BC', 42410, 'PELUSSIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042041', 'ST PAUL EN JAREZ CS BASKET', 42740, 'SAINT-PAUL-EN-JAREZ', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042042', 'CCSL RIVE DE GIER SAINT JOSEPH BASKET', 42800, 'RIVE-DE-GIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042043', 'BOISSET LES MONTROND CJS', 42210, 'BOISSET-LES-MONTROND', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042044', 'ST MEDARD BASKET', 42330, 'SAINT-MEDARD-EN-FOREZ', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042046', 'VEAUCHE CRAP', 42340, 'VEAUCHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042047', 'FEURS EF', 42110, 'FEURS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042048', 'ROCHE LA MOLIERE ES', 42230, 'ROCHE-LA-MOLIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042049', 'SORBIERS/TALAUDIERE BASKET', 42350, 'TALAUDIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042050', 'ST RAMBERT ES', 42170, 'SAINT-JUST-SAINT-RAMBERT', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042051', 'ST GALMIER ES', 42330, 'SAINT-GALMIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042052', 'BOEN ETOILE', 42130, 'BOEN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042053', 'FRAISSES-UNIEUX BASKET 42', 42490, 'FRAISSES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042054', 'ST ETIENNE MONTAUD', 42000, 'SAINT-ETIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042055', 'C.E.S.T.I. BASKET', 42670, 'ECOCHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042058', 'ROANNAIS BASKET FEMININ', 42300, 'ROANNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042059', 'LE CHAMBON FEUG. BASKET FL', 42500, 'LE CHAMBON-FEUGEROLLES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042060', 'MONTROND FRAT.', 42210, 'MONTROND-LES-BAINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042062', 'ST ROMAIN EN JAREZ JA', 42800, 'SAINT-ROMAIN-EN-JAREZ', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042063', 'JEUNESSE DU JAREZ', 42400, 'SAINT-CHAMOND', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042069', 'ST ANDRE SPORT', 42210, 'MONTROND-LES-BAINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042070', 'ST CHAMOND BASKET VALLEE DU GIER', 42400, 'SAINT-CHAMOND', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042072', 'ST PRIEST EN JAREZ BASKET', 42270, 'SAINT-PRIEST-EN-JAREZ', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042074', 'VILLARS BASKET', 42390, 'VILLARS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042078', 'L''HORME US', 42152, 'HORME', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042081', 'FIRMINY CHAZEAU-FAYOL AL', 42700, 'FIRMINY', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042084', 'ST MARCELLIN BC', 42680, 'SAINT-MARCELLIN-EN-FOREZ', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042085', 'ST GENEST MALIFAUX BC', 42660, 'SAINT-GENEST-MALIFAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042090', 'ST HEAND BC', 42570, 'SAINT-HEAND', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042091', 'SAINT-CHAMOND ANDREZIEUX BOUTHEON BASKET - SCABB', 42160, 'ANDREZIEUX-BOUTHEON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042095', 'BASKET CLUB VALLEE DU JARNOSSIN', 42460, 'COUTOUVRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042096', 'BRIENNON CDJ', 42720, 'BRIENNON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042099', 'CHARLIEU AL', 42190, 'CHARLIEU', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042100', '2F CAMPS BASKET', 42000, 'SAINT-ETIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042104', 'CREMEAUX BC', 42260, 'CREMEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042105', 'CUINZIER JARNOSSE BASKET', 42460, 'CUINZIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042108', 'FOURNEAUX CS', 42470, 'FOURNEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042113', 'LAGRESLE ETOILE', 42460, 'LA GRESLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042114', 'LA PACAUDIERE BC', 42310, 'LA PACAUDIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042115', 'LE CERGNE JA', 42460, 'LE CERGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042117', 'LE COTEAU PLAINES', 42120, 'LE COTEAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042119', 'LENTIGNY US', 42155, 'LENTIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042120', 'MABLY CLP', 42300, 'MABLY', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042121', 'MARS JA', 42750, 'MARS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042123', 'MONTAGNY BC', 42840, 'MONTAGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042124', 'NEULISE AL', 42590, 'NEULISE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042126', 'BOISSET BC', 42120, 'SAINT-VINCENT-DE-BOISSET', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042128', 'PERREUX AIGLONS', 42120, 'PERREUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042133', 'RIORGES BC', 42153, 'RIORGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042137', 'ROANNE CHORALE', 42300, 'ROANNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042138', 'ROANNE BCV', 42300, 'ROANNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042143', 'STE COLOMBE AS', 42540, 'SAINTE-COLOMBE-SUR-GAND', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042144', 'SAIL LES BAINS AS', 42310, 'SAIL-LES-BAINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042148', 'VAL D ''AIX ELAN', 42260, 'SAINT-GERMAIN-LAVAL', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042149', 'ST GERMAIN LESPINASSE BASKET', 42640, 'SAINT-GERMAIN-LESPINASSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042151', 'ST JEAN ST MAURICE LES LOUPS', 42155, 'SAINT-JEAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042154', 'ST MARTIN/ESTREAUX AS', 42620, 'SAINT-MARTIN-D''ESTREAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042156', 'SORNIN BC', 42190, 'SAINT-NIZIER-SOUS-CHARLIEU', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042158', 'ST ROMAIN LA MOTTE AS', 42640, 'SAINT-ROMAIN-LA-MOTTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042159', 'ST SYMPHORIEN DE LAY AS', 42470, 'SAINT-SYMPHORIEN-DE-LAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042160', 'ST VICTOR/RHINS ES', 42630, 'SAINT-VICTOR-SUR-RHINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042161', 'VILLEMONTAIS AS', 42155, 'VILLEMONTAIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042162', 'MONTCHAL VIOLAY BASKET', 42360, 'ESSERTINES-EN-DONZY', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042174', 'COMMELLE VERNAY BC', 42120, 'COMMELLE-VERNAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042176', 'BALBIGNY AL', 42510, 'BALBIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042181', 'AMBIERLE BC', 42820, 'AMBIERLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042187', 'VILLEREST BC', 42300, 'VILLEREST', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042194', 'CHAVANAY BASKET AS', 42410, 'CHAVANAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042196', 'LORETTE BC', 42420, 'LORETTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042201', 'GROUPE SPORTIF SAINT LEGER POUILLY', 42155, 'POUILLY-LES-NONAINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042202', 'ST DENIS DE CABANNE ABC', 42750, 'SAINT-DENIS-DE-CABANNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042205', 'LE COTEAU BASKET', 42120, 'LE COTEAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL')),
    ('ARA0042206', 'COTE ROANNAISE ALLIANCE BASKET', 42370, 'RENAISON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE DE BASKET-BALL'));

-- from clubs/43_haute_loire.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id) 
VALUES
    ('ARA0043001', 'BASKET-BALL BRIVADOIS', 43100, 'BRIOUDE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043004', 'ASM BASKET LE PUY EN VELAY 43 AUVERGNE', 43000, 'LE PUY-EN-VELAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043005', 'ASSOCIATION KOZAN BASKETBALL', 43750, 'VALS-PRES-LE-PUY', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043006', 'GRAZAC / LAPTE A S', 43200, 'LAPTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043007', 'DESIDERIEN SEAUVOIS B C', 43140, 'SEAUVE-SUR-SEMENE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043008', 'SIGOLENOIS BC', 43600, 'SAINTE-SIGOLENE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043009', 'BEAUZAC AVENIR BASKET', 43590, 'BEAUZAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043010', 'BC AUREC', 43110, 'AUREC-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043011', 'ST MAURICE DE LIGNON BLEUETS', 43200, 'SAINT-MAURICE-DE-LIGNON', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043016', 'DUNIERES B C', 43220, 'DUNIERES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043017', 'BAS EN BASSET LIGERIENNE BASKET', 43210, 'BAS-EN-BASSET', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043018', 'TENCE B C', 43190, 'TENCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043019', 'MONISTROL BASKET U.S.', 43120, 'MONISTROL-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043021', 'ST PAL DE MONS VIGILANTE', 43620, 'SAINT-PAL-DE-MONS', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043022', 'ST FERREOL PT SALOMON AS', 43330, 'SAINT-FERREOL-D''AUROURE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043025', 'CD 43 HORS ASSOCIATION', 43000, 'LE PUY-EN-VELAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043026', 'ST PAULIEN SPBCPA', 43350, 'SAINT-PAULIEN', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL')),
    ('ARA0043030', 'ST JUST MALMONT BC', 43240, 'SAINT-JUST-MALMONT', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-LOIRE DE BASKET-BALL'));

-- from clubs/44_loire_atlantique.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id) VALUES
    ('PDL0044001', 'BASKET CLUB BASSE LOIRE', '44640', 'SAINT-JEAN-DE-BOISEAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044004', 'REZE BASKET 44', '44400', 'REZE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044005', 'AL CHAUVINIERE', '44000', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044006', 'ALC CHATEAUBRIANT', '44110', 'CHATEAUBRIANT', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044007', 'BOUGUENAIS BASKET', '44340', 'BOUGUENAIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044008', 'AL CREMETTERIE ST HERBLAIN', '44800', 'SAINT-HERBLAIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044010', 'LES FRECHETS BC ST NAZAIRE', '44600', 'SAINT-NAZAIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044011', 'AL GARENNES NANTES', '44000', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044015', 'ALPC MOULIN NANTES BASKET', '44000', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044016', 'JEANNE D''ARC DE BESNE', '44160', 'BESNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044019', 'PONTCHATEAU BASKET CLUB', '44160', 'PONTCHATEAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044020', 'ASSOCIATION BC DERVALAIS', '44590', 'DERVAL', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044021', 'ASC ST MEDARD DE DOULON NANTES', '44300', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044026', 'ESCOUBLACAISE', '44500', 'LA BAULE-ESCOUBLAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044028', 'ASC TRIGNAC', '44570', 'TRIGNAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044031', 'Union Sportive de Basket de Frossay et Saint-Viaud', '44320', 'SAINT-VIAUD', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044033', 'AS SAINT ROGATIEN NANTES', '44000', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044034', 'NANTES BREIL BASKET', '44000', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044037', 'BASKET SUD LOIRE', '44690', 'SAINT-FIACRE-SUR-MAINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044038', 'SEVRE ET MAINE BASKET', '44690', 'MAISDON-SUR-SEVRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044040', 'VERTOU BASKET', '44120', 'VERTOU', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044046', 'EB SORINIERES', '44840', 'LES SORINIERES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044047', 'ELAN DE GORGES', '44190', 'GORGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044049', 'OUDON BASKET', '44521', 'OUDON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044053', 'ETOILE ARTHONNAISE', '44320', 'CHAUMES-EN-RETZ', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044056', 'NOTRE DAME BASKET CLUB', '44130', 'NOTRE-DAME-DES-LANDES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044057', 'VAIR-SUR-LOIRE BASKET', '44150', 'ANETZ', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044059', 'GARS D''HERBAUGES BOUAYE', '44830', 'BOUAYE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044060', 'GAZELLES BLINOISES', '44130', 'BLAIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044061', 'SUD RETZ BASKET', '44270', 'MACHECOUL', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044063', 'NANTES BASKET HERMINE (NBH)', '44000', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044064', 'ESPERANCE MOUETTE BASKET CLUB', '44510', 'LE POULIGUEN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044065', 'LA LEGEENNE', '44650', 'LEGE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044066', 'NOZAY OMNISPORT', '44170', 'NOZAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044067', 'ORVAULT SPORTS BASKET', '44700', 'ORVAULT', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044068', 'PAMPRES VALLETAIS', '44330', 'VALLET', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044070', 'SAINTE LUCE BASKET', '44980', 'SAINTE-LUCE-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044071', 'RC DONGES', '44480', 'DONGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044072', 'SAINT ANDRE BASKET BALL', '44117', 'SAINT-ANDRE-DES-EAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044073', 'SAINT CYR BASKET HERBIGNAC', '44410', 'HERBIGNAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044075', 'LAC ET TENU BASKET', '44270', 'SAINT-MEME-LE-TENU', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044076', 'PORT SAINT MARS BASKET', '44680', 'SAINT-MARS-DE-COUTAIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044078', 'CSP RETZ BASKET', '44320', 'SAINT-PERE-EN-RETZ', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044079', 'EN - Guérande / Basket Sud Vilaine', '44350', 'GUERANDE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044081', 'BASKET CLUB HERICOIS', '44810', 'HERIC', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044082', 'CHOLTIERE PAULX MER MORTE', '44270', 'PAULX', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044083', 'STEPHANOISE MONTOIR DE BRETAGNE', '44550', 'MONTOIR-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044085', 'MONTBERT GENESTON LE BIGNON B.', '44140', 'GENESTON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044086', 'GUERANDE BASKET', '44350', 'GUERANDE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044087', 'CARQUEFOU BASKET', '44470', 'CARQUEFOU', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044088', 'US PONT SAINT MARTIN BASKET', '44860', 'PONT-SAINT-MARTIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044089', 'GRAND LIEU BASKET', '44310', 'SAINT-PHILBERT-DE-GRAND-LIEU', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044090', 'US STE REINE DE BRETAGNE', '44780', 'MISSILLAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044091', 'USVR VARADES BASKET', '44370', 'VARADES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044093', 'VAILLANTE IMMACULEE ST NAZAIRE', '44600', 'SAINT-NAZAIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044096', 'I.B.C. - Indre Basket Club', '44610', 'INDRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044102', 'SAINT SEBASTIEN BASKET CLUB', '44230', 'SAINT-SEBASTIEN-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044103', 'ASSOCIATION SPORTIVE CORDEMAISIENNE', '44360', 'CORDEMAIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044104', 'BEAUJOIRE BASKET CLUB', '44300', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044106', 'LOIRE & SILLON BASKET CLUB', '44360', 'SAINT-ETIENNE-DE-MONTLUC', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044108', 'ASPTT NANTES', '44100', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044111', 'CS AIGREFEUILLE REMOUILLE BASKET', '44140', 'REMOUILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044112', 'EN - AS Brains / BC Basse Loire', '44830', 'BRAINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044113', 'AMICALE SAINT LYPHARD', '44410', 'SAINT-LYPHARD', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044116', 'SAINT BREVIN BASKET CLUB', '44250', 'SAINT-BREVIN-LES-PINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044121', 'CHABOSSIERE OCB', '44220', 'COUERON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044122', 'Association Sportive Sion Lusanger', '44590', 'SION-LES-MINES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044123', 'ABC DES TROIS RIVIERES', '44530', 'SAINT-GILDAS-DES-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044126', 'ES PORNICHET', '44380', 'PORNICHET', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044129', 'ESPERANCE SPORTIVE DE CROSSAC', '44160', 'CROSSAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044133', 'ETOILE DE CLISSON BASKET', '44190', 'CLISSON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044134', 'OPEN DE L''ERDRE', '44390', 'NORT-SUR-ERDRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044135', 'ETOILE SPORTIVE DE COUERON', '44220', 'COUERON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044138', 'GROUPE ST VINCENT LE PALLET', '44330', 'LE PALLET', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044139', 'HERBADILLA LA CHEVROLIERE', '44118', 'LA CHEVROLIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044140', 'HIRONDELLE S JULIEN CONCELLES', '44450', 'SAINT-JULIEN-DE-CONCELLES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044141', 'NANTES SULLY BASKET', '44000', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044142', 'BASKET CLUB LOROUX LANDREAU - BC2L', '44430', 'LE LOROUX-BOTTEREAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044143', 'BASKET CLUB DU BRIVET', '44160', 'SAINTE-ANNE-SUR-BRIVET', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044145', 'LES MONTAGNARDS LA MONTAGNE', '44620', 'LA MONTAGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044146', 'NORT SUR ERDRE AC LES TOUCHES BASKET', '44390', 'NORT-SUR-ERDRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044147', 'PAZENNAIS BASKET CLUB', '44680', 'SAINTE-PAZANNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044148', 'PAYS D''ANCENIS BASKET', '44150', 'ANCENIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044150', 'ST NAZAIRE OLYMPIQUE SPORTIF', '44600', 'SAINT-NAZAIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044152', 'ST SAUVEUR BOUVRON', '44130', 'BOUVRON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044154', 'EN - Etoile Arthonnaise / Rouans BC', '44320', 'CHAUMES-EN-RETZ', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044155', 'SAINT JOACHIM BRIERE SPORT', '44720', 'SAINT-JOACHIM', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044156', 'SAUTRON BASKET CLUB', '44880', 'SAUTRON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044157', 'SIMILIENNE NANTES', '44000', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044159', 'SPORTING CLUB ORVAULT', '44700', 'ORVAULT', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044161', 'FALLERON TOUVOIS BASKET CLUB', '44650', 'TOUVOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044162', 'SAINT HERBLAIN BASKET CLUB', '44800', 'SAINT-HERBLAIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044164', 'US CHAPELLE BASSE MER', '44450', 'LA CHAPELLE-BASSE-MER', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044165', 'UNION BASKET LOGNE', '44310', 'SAINT-COLOMBAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044167', 'ASSOCIATION SPORTIVE BASKET GETIGNE BOUSSAY', '44190', 'GETIGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044169', 'ROUANS BASKET CLUB', '44640', 'ROUANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044171', 'US THOUAREENNE THOUARE', '44470', 'THOUARE-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044172', 'PETIT MARS BASKET CLUB', '44390', 'PETIT-MARS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044175', 'AS SAFFREENNE', '44390', 'SAFFRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044176', 'ELAN FAYEN FAY DE BRETAGNE', '44130', 'FAY-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044178', 'AS GRANDCHAMP BASKET', '44119', 'GRANDCHAMPS-DES-FONTAINES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044179', 'AS HEULINOISE BASKET BALL', '44330', 'LA CHAPELLE-HEULIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044181', 'ALS PLAISANCE SAINT NAZAIRE', '44600', 'SAINT-NAZAIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044184', 'ASL SAINT MALO DE GUERSAC', '44550', 'MONTOIR-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044185', 'JOUE BASKET', '44440', 'JOUE-SUR-ERDRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044189', 'GOLF BASKET CLUB HERBLINOIS', '44800', 'SAINT-HERBLAIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044190', 'BASKET CLUB BASSE GOULAINE', '44115', 'BASSE-GOULAINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044191', 'ERDRE BASKET CLUB', '44240', 'LA CHAPELLE-SUR-ERDRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044192', 'BASKET CLUB DE FEGREAC', '44460', 'FEGREAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044194', 'SAINT MICHEL JANS', '44170', 'JANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044197', 'AL OUCHE DINIER REZE', '44400', 'REZE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044200', 'BC CORSEPTIN', '44560', 'CORSEPT', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044203', 'AS LA MADELEINE GUERANDE', '44350', 'GUERANDE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044208', 'CLUB BASKET COUFFE', '44521', 'COUFFE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044214', 'TREILLIERES BASKET CLUB', '44119', 'TREILLIERES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044215', 'LE GAVRE BASKET CLUB', '44130', 'LE GAVRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044217', 'UNION DU SILLON BASKET CLUB', '44750', 'CAMPBON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044219', 'RED BASKET CLUB MARSIEN', '44850', 'SAINT-MARS-DU-DESERT', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044220', 'MOISDON BASKET', '44520', 'MOISDON-LA-RIVIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044221', 'ATLANTIQUE BC TURBALLAIS', '44420', 'LA TURBALLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044223', 'CD44 – HORS ASSOCIATION – LOIRE ATLANTIQUE', '44980', 'SAINTE-LUCE-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044225', 'AS BRAINS BASKET', '44830', 'BRAINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044230', 'BASKET CLUB SUCE/ERDRE', '44240', 'SUCE-SUR-ERDRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044235', 'FOYER DES JEUNES BASKETTEURS DE MALVILLE', '44260', 'MALVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044238', 'CELLIER MAUVES BASKET CLUB', '44850', 'LE CELLIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044241', 'ATLANTIQUE BC NAZAIRIEN', '44600', 'SAINT-NAZAIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044245', 'CASSON BASKET CLUB', '44390', 'CASSON', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044250', 'PORNIC BASKET ST MICHEL', '44210', 'PORNIC', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044251', 'LA PLANCHE VIEILLEVIGNE BASKET', '44116', 'VIEILLEVIGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044304', 'ATC BASKETBALL', '44100', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044330', 'BASKET CLUB REZE', '44400', 'REZE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044331', 'EN - Ste Luce / Carquefou', '44980', 'SAINTE-LUCE-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044332', 'EN - Jans / Derval', '44170', 'JANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044333', 'EN - Besné / Montoir de Bretagne', '44160', 'BESNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044334', 'EN - Loroux Landreau / Hirondelle St Julien Concelles', '44430', 'LE LOROUX-BOTTEREAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044335', 'EN - ASL St Malo de Guersac / Stéphanoise Montoir', '44550', 'MONTOIR-DE-BRETAGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044336', 'Pôle Espoirs PDL', '44800', 'SAINT-HERBLAIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044337', 'EN - Beaujoire BC / Erdre BC', '44300', 'NANTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL')),
    ('PDL0044631', 'BASKET CLUB MISSILLAC LA CHAPELLE', '44780', 'MISSILLAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA LOIRE-ATLANTIQUE DE BASKET-BALL'));

-- from clubs/45_loiret.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('CVL0045001', 'CD45 HORS ASSOCIATION - LOIRET', '45770', 'SARAN', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045002', 'AMILLY J3 SPORTS', '45200', 'AMILLY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045004', 'ASCHERES LE MARCHE A.S.', '45170', 'ASCHERES-LE-MARCHE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045006', 'BC BALGENCIEN', '45130', 'MEUNG-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045008', 'ENTENTE BEAUNE BOISCOMMUN', '45340', 'BEAUNE-LA-ROLANDE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045010', 'BOIGNY BC', '45760', 'BOIGNY-SUR-BIONNE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045012', 'BRIARE CSC', '45250', 'BRIARE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045014', 'CHAINGY BASKET', '45380', 'CHAINGY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045017', 'BC CASTELNEUVIEN', '45110', 'CHATEAUNEUF-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045019', 'ASB CHATILLON SUR LOIRE', '45360', 'CHATILLON-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045020', 'CHECY JEUNESSE SPORTIVE', '45430', 'CHECY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045021', 'CHEVILLY AS', '45520', 'CHEVILLY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045023', 'CLERY SAINT ANDRE AAS', '45370', 'CLERY-SAINT-ANDRE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045026', 'AS DAMPIERRE OUZOUER SUR LOIRE', '45570', 'DAMPIERRE-EN-BURLY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045028', 'ABC DONNERY', '45450', 'DONNERY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045029', 'ABEILLE DE GIEN', '45500', 'GIEN', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045032', 'US FAY BASKET', '45450', 'FAY-AUX-LOGES', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045033', 'ENTENTE SPORTIVE GATINAISE', '45210', 'FERRIERES', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045034', 'CJF LES AUBRAIS', '45400', 'FLEURY-LES-AUBRAIS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045035', 'AMICALE GIDY BASKET', '45520', 'GIDY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045036', 'CMPJM INGRE BASKET', '45140', 'INGRE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045037', 'AS LOURY', '45470', 'LOURY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045039', 'AS JOUY LE POTIER', '45370', 'JOUY-LE-POTIER', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045040', 'ACB LA CHAPELLE', '45380', 'LA CHAPELLE-SAINT-MESMIN', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045041', 'US LA FERTE BASKET', '45240', 'LA FERTE-SAINT-AUBIN', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045042', 'CO SOLOGNOT MARCILLY', '45240', 'MARCILLY-EN-VILLETTE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045044', 'USM MONTARGIS', '45200', 'MONTARGIS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045045', 'AMICALE NEUVILLE AUX BOIS', '45170', 'NEUVILLE-AUX-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045046', 'MALESHERBES SPORTING CLUB', '45330', 'MALESHERBES', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045048', 'USM OLIVET', '45160', 'OLIVET', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045049', 'EVEIL SPORTIF D''ORMES BASKET BALL', '45140', 'ORMES', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045050', 'MEUNG SUR LOIRE LA MAGDUNOISE', '45130', 'MEUNG-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045051', 'ABC SAINT JEAN DE BRAYE 45', '45800', 'SAINT-JEAN-DE-BRAYE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045056', 'A.L. LA SOURCE BASKET', '45100', 'ORLEANS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045057', 'ASPTT ORLEANS', '45100', 'SOURCE (la)', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045058', 'ORLEANS LOIRET BASKET ASSOCIATION', '45100', 'ORLEANS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045059', 'ORLEANS PIEDS BLANCS LES AYDES', '45000', 'ORLEANS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045063', 'PUISEAUX AS', '45390', 'PUISEAUX', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045065', 'BASKET CLUB DE PANNES', '45700', 'PANNES', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045066', 'BC PATAY', '45310', 'PATAY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045067', 'PITHIVIERS BC', '45300', 'PITHIVIERS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045068', 'US POILLY LEZ GIEN', '45500', 'POILLY-LEZ-GIEN', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045072', 'USM SARAN', '45770', 'SARAN', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045074', 'CSA SAINT AY', '45130', 'SAINT-AY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045076', 'ST CYR US BASKET', '45150', 'DARVOY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045077', 'SAINT DENIS DE L''HOTEL ASM', '45550', 'SAINT-DENIS-DE-L''HOTEL', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045078', 'LA MONTJOIE SAINT DENIS EN VAL', '45560', 'SAINT-DENIS-EN-VAL', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045079', 'NECOTIN BASKETBALL ASSOCIATION', '45000', 'ORLEANS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045082', 'BASKET CLUB SAINT JEAN DE LA RUELLE', '45140', 'SAINT-JEAN-DE-LA-RUELLE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045084', 'SAINT JEAN LE BLANC BASKET', '45650', 'SAINT-JEAN-LE-BLANC', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045087', 'US SANDILLON', '45640', 'SANDILLON', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045089', 'ASB SEMOY', '45400', 'SEMOY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045090', 'SERMAISES BASKET CLUB', '45300', 'SERMAISES', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045091', 'SULLY BASKET', '45600', 'SULLY-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045094', 'TRAINOU AS', '45450', 'FAY-AUX-LOGES', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045099', 'VITRY AUX LOGES USM', '45530', 'VITRY-AUX-LOGES', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045109', 'UNION SPORTIVE OLIVET-SARAN', '45750', 'SAINT-PRYVE-SAINT-MESMIN', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045113', 'TONNERRE BASKET-BALL', '45100', 'ORLEANS', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045118', 'TIGY BASKET', '45510', 'TIGY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045121', 'ENT CHATILLON-POILLY', '45360', 'CHATILLON-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045122', 'POLE ESPOIRS M LIGUE CVL', '45770', 'SARAN', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045123', 'AS CHAINGY Basket - ACB LA CHAPELLE', '45380', 'CHAINGY', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL')),
    ('CVL0045205', 'MJC VILLEMANDEUR', '45700', 'VILLEMANDEUR', (SELECT id FROM committees WHERE name = 'COMITE DU LOIRET DE BASKET-BALL'));

-- from clubs/46_lot.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('46000', 'OCC0046001', 'CT QUERCY GARONNE HORS ASSOCIATION', 'CAHORS', (SELECT id FROM committees WHERE name = 'COMITE DU LOT de BASKET-BALL')),
    ('46000', 'OCC0046003', 'CAHORSAUZET BASKET', 'CAHORS', (SELECT id FROM committees WHERE name = 'COMITE DU LOT de BASKET-BALL')),
    ('46090', 'OCC0046007', 'ESPERE - BASKET', 'ESPERE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT de BASKET-BALL')),
    ('46220', 'OCC0046009', 'PRAYSSAC BASKET CLUB', 'PRAYSSAC', (SELECT id FROM committees WHERE name = 'COMITE DU LOT de BASKET-BALL')),
    ('46800', 'OCC0046011', 'MONTCUQ BASKET', 'MONTCUQ', (SELECT id FROM committees WHERE name = 'COMITE DU LOT de BASKET-BALL')),
    ('46090', 'OCC0046022', 'PRADINES LOT BASKET', 'PRADINES', (SELECT id FROM committees WHERE name = 'COMITE DU LOT de BASKET-BALL')),
    ('46230', 'OCC0046027', 'BASKET CLUB LALBENQUE', 'LALBENQUE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT de BASKET-BALL')),
    ('46340', 'OCC0046034', 'SALVIAC BASKET CLUB', 'SALVIAC', (SELECT id FROM committees WHERE name = 'COMITE DU LOT de BASKET-BALL')),
    ('46230', 'OCC0046036', 'Entente LALBENQUE MONTPEZAT', 'LALBENQUE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT de BASKET-BALL')),
    ('46090', 'OCC0046038', 'Entente Espère Prayssac', 'ESPERE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT de BASKET-BALL'));

-- from clubs/47_lot_et_garonne.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('NAQ0047001', 'COMITE DEPARTEMENTAL DE BASKET DE LOT-ET-GARONNE', '47000', 'AGEN', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047003', 'AMICALE LAIQUE DE TOURNON', '47370', 'TOURNON-D''AGENAIS', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047004', 'US LEVIGNAC STE COLOMBE DURAS', '47120', 'LEVIGNAC-DE-GUYENNE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047006', 'BASKET LAROQUE', '47340', 'LAROQUE-TIMBAUT', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047007', 'COP BASKET', '47480', 'PONT-DU-CASSE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047015', 'ELAN SPORTIF BOE / BON ENCONTRE', '47550', 'BOE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047017', 'LES MIMOSAS BRUCHOIS', '47130', 'BRUCH', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047020', 'JIL COLAYRAC BASKET', '47450', 'COLAYRAC-SAINT-CIRQ', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047023', 'US FRANCESCAS', '47600', 'FRANCESCAS', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047026', 'AVENIR GRANDFONDS SPORTIF', '47240', 'CASTELCULIER', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047027', 'BC DES TOLZAC GRATELOUP', '47400', 'GRATELOUP', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047028', 'ASSOCIATION SPORTIVE LAFITTOISE BASKET', '47320', 'LAFITTE-SUR-LOT', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047030', 'SECTION BASKET KLUB LAGARRIGUE BASKETBALL', '47190', 'LAGARRIGUE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047035', 'BC LAYRAC ASTAFFORT', '47390', 'LAYRAC', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047037', 'GARONNE AVENIR BASKET DU MARMANDAIS', '47180', 'MEILHAN-SUR-GARONNE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047038', 'BASKET CLUB MEZIN MONCRABEAU', '47170', 'MEZIN', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047045', 'AL PASSAGE BASKET', '47520', 'LE PASSAGE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047046', 'ASSOCIATION LA PENNOISE', '47140', 'PENNE-D''AGENAIS', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047048', 'BC PORTAIS LAURENTAIS', '47130', 'PORT-SAINTE-MARIE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047049', 'U S PUYMIROLAISE', '47270', 'PUYMIROL', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047050', 'BASKET BALL BAZEILLAIS', '47180', 'SAINTE-BAZEILLE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047053', 'US STE GEMME LA VAILLANTE', '47250', 'SAINTE-GEMME-MARTAILLAC', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047056', 'US SAMAZANAISE BASKET', '47250', 'SAMAZAN', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047057', 'BASKET FONGRAVE CASTELMORON', '47260', 'FONGRAVE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047058', 'LES LILAS SERIGNACAIS', '47310', 'SERIGNAC-SUR-GARONNE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047059', 'BASKET SEYCHOIS BARTHELEMEEN', '47350', 'SEYCHES', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047061', 'UNION SPORTIVE TEMPLAISE', '47110', 'TEMPLE-SUR-LOT', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047062', 'TONNEINS BASKET CLUB', '47400', 'TONNEINS', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047065', 'ENTENTE USLSCD - CTC VAL DE GARONNE', '47120', 'LEVIGNAC-DE-GUYENNE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047067', 'BEYSSAC BEAUPUY MARMANDE', '47200', 'MARMANDE', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047068', 'BOUDY BASKET CLUB', '47290', 'BOUDY-DE-BEAUREGARD', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047069', 'BASKET CLUB PUJOLAIS', '47300', 'PUJOLS', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047070', 'BASKET CUZORN FUMEL LIBOS', '47500', 'CUZORN', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047072', 'AS FAUILLETAISE', '47400', 'FAUILLET', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047073', 'ENTENTE FRANCESCAS - CTC ABA', '47600', 'FRANCESCAS', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047077', 'AMICALE LAIQUE PRAYSSAS OLYMPIQUE', '47360', 'PRAYSSAS', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047080', 'FOULAYRONNES BASKET BALL', '47510', 'FOULAYRONNES', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047084', 'CLAIRAC BASKET CLUB', '47320', 'CLAIRAC', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047089', 'LES CERFS DE VARES B.C.', '47400', 'VARES', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047090', 'ES DU BRUILHOIS BASKET', '47310', 'AUBIAC', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047095', 'VAL D''ALBRET BASKET', '47230', 'LAVARDAC', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047096', 'AMICALE LOISIRS CASTILLONNES BASKET', '47330', 'CAHUZAC', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047099', 'AGEN BASKET CLUB', '47000', 'AGEN', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL')),
    ('NAQ0047100', 'VILLENEUVE BASKET CLUB', '47300', 'VILLENEUVE-SUR-LOT', (SELECT id FROM committees WHERE name = 'COMITE DU LOT-ET-GARONNE DE BASKET-BALL'));

-- from clubs/48_lozere.sql
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

-- from clubs/49_maine_et_loire.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('PDL0049000', 'HORS ASSOCIATION - BARRAGE', '49130', 'PONTS-DE-CE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049001', 'CD 49 HORS ASSOCIATION', '49130', 'PONTS-DE-CE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049002', 'AUTHION ENTENTE BASKET', '49650', 'ALLONNES', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049004', 'ANDARD BRAIN', '49800', 'ANDARD', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049005', 'ANGERS JND', '49000', 'ANGERS', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049006', 'ANGERS ALJF', '49100', 'ANGERS', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049007', 'ANGERS ACBB BASKET', '49000', 'ANGERS', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049008', 'ANGERS NDC', '49100', 'ANGERS', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049009', 'ASSOCIATION VAL D''ERDRE AUXENCE BASKET', '49370', 'VAL D''ERDRE-AUXENCE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049010', 'OMBREE D''ANJOU BASKET', '49420', 'Ombrée d''Anjou', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049012', 'AVRILLE BASKET', '49240', 'AVRILLE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049014', 'BAUGE', '49150', 'BAUGE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049016', 'BEAUPREAU FIEF SAUVIN BASKET', '49600', 'BEAUPREAU EN MAUGES', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049020', 'BOTZ LA CHAPELLE', '49110', 'BOTZ-EN-MAUGES', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049023', 'BRIOLLAY', '49125', 'BRIOLLAY', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049024', 'BRISSAC AUBANCE BASKET', '49320', 'BRISSAC LOIRE AUBANCE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049026', 'CANTENAY EPINARD', '49460', 'CANTENAY-EPINARD', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049027', 'VAL HYROME BASKET', '49750', 'CHANZEAUX', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049028', 'ENVOL BASKET BECON ST CLEMENT', '49370', 'SAINT-CLEMENT-DE-LA-PLACE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049029', 'VERNANTES BASKET LOISIR', '49390', 'VERNANTES', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049031', 'CHALONNES SUR LOIRE BASKET', '49290', 'CHALONNES-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049032', 'CHAMP SUR LAYON', '49380', 'CHAMP-SUR-LAYON', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049033', 'CHAMPIGNE', '49330', 'Hauts d''Anjou (Les)', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049036', 'CHAPELLE ROUSSELIN', '49120', 'CHEMILLE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049037', 'CHATEAUNEUF SUR SARTHE', '49330', 'CHATEAUNEUF-SUR-SARTHE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049038', 'AUBRY CHAUDRON BASKET', '49110', 'CHAUDRON-EN-MAUGES', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049040', 'CHAZE SUR ARGOS', '49500', 'SEGRE-EN-ANJOU-BLEU', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049041', 'CHEMILLE', '49120', 'CHEMILLE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049043', 'CHOLET BASKET', '49300', 'CHOLET', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049045', 'CHOLET JF', '49300', 'CHOLET', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049048', 'CORNE BASKET', '49630', 'CORNE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049050', 'CORON/SALLE DE VIHIERS', '49690', 'CORON', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049051', 'ESBB ECLAIR ST BARTHELEMY', '49124', 'SAINT-BARTHELEMY-D''ANJOU', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049053', 'DENEE MOZE', '49610', 'MOZE-SUR-LOUET', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049054', 'DOUE LA FONTAINE', '49700', 'Doué-en-Anjou', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049055', 'ETRICHE BASKET', '49330', 'ETRICHE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049056', 'FAVERAYE MACHELLES', '49380', 'FAVERAYE-MACHELLES', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049057', 'FAYE D''ANJOU', '49380', 'FAYE-D''ANJOU', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049061', 'GREZ NEUVILLE', '49220', 'LION-D''ANGERS', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049063', 'JUB JALLAIS BASKET', '49510', 'JALLAIS', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049066', 'JUMELLIERE', '49120', 'CHEMILLE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049067', 'ELAN DES MAUGES', '49270', 'LANDEMONT', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049070', 'LONGUE ATHLETIC CLUB', '49160', 'LONGUE-JUMELLES', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049073', 'MARTIGNE BRIAND', '49540', 'MARTIGNE-BRIAND', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049074', 'MAULEVRIER', '49360', 'MAULEVRIER', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049077', 'STADE OLYMPIQUE CANDE LOIRE BASKET', '49440', 'LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049078', 'BMB - BEGROLLES LE MAY BASKET', '49122', 'BEGROLLES-EN-MAUGES', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049079', 'MONTREUIL BELLAY', '49260', 'MONTREUIL-BELLAY', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049080', 'EVRE BASKET CLUB', '49110', 'SAINT-PIERRE-MONTLIMART', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049081', 'Association loisirs et jeunesse de MORANNES', '49640', 'Morannes sur Sarthe-Daumeray', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049082', 'MURS ERIGNE BASKET CLUB', '49610', 'MURS-ERIGNE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049083', 'NEUVY EN MAUGES', '49120', 'NEUVY-EN-MAUGES', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049084', 'POITEVINIERE LE PIN', '49110', 'LE PIN-EN-MAUGES', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049085', 'PLESSIS GRAMMOIRE', '49124', 'PLESSIS-GRAMMOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049087', 'POMJEANNAIS BASKET CLUB', '49620', 'MAUGES SUR LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049088', 'PONTS DE CE BASKET', '49130', 'PONTS-DE-CE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049091', 'POUEZE', '49370', 'POUEZE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049093', 'PUY SAINT BONNET BASKET', '49300', 'LE PUY-SAINT-BONNET', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049095', 'ETOILE ANGERS BASKET', '49000', 'ANGERS', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049096', 'ROUSSAY VILLEDIEU', '49450', 'ROUSSAY', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049097', 'SAINT CHRISTOPHE DU BOIS', '49280', 'SAINT-CHRISTOPHE-DU-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049100', 'SAINTE GEMMES D''ANDIGNE', '49500', 'SEGRE-EN-ANJOU-BLEU', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049104', 'VIHIERS BASKET', '49310', 'LYS-HAUT-LAYON', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049108', 'SAINT LAURENT DE LA PLAINE', '49290', 'SAINT-LAURENT-DE-LA-PLAINE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049109', 'LAYON BASKET CLUB', '49380', 'BELLEVIGNE EN LAYON', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049110', 'SAINT MARTIN DU BOIS USJA', '49500', 'SAINT-MARTIN-DU-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049111', 'SAINT MATHURIN SAINT REMY', '49250', 'BEAUFORT-EN-VALLEE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049112', 'CERQUEUX SOMLOIRE ST PAUL LA PLAINE', '49360', 'LES CERQUEUX', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049113', 'MOINE BASKET CLUB', '49230', 'SAINT-GERMAIN-SUR-MOINE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049114', 'FUILETAIS REMYGEOIS BASKET', '49110', 'SAINT-REMY-EN-MAUGES', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049115', 'ELAN LIGERIEN BASKET', '49170', 'POSSONNIERE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049116', 'SAUMUR LOIRE BASKET 49', '49400', 'SAUMUR', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049117', 'VALLEE BASKET CLUB', '49250', 'BEAUFORT-EN-VALLEE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049119', 'SEGRE', '49500', 'SEGRE-EN-ANJOU-BLEU', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049120', 'SEGUINIERE (LA) ST LOUIS BASKET', '49280', 'SEGUINIERE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049121', 'SEICHES BASKET CLUB SBC', '49140', 'SEICHES-SUR-LE-LOIR', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049123', 'LOIR BASKET CLUB', '49140', 'VILLEVEQUE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049124', 'TESSOUALLE', '49280', 'TESSOUALLE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049126', 'GARENNES LOIRE BASKET CLUB 49 - GLBC 49', '49610', 'Garennes sur Loire (Les)', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049127', 'SEVRE BASKET A.S.', '49660', 'TORFOU', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049128', 'TOURMELAY BASKET', '49120', 'MELAY', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049130', 'TRELAZE BASKET', '49800', 'TRELAZE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049131', 'AVENIR TREMENTINES BASKET', '49340', 'TREMENTINES', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049134', 'VERN D''ANJOU - B. CLUB VERNOIS', '49220', 'VERN-D''ANJOU', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049136', 'VERNOIL', '49390', 'VERNOIL', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049138', 'YZERNAY', '49360', 'YZERNAY', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049143', 'SAINTE GEMMES SUR LOIRE', '49130', 'SAINTE-GEMMES-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049146', 'BASKET CLUB SAINT BARTHELEMY', '49124', 'SAINT-BARTHELEMY-D''ANJOU', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049147', 'SAINT AUGUSTIN DES BOIS', '49170', 'SAINT-GEORGES-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049149', 'ROSIERS', '49350', 'CHENEHUTTE-TREVES-CUNAULT', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049152', 'BEAUCOUZE', '49070', 'BEAUCOUZE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049156', 'TIERCE', '49125', 'TIERCE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049164', 'SAINT MACAIRE EN MAUGES', '49450', 'SEVREMOINE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049165', 'BOUCHEMAINE', '49080', 'BOUCHEMAINE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049166', 'MONTREUIL JUIGNE', '49460', 'MONTREUIL-JUIGNE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049170', 'SAINT ANDRE DE LA MARCHE BASKET', '49450', 'SAINT-ANDRE-DE-LA-MARCHE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049174', 'LONGUENEE BASKET CLUB', '49770', 'MEIGNANNE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049178', 'PLESSIS MACE', '49770', 'PLESSIS-MACE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049180', 'LAMBOISIERES-MARTIN BASKET', '49170', 'SAINT-LEGER-DES-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049183', 'SAINT SYLVAIN D''ANJOU BASKET', '49480', 'VERRIERES-EN-ANJOU', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049186', 'SAINT LEGER SOUS CHOLET', '49280', 'SAINT-LEGER-SOUS-CHOLET', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049194', 'MENITRE', '49250', 'MENITRE', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049195', 'ECOUFLANT', '49000', 'ECOUFLANT', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049197', 'ANGERS - UNION FEMININE BASKET 49', '49000', 'ANGERS', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL')),
    ('PDL0049198', 'FENEU - REBOND FANOUIN', '49460', 'FENEU', (SELECT id FROM committees WHERE name = 'COMITE DU MAINE-ET-LOIRE DE BASKET-BALL'));

-- from clubs/50_manche.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('NOR0050001', 'CD 50 HORS ASSOCIATION', '50120', 'EQUEURDREVILLE-HAINNEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050008', 'BASKET CLUB BRECEEN', '50370', 'BRECEY', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050009', 'CHERBOURG BASKET BALL', '50100', 'CHERBOURG-EN-COTENTIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050012', 'OCTEVILLE HAGUE SPORTS', '50130', 'OCTEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050013', 'PL TOURLAVILLE BASKET', '50110', 'TOURLAVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050015', 'ABC/APTB', '50750', 'SAINTE-SUZANNE-SUR-VIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050016', 'SAINT MICHEL D''AVRANCHES', '50300', 'AVRANCHES', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050017', 'SAINT MICHEL DE COUTANCES BB', '50200', 'COUTANCES', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050018', 'STADE SAINT LOIS BASKET', '50000', 'SAINT-LO', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050019', 'U.S. T. BASKET EQUEURDREVILLE', '50120', 'EQUEURDREVILLE-HAINNEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050021', 'UNION SPORTIVE LA GLACERIE', '50470', 'GLACERIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050025', 'AGNEAUX BASKET CLUB', '50750', 'SAINTE-SUZANNE-SUR-VIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050026', 'BASKET CLUB MORTAIN', '50140', 'MORTAIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050030', 'BC FLAMANVILLE LES PIEUX', '50340', 'PIEUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050031', 'ASSUN BASKET CLUB DE LA HAGUE', '50460', 'URVILLE-NACQUEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050032', 'GRANVILLE BASKET CLUB', '50400', 'GRANVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050035', 'LA VALOGNAISE BASKET', '50700', 'VALOGNES', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050038', 'ASS OMNI CANTONALE ST JAMES', '50240', 'SAINT-JAMES', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050039', 'PERCY TESSY BASKET', '50410', 'PERCY', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL')),
    ('NOR0050043', 'POINTE COTENTIN BASKET', '50330', 'SAINT-PIERRE-EGLISE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MANCHE DE BASKET-BALL'));

-- from clubs/51_marne.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('GES0051001', 'CD51 – HORS ASSOCIATION - MARNE', '51100', 'REIMS', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051002', 'AMICALE DES JEUNES DE BETHENY', '51450', 'BETHENY', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051003', 'REIMS UNIVERSITE CLUB BASKET', '51100', 'REIMS', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051004', 'AVENIR SPORTIF COURTISOLS BASKET', '51460', 'COURTISOLS', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051007', 'ASPTT DE CHALONS EN CHAMPAGNE', '51000', 'CHALONS EN CHAMPAGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051008', 'AS SAINT BRICE COURCELLES', '51370', 'SAINT-BRICE-COURCELLES', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051009', 'CAD MOURMELON BASKETBALL', '51400', 'MOURMELON-LE-GRAND', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051010', 'ENTENTE GAILLARDE MUIZONNAISE', '51140', 'MUIZON', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051011', 'ESPE BASKET CHALONS EN CHAMPAGNE', '51000', 'CHALONS EN CHAMPAGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051012', 'EVEIL RECY SAINT MARTIN BASKET', '51520', 'RECY', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051013', 'GAULOISE DE VITRY LE FRANCOIS', '51300', 'VITRY-LE-FRANCOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051014', 'LA FERTONNE FERE-CHAMPENOISE', '51230', 'FERE-CHAMPENOISE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051015', 'REIMS CHAMPAGNE BASKET', '51100', 'REIMS', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051017', 'CHAMPAGNE BASKET FEMININ', '51100', 'REIMS', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051018', 'AVENIR DE MONTMIRAIL', '51120', 'CHARLEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051019', 'UNION SPORTIVE DE SEZANNE', '51120', 'SEZANNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051021', 'ASSOCIATION CORMONTREUIL CHAMPAGNE BASKET', '51350', 'CORMONTREUIL', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051022', 'AS AMATEUR TINQUEUX BASKET', '51430', 'TINQUEUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051024', 'F-J-E-P- BASKET DE BAZANCOURT', '51110', 'BAZANCOURT', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051028', 'UNION SPORTIVE FISMOISE ARDRE et VESLE', '51170', 'FISMES', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051030', 'B-C TAISSY SAINT LEONARD', '51500', 'TAISSY', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051031', 'AMICALE BASKET SPARNACIENNE', '51530', 'PIERRY', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051032', 'CLUB OMNISPORTS DE SARRY', '51520', 'SARRY', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051035', 'E- L-WITRY LES REIMS BASKET', '51420', 'WITRY-LÈS-REIMS', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051038', 'AMICALE SPORTIVE TARDENOISE BASKET', '51170', 'VILLE-EN-TARDENOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051042', 'ESPERANCE REMOISE BASKET BALL', '51100', 'REIMS', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051044', 'CAMP BASKET CHAMPARDENNAIS', '51000', 'CHALONS EN CHAMPAGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051049', 'ACADEMIE BASKET DU GRAND REIMS', '51100', 'REIMS', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051062', 'Entente Saint Brice / Taissy', '51370', 'SAINT-BRICE-COURCELLES', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL')),
    ('GES0051094', 'UNION CHAMPAGNE CHALONS REIMS BASKET', '51000', 'CHALONS EN CHAMPAGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARNE DE BASKET-BALL'));

-- from clubs/52_haute_marne.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('52000', 'GES0052503', 'ENTENTE CHAUMONTAISE AC BASKET', 'CHAUMONT', (SELECT id FROM committees WHERE name = 'COMITE DE L''HAUTE-MARNE DE BASKET-BALL')),
    ('52100', 'GES0052507', 'SAINT DIZIER BASKET', 'SAINT-DIZIER', (SELECT id FROM committees WHERE name = 'COMITE DE L''HAUTE-MARNE DE BASKET-BALL')),
    ('52130', 'GES0052508', 'AS BASKET WASSEYEN', 'ATTANCOURT', (SELECT id FROM committees WHERE name = 'COMITE DE L''HAUTE-MARNE DE BASKET-BALL')),
    ('52200', 'GES0052509', 'LANGRES BASKET CLUB', 'LANGRES', (SELECT id FROM committees WHERE name = 'COMITE DE L''HAUTE-MARNE DE BASKET-BALL'));

-- from clubs/53_mayenne.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('PDL0053002', 'STADE LAVALLOIS Basket', '53000', 'LAVAL', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053003', 'ARGENTRÉ US', '53210', 'ARGENTRE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053004', 'MONTSURS USCP', '53150', 'MONTSURS-SAINT CENERE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053005', 'CLUB BASKET CRAON', '53400', 'CRAON', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053006', 'LAVAL US', '53000', 'LAVAL', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053007', 'ST BERTHEVIN US Basket', '53940', 'SAINT-BERTHEVIN', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053008', 'VILLIERS CHARLEMAGNE US', '53170', 'VILLIERS-CHARLEMAGNE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053013', 'FORCE UNION SPORTIVE', '53260', 'FORCE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053016', 'LE HORPS AJ', '53640', 'HORPS', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053017', 'RENAZÉ Basket', '53800', 'RENAZE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053019', 'CD 53 HORS ASSOCIATION', '53000', 'LAVAL', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053020', 'BONCHAMP ES', '53960', 'BONCHAMP-LES-LAVAL', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053022', 'CHANGÉ US', '53810', 'CHANGE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053023', 'MESLAY Basket Club', '53170', 'MESLAY-DU-MAINE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053024', 'CHAILLAND SPORTS Basket', '53420', 'CHAILLAND', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053025', 'COSSÉ Avant Garde', '53230', 'COSSE-LE-VIVIEN', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053026', 'ÉVRON Alerte', '53600', 'EVRON', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053027', 'SUD MAYENNE BASKET', '53200', 'CHATEAU-GONTIER SUR MAYENNE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053028', 'SAINT PIERRE LA COUR BASKET - SPLC BASKET', '53410', 'SAINT-PIERRE-LA-COUR', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053030', 'QUELAINES ASB', '53360', 'QUELAINES-SAINT-GAULT', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053035', 'LOIRON BASKET', '53320', 'LOIRON-RUILLE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053036', 'LOUVERNÉ BC', '53950', 'LOUVERNE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053038', 'PRE EN PAIL US', '53140', 'PRE-EN-PAIL- SAINT SAMSON', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053039', 'ST PIERRE DES LANDES CS', '53500', 'SAINT-PIERRE-DES-LANDES', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053040', 'O''REGANS Club Basket', '53000', 'LAVAL', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053041', 'ERNÉENNE', '53500', 'ERNEE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053043', 'DAON BAC', '53200', 'DAON', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053047', 'QUELAINES COSSÉ', '53360', 'QUELAINES-SAINT-GAULT', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053049', 'LAVAL FRANCS ARCHERS', '53000', 'LAVAL', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053051', 'ST DENIS DE GASTINES JG', '53500', 'SAINT-DENIS-DE-GASTINES', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053052', 'AMBRIÈRES AS', '53300', 'AMBRIERES-LES-VALLEES', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053055', 'ENTENTE STADE LAVALLOIS - ENTRAMMES BASKETBALL', '53000', 'LAVAL', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053056', 'MAYENNAIS CA', '53100', 'MAYENNE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053057', 'SOULGE BASKET CLUB', '53210', 'SOULGE-SUR-OUETTE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053058', 'VLJBB', '53700', 'VILLAINES-LA-JUHEL', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053060', 'L''HUISSERIE BA', '53970', 'HUISSERIE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053061', 'ST OUEN Basket LE GENEST', '53410', 'SAINT-OUEN-DES-TOITS', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053062', 'ENTENTE SUD MAYENNE BASKET - MESLAY DU MAINE BASKET CLUB', '53200', 'CHATEAU-GONTIER SUR MAYENNE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053063', 'MARTIGNÉ Basket Club', '53470', 'MARTIGNE-SUR-MAYENNE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053065', 'BIERNÉ BOUÈRE BASKET', '53290', 'BIERNE LES VILLAGES', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053066', 'ENTRAMMES Basket Ball', '53260', 'ENTRAMMES', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053067', 'ENTENTE ENTRAMMES FORCÉ', '53260', 'ENTRAMMES', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053068', 'ENTENTE SPLC BASKET - ST OUEN', '53410', 'SAINT-PIERRE-LA-COUR', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053069', 'ENTENTE STADE LAVALLOIS - US CHANGÉ - ENTRAMMES BASKETBALL', '53000', 'LAVAL', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053071', 'ENTENTE SOULGÉ BC - ALERTE EVRON', '53210', 'SOULGE-SUR-OUETTE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL')),
    ('PDL0053072', 'ENTENTE US CHANGÉ - SOULGÉ BC', '53810', 'CHANGE', (SELECT id FROM committees WHERE name = 'COMITÉ DE LA MAYENNE DE BASKET-BALL'));

-- from clubs/54_meurthe_et_moselle.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('GES0054001', 'CD54 – HORS ASSOCIATION – MEURTHE ET MOSELLE', '54000', 'NANCY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054005', 'LES LYNX MAXEVILLOIS', '54320', 'MAXEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054006', 'BASKET-CLUB HOUDEMONT', '54180', 'HOUDEMONT', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054007', 'LAXOU BASKET CLUB', '54520', 'LAXOU', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054009', 'ASPTT NANCY TOMBLAINE', '54000', 'NANCY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054010', 'LA PORTE VERTE BASKET', '54420', 'SAULXURES-LES-NANCY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054011', 'SLUC NANCY BASKET ASSOCIATION', '54000', 'NANCY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054012', 'VANDOEUVRE BASKETBALL', '54500', 'VANDOEUVRE-LES-NANCY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054013', 'COS VILLERS LES NANCY', '54600', 'VILLERS-LES-NANCY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054014', 'BACCARAT RAON BASKET', '54120', 'BACCARAT', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054015', 'SAINT MARTIN BASKET BAYON', '54290', 'BAYON', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054016', 'AC BLAINVILLE DAMELEVIERES', '54360', 'BLAINVILLE-SUR-L''EAU', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054017', 'BASKET NOMENY', '54610', 'NOMENY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054018', 'NANCY BASKET CONVIVIALITE', '54000', 'NANCY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054019', 'OMNI SPORTS FROUARD POMPEY', '54390', 'FROUARD', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054020', 'DOMBASLE BASKET', '54110', 'DOMBASLE-SUR-MEURTHE', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054021', 'BASKET CLUB GONDREVILLE', '54840', 'GONDREVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054022', 'BASKET CLUB DIEUZE', '54370', 'BURES', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054023', 'PUNCH', '54000', 'NANCY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054024', 'LUDRES PONT ST VINCENT BASKET CL', '54710', 'LUDRES', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054025', 'AVANT-GARDE PORTOISE BASKET', '54210', 'SAINT-NICOLAS-DE-PORT', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054026', 'ESPERANCE TOUL', '54200', 'TOUL', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054028', 'CERCLE SPORTIF MUNICIPAL AUBOUE', '54580', 'AUBOUE', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054032', 'AURORE BASKET HUSSIGNY', '54590', 'HUSSIGNY-GODBRANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054033', 'UNION SPORTIVE JARNISY SECTION BASKET', '54800', 'JARNY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054034', 'AS JOUDREVILLE PIENNE BOULIGNY', '54490', 'JOUDREVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054035', 'BASKET CLUB LONGWY REHON', '54400', 'LONGWY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054037', 'SAINT MAX BASKET CLUB', '54130', 'SAINT-MAX', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054038', 'GS ARNAVILLE NOVEANT', '54530', 'ARNAVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054043', 'AS HAUT DU LIEVRE NANCY', '54000', 'NANCY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054044', 'JOEUF HOMECOURT BASKET', '54240', 'JOEUF', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054045', 'BASKET CLUB DE VALLEROY', '54910', 'VALLEROY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054046', 'COLLECTIF SPORTS VAL DE LORRAINE SUD', '54340', 'POMPEY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054047', 'BASKET ALL STAR MUSSIPONTAIN', '54700', 'PONT-A-MOUSSON', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054048', 'BASKET LOISIR BLÉNOD', '54700', 'BLENOD-LES-PONT-A-MOUSSON', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054049', 'BASKET CLUB LUNEVILLE', '54300', 'LUNEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054051', 'BASKET CLUB TUCQUENOIS', '54640', 'TUCQUEGNIEUX', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054052', 'Entente TOUL/GONDREVILLE BASKETBALL', '54200', 'TOUL', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054054', 'BASKET CLUB LIVERDUN', '54460', 'LIVERDUN', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054055', 'AS CHAMPIGNEULLES BASKETBALL', '54250', 'CHAMPIGNEULLES', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054056', 'BASKET CLUB LONGUYON', '54620', 'BEUVEILLE', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054057', 'LAXOU NANCY CONVIVIALITE', '54000', 'NANCY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054058', 'FLEVILLE LOISIRS', '54710', 'FLEVILLE-DEVANT-NANCY', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL')),
    ('GES0054059', 'BASKET CLUB LAY-SAINT-CHRISTOPHE', '54690', 'LAY-SAINT-CHRISTOPHE', (SELECT id FROM committees WHERE name = 'COMITE DE MEURTHE-ET-MOSELLE DE BASKET-BALL'));

-- from clubs/55_meuse.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('GES0055001', 'CD 55 HORS ASSOCIATION', '55100', 'VERDUN', (SELECT id FROM committees WHERE name = 'COMITE DE LA MEUSE DE BASKET-BALL')),
    ('GES0055002', 'MJC ANCERVILLE', '55170', 'ANCERVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MEUSE DE BASKET-BALL')),
    ('GES0055003', 'CSLB BAR LE DUC', '55000', 'BAR-LE-DUC', (SELECT id FROM committees WHERE name = 'COMITE DE LA MEUSE DE BASKET-BALL')),
    ('GES0055007', 'SAINT-MIHIEL-SPORT BASKET-BALL', '55300', 'SAINT-MIHIEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA MEUSE DE BASKET-BALL')),
    ('GES0055009', 'AS SOUILLY-BASKET', '55220', 'SOUILLY', (SELECT id FROM committees WHERE name = 'COMITE DE LA MEUSE DE BASKET-BALL')),
    ('GES0055010', 'BCV VERDUN', '55100', 'VERDUN', (SELECT id FROM committees WHERE name = 'COMITE DE LA MEUSE DE BASKET-BALL')),
    ('GES0055012', 'AVENIR DE VIGNOT', '55200', 'VIGNOT', (SELECT id FROM committees WHERE name = 'COMITE DE LA MEUSE DE BASKET-BALL')),
    ('GES0055013', 'ASC CHARNY SUR MEUSE', '55100', 'CHARNY-SUR-MEUSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MEUSE DE BASKET-BALL')),
    ('GES0055016', 'L''ESPERANCE DE STENAY', '55700', 'STENAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA MEUSE DE BASKET-BALL')),
    ('GES0055020', 'REVIGNY BASKET CLUB', '55000', 'BAR-LE-DUC', (SELECT id FROM committees WHERE name = 'COMITE DE LA MEUSE DE BASKET-BALL')),
    ('GES0055025', 'PAGNY SUR MEUSE BC', '55190', 'PAGNY-SUR-MEUSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MEUSE DE BASKET-BALL'));

-- from clubs/56_morbihan.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('BRE0056001', 'CD 56 HORS ASSOCIATION', '56100', 'LORIENT', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056002', 'CEP LORIENT BASKET', '56100', 'LORIENT', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056003', 'FL LANESTER', '56600', 'LANESTER', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056005', 'AVANT GARDE ARZAL BASKETBALL', '56190', 'ARZAL', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056006', 'AS ESPERANCE DE BREHAN', '56580', 'ROHAN', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056007', 'PL LOCMIQUELIC', '56570', 'LOCMIQUELIC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056008', 'FOLC LORIENT OUEST BASKET', '56100', 'LORIENT', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056009', 'RL PONTIVY BASKET', '56300', 'PONTIVY', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056010', 'SEMEURS BASKET GRANDCHAMP', '56390', 'GRAND-CHAMP', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056011', 'BO PLOEMEUROIS', '56270', 'PLOEMEUR', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056012', 'BC PLOERMEL', '56800', 'PLOERMEL', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056013', 'VANNES AC BASKET', '56000', 'VANNES', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056015', 'BASKET QUEVEN BS', '56530', 'QUEVEN', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056016', 'ARVOR BASKET LORIENT', '56100', 'LORIENT', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056018', 'AVETTES DE QUESTEMBERT', '56230', 'QUESTEMBERT', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056019', 'PLC AURAY BASKET', '56400', 'AURAY', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056020', 'CB BELZ', '56550', 'BELZ', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056021', 'BC HENNEBONTAIS', '56700', 'HENNEBONT', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056023', 'LA GUIDELOISE BASKET', '56520', 'GUIDEL', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056024', 'BASKET BRO BAOD', '56150', 'BAUD', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056025', 'ECUREUILS DE PLOUAY BB', '56240', 'PLOUAY', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056026', 'GUER (LES ENFANTS )', '56380', 'GUER', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056027', 'BASKET CLUB DU LOC’H', '56390', 'LOCQUELTAS', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056028', 'ELVINOISE BASKET', '56250', 'ELVEN', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056029', 'M SULNIAC', '56250', 'SULNIAC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056030', 'CLP INZINZAC-LOCHRIST', '56650', 'INZINZAC-LOCHRIST', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056032', 'CAUDAN BASKET', '56850', 'CAUDAN', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056034', 'BC MOREAC', '56500', 'MOREAC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056036', 'UCKNEF VANNES BASKET', '56000', 'VANNES', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056037', 'MB NOYAL PONTIVY', '56920', 'NOYAL-PONTIVY', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056040', 'ES PLESCOP BB', '56890', 'PLESCOP', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056041', 'BASKET CLUB BZH RIEUX ST-DOLAY', '56350', 'RIEUX', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056042', 'BREIZH SPORT MARZAN BASKET', '56130', 'MARZAN', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056043', 'AO SAINT NOLFF', '56250', 'SAINT-NOLFF', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056044', 'AL LARMOR PLAGE', '56260', 'LARMOR-PLAGE', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056045', 'MALESTROIT BC', '56140', 'SAINT-LAURENT', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056047', 'ARMORICAINE PEAULE - BASKET', '56130', 'PEAULE', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056048', 'BC DE LA VILAINE NIVILLAC', '56130', 'NIVILLAC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056051', 'JEANNE D''ARC DE L''OUST - BASKET-BALL', '56140', 'PLEUCADEUC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056053', 'PBP QUIBERON', '56170', 'QUIBERON', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056056', 'ESG GUEGON', '56120', 'GUEGON', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056057', 'PLUVIGNER BB', '56330', 'PLUVIGNER', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056058', 'BASKET SUD VILAINE - FEREL', '56130', 'FEREL', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056060', 'BOHAL AS DE LA CLAIE', '56140', 'BOHAL', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056061', 'PLOUHINEC BO', '56680', 'PLOUHINEC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056062', 'ESPERANCE DE RUFFIAC', '56140', 'RUFFIAC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056063', 'BADEN BC', '56870', 'BADEN', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056065', 'CLUB ST GAUDENCE BASKET', '56350', 'ALLAIRE', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056066', 'THEIX TNS BC', '56450', 'THEIX', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056067', 'ES SAINT AVE BASKET', '56890', 'SAINT-AVE', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056069', 'AMICALE LAIQUE DE CLEGUER', '56620', 'CLEGUER', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056070', 'ASSOCIATION LA STIREN DE LANGUIDIC', '56440', 'LANGUIDIC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056071', 'LA PATRIOTE', '56220', 'MALANSAC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056072', 'BASKET RAH-KOED', '56420', 'PLAUDREN', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056073', 'LA SÉRENTAISE BASKET', '56460', 'SERENT', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056074', 'USSAC BASKET UNION SPORTIVE DE SAINT ABRAHAM ET LA CHAPELLE CARO', '56460', 'LA CHAPELLE-CARO', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056075', 'PLUMELEC BC', '56420', 'PLUMELEC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056076', 'BASKET CLUB DE RHUYS', '56640', 'ARZON', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056081', 'SAINT LEON GLENAC', '56200', 'GLENAC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056082', 'US PLOEREN', '56880', 'PLOEREN', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056083', 'EDO LES FOUGERETS', '56200', 'FOUGERETS', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056084', 'CSC BASKET REGUINY', '56500', 'REGUINY', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056094', 'JF NOYAL MUZILLAC', '56190', 'NOYAL-MUZILLAC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056097', 'MUZILLAC BC', '56190', 'MUZILLAC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056102', 'RB JOSSELIN', '56120', 'JOSSELIN', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056103', 'EB BERRIC LAUZACH', '56230', 'BERRIC', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056105', 'SAINT JACUT BE 56', '56220', 'SAINT-JACUT-LES-PINS', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056112', 'LE ROC ST ANDRE ECUREUILS BC', '56460', 'VAL D''OUST', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL')),
    ('BRE0056590', 'GOURIN BC', '56110', 'GOURIN', (SELECT id FROM committees WHERE name = 'COMITE DU MORBIHAN DE BASKET-BALL'));

-- from clubs/57_moselle.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('GES0057002', 'J.S.AUDUNOISE BASKET', '7390', 'AUDUN-LE-TICHE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057003', 'CSJ AUGNY', '57685', 'AUGNY', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057004', 'BC AUMETZ', '57710', 'AUMETZ', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057005', 'CEPS BEHREN', '57460', 'BEHREN-LES-FORBACH', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057006', 'LOISIRS SPORT MONTIGNY', '57680', 'ARRY', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057007', 'US BOULANGE FONTOY BB', '57700', 'HAYANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057009', 'BASKET CREHANGE FAULQUEMONT', '57380', 'FAULQUEMONT', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057010', 'CREUTZWALD BC', '57550', 'FALCK', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057012', 'CSE FOLKLING', '57600', 'FOLKLING', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057016', 'ES HAGONDANGE', '57300', 'HAGONDANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057017', 'DISTRICT BASKET RODEMACK KANFEN (DBRK)', '57570', 'RODEMACK', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057019', 'BC MAIZIERES LES METZ', '57525', 'TALANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057020', 'BASKET CLUB HAYANGE MARSPICH', '57700', 'HAYANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057022', 'METZ BC', '57050', 'LONGEVILLE-LES-METZ', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057025', 'ENTENTE BASKET NILVANGE SEREMANGE ALGRANGE', '57290', 'FAMECK', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057027', 'ROMBAS OC', '57120', 'ROMBAS', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057028', 'LS ROSSELANGE BASKET', '57300', 'HAGONDANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057029', 'AS SAINT NICOLAS EN FORET', '57700', 'HAYANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057030', 'ASP STE MARIE AUX CHENES', '57255', 'SAINTE-MARIE-AUX-CHENES', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057031', 'NBC SARREBOURG', '57400', 'SARREBOURG', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057032', 'AS SARREGUEMINES BASKET', '57200', 'SARREGUEMINES', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057034', 'US SILVANGE BASKET', '57535', 'MARANGE-SILVANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057035', 'THIONVILLE BC', '57100', 'THIONVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057036', 'USBB UCKANGE', '57190', 'FLORANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057037', 'ASPTT METZ - BASKET', '57070', 'METZ', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057041', 'DUKES DE FAMECK', '57290', 'FAMECK', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057042', 'COMITE MOSELLE DE BASKETBALL', '57420', 'VERNY', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057043', 'ENT. CLOUANGE ROSSELANGE', '57300', 'HAGONDANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057044', 'BASKET CLUB CLOUANGE', '57185', 'CLOUANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057045', 'ENT. CREHANGE FAULQUEMONT LONGEVILLE BASKET', '57690', 'CREHANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057047', 'MORHANGE BASKET-BALL ASSOCIATION', '57340', 'MORHANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057054', 'C2B CLUB BASKET BOUZONVILLE', '57320', 'BOUZONVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057057', 'LONGEVILLE ET ST AVOLD BASKET', '57740', 'LONGEVILLE-LES-SAINT-AVOLD', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057060', 'ENT. LONGEVILLE ST AVOLD FAULQUEMONT BASKET', '57380', 'FAULQUEMONT', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057063', 'FENSCH BASKET AVENIR FBA', '57240', 'NILVANGE', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL')),
    ('GES0057068', 'BASKET CLUB HOMBOURG-HAUT', '57470', 'HOMBOURG-HAUT', (SELECT id FROM committees WHERE name = 'COMITE DE MOSELLE DE BASKET-BALL'));

-- from clubs/58_nievre.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('BFC0058001', 'CD 58 HORS ASSOCIATION', '58000', 'NEVERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058003', 'BC COULANGES LES NEVERS', '58660', 'COULANGES-LES-NEVERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058004', 'U COSNOISE S BASKET', '58200', 'COSNE-COURS-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058007', 'DORNES BASKET', '58390', 'DORNES', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058009', 'EB FOURCHAMBAULT NEVERS', '58000', 'NEVERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058011', 'US CHARITOISE BASKET', '58400', 'CHARITE-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058013', 'JS MARZY BASKET', '58180', 'MARZY', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058014', 'BASKET CLUB SAINT PIERROIS', '58240', 'SAINT-PIERRE-LE-MOUTIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058015', 'ASC DE NEUVY SUR LOIRE', '58450', 'NEUVY-SUR-LOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058016', 'A POUGUOISE DE BASKET B', '58320', 'POUGUES-LES-EAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058017', 'ETOILE SPORTIVE DONZIAISE BASKET', '58220', 'DONZY', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058018', 'CLUB JEUNES PUISAYE FORTERRE', '58310', 'SAINT-AMAND-EN-PUISAYE', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058019', 'A S A VAUZELLES', '58640', 'VARENNES-VAUZELLES', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058020', 'ESPERANCE CORVOL BASKET', '58460', 'CORVOL-L''ORGUEILLEUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058022', 'AS GUERIGNY URZY SECTION BASKET', '58130', 'GUERIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL')),
    ('BFC0058038', 'ENTENTE JS MARZY - DORNES BASKET', '58180', 'MARZY', (SELECT id FROM committees WHERE name = 'COMITE DE LA NIEVRE DE BASKET-BALL'));

-- from clubs/59_nord.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('HDF0059001', 'CD 59 HORS ASSOCIATION', '59133', 'PHALEMPIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059003', 'AULNOYE AS', '59570', 'BAVAY', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059005', 'FLINES LEZ RACHES BC', '59148', 'FLINES-LEZ-RACHES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059007', 'HAUTMONT USO', '59330', 'HAUTMONT', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059008', 'JEUMONT JSBB', '59460', 'JEUMONT', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059009', 'GAYANT BASKET', '59500', 'DOUAI', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059011', 'LOUVROIL ASG', '59720', 'LOUVROIL', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059012', 'UNION SPORTIVE MAUBEUGE BASKET BALL', '59600', 'MAUBEUGE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059013', 'PONTOIS ASB', '59138', 'PONT-SUR-SAMBRE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059016', 'FOURMIES CSC', '59610', 'FOURMIES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059017', 'CAMBRAI BASKET', '59400', 'CAMBRAI', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059018', 'CARNIERES BC', '59217', 'CARNIERES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059019', 'CAUDRY BC', '59540', 'CAUDRY', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059020', 'FERRIEROIS BC', '59680', 'COLLERET', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059023', 'PROVILLE BASKET', '59267', 'PROVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059024', 'SOLESMES BC', '59144', 'JENLAIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059026', 'VILLERS OUTREAUX BB', '59142', 'VILLERS-OUTREAUX', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059027', 'WALINCOURT SELVIGNY BASKET AVENIR', '59127', 'WALINCOURT-SELVIGNY', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059033', 'UNION DECHY SIN BASKET', '59187', 'DECHY', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059034', 'DORIGNIES DOUAI AAE', '59500', 'DOUAI', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059035', 'ENTENTE CONDE/CRESPIN FEMININE', '59163', 'CONDE-SUR-L''ESCAUT', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059036', 'DOUAI BASKET FEMININ', '59500', 'DOUAI', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059038', 'OSTREVENT BASKET BALL EAA MONCHECOURT', '59580', 'EMERCHICOURT', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059040', 'AVENIR BASKET FLERSOIS', '59128', 'FLERS-EN-ESCREBIEUX', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059041', 'LAMBRES BASKET CLUB', '59552', 'LAMBRES-LEZ-DOUAI', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059043', 'AMICALE BASKET PECQUENCOURT', '59146', 'PECQUENCOURT', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059045', 'OSTRICOURT ABC', '59162', 'OSTRICOURT', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059047', 'RAIMBEAUCOURT CSL', '59553', 'CUINCY', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059049', 'USAC SOMAIN MARCHIENNES BASKETBALL', '59490', 'SOMAIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059050', 'CUINCY ASB', '59553', 'CUINCY', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059051', 'WAZIERS A B', '59182', 'MONTIGNY-EN-OSTREVENT', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059053', 'BOURBOURG SC', '59630', 'BOURBOURG', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059054', 'BASKET CLUB BRAY DUNES', '59123', 'BRAY-DUNES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059055', 'CAPPELLE BC', '59180', 'CAPPELLE-LA-GRANDE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059056', 'COUDEKERQUE BRANCHE AL', '59210', 'COUDEKERQUE-BRANCHE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059057', 'BIERNOIS BC', '59380', 'BIERNE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059058', 'DUNKERQUE MALO BASKET CLUB', '59140', 'DUNKERQUE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059061', 'OLYMPIQUE GRANDE SYNTHE BASKET', '59760', 'GRANDE-SYNTHE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059062', 'GRAVELINES GRAND FORT BCM', '59820', 'GRAVELINES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059063', 'GRAVELINES B F', '59820', 'GRAVELINES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059064', 'LEFFRINCKOUCKE BC', '59495', 'LEFFRINCKOUCKE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059065', 'LOON PLAGE AS', '59279', 'LOON-PLAGE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059066', 'ESABC SALOME', '59480', 'SALOME', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059067', 'PETITE SYNTHE DUNKERQUE BASKET BALL', '59640', 'DUNKERQUE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059068', 'ST PIERREBROUCK AL', '59630', 'SAINT-PIERRE-BROUCK', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059069', 'SAINT POL SUR MER BC', '59430', 'Saint-Pol-sur-Mer', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059071', 'BCT BASKET CLUB TETEGHEM', '59229', 'TETEGHEM', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059072', 'WORMHOUT A S', '59470', 'WORMHOUT', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059075', 'GRAVELINES B ESLA', '59820', 'GRAVELINES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059076', 'VILLENEUVE D''ASCQ ESB', '59650', 'VILLENEUVE-D''ASCQ', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059077', 'ANNOEULLIN B C', '59112', 'ANNOEULLIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059078', 'HASNON BASKET', '59178', 'HASNON', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059080', 'SPORTS OUVRIERS ARMENTIEROIS', '59280', 'ARMENTIERES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059081', 'BONDUES A B C', '59910', 'BONDUES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059082', 'CHERENG ABC', '59152', 'CHERENG', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059083', 'COMINOISE L L', '59560', 'COMINES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059084', 'CROIX F S P', '59290', 'WASQUEHAL', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059086', 'CROIX OLYMPIQUE', '59170', 'CROIX', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059087', 'CYSOING SAINGHIN BOUVINES BASKET', '59830', 'CYSOING', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059090', 'BAUVIN B C', '59221', 'BAUVIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059091', 'LOOSSOIS BASKET CLUB', '59120', 'LOOS', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059092', 'HAUBOURDIN CG', '59320', 'HAUBOURDIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059093', 'HELLEMMES LILLE BFC', '59260', 'HELLEMMES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059094', 'HEM S B B', '59510', 'HEM', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059096', 'LAMBERSART J F', '59840', 'LOMPRET', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059097', 'LAMBERSART B L M', '59211', 'SANTES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059098', 'LEERS OSBB', '59115', 'LEERS', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059099', 'BC LESQUIN', '59810', 'LESQUIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059100', 'SAINGHIN WEPPES LCJMPT', '59184', 'SAINGHIN-EN-WEPPES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059103', 'RONCHIN B C', '59790', 'RONCHIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059104', 'LINSELLES B', '59280', 'ARMENTIERES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059105', 'LILLE-EST BASKET', '59000', 'LILLE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059107', 'MARCQ EN BAROEUL ASJ', '59520', 'MARQUETTE-LEZ-LILLE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059108', 'PROVIN BC', '59185', 'PROVIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059109', 'MERVILLE S B B', '59660', 'MERVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059110', 'LILLE BASKET 2000', '59000', 'LILLE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059111', 'LOOS BC', '59120', 'LOOS', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059112', 'LILLE-LAMBERSART BASKET', '59777', 'LILLE-LAMBERSART', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059113', 'FIVES BASKET CLUB', '59800', 'LILLE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059115', 'HESDIGNEUL LILLE BASKET', '59650', 'HESDIGNEUL', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059116', 'VALENCIENNES B C', '59300', 'VALENCIENNES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059118', 'ASBR BASKET', '59124', 'BAVAY', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059119', 'CROIX OLYMPIQUE 2', '59170', 'CROIX', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059120', 'BASKET CLUB HALLUINOIS', '59250', 'HALLUIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059198', 'ABC WATTEN', '59143', 'WATTEN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059199', 'SANTES BB', '59211', 'SANTES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059200', 'CASC BOLLEZEELE BASKET', '59470', 'BOLLEZEELE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059204', 'BASKET CLUB ASSEVENT BOUSSOIS RECQUIGNIES', '59168', 'BOUSSOIS', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059208', 'LANDRECIEN B C', '59550', 'LANDRECIES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059210', 'UNION BASKET LAMBERSART / VILLENEUVE D''ASCQ', '59650', 'VILLENEUVE-D''ASCQ', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059212', 'UNION DENAIN HASNON BASKET-BALL - PORTE DU HAINAUT', '59220', 'DENAIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059213', 'MASNIERES BC', '59241', 'MASNIERES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059214', 'WAVRECHAIN / DENAIN BC', '59220', 'WAVRECHAIN-SOUS-DENAIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059215', 'WASQUEHAL FEM B', '59290', 'WASQUEHAL', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059216', 'ASC DENAIN VOLTAIRE PORTE DU HAINAUT', '59220', 'DENAIN', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059217', 'TOURCOING US F', '59200', 'TOURCOING', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059220', 'ESCAUDOEUVRES BASKET CLUB', '59161', 'ESCAUDOEUVRES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059221', 'JEUNESSE BASKET CLUB AUBY', '59950', 'AUBY', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059226', 'BASKET CLUB LEZENNOIS', '59260', 'LEZENNES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059227', 'ESTAIRES BC', '59660', 'MERVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059229', 'BASKET CLUB PEVELE', '59310', 'AIX', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059232', 'ASSOCIATION SPORTIVE BASKET LOURCHOIS', '59156', 'LOURCHES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059233', 'LILLE BASKET', '59000', 'LILLE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059236', 'AVELIN BASKET CLUB PONT-A-MARCQ', '59710', 'PONT-A-MARCQ', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059240', 'BASKET CLUB MARLY', '59770', 'MARLY', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059241', 'BRILLON BASKET COMPETITION ET LOISIR', '59178', 'BRILLON', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059247', 'BASKETSPHERE ACADEMY', '59910', 'BONDUES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059248', 'BASKET CLUB DOUCHY', '59282', 'DOUCHY-LES-MINES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059249', 'ENTENTE LILLE LBLS', '59000', 'LILLE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059250', 'ACADEMIE DE BASKET CATESIENNE', '59360', 'LE CATEAU-CAMBRESIS', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059610', 'LES HUTTES BASKET SOLIDARITE', '59820', 'GRAVELINES', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059611', 'LA MADELEINE ROSTAND CLUB', '59110', 'MADELEINE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059612', 'LILLE SUD BASKET-BALL SPORTING CLUB', '59000', 'LILLE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL')),
    ('HDF0059613', 'US HONDSCHOOTE BASKET', '59122', 'HONDSCHOOTE', (SELECT id FROM committees WHERE name = 'COMITE DU NORD DE BASKET-BALL'));

-- from clubs/60_oise.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('HDF0060001', 'CD 60 HORS ASSOCIATION', '60180', 'NOGENT-SUR-OISE', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060002', 'ROCKETS RESSONS BASKET', '60490', 'RESSONS-SUR-MATZ', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060003', 'BCI ATTICHY', '60350', 'ATTICHY', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060005', 'BASKET C3B', '60750', 'CHOISY-AU-BAC', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060007', 'BEAUVAIS BCO', '60000', 'BEAUVAIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060008', 'HARDE DE CHAMANT', '60300', 'CHAMANT', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060009', 'GAS CHANTILLY', '60500', 'CHANTILLY', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060010', 'STADE COMPIEGNOIS BB', '60880', 'LE MEUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060011', 'ASCC MARGNY', '60280', 'MARGNY-LES-COMPIEGNE', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060012', 'BC COYE LA FORET', '60580', 'COYE-LA-FORET', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060013', 'Basket Never Dies', '60650', 'SAINT-PAUL', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060014', 'US CREPY EN VALOIS', '60800', 'FEIGNEUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060016', 'ASO ESQUENNOY BRETEUIL', '60120', 'BRETEUIL', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060017', 'GOUVIEUX BASKET OISE', '60270', 'GOUVIEUX', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060018', 'AGGLOMERATION CREILLOISE BASKET', '60100', 'CREIL', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060021', 'MONTATAIRE BB', '60160', 'MONTATAIRE', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060022', 'ABC MERU', '60110', 'MERU', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060023', 'MOUY BASKET', '60250', 'MOUY', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060024', 'JA MOYENNEVILLE', '60190', 'MOYENNEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060025', 'BCC NANTEUIL LE HAUDOUIN', '60440', 'NANTEUIL-LE-HAUDOUIN', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060026', 'BB NOYONNAIS', '60640', 'BERLANCOURT', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060027', 'CERCLE SPORTIF DE PONTPOINT ET PONT STE MAXENCE (C.S.2.P)', '60700', 'PONTPOINT', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060031', 'ACLES ST JUST EN CHAUSSEE', '60130', 'SAINT-JUST-EN-CHAUSSEE', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060033', 'BB LA CROIX ST OUEN', '60610', 'LACROIX-SAINT-OUEN', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060034', 'US ST LEU D''ESSERENT BB', '60340', 'SAINT-LEU-D''ESSERENT', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060035', 'SENLIS BASKET-BALL', '60300', 'SENLIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060036', 'AS THOUROTTE', '60150', 'THOUROTTE', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060037', 'BASKET CLUB DU LIANCOURTOIS', '60140', 'LIANCOURT', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060039', 'NOGENT BBC', '60180', 'NOGENT-SUR-OISE', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060041', 'NOAILLES BBA', '60430', 'NOAILLES', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060042', 'ABC-ARC BASKET CLUB', '60200', 'COMPIEGNE', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060043', 'VERBERIE BC', '60410', 'VERBERIE', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060044', 'BEAUVAIS WOLF BASKETBALL', '60000', 'BEAUVAIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060048', 'CLAIROIX BB', '60280', 'CLAIROIX', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060050', 'ASSOCIATION DE LA JEUNESSE SPORTIVE DE REMY', '60190', 'REMY', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060053', 'VILLERS BASKETBALL', '60870', 'VILLERS-SAINT-PAUL', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060054', 'CLERMONT OISE BASKETBALL', '60600', 'CLERMONT', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060055', 'CRAB BRENOUILLE', '60870', 'BRENOUILLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060060', 'ES ST LEGER', '60170', 'SAINT-LEGER-AUX-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060064', 'BC VEXIN-THELLE', '60240', 'CHAUMONT-EN-VEXIN', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL')),
    ('HDF0060072', 'SUD BASKET OISE', '60560', 'ORRY-LA-VILLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''OISE DE BASKET-BALL'));

-- from clubs/61_orne.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('NOR0061001', 'CD HORS ASSOCIATION', '61000', 'ALENCON', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061002', 'UNION SPORTIVE BASKET DAMIGNY ALENCON 61 (USBDA61)', '61000', 'ALENCON', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061003', 'BAYARD ARGENTAN', '61200', 'ARGENTAN', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061004', 'PATRONAGE LAIQUE D''ARGENTAN', '61200', 'ARGENTAN', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061005', 'BASKET FLERS SAINT GEORGES', '61100', 'SAINT-GEORGES-DES-GROSEILLERS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061007', 'OLYMPIQUE CLUB DE BRIOUZE', '61220', 'BRIOUZE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061008', 'BASKET CLUB DU PAYS DE LA RISLE', '61270', 'RAI', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061014', 'Association Basket Club de Mortagne', '61400', 'MORTAGNE-AU-PERCHE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061015', 'BASKET CLUB DU PAYS MELOIS', '61170', 'MELE-SUR-SARTHE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061018', 'LES BASKETTEURS GACEENS', '61230', 'GACE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061019', 'BASKET CLUB DE SEES', '61500', 'SEES', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061023', 'AVENIR ST GERMAIN DU CORBEIS BA', '61000', 'SAINT-GERMAIN-DU-CORBEIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061025', 'BASKET BALL FERTOIS', '61600', 'Ferté Macé (La)', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL')),
    ('NOR0061026', 'BASKET SAINT PIERRE DU REGARD', '61430', 'ATHIS-VAL-DE-ROUVRE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ORNE DE BASKET-BALL'));

-- from clubs/62_pas_de_calais.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('HDF0062001', 'CD 62 HORS ASSOCIATION', '62190', 'LILLERS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062002', 'AL ANDRES BASKET BALL', '62340', 'ANDRES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062003', 'BASKET CLUB VIOLAINES', '62138', 'VIOLAINES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062005', 'AMICALE LAIQUE DE DESVRES', '62240', 'DESVRES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062006', 'AMICALE BUCAILLE BOULOGNE', '62200', 'BOULOGNE-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062007', 'BREBIERES BC', '62117', 'BREBIERES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062008', 'ESSM LE PORTEL', '62480', 'LE PORTEL', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062009', 'AMICALE DRAPEAU LE PORTEL', '62360', 'SAINT-ETIENNE-AU-MONT', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062010', 'A PAUL BERT OUTREAU', '62230', 'OUTREAU', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062012', 'BC ST MARTIN LES BOULOGNE', '62200', 'BOULOGNE-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062013', 'BASKET CLUB ARDRES', '62610', 'ARDRES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062014', 'AS AUDRUICQ BASKET', '62370', 'AUDRUICQ', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062015', 'CALAIS BASKET', '62100', 'CALAIS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062017', 'ASM BASKET ELEU DIT LEAUWETTE', '62300', 'LENS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062018', 'BC LOOS EN GOHELLE', '62750', 'LOOS-EN-GOHELLE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062019', 'COTE D''OPALE BASKET CALAIS', '62100', 'CALAIS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062020', 'BC OYE PLAGE MARITIME', '62215', 'OYE-PLAGE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062021', 'BC BLENDECQUES SAINT OMER', '62575', 'BLENDECQUES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062022', 'LONGUENESSE BC', '62219', 'LONGUENESSE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062024', 'BC SAINT LEONARD', '62360', 'SAINT-LEONARD', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062025', 'OMNISPORTS AIROIS', '62120', 'AIRE-SUR-LA-LYS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062026', 'BASKET CHEMINOTS BETHUNOIS', '62660', 'BEUVRY', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062027', 'USO BRUAY LABUISSIERE', '62150', 'HOUDAIN', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062028', 'ACLPAB CALAIS', '62100', 'CALAIS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062030', 'OLYMPIQUE HESDIN MARCONNE BASKET', '62140', 'HESDIN', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062031', 'CLUB LAIQUE HOUDAIN', '62150', 'HOUDAIN', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062032', 'ETOILE SPORTIVE ISBERGUES', '62330', 'ISBERGUES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062034', 'BC NOEUX LES MINES', '62290', 'NOEUX-LES-MINES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062035', 'ARRAS PAYS D''ARTOIS BASKET', '62000', 'ARRAS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062036', 'RACING CLUB ARRAS', '62000', 'ARRAS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062037', 'AMICALE CONDETTE', '62360', 'CONDETTE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062038', 'US ARRAS OUEST', '62000', 'ARRAS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062039', 'CLUB SPORTIF AVIONNAIS', '62210', 'AVION', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062040', 'UNION ARTOIS ELITE BASKET', '62119', 'DOURGES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062043', 'ASOB CARVINOIS', '62220', 'CARVIN', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062044', 'AS COURRIERES', '62710', 'COURRIERES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062045', 'ABC DOURGES', '62119', 'DOURGES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062046', 'AAE EVIN MALMAISON', '62141', 'EVIN-MALMAISON', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062047', 'ES HENIN BEAUMONT BB', '62110', 'HENIN-BEAUMONT', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062048', 'RC LENS BASKET', '62300', 'LENS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062050', 'OBC FRETHUN', '62340', 'PIHEN-LES-GUINES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062052', 'LOISON ATHLETIC CLUB', '62218', 'LOISON-SOUS-LENS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062053', 'BILLY BERCLAU BC', '62138', 'BILLY-BERCLAU', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062054', 'ETOILE OIGNIES', '62590', 'OIGNIES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062055', 'AS VENDINOISE', '62880', 'VENDIN-LE-VIEIL', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062057', 'WINGLES BASKET CLUB', '62410', 'WINGLES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062058', 'AL OSTROHOVE', '62280', 'SAINT-MARTIN-BOULOGNE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062059', 'FOYER LAIQUE ECAULT', '62360', 'SAINT-ETIENNE-AU-MONT', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062060', 'BC MERICOURT', '62680', 'MERICOURT', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062061', 'GRENAY SECTION BASKET', '62160', 'GRENAY', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062062', 'DAINVILLE BASKET CLUB', '62000', 'DAINVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062064', 'SPORTING CLUB AUBINOIS', '62690', 'AUBIGNY-EN-ARTOIS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062065', 'ALLOEU BASKET CLUB', '62840', 'LAVENTIE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062066', 'AS ETAPLES BASKET', '62630', 'ETAPLES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062067', 'BC SAINT POLOIS', '62130', 'SAINT-POL-SUR-TERNOISE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062068', 'BC NEUFCHATEL HARDELOT', '62152', 'NEUFCHATEL-HARDELOT', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062070', 'LES ATTAQUES BASKET CLUB', '62730', 'MARCK', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062071', 'BASKET CLUB DOUVRIN', '62138', 'DOUVRIN', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062072', 'AIGLON BASKET ESSARS', '62400', 'ESSARS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062075', 'BERCK/RANG DU FLIERS', '62600', 'BERCK', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062078', 'BASKET CLUB HULLUCH', '62410', 'HULLUCH', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062079', 'BEAURAINS BASKET BALL', '62217', 'BEAURAINS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062081', 'AMICALE LAIQUE JM LUMBRES', '62380', 'NIELLES-LES-BLEQUIN', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062084', 'US TINCQUES BASKET', '62127', 'TINCQUES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062086', 'RUITZ BASKET CLUB', '62620', 'RUITZ', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062087', 'BC ST NICOLAS ARRAS', '62223', 'SAINT-NICOLAS LES ARRAS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062088', 'BASKET AMBLETEUSE MARQUISE', '62250', 'LEULINGHEN-BERNES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062089', 'BASKET CLUB DE MARCK', '62730', 'MARCK', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062090', 'SO MARITIME BOULOGNE', '62200', 'BOULOGNE-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062094', 'AS HESDIGNEUL-HESDIN L''ABBE', '62360', 'HESDIGNEUL-LES-BOULOGNE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062096', 'AMICALE PAUL BERT GUINES', '62340', 'GUINES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062103', 'BBC COULOGNE', '62100', 'COULOGNE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062104', 'BASKET CLUB AUDRUICQ', '62370', 'AUDRUICQ', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062105', 'AS CUCQ BASKET', '62780', 'CUCQ', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062106', 'CERCLE LAIQUE DE BARLIN', '62620', 'BARLIN', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062107', 'ALP HAILLICOURT', '62940', 'HAILLICOURT', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062108', 'ASPTT BOULOGNE SUR MER', '62280', 'SAINT-MARTIN-BOULOGNE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062110', 'ASSOCIATION OLYMPIQUE DE SAINT-MARTIN-LEZ-TATINGHEM BASKET-BALL (A.O.S.M. BASKET)', '62500', 'SAINT-OMER', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062114', 'FERQUES BASKET CLUB', '62250', 'FERQUES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062121', 'BAPAUME BASKET CLUB', '62450', 'BAPAUME', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062128', 'AA WIZERNES BASKET', '62570', 'WIZERNES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062129', 'SAMER BASKET CLUB', '62830', 'VERLINCTHUN', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062131', 'BASKET CLUB SAINT FOLQUIN', '62370', 'SAINT-FOLQUIN', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062134', 'BASKET CLUB GUEMPS', '62370', 'GUEMPS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062135', 'AMICALE LAIQUE FRUGEOISE - SECTION USEP', '62310', 'FRUGES', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062136', 'LEF BASKETCLUB', '62790', 'LEFOREST', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062142', 'BASKET CLUB LILLERS', '62190', 'LILLERS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062143', 'BASKET BALL LESTREM', '62136', 'LESTREM', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062144', 'AMICALE BALZAC CALAIS', '62100', 'CALAIS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062145', 'BC AIX NOULETTE BASKET', '62160', 'AIX-NOULETTE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062146', 'ALEC MAZINGARBE', '62800', 'LIEVIN', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062147', 'AL COQUELLES BASKET', '62100', 'CALAIS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062148', 'AS PETIT COURGAIN', '62100', 'CALAIS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062149', 'AMICALE PASCAL BASKET CALAIS', '62100', 'CALAIS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062152', 'EOBC WIMILLE WIMEREUX', '62930', 'WIMEREUX', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062153', 'RINXENT HYDREQUENT BC', '62720', 'RINXENT', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062155', 'AMICALE CONDE Basket Ball', '62100', 'CALAIS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062157', 'LA COUTURE BASKET CLUB', '62136', 'LA COUTURE', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062158', 'AMICALE MICHELET BASKET', '62100', 'CALAIS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062166', 'BASKET CLUB LIEVINOIS', '62800', 'LIEVIN', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL')),
    ('HDF0062170', 'ES BLERIOT BASKET CLUB', '62100', 'CALAIS', (SELECT id FROM committees WHERE name = 'COMITE DU PAS-DE-CALAIS DE BASKET-BALL'));

-- from clubs/63_puy_de_dome.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('ARA0063001', 'CD63 – HORS ASSOCIATION – PUY DE DOME', '63000', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063002', 'LA MONNERIE BASKET', '63650', 'MONNERIE-LE-MONTEL', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063003', 'AL ANATOLE FRANCE', '63000', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063004', 'UNION SPORTIVE ET CULTURELLE CGI AUVERGNE', '63000', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063005', 'AL AUBIERE', '63170', 'AUBIERE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063006', 'AULNAT SPORTIF', '63510', 'AULNAT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063007', 'AS BANQUE DE FRANCE CHAMALIERES', '63400', 'CHAMALIERES', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063008', 'US BEAUMONT', '63110', 'BEAUMONT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063009', 'SC BILLOM', '63160', 'BILLOM', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063010', 'STADE CLERMONTOIS BASKET FEMININ', '63000', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063011', 'FR BLANZAT', '63112', 'BLANZAT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063012', 'NEYRAT BASKET ASSOCIATION', '63100', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063018', 'CLERMONT BASKET', '63000', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063019', 'AS CHATEAUGAY BASKET', '63119', 'CHATEAUGAY', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063020', 'NOHANENT PUY VALEIX', '63830', 'NOHANENT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063021', 'US CHAURIAT VERTAIZON', '63117', 'CHAURIAT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063022', 'BB COURNON D''AUVERGNE', '63800', 'COURNON-D''AUVERGNE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063023', 'CLERMONT UNIVERSITE CLUB', '63000', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063025', 'BASKET CLUB DURTOL', '63830', 'DURTOL', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063027', 'ETOILE DE CHAMALIERES SAYAT', '63400', 'CHAMALIERES', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063029', 'GERZAT BASKET', '63360', 'GERZAT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063030', 'AIGUEPERSE BASKET CLUB', '63260', 'AIGUEPERSE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063031', 'US ISSOIRE', '63500', 'ISSOIRE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063033', 'ENT. LA GLACIERE / DURTOL', '63960', 'VEYRE-MONTON', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063034', 'AL LA GLACIERE', '63960', 'VEYRE-MONTON', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063035', 'BASKET CLUB LA ROCHE BLANCHE', '63670', 'LA ROCHE-BLANCHE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063038', 'LE CENDRE BASKET', '63670', 'LE CENDRE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063039', 'BC LEMPDES', '63370', 'LEMPDES', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063040', 'BANQUE POPULAIRE AUVERGNE RHONE ALPES', '63000', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063041', 'USC LEZOUX', '63190', 'LEZOUX', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063042', 'AMICALE LAIQUE BASKET LUSSAT', '63360', 'LUSSAT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063044', 'AS MARECHAT RIOM', '63200', 'RIOM', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063045', 'PRO PATRIA MARINGUES', '63350', 'MARINGUES', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063047', 'LES LUNDIS AU BASKET BALL', '63100', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063050', 'AS MONTFERRAND', '63100', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063051', 'MOZAC VOLVIC BASKET', '63530', 'VOLVIC', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063056', 'ENT. ROMAGNAT / GERZAT', '63540', 'ROMAGNAT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063057', 'AL PERIGNAT', '63800', 'PERIGNAT-SUR-ALLIER', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063058', 'CS PONT DU CHATEAU', '63430', 'PONT-DU-CHATEAU', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063060', 'CLUB SPORTIF DE PONT DE DORE', '63920', 'PESCHADOIRES', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063061', 'ALTERIS', '63000', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063063', 'AS ROMAGNAT BASKET', '63540', 'ROMAGNAT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063066', 'CLUB SPORTIF SAUXILLANGEOIS', '63490', 'SAUXILLANGES', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063068', 'US SAINT GEORGES LES ANCIZES', '63780', 'SAINT-GEORGES-DE-MONS', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063070', 'ALFA SAINT JACQUES', '63000', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063072', 'AS SAINT PRIEST BRAMEFANT', '63310', 'RANDAN', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063074', 'STADE CLERMONTOIS BASKET AUVERGNE', '63000', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063078', 'SA THIERS VAILLANTE', '63300', 'THIERS', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063079', 'AMICALE CHAMPANELLOISE', '63122', 'SAINT-GENES-CHAMPANELLE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063082', 'US VIC LE COMTE BASKET', '63270', 'VIC-LE-COMTE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063086', 'BC AMBERT LIVRADOIS', '63600', 'AMBERT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063087', 'US CELLES SUR DUROLLE', '63250', 'CELLES-SUR-DUROLLE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063092', 'COMBRONDE BASKET CLUB', '63460', 'COMBRONDE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063096', 'CLUB SPORTIF PUY GUILLAUME', '63290', 'PUY-GUILLAUME', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063102', 'AMICALE LAIQUE JULES VERNE', '63100', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063104', 'BC VAL DE VEYRE ORCET', '63730', 'MARTRES-DE-VEYRE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063106', 'BASKET DOMES SANCY', '63210', 'ROCHEFORT-MONTAGNE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063111', 'ROYAT ORCINES CLUB BASKET BALL', '63130', 'ROYAT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063126', 'CREDIT AGRICOLE', '63430', 'PONT-DU-CHATEAU', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063128', 'LIMAGRAIN', '63360', 'SAINT-BEAUZIRE', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063132', 'LIMAGNE BASKET', '63720', 'ENNEZAT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063138', 'ASSOCIATION SPORTIVE SECURITE SOCIALE', '63000', 'CLERMONT-FERRAND', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL')),
    ('ARA0063997', 'INGEROP BASKET', '63118', 'CEBAZAT', (SELECT id FROM committees WHERE name = 'COMITE DU PUY-DE-DOME DE BASKET-BALL'));

-- from clubs/64_pyrenees_atlantiques.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('NAQ0064001', 'CD64 – HORS ASSOCIATION – PYRENEES ATLANTIQUES', '64000', 'PAU', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064002', 'HENDAYE Basket Ball', '64700', 'HENDAYE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064005', 'ASE ASCAIN', '64310', 'ASCAIN', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064006', 'AVIRON BAYONNAIS', '64100', 'BAYONNE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064008', 'DENEK BAT URCUIT', '64990', 'URCUIT', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064009', 'FR SAMES', '64520', 'SAMES', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064010', 'ANGLET COTE BASQUE BASKET', '64600', 'ANGLET', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064011', 'SAINT JEAN DE LUZ OLYMPIQUE BASKET', '64500', 'SAINT-JEAN-DE-LUZ', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064012', 'MOURENX BASKET BASSIN DE LACQ', '64150', 'MOURENX', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064013', 'AS SALISIENNE', '64270', 'SALIES-DE-BEARN', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064014', 'AL SALLESPISSE', '64300', 'SALLESPISSE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064015', 'BONNUT SPORT', '64300', 'BONNUT', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064016', 'ELAN BEARNAIS PAU NORD-EST', '64000', 'PAU', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064017', 'RAMOUS / BAIGTS BASKET', '64270', 'RAMOUS', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064018', 'US ORTHEZ BASKET', '64300', 'ORTHEZ', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064020', 'US ST PALAIS AMIKUZE', '64120', 'SAINT-PALAIS', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064021', 'US SAULT DE NAVAILLES', '64300', 'SAULT-DE-NAVAILLES', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064023', 'BASKET CLUB BILLEROIS', '64140', 'BILLERE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064024', 'AMICALE LAHOURCADE', '64150', 'LAHOURCADE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064026', 'AL JEAN SARRAILH PAU', '64000', 'PAU', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064027', 'AVENIR ABOSIEN', '64360', 'ABOS', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064029', 'ES LEMBEYE BASKET EN VIC-BILH', '64350', 'LEMBEYE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064032', 'FR MONEIN', '64360', 'MONEIN', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064033', 'GAZTIAK GOTEIN', '64130', 'GOTEIN-LIBARRENX', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064034', 'JEANNE D''ARC D''OLORON', '64400', 'OLORON-SAINTE-MARIE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064038', 'UNION JURANCONNAISE', '64110', 'JURANCON', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064042', 'ENTENTE POMPS MORLANNE', '64370', 'MORLANNE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064044', 'SA BIDOS BASKET FEMININ', '64400', 'OLORON-SAINTE-MARIE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064049', 'SAUVETERRE BASKET CLUB', '64390', 'SAUVETERRE-DE-BEARN', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064054', 'AVENIR DE BIZANOS', '64320', 'BIZANOS', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064056', 'UNION SPORTIVE CASTETIS GOUZE', '64300', 'MONT', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064057', 'JA BIARRITZ BASKET', '64200', 'BIARRITZ', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064059', 'SPORTING CLUB AUDAUX NAVARRENX', '64190', 'NAVARRENX', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064062', 'HASPARREN BASKET CLUB ZAREAN', '64240', 'HASPARREN', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064063', 'BASKET CLUB DU LUY DE BEARN', '64121', 'SERRES-CASTET', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064069', 'ARTIX LABASTIDE-CEZERACQ BASKET', '64170', 'ARTIX', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064070', 'CA PONTACQ', '64530', 'PONTACQ', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064073', 'BASKET CLUB HAUT BEARN', '64660', 'ASASP-ARROS', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064074', 'ASC PAU BC', '64000', 'PAU', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064076', 'LONS BASKET', '64140', 'LONS', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064080', 'BC ARTHEZIEN', '64370', 'ARTHEZ-DE-BEARN', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064082', 'LESCAR Basket', '64230', 'LESCAR', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064085', 'LOUVIE JUZON BASKET', '64260', 'LOUVIE-JUZON', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064089', 'AS MAZERES UZOS RONTIGNON Basket', '64110', 'MAZERES-LEZONS', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064091', 'Entente 2MBS / NORD BEARN', '64410', 'MALAUSSANNE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064092', 'IDRON SPORTS VILLAGE', '64320', 'IDRON-OUSSE-SENDETS', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064095', 'ENT. SALLESPISSE-CTC CASTETIS-GOUZE-ARTHEZ', '64300', 'SALLESPISSE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064098', 'BASKET NORD BEARN', '64450', 'THEZE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064100', 'ENTENTE ST PALAIS AMIKUZE - GAZTIAK GOTEIN', '64120', 'SAINT-PALAIS', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064101', 'ENTENTE ALCB /MBBL', '64170', 'ARTIX', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064104', 'EN - AVENIR BIZANOS BASKET - IDRON SPORT VILLAGE', '64320', 'BIZANOS', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064108', 'EN - HENDAYE - ST JEAN DE LUZ', '64700', 'HENDAYE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064109', 'EN MBBL-ALCB', '64150', 'MOURENX', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064110', 'EN - 2MBS - LUY DE BEARN', '64410', 'MALAUSSANNE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064116', 'EST BEARN BASKET AMI', '64800', 'MIREPEIX', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064118', 'ENT IDRON SV - EBB AMI', '64320', 'IDRON-OUSSE-SENDETS', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL')),
    ('NAQ0064202', 'MALAUSSANNE MAZEROLLES BASKET SOUBESTRE', '64410', 'MALAUSSANNE', (SELECT id FROM committees WHERE name = 'COMITE DES PYRENEES-ATLANTIQUES DE BASKET-BALL'));

-- from clubs/65_hautes_pyrenees.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('OCC0065001', 'CD HORS ASSOCIATION', '65000', 'TARBES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065002', 'VIC PYRENEES BASKET', '65500', 'VIC-EN-BIGORRE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065003', 'En-USM-LBC', '65670', 'MONLEON-MAGNOAC', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065004', 'US MONLEONNAISE', '65670', 'MONLEON-MAGNOAC', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065005', 'BASKET CLUB LOURDAIS', '65100', 'LOURDES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065006', 'IBOS SPORTS LOISIRS', '65420', 'IBOS', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065007', 'UA LALOUBERE', '65310', 'LALOUBERE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065008', 'ASC AUREILHAN', '65800', 'AUREILHAN', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065009', 'BASKET CLUB OSSUNOIS', '65380', 'OSSUN', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065010', 'TARBES UNION BASKET 65', '65000', 'TARBES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065011', 'STADE BAGNERAIS BASKET', '65200', 'BAGNERES-DE-BIGORRE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065012', 'BASKET CLUB DU LAVEDAN', '65400', 'ARGELES-GAZOST', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065013', 'SEMEAC OLYMPIQUE', '65600', 'SEMEAC', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065015', 'JA BORDERES', '65320', 'BORDERES-SUR-L''ECHEZ', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065018', 'SO MAUBOURGUET', '65700', 'LAHITTE-TOUPIERE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065020', 'TARBES GESPE BIGORRE', '65000', 'TARBES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065021', 'JUILLAN BASKET', '65290', 'JUILLAN', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065023', 'LANNEMEZAN BASKET CLUB', '65300', 'LANNEMEZAN', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065024', 'BASKET CLUB POUYASTRUC', '65350', 'POUYASTRUC', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065025', 'ENTENTE JUILLAN / OSSUN', '65290', 'JUILLAN', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065026', 'BARBAZAN BASKET CLUB', '65690', 'BARBAZAN-DEBAT', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065027', 'ENTENTE JUILLAN - IBOS', '65430', 'SOUES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL')),
    ('OCC0065098', 'UNION TARBES LOURDES PYRENEES BASKET', '65000', 'TARBES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTES-PYRENEES DE BASKET-BALL'));

-- from clubs/66_pyrenees_orientales.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('66000', 'OCC0066006', 'PERPIGNAN BASKET CATALAN', 'PERPIGNAN', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66200', 'OCC0066014', 'TESA JOVENTUT', 'THEZA', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66690', 'OCC0066015', 'BASKET CLUB DES ALBERES', 'PALAU-DEL-VIDRE', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66350', 'OCC0066016', 'TOULOUGES BASKET ASSOCIATION 3X3', 'TOULOUGES', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66530', 'OCC0066019', 'PIA CLAIRA BASKET', 'CLAIRA', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66000', 'OCC0066501', 'CT 11-66 HORS ASSOCIATION', 'PERPIGNAN', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66620', 'OCC0066502', 'BAGES BC DES ASPRES', 'BROUILLA', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66330', 'OCC0066504', 'CABESTANY O C B', 'CABESTANY', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66200', 'OCC0066507', 'AL ILLIBERIENNE B', 'ELNE', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66440', 'OCC0066509', 'Ent. SALANQUE BC', 'TORREILLES', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66600', 'OCC0066512', 'BC RIVESALTES', 'RIVESALTES', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66750', 'OCC0066513', 'ST CYPRIEN SB', 'SAINT-CYPRIEN', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66140', 'OCC0066516', 'CANET RBC', 'CANET-EN-ROUSSILLON', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66240', 'OCC0066518', 'ST ESTEVE BC', 'SAINT-ESTEVE', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66500', 'OCC0066521', 'PRADES CONFLENT B', 'PRADES', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66130', 'OCC0066525', 'ILLE BASKET', 'ILLE-SUR-TET', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66300', 'OCC0066529', 'BC THUIRINOIS', 'THUIR', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66180', 'OCC0066539', 'BO SALEILLENC', 'VILLENEUVE-DE-LA-RAHO', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66400', 'OCC0066542', 'Ent. VALLESPIR B', 'CERET', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66660', 'OCC0066544', 'COTE VERMEILLE AB', 'PORT-VENDRES', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66600', 'OCC0066548', 'SALSES LE CHATEAU BC', 'SALSES-LE-CHATEAU', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL')),
    ('66350', 'OCC0066560', 'TOULOUGES BA', 'TOULOUGES', (SELECT id FROM committees WHERE name = 'COMITÉ DES PYRÉNÉES-ORIENTALES de BASKET-BALL'));

-- from clubs/67_bas_rhin.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('GES0067001', '67 CD HORS ASSOCIATION', '67100', 'STRASBOURG', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067002', 'BARR/GERTWILLER', '67140', 'BARR', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067003', 'BRUCHE SPORTS ACADEMY', '67190', 'DINSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067004', 'DUTTLENHEIM LC', '67120', 'DUTTLENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067005', 'ERSTEIN BC', '67150', 'ERSTEIN', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067006', 'ECKBOLSHEIM BB', '67201', 'ECKBOLSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067007', 'ESCHAU BC', '67114', 'ESCHAU', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067010', 'GOTTENHOUSE AS PG', '67700', 'GOTTENHOUSE', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067011', 'S.I. GRAFFENSTADEN', '67400', 'ILLKIRCH-GRAFFENSTADEN', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067013', 'GRIESHEIM P/MOLSHEIM LS', '67870', 'GRIESHEIM-PRES-MOLSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067014', 'ASA GRIES / OBERHOFFEN', '67240', 'GRIES', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067017', 'HATTMATT SS', '67330', 'HATTMATT', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067020', 'BASKET CLUB HOENHEIM', '67800', 'HOENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067021', 'HOLTZHEIM VOGESIA', '67810', 'HOLTZHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067022', 'LINGOLSHEIM C.C.S.S.', '67380', 'LINGOLSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067023', 'MARIENTHAL A.S.C.C', '67500', 'HAGUENAU', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067024', 'MARLENHEIM BC', '67520', 'MARLENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067025', 'MOLSHEIM CSTG', '67120', 'MOLSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067026', 'MUNDOLSHEIM B.C.', '67450', 'MUNDOLSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067027', 'SELTZ MULTI SPORT CLUB', '67470', 'SELTZ', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067030', 'ENT-URMATT/SCHIRMECK', '67280', 'URMATT', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067031', 'OHNHEIM C.S.S.A.', '67640', 'FEGERSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067035', 'ROSHEIM CA', '67560', 'ROSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067038', 'SAVERNE TRICOLORE ST JEAN', '67700', 'SAVERNE', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067040', 'SCHILTIGHEIM AU', '67300', 'SCHILTIGHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067041', 'S.U. SCHILTIGHEIM BASKET BALL', '67300', 'SCHILTIGHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067042', 'SCHIRMECK LB', '67130', 'SCHIRMECK', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067043', 'SCHIRRHEIN C.S.C.SN', '67240', 'SCHIRRHEIN', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067044', 'SELESTAT BC', '67600', 'SELESTAT', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067046', 'ASA SOUFFELWEYERSHEIM', '67460', 'SOUFFELWEYERSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067047', 'SOULTZ LES BAINS A.S.L.', '67120', 'SOULTZ-LES-BAINS', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067048', 'SOUFFLENHEIM C.C.S.A', '67620', 'SOUFFLENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067051', 'STRASBOURG ELECTRICITE A.S.', '67953', 'STRASBOURG Cedex 9', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067052', 'STRASBOURG MENORA AS', '67000', 'STRASBOURG', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067056', 'STRASBOURG JS KOENIGSHOFFEN', '67200', 'STRASBOURG', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067058', 'STRASBOURG LIBELLULES B.C.', '67200', 'STRASBOURG', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067060', 'STRASBOURG SAINT JOSEPH', '67100', 'STRASBOURG', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067068', 'VENDENHEIM BC', '67550', 'VENDENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067069', 'WANGENBOURG-ENGENTHAL U.S.', '67710', 'WANGENBOURG-ENGENTHAL', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067070', 'WEITBRUCH A.S.C.G', '67500', 'WEITBRUCH', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067071', 'ENT-HATTMATT/SAVERNE', '67330', 'HATTMATT', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067072', 'WISSEMBOURG BC', '67160', 'WISSEMBOURG', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067081', 'WALBOURG ESCHBACH BASKET', '67360', 'ESCHBACH', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067083', 'ASA WEYERSHEIM', '67720', 'HOERDT', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067086', 'BISCHHEIM BS', '67800', 'BISCHHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067088', 'NIEDERSCHAEFFOLSHEIM C.S.M.', '67500', 'NIEDERSCHAEFFOLSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067089', 'HATTEN BC', '67690', 'HATTEN', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067092', 'BISCHWILLER F.C.J.A.B.', '67240', 'BISCHWILLER', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067094', 'BASKET CLUB D’OSTWALD', '67540', 'OSTWALD', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067096', 'ENT SELTZ/HATTEN - SELTZ', '67470', 'SELTZ', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067099', 'WANTZENAU (LA) A.S.C.SP', '67610', 'WANTZENAU', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067100', 'GEISPOLSHEIM C.J.S.', '67118', 'GEISPOLSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067101', 'OFFENDORF C.S.STPP', '67850', 'OFFENDORF', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067103', 'SAINTE CROIX AUX MINES C.S.N.', '67600', 'SELESTAT', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067105', 'SCHAEFFERSHEIM A.S.L.C.', '67150', 'SCHAEFFERSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067106', 'ENT-Hatten-Seltz/HATTEN', '67690', 'HATTEN', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067107', 'HINDISHEIM C.S.E', '67150', 'HINDISHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067110', 'OSTHOUSE CSTB', '67150', 'OSTHOUSE', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067111', 'BASKET CLUB NORD ALSACE', '67500', 'HAGUENAU', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067114', 'OBERNAI C.A.', '67210', 'OBERNAI', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067116', 'W.O.S.B.', '67700', 'OTTERSWILLER', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067117', 'DRUSENHEIM A.B.C.', '67410', 'DRUSENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067119', 'NIEDER BASKET ALSACE', '67207', 'NIEDERHAUSBERGEN', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067120', 'WITTERNHEIM', '67230', 'WITTERNHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067121', 'PHALSBOURG B.C.', '67330', 'NEUWILLER-LES-SAVERNE', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067132', 'BASK FURDENHEIM', '67117', 'FURDENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067133', 'UNITAS BRUMATH BASKET', '67170', 'BRUMATH', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067134', 'ALSACE BOSSUE BC', '67320', 'BETTWILLER', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067140', 'ENT Wangenbourg/Saverne - Wangenbourg', '67710', 'WANGENBOURG-ENGENTHAL', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067142', 'UNION DES SPORTS ET LOISIRS DUPPIGHEIM', '67120', 'DUPPIGHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067143', 'SCHWEIGHOUSE/OHLUNGEN B.C.', '67350', 'DAUENDORF', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067144', 'GRIESHEIM/DINGSHEIM B.C.', '67370', 'GRIESHEIM-SUR-SOUFFEL', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067145', 'KESKASTEL BC', '67260', 'KESKASTEL', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067146', 'OHNENHEIM S.S.C.', '67390', 'OHNENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067147', 'BITCHE (PAYS DE)', '67110', 'DAMBACH', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067148', 'VAL DE VILLE B.C.', '67220', 'LALAYE', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067149', 'HAMBACH BC', '67260', 'SILTZHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067151', 'RACING CLUB DE STRASBOURG', '67100', 'STRASBOURG', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067153', 'MORSCHWILLER FCJ', '67350', 'MORSCHWILLER', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067154', 'EPFIG UNITAS', '67680', 'EPFIG', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067155', 'EBERSHEIM C.C.A', '67600', 'EBERSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067156', 'WEITERSWILLER/INGWILLER BCSM', '67340', 'WEITERSWILLER', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067160', 'WESTHOUSE E.S.', '67230', 'WESTHOUSE', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067161', 'BINDERNHEIM C.S.U.', '67600', 'BINDERNHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067169', 'URMATT BC', '67120', 'MOLSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067172', 'KRIEGSHEIM/R. ASC', '67170', 'ROTTELSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067176', 'KOGENHEIM/SERMERSHEIM B.C.', '67230', 'KOGENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067177', 'LUPSTEIN BC', '67490', 'LUPSTEIN', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067180', 'HUTTENHEIM C.S.C.A', '67230', 'HUTTENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067186', 'LILLY AS', '67640', 'FEGERSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067188', 'STRASBOURG ASS', '67200', 'STRASBOURG', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067193', 'ASCMCIC Féminines (Crédit Mutuel)', '67000', 'STRASBOURG', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067199', 'WOLFISHEIM BASKET CLUB', '67201', 'ECKBOLSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067202', 'BASKET CLUB BISCHOFFSHEIM', '67870', 'BISCHOFFSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067207', 'ENT LA WANTZENAU - OFFENDORF', '67610', 'WANTZENAU', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067211', 'ENT DRUSENHEIM / BISCHWILLER - DRUSENHEIM', '67410', 'DRUSENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067212', 'ENT WOSB / HATTMATT - WOSB', '67700', 'OTTERSWILLER', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067213', 'ENT URMATT / SCHIRMECK - URMATT', '67280', 'URMATT', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067214', 'ENT SCHIRMECK / URMATT - SCHIRMECK', '67130', 'SCHIRMECK', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067215', 'AVENIR BASKET CLUB DETTWILLER', '67490', 'DETTWILLER', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067216', 'ENT SCHIRRHEIN / DRUSENHEIM - SCHIRRHEIN', '67240', 'SCHIRRHEIN', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067217', 'ENT KRIEGSHEIM/R / NIEDERSCHAEFFOLSHEIM - KRIEGSHEIM/R', '67170', 'ROTTELSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067218', 'ENT Hatten / Seltz - Hatten', '67690', 'HATTEN', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067219', 'ENT BISCHHEIM / AUS - BISCHHEIM', '67800', 'BISCHHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL')),
    ('GES0067220', 'BASKET CLUB KOCHERSBERG TRUCHTERSHEIM', '67370', 'TRUCHTERSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU BAS-RHIN DE BASKET-BALL'));

-- from clubs/68_haut_rhin.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('GES0068001', 'CD 68 HORS ASSOCIATION', '68200', 'MULHOUSE', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068002', 'CSSM ALTKIRCH', '68130', 'ALTKIRCH', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068004', 'BERRWILLER/STAFFELFELDEN BC', '68500', 'BERRWILLER', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068009', 'BC ST GEORGES CARSPACH', '68720', 'TAGOLSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068012', 'ASL DESSENHEIM', '68600', 'DESSENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068013', 'FCSL EGUISHEIM', '68420', 'EGUISHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068014', 'BASKET CLUB HEGENHEIM', '68220', 'HEGENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068015', 'UNION SPORTIVE FLAXLANDEN', '68720', 'FLAXLANDEN', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068016', 'GUEBWILLER AS SAINT LEGER', '68500', 'GUEBWILLER', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068017', 'BASKET CLUB HIRTZFELDEN-REGUISHEIM', '68740', 'HIRTZFELDEN', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068018', 'AS HEIMERSDORF', '68560', 'HEIMERSDORF', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068019', 'BASKET CLUB ILLZACH', '68110', 'ILLZACH', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068020', 'AS KAYSERSBERG AMMERSCHWIHR BCA', '68240', 'KAYSERSBERG', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068021', 'BC KUNHEIM', '68320', 'KUNHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068022', 'ABC LUTTERBACH', '68460', 'LUTTERBACH', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068023', 'BASKET-CLUB 3 PAYS', '68730', 'MICHELBACH-LE-BAS', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068025', 'NBC WINTZENHEIM', '68124', 'LOGELBACH', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068028', 'ASC STE AFRE RIEDISHEIM', '68400', 'RIEDISHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068029', 'RICHWILLER UNION SPORTIVE', '68120', 'RICHWILLER', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068030', 'CSSL RIXHEIM', '68170', 'RIXHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068031', 'BASKET CLUB ROSENAU', '68128', 'ROSENAU', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068032', 'BASKET CLUB RUELISHEIM', '68270', 'WITTENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068033', 'BASKET CLUB THANN', '68800', 'THANN', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068034', 'CSC RUSTENHART', '68740', 'RUSTENHART', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068035', 'AS HORBOURG-WIHR', '68180', 'HORBOURG-WIHR', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068036', 'AS WILLEROISE', '68760', 'WILLER-SUR-THUR', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068038', 'ASCA WITTELSHEIM', '68310', 'WITTELSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068039', 'US WITTENHEIM', '68270', 'WITTENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068040', 'CSSL SAUSHEIM', '68390', 'SAUSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068044', 'BASKET ANDOLSHEIM', '68280', 'ANDOLSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068046', 'BASKET CLUB SIERENTZ', '68510', 'SIERENTZ', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068048', 'AS WICKERSCHWIHR', '68320', 'WICKERSCHWIHR', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068051', 'ASC SAINT ROMAIN REININGUE', '68950', 'REININGUE', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068052', 'AS DE CHALAMPE', '68490', 'CHALAMPE', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068053', 'AS ATTENSCHWILLER', '68220', 'ATTENSCHWILLER', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068055', 'MULHOUSE PFASTATT BASKET ASSOCIATION', '68120', 'PFASTATT', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068057', 'BASKET CLUB DE KINGERSHEIM', '68260', 'KINGERSHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068059', 'CS SAINT AUGUSTIN RIMBACH', '68290', 'RIMBACH-PRES-MASEVAUX', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068060', 'CS SAINT PP WALDIGHOFFEN', '68640', 'WALDIGHOFEN', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068062', 'BC VIEUX-FERRETTE', '68480', 'VIEUX-FERRETTE', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068066', 'BASKET CLUB RUMERSHEIM', '68740', 'RUMERSHEIM-LE-HAUT', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068074', 'ZILLISHEIM SOCIETE SPORTIVE', '68720', 'ZILLISHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068075', 'BASKET CLUB CERNAY', '68800', 'LEIMBACH', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068080', 'BASKET CLUB MOERNACH', '68480', 'MOERNACH', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068082', 'BASKET CLUB RIBEAUVILLE', '68970', 'ILLHAEUSERN', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068083', 'CB KIENTZHEIM', '68240', 'KIENTZHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068087', 'ASCL ESCHENTZWILLER', '68440', 'ESCHENTZWILLER', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068089', 'MACADAM BASKET 68', '68200', 'MULHOUSE', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068090', 'MULHOUSE BASKET CLUB AMATEUR', '68200', 'MULHOUSE', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068091', 'NB RUELISHEIM', '68270', 'WITTENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068092', 'BLOTZHEIM REGIO BASKET CLUB', '68730', 'BLOTZHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068102', 'COLMAR BASKET', '68000', 'COLMAR', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068107', 'PANTHERES MULHOUSE BASKET ALSACE', '68200', 'MULHOUSE', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068112', 'BASKET NORD SUNDGAU', '68720', 'ILLFURTH', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068113', 'HARDTKIDS BASKET', '68490', 'BANTZENHEIM', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL')),
    ('GES0068114', 'EN-LUTTERBACH/REININGUE', '68460', 'LUTTERBACH', (SELECT id FROM committees WHERE name = 'COMITE DU HAUT-RHIN DE BASKET-BALL'));

-- from clubs/69_rhone_et_lyon.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('ARA0069001', 'CD69 - HORS ASSOCIATION - RHONE ET METROPOLE DE LYON DE BASKET BALL', '69500', 'BRON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069004', 'BC ST GERMAIN NUELLES', '69210', 'SAINT-GERMAIN-SUR-L''ARBRESLE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069005', 'AL ANSE BASKET', '69480', 'ANSE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069006', 'AL ANTONIN PERRIN', '69100', 'VILLEURBANNE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069007', 'BASKET CLUB BELLEVILLE', '69220', 'BELLEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069008', 'AL CALUIRE ET CUIRE', '69300', 'CALUIRE-ET-CUIRE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069010', 'BASKET LANCIE FLEURIE VILLIE MORGON', '69820', 'FLEURIE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069011', 'AL GERLAND MOUCHE LYON', '69007', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069012', 'AL MEYZIEU', '69330', 'MEYZIEU', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069013', 'BC MIONS', '69780', 'MIONS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069014', 'AL MIXTE RAMBERTOISE', '69009', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069016', 'BEAUJOLAIS BASKET', '69430', 'QUINCIE-EN-BEAUJOLAIS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069018', 'BALE SAINT GENIS LAVAL', '69230', 'SAINT-GENIS-LAVAL', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069020', 'AL SAINT PRIEST', '69800', 'SAINT-PRIEST', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069021', 'AL TROLLSPORTS', '69003', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069023', 'AMPUIS VIENNE SAINT ROMAIN REVENTIN BASKET', '69420', 'AMPUIS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069024', 'AS ANDEOLAISE', '69700', 'BEAUVALLON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069025', 'BEAUMARCHAIS BASKET LYON METROPOLE', '69005', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069028', 'AS BUERS VILLEURBANNE', '69100', 'VILLEURBANNE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069029', 'AS COLLONGES', '69660', 'COLLONGES-AU-MONT-D''OR', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069032', 'AMICALE SPORTIVE DE LA GROSNE', '69430', 'AVENAS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069033', 'ASC MONTS D''OR', '69380', 'LISSIEU', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069034', 'OUEST LYONNAIS BASKET', '69370', 'SAINT-DIDIER-AU-MONT-D''OR', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069035', 'AS LYON DUCHERE', '69009', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069036', 'B CHARPENNES CROIX LUIZET', '69100', 'VILLEURBANNE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069037', 'ASE MUROISE BASKET', '69720', 'SAINT-BONNET-DE-MURE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069038', 'ASB SAINT FORGEUX', '69490', 'SAINT-FORGEUX', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069039', 'AS GREZIEU LA VARENNE BASKET', '69290', 'GREZIEU-LA-VARENNE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069043', 'JONS BASKET CLUB', '69330', 'JONS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069045', 'TRAIT D''UNION MONTAGNY BASKET', '69002', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069048', 'SOLAIZE SPORT BASKET', '69360', 'SOLAIZE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069049', 'BASKET UNION HAUT LYONNAIS', '69850', 'SAINT-MARTIN-EN-HAUT', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069052', 'AS TARARE', '69170', 'TARARE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069053', 'ASUL LYON BASKET', '69003', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069054', 'ASVEL BASKET', '69100', 'VILLEURBANNE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069055', 'BASKET CLUB ARBRESLOIS', '69210', 'L''ARBRESLE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069056', 'BLEES LENTILLY', '69210', 'LENTILLY', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069057', 'BL SAIN BELOIS', '69210', 'SAIN-BEL', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069058', 'BRON BASKET CLUB', '69500', 'BRON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069060', 'BALLE VERTE DE LETRA', '69620', 'LETRA', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069062', 'BASKET CLUB DES MONTS LYONNAIS', '69610', 'SAINTE-FOY-L''ARGENTIERE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069064', 'BASKET CLUB FEYZIN', '69320', 'FEYZIN', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069065', 'C BELLECOMBE', '69006', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069069', 'CLAR LYON BASKET', '69006', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069070', 'CO CHANDIEU', '69780', 'SAINT-PIERRE-DE-CHANDIEU', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069071', 'CLUB OMNISPORTS SAINT FONS', '69190', 'SAINT-FONS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069072', 'BASKET CRO LYON', '69001', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069073', 'CLUB SPORTIF DE DECINES BASKET', '69150', 'DECINES-CHARPIEU', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069074', 'CS MENIVAL SAINT PRIEST', '69800', 'SAINT-PRIEST', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069075', 'GRIGNY BASKET CLUB', '69520', 'GRIGNY-SUR-RHONE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069076', 'CORBAS BASKET CLUB', '69960', 'CORBAS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069078', 'BC DES COTEAUX DU LYONNAIS', '69440', 'SAINT-LAURENT-D''AGNY', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069080', 'CERCLE SPORTIF DE L''OZON', '69360', 'SAINT-SYMPHORIEN-D''OZON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069082', 'ENTENTE BAGNOLS BOIS D''OINGT', '69620', 'Val d''Oingt', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069085', 'ETOILE GRANDRISIENNE', '69870', 'GRANDRIS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069086', 'ESPERANCE SAINTE BLANDINE', '69002', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069088', 'CHASSIEU BASKET', '69680', 'CHASSIEU', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069090', 'EVEIL SPORTIF GENAS AZIEU', '69740', 'GENAS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069091', 'ENTENTE SAINT GENOISE', '69290', 'SAINT-GENIS-LES-OLLIERES', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069092', 'EVEIL SPORTIF JONAGEOIS', '69330', 'JONAGE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069094', 'ES SAINT JEAN TOUSLAS', '69700', 'BEAUVALLON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069096', 'EVEIL DE LYON', '69006', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069097', 'EXCELSIOR CHAPONOST', '69630', 'CHAPONOST', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069098', 'FC LYON ASVEL FEMININ', '69008', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069101', 'OULLINS STE FOY BASKET BALL', '69110', 'SAINTE-FOY-LES-LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069103', 'BC VILLEFRANCHE BEAUJOLAIS', '69400', 'VILLEFRANCHE EN BEAUJOLAIS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069104', 'LA PERREONNAISE BASKET', '69460', 'PERREON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069106', 'OLYMPIC SATHONAY', '69580', 'SATHONAY-CAMP', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069108', 'PATRONAGE LAIQUE DE CRAPONNE', '69290', 'CRAPONNE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069109', 'PL HERRIOT MERMOZ LYON 8', '69008', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069110', 'PATRONAGE LAIQUE D''OULLINS', '69600', 'OULLINS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069111', 'PONTCHARRA SPORTS', '69490', 'PONTCHARRA-SUR-TURDINE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069112', 'ANIMATION SPORTS LOISIRS DE SAINT MARCEL L''ECLAIRE', '69170', 'SAINT-MARCEL-L''ECLAIRE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069114', 'LES FALCONS DE PUSIGNAN', '69330', 'PUSIGNAN', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069115', 'AL VENISSIEUX PARILLY', '69200', 'VENISSIEUX', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069117', 'SOCIETE BESSENOISE DE BASKET', '69690', 'BESSENAY', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069118', 'SEL GRAND TROU BASKET BALL', '69008', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069119', 'ST LOUIS FONTAINES SUR SAONE', '69270', 'FONTAINES-SUR-SAONE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069120', 'SO GIVORS BASKET', '69700', 'GIVORS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069122', 'TAC BASKET LA TOUR DE SALVAGNY', '69890', 'TOUR-DE-SALVAGNY', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069124', 'UNION OLYMPIQUE DEMI-LUNOISE TASSIN ECULLY OLYMPIQUE BASKET', '69160', 'TASSIN-LA-DEMI-LUNE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069125', 'UNION SPORTIVE AZERGOISE', '69380', 'CHAZAY-D''AZERGUES', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069126', 'FRANCHEVILLE BASKET', '69340', 'FRANCHEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069129', 'UNION SPORTIVE PIERRE BENITE', '69310', 'PIERRE-BENITE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069130', 'USOL VAUGNERAY BRINDAS', '69670', 'VAUGNERAY', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069142', 'AS CLAVEISOLLES', '69870', 'CLAVEISOLLES', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069150', 'CLUB SPORTIF DE LOZANNE', '69380', 'LOZANNE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069152', 'BASKET ATHLETIQUE CLUB SATOLAS', '69500', 'BRON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069159', 'BASKET CLUB COMMUNAY TERNAY', '69360', 'COMMUNAY', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069160', 'ASVEL VILLEURBANNE BASKET FEMININ', '69100', 'VILLEURBANNE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069162', 'AS MORNANTAISE', '69440', 'MORNANT', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069168', 'JEUNESSE ATHLETIQUE HEYRIEUX', '69780', 'MIONS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069172', 'HAUT BEAUJOLAIS BASKET', '69470', 'COURS-LA-VILLE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069173', 'CUBLIZE ASC', '69550', 'CUBLIZE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069176', 'AS THIZY BOURG', '69240', 'THIZY', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069177', 'AMPLEPUIS BC', '69550', 'AMPLEPUIS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069180', 'SAINT JEAN LA BUSSIERE BASKET', '69550', 'SAINT-JEAN-LA-BUSSIERE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069184', 'LARAJASSE BC', '69590', 'LARAJASSE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069187', 'VOLTAIRE LYON BASKET', '69009', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069193', 'AMICALE LAÏQUE IRIGNY VERNAISON BASKET', '69540', 'IRIGNY', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069206', 'CLAM VENISSIEUX', '69200', 'VENISSIEUX', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069207', 'VAULX EN VELIN BASKET CLUB', '69120', 'VAULX-EN-VELIN', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069209', 'SUD LYONNAIS BASKET (SLB)', '69390', 'MILLERY', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069210', 'BASKET CLUB DE POMMIERS', '69480', 'POMMIERS', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069211', 'BASKET RILLIEUX CREPIEUX', '69140', 'RILLIEUX-LA-PAPE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069212', 'NEUVILLE BASKET', '69250', 'NEUVILLE-SUR-SAONE', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069223', 'BASKET BALL 5EME', '69005', 'LYON', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069229', 'ASSOCIATION BASKET ST PIERRE SAVIGNY', '69210', 'SAINT-PIERRE-LA-PALUD', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069231', 'ST GENIS OULLINS STE FOY FEMININ', '69230', 'SAINT-GENIS-LAVAL', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL')),
    ('ARA0069234', 'BASKET CLUB DES GONES DE L''OUEST ECULLY', '69130', 'ECULLY', (SELECT id FROM committees WHERE name = 'COMITE DU RHONE ET METROPOLE DE LYON DE BASKET-BALL'));

-- from clubs/70_haute_saone.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('70000', 'BFC0070001', 'CD70/90 – HAUTE SAONE ET TERRITOIRE DE BELFORT BASKET BALL', 'VESOUL', (SELECT id FROM committees WHERE name = 'COMITE DE HAUTE-SAONE DE BASKET-BALL')),
    ('70220', 'BFC0070002', 'FOUGEROLLES BC', 'FOUGEROLLES', (SELECT id FROM committees WHERE name = 'COMITE DE HAUTE-SAONE DE BASKET-BALL')),
    ('70000', 'BFC0070003', 'AVANT GARDE de la MOTTE VESOUL', 'VESOUL', (SELECT id FROM committees WHERE name = 'COMITE DE HAUTE-SAONE DE BASKET-BALL')),
    ('70100', 'BFC0070004', 'VAL DE GRAY BASKET', 'ARC-LES-GRAY', (SELECT id FROM committees WHERE name = 'COMITE DE HAUTE-SAONE DE BASKET-BALL')),
    ('70400', 'BFC0070005', 'SPORTS GENERAUX HERICOURT BASKET', 'HERICOURT', (SELECT id FROM committees WHERE name = 'COMITE DE HAUTE-SAONE DE BASKET-BALL')),
    ('70800', 'BFC0070006', 'ST LOUP FC', 'SAINT-LOUP-SUR-SEMOUSE', (SELECT id FROM committees WHERE name = 'COMITE DE HAUTE-SAONE DE BASKET-BALL')),
    ('70300', 'BFC0070007', 'AL LUXEUIL', 'LUXEUIL-LES-BAINS', (SELECT id FROM committees WHERE name = 'COMITE DE HAUTE-SAONE DE BASKET-BALL')),
    ('70200', 'BFC0070008', 'LURE BC', 'MAGNY-VERNOIS', (SELECT id FROM committees WHERE name = 'COMITE DE HAUTE-SAONE DE BASKET-BALL')),
    ('70170', 'BFC0070009', 'PORT SUR SAONE', 'PORT-SUR-SAONE', (SELECT id FROM committees WHERE name = 'COMITE DE HAUTE-SAONE DE BASKET-BALL')),
    ('70500', 'BFC0070011', 'BASKET BALL JUSSEEN', 'JUSSEY', (SELECT id FROM committees WHERE name = 'COMITE DE HAUTE-SAONE DE BASKET-BALL')),
    ('70400', 'BFC0070026', 'CHENEVIERE BASKET HERICOURT', 'HERICOURT', (SELECT id FROM committees WHERE name = 'COMITE DE HAUTE-SAONE DE BASKET-BALL'));

-- from clubs/71_saone_et_loire.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('BFC0071001', 'CD 71 HORS ASSOCIATION', 71300, 'MONTCEAU-LES-MINES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071003', 'LA VAILLANTE D''AUTUN', 71400, 'AUTUN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071004', 'US BOURBON LANCY', 71140, 'BOURBON-LANCY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071005', 'AL CHAGNY BASKET', 71150, 'CHAGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071006', 'ELAN CHALON', 71100, 'CHALON-SUR-SAONE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071007', 'CHALON SUR SAONE BASKET CLUB', 71100, 'CHALON-SUR-SAONE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071008', 'CHARNAY BASKET BOURGOGNE SUD', 71850, 'CHARNAY-LES-MACON', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071009', 'CLUB BASKET BUXYNOIS', 71390, 'BUXY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071012', 'UNION SPORTIVE CLUNISOISE BASKET BALL', 71250, 'CLUNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071014', 'AS BASKET CHATENOY LE ROYAL', 71880, 'CHATENOY-LE-ROYAL', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071016', 'CURGY BASKET', 71400, 'CURGY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071018', 'BASKET CLUB ETANGEOIS', 71190, 'MESVRES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071020', 'GUEUGNON BASKET', 71130, 'GUEUGNON', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071023', 'AS LA CHAPELLE DE GUINCHAY', 71570, 'LA CHAPELLE-DE-GUINCHAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071024', 'SPORTS REUNIS CLAYETTOIS', 71800, 'CLAYETTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071025', 'ALLIANCE BASKET CREUSOTIN', 71200, 'LE CREUSOT', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071027', 'LOUHANS BASKET BALL CLUB', 71500, 'LOUHANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071028', 'BASKET CLUB FONTAINES RULLY', 71150, 'RULLY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071029', 'MARCIGNY BASKET CLUB', 71110, 'MARCIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071030', 'BASKET CLUB DE MATOUR', 71520, 'MATOUR', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071031', 'CS DE MERVANS', 71310, 'MERVANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071032', 'MONTCHANIN BASKET CLUB', 71210, 'MONTCHANIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071033', 'BASKET MONTCEAU BOURGOGNE', 71300, 'MONTCEAU-LES-MINES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071034', 'JS OUROUX SUR SAONE', 71370, 'OUROUX-SUR-SAONE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071035', 'BASKET CLUB PALINGEOIS', 71430, 'PALINGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071036', 'USCP PARAY LE MONIAL', 71600, 'PARAY-LE-MONIAL', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071037', 'ES PRISSE MACON', 71960, 'PRISSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071040', 'CS SAINT LOUP GEANGES', 71350, 'SAINT-LOUP-DE-LA-SALLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071041', 'BC SAINT MARTIN BELLE ROCHE', 71118, 'SAINT-MARTIN-BELLE-ROCHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071043', 'US SAN REMOISE SAINT REMY', 71100, 'SAINT-REMY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071044', 'CS LAIC SAINT VALLIER', 71230, 'SAINT-VALLIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071047', 'AS TOURNUS', 71700, 'TOURNUS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071050', 'AS VERDUN SUR LE DOUBS', 71350, 'VERDUN-SUR-LE-DOUBS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071053', 'AMICALE SPORTIVE SANCE BASKET', 71000, 'SANCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071054', 'EPINAC BASKET', 71360, 'EPINAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071056', 'AS IGUERANDE', 71340, 'IGUERANDE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071057', 'BREUIL BASKET CLUB', 71670, 'LE BREUIL', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071058', 'CLUB BASKET CHAROLLES', 71120, 'CHAROLLES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071059', '(C.S.A) CLUB SPORTIF AUTUNOIS', 71400, 'AUTUN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071076', 'AUGUSTE EVENTS 3X3 (AE3)', 71400, 'AUTUN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071079', 'Entente CSL ST VALLIER/B.MONTCEAU.B', 71230, 'SAINT-VALLIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071084', 'GIVRY WINEGROWERS', 71100, 'SAINT-REMY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL')),
    ('BFC0071086', 'ENT USCPARAY/PALINGES', 71600, 'PARAY-LE-MONIAL', (SELECT id FROM committees WHERE name = 'COMITE DE LA SAONE-ET-LOIRE DE BASKET-BALL'));

-- from clubs/72_sarthe.sql
INSERT INTO clubs (code, name, zip_code, city, committee_id)
VALUES
    ('PDL0072001', 'ALLONNES J.S.', 72700, 'ALLONNES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072002', 'ARNAGE U.S.', 72230, 'ARNAGE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072003', 'BEAUMONT A.S.', 72170, 'BEAUMONT-SUR-SARTHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072004', 'CHATEAU DU LOIR C.O.C.', 72500, 'MONTVAL-SUR-LOIR', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072005', 'COULAINES J.S.', 72190, 'COULAINES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072006', 'CERANS YVRE BASKET', 72330, 'CERANS-FOULLETOURTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072007', 'LA FERTE BERNARD V.S.', 72400, 'LA FERTE-BERNARD', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072008', 'LA FLECHE US', 72200, 'LA FLECHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072009', 'GUECELARD B.B.C.', 72230, 'GUECELARD', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072010', 'JOUE L''ABBE MONTBIZOT', 72380, 'JOUE-L''ABBE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072011', 'MAMERS S.A.', 72600, 'MAMERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072012', 'LE MANS SAINT PAVIN', 72000, 'LE MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072013', 'MONTFORT SPORT BASKET', 72450, 'MONTFORT-LE-GESNOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072014', 'LE MANS S.L.B.', 72000, 'LE MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072017', 'LE MANS C.S.S.G.', 72000, 'LE MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072018', 'LE MANS GSOS', 72000, 'LE MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072019', 'LE MANS JALT', 72000, 'LE MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072020', 'LE MANS J.C.M.', 72000, 'LE MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072021', 'LE MANS SCM', 72000, 'LE MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072024', 'ROUILLON E.G', 72700, 'ROUILLON', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072027', 'ANILLE BRAYE BASKET', 72120, 'SAINT-CALAIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072028', 'SAINT MARS LA BRIERE US', 72470, 'SAINT-MARS-LA-BRIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072029', 'ST MARS D OUTILLE LES MOUETTES', 72220, 'SAINT-MARS-D''OUTILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072030', 'SILLE LE PHILIPPE B.C', 72460, 'SILLE-LE-PHILIPPE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072032', 'LE MANS A.S.MADELEINE', 72000, 'LE MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072033', 'CONLIE B.C.', 72240, 'CONLIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072035', 'CD72 – HORS ASSOCIATION – SARTHE', 72000, 'LE MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072036', 'BASKET BALL CLUB CHANGÉEN', 72560, 'CHANGE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072039', 'RUAUDIN JEUNESSES SPORTIVE', 72230, 'RUAUDIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072040', 'BASKET CANTONAL MALICORNAIS', 72270, 'MALICORNE-SUR-SARTHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072044', 'LA CHARTRE A.S.', 72340, 'LA CHARTRE-SUR-LE-LOIR', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072046', 'LAIGNE ST GERVAIS CO', 72220, 'LAIGNE-EN-BELIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072048', 'LE GRAND LUCE UNION SPORTIVE', 72150, 'LE GRAND-LUCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072052', 'MANSIGNE BASKET CLUB', 72510, 'MANSIGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072055', 'SABLE BASKET', 72300, 'SABLE-SUR-SARTHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072056', 'SOM BASKET-BALL', 72000, 'LE MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072057', 'CHAMPAGNE ES', 72470, 'CHAMPAGNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072058', 'MULSANNE BASKET 2000', 72230, 'MULSANNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072060', 'SAVIGNE L''EVEQUE B.C.', 72460, 'SAVIGNE-L''EVEQUE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072068', 'ENT SILLE LE PHILIPPE - SAVIGNE L''EVEQUE', 72460, 'SILLE-LE-PHILIPPE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072069', 'ETIVAL BASKET CLUB', 72700, 'ETIVAL-LES-LE-MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072070', 'FRESNAY /SARTHE', 72130, 'FRESNAY-SUR-SARTHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072071', 'LA CHAPELLE ST AUBIN', 72650, 'LA CHAPELLE-SAINT-AUBIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072072', 'ENT SAVIGNE L''EVEQUE - SILLE LE PHILIPPE', 72460, 'SAVIGNE-L''EVEQUE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072074', 'ECOMMOY K.B.C.', 72220, 'ECOMMOY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072075', 'MAROLLAIS S.C.', 72260, 'MAROLLES-LES-BRAULTS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072077', 'BASKET CLUB ROEZEEN', 72210, 'ROEZE-SUR-SARTHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072078', 'BOULOIRE US', 72440, 'BOULOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072079', 'ENT GUECELARD - CERANS YVRE', 72230, 'GUECELARD', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072080', 'NEUVILLE BASKET ASSOCIATION', 72190, 'NEUVILLE-SUR-SARTHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072082', 'THE MANSTER', 72100, 'LE MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072083', 'LOUE-BRULON', 72540, 'LOUE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072085', 'COULANS SUR GÉE BASKET CLUB', 72550, 'COULANS-SUR-GEE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072086', 'BASKET CLUB YVRÉEN', 72530, 'YVRE-L''EVEQUE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL')),
    ('PDL0072104', 'ASCE MMA', 72000, 'LE MANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SARTHE DE BASKET-BALL'));

-- from clubs/73_savoie.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id) VALUES
    ('73200', 'ARA0073002', 'GILLY SAVOIE BASKET', 'GILLY-SUR-ISERE', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73230', 'ARA0073004', 'E BARBY ST ALBAN', 'SAINT-ALBAN-LEYSSE', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73870', 'ARA0073007', 'AS MAURIENNAISE', 'SAINT-JULIEN-MONT-DENIS', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73000', 'ARA0073008', 'JS CHAMBERIENNE', 'CHAMBERY', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73700', 'ARA0073009', 'BASKET BALL BORAIN HAUTE TARENTAISE', 'BOURG-SAINT-MAURICE', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73800', 'ARA0073011', 'MONTMELIAN BS', 'MONTMELIAN', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73300', 'ARA0073014', 'B C MAURIENNAIS', 'SAINT-JEAN-DE-MAURIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73470', 'ARA0073019', 'BC NOVALAISE', 'NOVALAISE', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73100', 'ARA0073024', 'AIX MAURIENNE S B', 'AIX-LES-BAINS', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73200', 'ARA0073026', 'JEUNESSE ALBERTVILLE BASKET', 'ALBERTVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73460', 'ARA0073027', 'FRONTENEX BASKET CLUB', 'FRONTENEX', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73190', 'ARA0073032', 'LA RAVOIRE CHALLES BASKET', 'CHALLES-LES-EAUX', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73290', 'ARA0073033', 'CHAMBERY LA MOTTE COGNIN BASKET SAVOIE', 'MOTTE-SERVOLEX', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73000', 'ARA0073035', 'CD SAVOIE - HA', 'BARBERAZ', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73140', 'ARA0073036', 'ES MARTIN S MICHEL', 'SAINT-MICHEL-DE-MAURIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73130', 'ARA0073038', 'B C CUINES', 'SAINT-ETIENNE-DE-CUINES', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL')),
    ('73470', 'ARA0073040', 'SAINT GENIX SAVOIE BASKET', 'MARCIEUX', (SELECT id FROM committees WHERE name = 'COMITE DE SAVOIE DE BASKET-BALL'));

-- from clubs/74_haute_savoie.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('74600', 'ARA0074001', 'CD DE HAUTE-SAVOIE - H-A', 'SEYNOD', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74100', 'ARA0074004', 'ANNEMASSE BASKET CLUB', 'ANNEMASSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74130', 'ARA0074005', 'BONNEVILLE BASKET CLUB', 'BONNEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74350', 'ARA0074006', 'SALEVE BASKET CRUSEILLES', 'CRUSEILLES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74960', 'ARA0074007', 'CRAN PRINGY ANNECY BASKET', 'CRAN-GEVRIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74330', 'ARA0074008', 'ETOILE SPORTIVE EPAGNY METZ TESSY', 'EPAGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74210', 'ARA0074010', 'CLUB SPORTIF FAVERGES', 'FAVERGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74270', 'ARA0074012', 'ASSOCIATION SPORTIVE F FRANGY', 'FRANGY', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74330', 'ARA0074013', 'BASKET CLUB LA BALME DE SILLINGY', 'LA BALME-DE-SILLINGY', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74150', 'ARA0074014', 'BASKET CLUB DU PAYS D''ALBY', 'RUMILLY', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74250', 'ARA0074016', 'VIUZ BASKET CLUB', 'VIUZ-EN-SALLAZ', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74150', 'ARA0074017', 'RUMILLY BASKET CLUB', 'RUMILLY', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74410', 'ARA0074018', 'ENTENTE SAINT JORIOZ BASKET- FAVERGES BASKET', 'SAINT-JORIOZ', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74950', 'ARA0074019', 'CLUSES SCIONZIER THYEZ BASKET', 'SCIONZIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74000', 'ARA0074020', 'LAB ANNECY BASKETBALL', 'ANNECY', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74600', 'ARA0074022', 'ANNECY BASKET', 'SEYNOD', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74200', 'ARA0074023', 'STELLA THONON BASKET', 'THONON-LES-BAINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74160', 'ARA0074024', 'BASKET CLUB SAINT JULIEN EN GENEVOIS', 'SAINT-JULIEN-EN-GENEVOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74500', 'ARA0074025', 'FLAP PUBLIER', 'PUBLIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74100', 'ARA0074027', 'VILLE LA GRAND BASKET', 'VILLE-LA-GRAND', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74910', 'ARA0074028', 'SEYSSEL SUR RHONE BASKET', 'SEYSSEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74140', 'ARA0074029', 'BASKET CLUB DU BAS CHABLAIS', 'DOUVAINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74410', 'ARA0074030', 'UNION CLUB BASKET ST JORIOZ', 'SAINT-JORIOZ', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74230', 'ARA0074031', 'THONES BASKET', 'THONES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74700', 'ARA0074032', 'SALLANCHES BASKET CLUB', 'SALLANCHES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL')),
    ('74800', 'ARA0074037', 'BASKET CLUB DU PAYS ROCHOIS', 'ROCHE-SUR-FORON', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-SAVOIE DE BASKET-BALL'));

-- from clubs/75_paris.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('75013', 'IDF0075001', 'CD75 – HORS ASSOCIATION – PARIS', 'PARIS 13E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75010', 'IDF0075004', 'ASC BNP PARIBAS', 'PARIS 10E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75017', 'IDF0075006', 'LA SALESIENNE DE PARIS', 'PARIS 17E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75011', 'IDF0075009', 'APSAP VILLE DE PARIS', 'PARIS 11E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75015', 'IDF0075011', 'AS CE FRANCE TELEVISIONS', 'PARIS 15E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75020', 'IDF0075012', 'PARIS LADY BASKET', 'PARIS 20E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75018', 'IDF0075013', 'LAPELCHA', 'PARIS 18E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75017', 'IDF0075014', 'SCUF - SPORTING CLUB UNIVERSITAIRE DE FRANCE', 'PARIS 17E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75019', 'IDF0075015', 'CLUB SPORTIF PARIS 19 EME', 'PARIS 19E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75007', 'IDF0075019', 'AS BON CONSEIL', 'PARIS 7E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75018', 'IDF0075020', 'BASSE COUR BASKET', 'PARIS 18E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75017', 'IDF0075026', 'AS ST CHARLES', 'PARIS 17E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75018', 'IDF0075031', 'CHAMPIONNET SPORTS', 'PARIS 18E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75016', 'IDF0075033', 'PARIS JEAN BOUIN CASG', 'PARIS 16E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75011', 'IDF0075034', 'CLUB BASKET PARIS 11', 'PARIS 11E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75015', 'IDF0075035', 'EIFFEL BASKET CLUB', 'PARIS 15E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75009', 'IDF0075036', 'PARIS BASKET 9', 'PARIS 9E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75012', 'IDF0075038', 'CSM FINANCES PARIS', 'PARIS 12E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75013', 'IDF0075043', 'LA DOMREMY BASKET 13', 'PARIS 13E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75018', 'IDF0075044', 'ESPACE JEUNE GOUTTE D''OR', 'PARIS 18E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75020', 'IDF0075045', 'MENILMONTANT PARIS SPORTS', 'PARIS 20E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75014', 'IDF0075046', 'PARIS BASKET 15', 'PARIS 14E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75015', 'IDF0075047', 'PARIS AMICALE CAMOU', 'PARIS 15E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75013', 'IDF0075048', 'PARIS UNIVERSITE CLUB', 'PARIS 13E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75018', 'IDF0075049', 'PARIS BASKET 18', 'PARIS 18E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75010', 'IDF0075053', 'SPORTING CLUB MACCABI DE PARIS', 'PARIS 10E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75016', 'IDF0075055', 'STADE FRANCAIS BASKET', 'PARIS 16E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75020', 'IDF0075056', 'USD CHARONNE', 'PARIS 20E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75018', 'IDF0075057', 'UA SOCIETE GENERALE-UASG', 'PARIS 18E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75017', 'IDF0075058', 'AS UGAB UNION SPORTIVE NUBAR', 'PARIS 17E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75013', 'IDF0075060', 'US METRO TRANSPORTS BASKET', 'PARIS 13E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75009', 'IDF0075063', 'AS HOMENETMEN FRANCE', 'PARIS 9E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75011', 'IDF0075065', 'MX OMNISPORTS', 'PARIS 11E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75015', 'IDF0075066', 'BASKETTEURS ASSOCIES', 'PARIS 15E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75018', 'IDF0075074', 'LAPELCHA - GOUTTE D''OR', 'PARIS 18E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75013', 'IDF0075077', 'PARIS BASKETBALL ASSOCIATION', 'PARIS 13E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75012', 'IDF0075079', 'CSMF PARIS', 'PARIS 12E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75116', 'IDF0075082', 'NICOLAITE DE CHAILLOT', 'PARIS 16E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75012', 'IDF0075083', 'CENTRE FEDERAL BB', 'PARIS 12E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75014', 'IDF0075084', 'BASKET PARIS 14', 'PARIS 14E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75020', 'IDF0075091', 'PARIS BASKET CENTRE 3', 'PARIS 20E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75014', 'IDF0075094', 'HUSTLE PARIS BASKET', 'PARIS 14E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75014', 'IDF0075096', 'INSEE PARIS CLUB', 'PARIS 14E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75018', 'IDF0075103', 'L.M.P. ASSOCIATION', 'PARIS 18E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75020', 'IDF0075106', 'PARIS ACADEMIE RESPECT INTEGRITE SPORT', 'PARIS 20E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75017', 'IDF0075107', 'FEEDBAC', 'PARIS 17E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75013', 'IDF0075113', 'PARIS SUD BASKET', 'PARIS 13E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75010', 'IDF0075120', 'ASSOCIATION CHINOISE DE BASKETBALL EN FRANCE', 'PARIS 10E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75014', 'IDF0075124', 'ENTENTE PARIS BASKET 15 - BASKETTEURS ASSOCIES', 'PARIS 14E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75003', 'IDF0075127', 'VIKING CLUB PARIS', 'PARIS 3E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75001', 'IDF0075128', 'ASSOCIATION DES SPORTS AU BARREAU DE PARIS', 'PARIS 1ER ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75008', 'IDF0075134', 'NIKE PARIS BASKETBALL', 'PARIS 8E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75010', 'IDF0075136', 'NEGATIV BASKETBALL', 'PARIS 10E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL')),
    ('75004', 'IDF0075137', 'PARIS BASKET BOWL', 'PARIS 4E ARRONDISSEMENT', (SELECT id FROM committees WHERE name = 'COMITE DE PARIS DE BASKET-BALL'));

-- from clubs/76_seine_maritime.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('76600', 'NOR0076001', 'CD 76 HORS ASSOCIATION', 'LE HAVRE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76610', 'NOR0076002', 'APLEMONT LE HAVRE BASKET', 'LE HAVRE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76700', 'NOR0076003', 'AMICALE LAIQUE HARFLEUR', 'HARFLEUR', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76290', 'NOR0076004', 'AMICALE LAIQUE MONTIVILLIERS B.', 'MONTIVILLIERS', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76190', 'NOR0076005', 'AMICALE SPORTIVE VEAUVILLAISE', 'YVETOT', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76600', 'NOR0076008', 'AS CHEMINOTS HAVRAIS', 'LE HAVRE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76600', 'NOR0076009', 'LE.HAVRE-S’PORT', 'LE HAVRE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76440', 'NOR0076010', 'UNION SPORTIVE DE FORGES-LES-EAUX BASKET-BALL', 'FORGES-LES-EAUX', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76620', 'NOR0076011', 'AS SAINT DENIS SANVIC', 'LE HAVRE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76700', 'NOR0076012', 'ES MUP GONFREVILLE L''ORCHER', 'GONFREVILLE-L''ORCHER', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76430', 'NOR0076013', 'ASSOCIATION SPORTIVE SANDOUVILLE BASKET', 'SANDOUVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76930', 'NOR0076014', 'BASKET CLUB OCTEVILLE SUR MER', 'OCTEVILLE-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76710', 'NOR0076015', 'BASKET CLUB MAROMME', 'MONTVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76000', 'NOR0076016', 'BERIZ LOBBY', 'ROUEN', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76330', 'NOR0076017', 'CLUB SPORTIF GRAVENCHONNAIS', 'NOTRE-DAME-DE-GRAVENCHON', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76110', 'NOR0076018', 'ASSOCIATION SPORTIVE GODERVILLAISE ET BRETTEVILLAISE DE BASKET-BALL', 'GODERVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76410', 'NOR0076020', 'CLEON BASKETBALL ACADEMY 410', 'CLEON', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76210', 'NOR0076021', 'FOOTBALL CLUB GRUCHET VALASSE', 'GRUCHET-LE-VALASSE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76280', 'NOR0076023', 'ASSOCIATION SPORTS ET LOISIRS DE GONNEVILLE LA MALLET', 'GONNEVILLE-LA-MALLET', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76600', 'NOR0076026', 'LOISIRS COOPERATIFS HAVRAIS', 'LE HAVRE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76430', 'NOR0076027', 'PATRONAGE LAIQUE HAVRAIS', 'ETAINHUS', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76600', 'NOR0076029', 'ASCL LE HAVRE', 'LE HAVRE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76210', 'NOR0076030', 'BOLBEC BASKET CLUB', 'BOLBEC', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76700', 'NOR0076031', 'ENTENTE SLAC ROGERVILLE', 'SAINT-LAURENT-DE-BREVEDENT', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76400', 'NOR0076033', 'UNION SPORTIVE FECAMPOISE', 'FECAMP', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76960', 'NOR0076034', 'LES SPHINX DE NOTRE-DAME-DE-BONDEVILLE', 'NOTRE-DAME-DE-BONDEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76170', 'NOR0076035', 'UNION SPORTIVE LILLEBONNAISE', 'LILLEBONNE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76600', 'NOR0076036', 'US SAINTE MARIE LE HAVRE', 'LE HAVRE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76600', 'NOR0076037', 'SAINT THOMAS BASKET LE HAVRE', 'LE HAVRE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76490', 'NOR0076042', 'BASKET CLUB DE CAUDEBEC EN CAUX (B3C)', 'CAUDEBEC-EN-CAUX', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76120', 'NOR0076043', 'AL CESAIRE LEVILLAIN', 'GRAND-QUEVILLY', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76250', 'NOR0076044', 'ASSOCIATION LAIQUE DEVILLE BASKET', 'DEVILLE-LES-ROUEN', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76530', 'NOR0076045', 'AMICALE LAIQUE LES ESSARTS', 'GRAND-COURONNE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76160', 'NOR0076047', 'US ST JACQUES SUR DARNETAL', 'SAINT-JACQUES-SUR-DARNETAL', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76650', 'NOR0076048', 'AS AMICALE COURONNAISE', 'PETIT-COURONNE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76780', 'NOR0076051', 'ASJ CROISY SUR ANDELLE', 'CROISY-SUR-ANDELLE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76240', 'NOR0076052', 'BASKET MESNIL FRANQUEVILLE BOOS', 'MESNIL-ESNARD', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76130', 'NOR0076053', 'MONT SAINT AIGNAN BASKET CLUB', 'MONT-SAINT-AIGNAN', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76000', 'NOR0076055', 'ASPTT DE ROUEN', 'ROUEN', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76360', 'NOR0076056', 'BASKET CLUB DE BARENTIN', 'BARENTIN', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76770', 'NOR0076057', 'BASKET CLUB DE MALAUNAY', 'MALAUNAY', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76380', 'NOR0076058', 'CLUB ATHLETIQUE DE CANTELEU', 'CANTELEU', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76350', 'NOR0076059', 'OISSEL BASKET SEINE', 'OISSEL', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76500', 'NOR0076060', 'CO REGION ELBEUVIENNE', 'ELBEUF', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76760', 'NOR0076061', 'CO REGION YERVILLE', 'YERVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76140', 'NOR0076062', 'CBPQ', 'PETIT-QUEVILLY', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76710', 'NOR0076065', 'MONTVILLE HOUPPEVILLE BASKET BALL', 'MONTVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76680', 'NOR0076066', 'GCO BIHOREL', 'CRITOT', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76210', 'NOR0076067', 'BC BEUZEVILLE LA GRENIER', 'BEUZEVILLE-LA-GRENIER', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76160', 'NOR0076069', 'OLYMPIQUE DE DARNETAL', 'DARNETAL', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76100', 'NOR0076071', 'SPO ROUEN BASKETBALL', 'ROUEN', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76300', 'NOR0076072', 'ST SOTTEVILLAIS CHEMINOT CLUB', 'SOTTEVILLE-LES-ROUEN', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76230', 'NOR0076073', 'QUINCAMPOIX BASKET', 'ISNEAUVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76570', 'NOR0076074', 'UNION SPORTIVE PAVILLY BASKET', 'PAVILLY', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76580', 'NOR0076075', 'UNION SPORTIVE LE TRAIT YAINVILL', 'TRAIT', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76200', 'NOR0076079', 'DIEPPE BASKET', 'DIEPPE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76370', 'NOR0076080', 'BASKET CLUB DE ROUXMESNIL', 'ROUXMESNIL-BOUTEILLES', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76510', 'NOR0076082', 'CEP SAINT NICOLAS D''ALIERMONT BBC', 'SAINT-NICOLAS-D''ALIERMONT', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76410', 'NOR0076083', 'TOURVILLE LA RIVIERE BASKET BALL', 'TOURVILLE-LA-RIVIERE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76880', 'NOR0076084', 'ETOILE SPORTIVE ARQUAISE', 'ARQUES-LA-BATAILLE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76550', 'NOR0076085', 'BASKET CLUB OFFRANVILLE', 'OFFRANVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76590', 'NOR0076086', 'CERCLE AMICAL LONGUEVILLAIS', 'LONGUEVILLE-SUR-SCIE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76680', 'NOR0076087', 'EAWY BASKET SAINT SAENS', 'SAINT-SAENS', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76370', 'NOR0076090', 'SEVENTY SIX BASKET BELLEVILLE', 'BELLEVILLE-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76240', 'NOR0076092', 'ENTRAINEMENT PHYSIQUE BASKET BELBEUF', 'BELBEUF', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76750', 'NOR0076094', 'BASKET CLUB BUCHOIS', 'BUCHY', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76000', 'NOR0076096', 'HAUTS DE ROUEN BASKET BALL', 'ROUEN', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76730', 'NOR0076099', 'UNION SPORTIVE BACQUEVILLAISE BASKET', 'BACQUEVILLE-EN-CAUX', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76310', 'NOR0076104', 'AS SAINTE ADRESSE', 'SAINTE-ADRESSE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76810', 'NOR0076107', 'LUNERAY BASKET CLUB', 'LUNERAY', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL')),
    ('76620', 'NOR0076108', 'BASKET CLUB EPOUVILLE MANEGLISE', 'LE HAVRE', (SELECT id FROM committees WHERE name = 'COMITE DE SEINE-MARITIME DE BASKET-BALL'));

-- from clubs/77_seine_et_marne.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('77240', 'IDF0077001', 'CD 77 HORS ASSOCIATION', 'VERT-SAINT-DENIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77124', 'IDF0077002', 'AVENIR CREGY SPORTS BASKET', 'CREGY-LES-MEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77210', 'IDF0077003', 'AVON BASKET', 'AVON', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77590', 'IDF0077005', 'US BOIS-LE-ROI', 'BOIS-LE-ROI', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77480', 'IDF0077006', 'CS BRAYTOIS', 'MOUSSEAUX-LES-BRAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77600', 'IDF0077007', 'BUSSY BASKET CLUB', 'BUSSY-SAINT-GEORGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77430', 'IDF0077009', 'US CHAMPAGNE-SUR-SEINE', 'CHAMPAGNE-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77590', 'IDF0077010', 'AS CHARTRETTES', 'CHARTRETTES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77120', 'IDF0077011', 'COULOMMIERS BRIE BASKET', 'COULOMMIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77230', 'IDF0077012', 'AMICAL BASKET CLUB DE LA GOELE', 'DAMMARTIN-EN-GOELE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77400', 'IDF0077013', 'JS DAMPMARTOISE', 'DAMPMART', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77320', 'IDF0077014', 'JS FERTE-GAUCHER', 'FERTE-GAUCHER', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77260', 'IDF0077015', 'BASKET BALL FERTOIS', 'LA FERTE-SOUS-JOUARRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77880', 'IDF0077016', 'FONTAINEBLEAU BASKET', 'GREZ-SUR-LOING', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77590', 'IDF0077017', 'AS HERICY-FONTAINE-LE-PORT', 'FONTAINE-LE-PORT', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77410', 'IDF0077019', 'CLAYE-SOUILLY BASKET-BALL', 'CLAYE-SOUILLY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77150', 'IDF0077020', 'USC LESIGNY', 'LESIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77440', 'IDF0077021', 'CA LIZEEN', 'LIZY-SUR-OURCQ', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77950', 'IDF0077022', 'CS MAINCY', 'MAINCY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77100', 'IDF0077023', 'CS MEAUX', 'MEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77350', 'IDF0077024', 'LE MEE SPORTS MELUN VAL DE SEINE', 'LE MEE-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77950', 'IDF0077026', 'AS MOISENAY', 'MOISENAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77130', 'IDF0077027', 'CS MONTEREAU', 'MONTEREAU-FAULT-YONNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77130', 'IDF0077029', 'AS MAROLLES SUR SEINE', 'MAROLLES-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77250', 'IDF0077030', 'SEPA MORET', 'Moret-Loing-et-Orvanne', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77330', 'IDF0077035', 'OZOIR BASKET CLUB 77', 'OZOIR-LA-FERRIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77176', 'IDF0077036', 'PLESSIS SAVIGNY BASKET', 'SAVIGNY-LE-TEMPLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77340', 'IDF0077037', 'PONTAULT - COMBAULT EMERAINVILLE BASKET', 'PONTAULT-COMBAULT', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77160', 'IDF0077039', 'BASKET BALL PROVINS', 'PROVINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77680', 'IDF0077041', 'US ROISSY EN BRIE', 'ROISSY-EN-BRIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77460', 'IDF0077042', 'ALC SOUPPES SUR LOING', 'SOUPPES-SUR-LOING', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77470', 'IDF0077046', 'USBB TRILPORT', 'TRILPORT', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77360', 'IDF0077047', 'VAIRES BASKET', 'VAIRES-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77000', 'IDF0077049', 'VAUX- LE-PENIL BASKET', 'VAUX-LE-PENIL', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77270', 'IDF0077051', 'USM VILLEPARISIS', 'VILLEPARISIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77000', 'IDF0077052', 'US MELUN', 'MELUN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77500', 'IDF0077053', 'CHELLES BASKET COURTRY', 'CHELLES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77310', 'IDF0077054', 'BOISSISE ORGENOY BASKET', 'BOISSISE-LE-ROI', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77171', 'IDF0077055', 'SOURDUN BASKET CLUB', 'SOURDUN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77400', 'IDF0077056', 'ELAN LAGNY BASKET', 'THORIGNY-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77190', 'IDF0077059', 'ES DAMMARIE BASKET', 'DAMMARIE-LES-LYS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77950', 'IDF0077063', 'ENTENTE MAINCY/MOISENAY', 'MOISENAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77240', 'IDF0077065', 'BASKET CLUB FONTENAY TRESIGNY', 'VERT-SAINT-DENIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77550', 'IDF0077067', 'MOISSY BASKET CLUB', 'MOISSY-CRAMAYEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77380', 'IDF0077068', 'COMBS-LA-VILLE BC', 'COMBS-LA-VILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77360', 'IDF0077069', 'ENTENTE ML VAIRES', 'VAIRES-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77100', 'IDF0077070', 'BE NANTEUIL LES MEAUX', 'NANTEUIL-LES-MEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77360', 'IDF0077071', 'VAIRES / MLV', 'VAIRES-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77185', 'IDF0077072', 'MARNE-LA-VALLEE BASKET VAL MAUBUEE', 'LOGNES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77310', 'IDF0077074', 'ENTENTE BOISSISE-DAMMARIE', 'BOISSISE-LE-ROI', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77220', 'IDF0077075', 'SC GRETZ TOURNAN', 'TOURNAN-EN-BRIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77190', 'IDF0077076', 'ENTENTE DAMMARIE-BOISSISE', 'DAMMARIE-LES-LYS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77176', 'IDF0077077', 'SENART BASKET BALL', 'NANDY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77410', 'IDF0077079', 'SPORTS ET LOISIRS ANNETOIS', 'ANNET-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77810', 'IDF0077081', 'THOMERY BASKET CLUB', 'THOMERY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77170', 'IDF0077082', 'BRIE BASKET CLUB', 'BRIE-COMTE-ROBERT', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77400', 'IDF0077085', 'SAINT THIBAULT - THEOBASKET', 'SAINT-THIBAULT-DES-VIGNES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77700', 'IDF0077086', 'VAL D''EUROPE MONTEVRAIN BASKET CLUB', 'BAILLY-ROMAINVILLIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77420', 'IDF0077087', 'BC CHAMPS-SUR-MARNE', 'CHAMPS-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77760', 'IDF0077088', 'ESF BASKET (LA FORET)', 'LA CHAPELLE-LA-REINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77186', 'IDF0077093', 'NOISIEL BASKET', 'NOISIEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL')),
    ('77720', 'IDF0077098', 'BASKET BALL MORMANTAIS', 'MORMANT', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-ET-MARNE DE BASKET-BALL'));

-- from clubs/78_yvelines.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('78180', 'IDF0078001', 'CD 78 HORS ASSOCIATION', 'MONTIGNY-LE-BRETONNEUX', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78650', 'IDF0078003', 'BEYNES BASKET CLUB', 'BEYNES', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78955', 'IDF0078005', 'SC CARRIERES SOUS POISSY', 'CARRIERES-SOUS-POISSY', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78330', 'IDF0078006', 'AS FONTENAY LE FLEURY', 'FONTENAY-LE-FLEURY', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78600', 'IDF0078007', 'AS MESNIL LE ROI', 'MESNIL-LE-ROI', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78200', 'IDF0078008', 'AS MANTAISE', 'MANTES-LA-JOLIE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78320', 'IDF0078009', 'AS MESNIL ST DENIS', 'MESNIL-SAINT-DENIS', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78450', 'IDF0078010', 'BC VILLEPREUX', 'VILLEPREUX', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78680', 'IDF0078012', 'EPONE MEZIERES BB', 'EPONE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78300', 'IDF0078013', 'POISSY BASKET ASSOCIATION', 'POISSY', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78140', 'IDF0078016', 'BBC VELIZY VILLACOUBLAY', 'VELIZY-VILLACOUBLAY', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78990', 'IDF0078018', 'BC ELANCOURT', 'ELANCOURT', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78310', 'IDF0078019', 'BC MAUREPAS', 'MAUREPAS', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78711', 'IDF0078020', 'CA MANTES LA VILLE', 'MANTES-LA-VILLE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78260', 'IDF0078023', 'CLO COMMUNE ACHERES', 'ACHERES', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78130', 'IDF0078024', 'LES MUREAUX BC', 'MUREAUX', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78440', 'IDF0078025', 'MB GARGENVILLE', 'GARGENVILLE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78170', 'IDF0078026', 'CELLE ST CLOUD BASKET', 'LA CELLE-SAINT-CLOUD', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78410', 'IDF0078027', 'CS AUBERGENVILLE BASKET', 'AUBERGENVILLE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78190', 'IDF0078028', 'ESC TRAPPES SQ YVELINES', 'TRAPPES', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78390', 'IDF0078030', 'JEUNESSE ARCISIENNE', 'BOIS-D''ARCY', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78290', 'IDF0078031', 'CHATOU CROISSY BASKET', 'CROISSY-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78000', 'IDF0078032', 'ENTENTE LE CHESNAY VERSAILLES 78 BASKET', 'VERSAILLES', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78370', 'IDF0078033', 'PLAISIR BASKET CLUB', 'PLAISIR', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78120', 'IDF0078034', 'RAMBOUILLET SPORTS', 'RAMBOUILLET', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78800', 'IDF0078035', 'SO HOUILLES', 'HOUILLES', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78100', 'IDF0078036', 'TUES GERMANOISE', 'SAINT-GERMAIN-EN-LAYE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78700', 'IDF0078037', 'US CONFLANS STE HONORINE B', 'CONFLANS-SAINTE-HONORINE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78580', 'IDF0078038', 'US MAULOISE BASKETBALL', 'MAULE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78270', 'IDF0078039', 'BC PORTE ILE DE FRANCE', 'BONNIERES-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78450', 'IDF0078040', 'LES CLAYES S/BOIS B', 'VILLEPREUX', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78600', 'IDF0078041', 'MAISONS LAFFITTE BASKET', 'MAISONS-LAFFITTE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78160', 'IDF0078042', 'US MARLY LE ROI', 'MARLY-LE-ROI', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78230', 'IDF0078043', 'US PECQ', 'PECQ', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78110', 'IDF0078044', 'US VESINET', 'VESINET', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78250', 'IDF0078045', 'VERNEUIL VILLENNES TRIEL BASKET', 'MEULAN', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78180', 'IDF0078048', 'AS MONTIGNY LE BRETONNEUX B', 'MONTIGNY-LE-BRETONNEUX', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78590', 'IDF0078049', 'ASBB NOISY BAILLY', 'NOISY-LE-ROI', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78500', 'IDF0078050', 'BC SARTROUVILLE', 'SARTROUVILLE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78200', 'IDF0078052', 'MAGNANVILLE BASKET BALL', 'MAGNANVILLE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78570', 'IDF0078056', 'ANDRESY CHANTELOUP MAURECOURT B', 'ANDRESY', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78350', 'IDF0078057', 'JOUY BASKET CLUB', 'JOUY-EN-JOSAS', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78220', 'IDF0078060', 'USM VIROFLAY', 'VIROFLAY', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78360', 'IDF0078061', 'MONTESSON BASKET CLUB', 'MONTESSON', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78240', 'IDF0078063', 'ASM CHAMBOURCY', 'CHAMBOURCY', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78660', 'IDF0078065', 'FOYER RURAL ABLIS', 'ABLIS', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78114', 'IDF0078066', 'KANGOUS BC MAGNY LES HAMEAUX', 'MAGNY-LES-HAMEAUX', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78280', 'IDF0078067', 'GUYANCOURT BASKETBALL', 'GUYANCOURT', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78910', 'IDF0078068', 'ORGERUS THOIRY BASKET', 'ORGERUS', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78720', 'IDF0078070', 'AS CERNAY BASKET', 'CERNAY-LA-VILLE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78440', 'IDF0078071', 'AS PORCHEVILLE', 'PORCHEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78690', 'IDF0078076', 'AGS LES ESSARTS LE ROI', 'LES ESSARTS-LE-ROI', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78920', 'IDF0078077', 'ECQUEVILLY BC', 'ECQUEVILLY', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78860', 'IDF0078083', 'SL SAINT NOM LA BRETECHE', 'SAINT-NOM-LA-BRETECHE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78310', 'IDF0078086', 'E MAUREPAS MESNIL ST DENIS U11F', 'MAUREPAS', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78200', 'IDF0078094', 'CLUB ATHLETIQUE LIMAY (C.A.L) - A.L.J BASKET', 'BUCHELAY', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78000', 'IDF0078096', 'UNION SPORTIVE LE CHESNAY POISSY VERSAILLES 78', 'VERSAILLES', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78210', 'IDF0078099', 'CASOARS BASKET SAINT-CYR', 'SAINT-CYR-L''ECOLE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78610', 'IDF0078100', 'PERRAY BASKET 78', 'PERRAY-EN-YVELINES', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78280', 'IDF0078101', 'ENTENTE GUYANCOURT MONTIGNY', 'GUYANCOURT', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78110', 'IDF0078103', 'ENTENTE BOUCLE DE SEINE U18F', 'VESINET', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78330', 'IDF0078105', 'ENTENTE FONTENAY-SAINT CYR BASKET', 'FONTENAY-LE-FLEURY', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78600', 'IDF0078106', 'ENTENTE MESNIL LE ROI ACHERES', 'MESNIL-LE-ROI', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78360', 'IDF0078107', 'ENTENTE BOUCLE DE SEINE SF', 'MONTESSON', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL')),
    ('78290', 'IDF0078108', 'ENTENTE BOUCLE DE SEINE U15F', 'CROISSY-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DES YVELINES DE BASKET-BALL'));

-- from clubs/79_deux_sevres.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('79200', 'NAQ0079001', 'CD 79 HORS ASSOCIATION', 'TALLUD', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79310', 'NAQ0079002', 'ACADEMIE SPORTIVE ST-PARDOUX/SOUTIERS', 'SAINT-PARDOUX', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79600', 'NAQ0079003', 'UNION SPORTIVE AIRVAULT BASKET', 'AIRVAULT', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79150', 'NAQ0079004', 'BASKET PAYS ARGENTONNAIS', 'ARGENTONNAY', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79410', 'NAQ0079005', 'BASKET PLAINE & SEVRE', 'ECHIRE', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79300', 'NAQ0079006', 'BRESSUIRE LE REVEIL', 'BRESSUIRE', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79000', 'NAQ0079008', 'TEAM 3B BASKET-BALL', 'NIORT', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79380', 'NAQ0079014', 'LA FORET SUR SEVRE EF', 'FORET-SUR-SEVRE', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79430', 'NAQ0079016', 'LA CHAPELLE ST LAURENT REBOND', 'LA CHAPELLE-SAINT-LAURENT', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79700', 'NAQ0079020', 'NORD BOCAGE BASKET CLUB', 'MAULEON', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79320', 'NAQ0079022', 'MONCOUTANT SPORT ATHLETIQUE', 'MONCOUTANT', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79500', 'NAQ0079026', 'BASKET BALL MELLOIS', 'MELLE', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79250', 'NAQ0079027', 'NUEIL LES AUBIERS ACNA', 'NUEIL-SUR-ARGENT', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79350', 'NAQ0079028', 'BASKET CLUBS DU BOCAGE', 'FAYE-L''ABBESSE', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79200', 'NAQ0079030', 'PARTHENAY BASKET BALL 79', 'PARTHENAY', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79700', 'NAQ0079032', 'SAINT AMAND ETOILE SPORTIVE', 'SAINT-AMAND-SUR-SEVRE', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79400', 'NAQ0079034', 'SAINT MAIXENT SAM', 'SAINT-MAIXENT-L''ECOLE', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79100', 'NAQ0079039', 'THOUARS BASKET 79', 'THOUARS', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79000', 'NAQ0079040', 'AMICALE SPORTIVE NIORTAISE', 'NIORT', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79230', 'NAQ0079041', 'AIFFRES BASKET CLUB', 'AIFFRES', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79290', 'NAQ0079042', 'BOUILLE LORETZ', 'BOUILLE-LORETZ', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79180', 'NAQ0079044', 'CHAURAY BASKET CLUB', 'CHAURAY', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79300', 'NAQ0079048', 'TERVES LE SURSAUT', 'BRESSUIRE', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79100', 'NAQ0079050', 'SAINT JEAN DE THOUARS', 'THOUARS', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL')),
    ('79140', 'NAQ0079056', 'BASKET CLUB DU CERIZEEN', 'CERIZAY', (SELECT id FROM committees WHERE name = 'COMITE DES DEUX SEVRES DE BASKET-BALL'));

-- from clubs/80_somme.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('80090', 'HDF0080001', 'CD 80 HORS ASSOCIATION', 'AMIENS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80500', 'HDF0080003', 'BASKET BALL MONTDIDERIEN', 'MONTDIDIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80000', 'HDF0080004', 'AMIENS SPORTING CLUB BASKET BALL', 'AMIENS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80340', 'HDF0080006', 'BRAY BASKET BALL', 'BRAY-SUR-SOMME', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80100', 'HDF0080007', 'EAL ABBEVILLE', 'ABBEVILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80300', 'HDF0080008', 'USO ALBERT AVIATION', 'ALBERT', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80440', 'HDF0080009', 'UNION SPORTIVE DE BOVES BASKET-BALL', 'BOVES', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80770', 'HDF0080010', 'US BEAUCHAMPS', 'BEAUCHAMPS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80330', 'HDF0080011', 'ESC LONGUEAU AMIENS MSBB', 'LONGUEAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80600', 'HDF0080012', 'SPARTIATES BEAUVAL BASKET-BALL', 'TERRAMESNIL', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80790', 'HDF0080013', 'BASKET CLUB FORT-MAHONNAIS', 'FORT-MAHON-PLAGE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80610', 'HDF0080014', 'AMICALE NIEVRE BASKET BALL', 'SAINT-OUEN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80800', 'HDF0080015', 'BASKET BALL VILLERS BRETONNEUX', 'VILLERS-BRETONNEUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80240', 'HDF0080016', 'ROISEL BASKETBALL (BBALL)', 'ROISEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80110', 'HDF0080018', 'LIONS BASKET BALL MOREUIL', 'MOREUIL', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80190', 'HDF0080019', 'BASKET BALL NESLOIS', 'NESLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80300', 'HDF0080020', 'CA PERONNE BASKET BALL', 'MORLANCOURT', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80700', 'HDF0080023', 'UNION SPORTIVE ROYENNE', 'ROYE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80600', 'HDF0080025', 'ENTENTE VAL D''AUTHIE BASKET BALL', 'DOULLENS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80120', 'HDF0080027', 'US RUE BASKET BALL', 'RUE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80400', 'HDF0080028', 'BASKET BALL HAMOIS', 'HAM', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80090', 'HDF0080030', 'CHEMINOTS AMIENS SUD B.B.', 'AMIENS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80000', 'HDF0080036', 'METROPOLE AMIENOISE BASKETBALL', 'AMIENS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL')),
    ('80160', 'HDF0080038', 'BASKET BALL CLUB DU CONTYNOIS', 'NAMPTY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SOMME DE BASKET-BALL'));

-- from clubs/81_tarn.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('81990', 'OCC0081002', 'BASKET CLUB CUNAC LESCURE', 'CUNAC', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81390', 'OCC0081009', 'BRIATEXTE BASKET CLUB', 'BRIATEXTE', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81400', 'OCC0081013', 'UNION SPORTIVE CARMAUX', 'CARMAUX', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81100', 'OCC0081014', 'CASTRES BASKET CLUB', 'CASTRES', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81600', 'OCC0081015', 'AS DU BASKET GAILLACOIS', 'GAILLAC', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81300', 'OCC0081016', 'SC GRAULHET', 'GRAULHET', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81210', 'OCC0081018', 'LACROUZETTE SIDOBRE BASKET', 'LACROUZETTE', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81500', 'OCC0081019', 'BASKET CLUB LAVAUR', 'LAVAUR', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81200', 'OCC0081020', 'BASKET CLUB MAZAMET AUSSILLON', 'MAZAMET', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81800', 'OCC0081021', 'BASKET CLUB PAYS RABASTINOIS', 'RABASTENS', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81210', 'OCC0081022', 'BASKET CLUB ROQUECOURBE', 'ROQUECOURBE', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81120', 'OCC0081023', 'ESPERANCE SPORTIVE REALMONT', 'REALMONT', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81400', 'OCC0081024', 'SAINT BENOIT BASKET CLUB', 'SAINT-BENOIT-DE-CARMAUX', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81990', 'OCC0081027', 'LE SEQUESTRE BASKET CLUB', 'SEQUESTRE', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81570', 'OCC0081029', 'BC VIELMUR SEMALENS', 'VIELMUR-SUR-AGOUT', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81990', 'OCC0081030', 'ENTENTE MARSSAC LE SEQUESTRE', 'SEQUESTRE', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81630', 'OCC0081032', 'DRAGONS BASKET CLUB SALVAGNAC', 'SALVAGNAC', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81300', 'OCC0081033', 'ENTENTE GRAULHET LAVAUR', 'GRAULHET', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81000', 'OCC0081034', 'COMITE TARN(HORS ASSOCIATION)', 'ALBI', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81160', 'OCC0081035', 'ENT. ARTHES ST JUERY BB', 'ARTHES', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81000', 'OCC0081037', 'ALBI BASKET 81', 'ALBI', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81370', 'OCC0081039', 'BASKET CLUB SAINT SULPICE', 'SAINT-SULPICE', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81260', 'OCC0081041', 'BRASSAC BASKET CLUB - MJC', 'BRASSAC', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81000', 'OCC0081042', 'UNION ALBI BASKET 81', 'ALBI', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81220', 'OCC0081043', 'BASKET DAMIATTE SAINT PAUL', 'SAINT-PAUL-CAP-DE-JOUX', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81000', 'OCC0081044', 'BASKET CLUB COMMUNAUTE DE COMMUNES DES MONTS D''ALBAN ET DU VILLEFRANCHOIS', 'ALBI', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81230', 'OCC0081047', 'BASKET CLUB DES MONTS DE LACAUNE', 'LACAUNE', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81310', 'OCC0081051', 'TARN DADOU BASKET CLUB L''ISLOIS', 'LISLE-SUR-TARN', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81150', 'OCC0081052', 'MARSSAC BASKET CLUB', 'MARSSAC-SUR-TARN', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81400', 'OCC0081055', 'ENTENTE CARMAUX - CUNAC LESCURE', 'CARMAUX', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81380', 'OCC0081056', 'ENTENTE CUNAC LESCURE - CARMAUX', 'LESCURE-D''ALBIGEOIS', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81390', 'OCC0081057', 'ENTENTE BRIATEXTE LAVAUR', 'BRIATEXTE', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81990', 'OCC0081058', 'ENTENTE LE SEQUESTRE LAGRAVE', 'SEQUESTRE', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81120', 'OCC0081059', 'ENTENTE REALMONT LACAUNE', 'REALMONT', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81120', 'OCC0081060', 'ENTENTE REALMONT VIELMUR LACAUNE', 'REALMONT', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL')),
    ('81150', 'OCC0081541', 'TARN IMPULSION BASKET-BALL LAGRAVE', 'LAGRAVE', (SELECT id FROM committees WHERE name = 'COMITE DU TARN DE BASKET-BALL'));

-- from clubs/82_tarn-et-garonne.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('82370', 'OCC0082032', 'BASKET CLUB BASTIDIEN', 'LABASTIDE-SAINT-PIERRE', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82700', 'OCC0082040', 'Montech Montauban Basket Ball', 'MONTECH', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82220', 'OCC0082503', 'SA CAUSSADE', 'AUTY', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82400', 'OCC0082504', 'BASKET CLUB GOLFECHOIS', 'GOLFECH', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82200', 'OCC0082507', 'MOISSAC CASTELSARRASIN BB', 'MOISSAC', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82000', 'OCC0082509', 'MONTAUBAN BASKET CLUB', 'MONTAUBAN', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82270', 'OCC0082511', 'BC MONTPEZAT DE QUERCY', 'MONTPEZAT-DE-QUERCY', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82800', 'OCC0082512', 'GIMBELET BASKET CLUB', 'NEGREPELISSE', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82370', 'OCC0082514', 'ST NAUPHARY ACO', 'SAINT-NAUPHARY', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82210', 'OCC0082515', 'AMICALE LAIQUE ST NICOLAS BASKET', 'SAINT-NICOLAS-DE-LA-GRAVE', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82220', 'OCC0082516', 'VAZERAC SUD QUERCY BASKET', 'VAZERAC', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82700', 'OCC0082519', 'AS ST PORQUIER', 'SAINT-PORQUIER', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82170', 'OCC0082521', 'BLEUETS DE GRISOLLES', 'GRISOLLES', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82100', 'OCC0082525', 'LABASTIDE DU TEMPLE BASKET', 'LABASTIDE-DU-TEMPLE', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL')),
    ('82700', 'OCC0082535', 'MONTECH BASKET BALL', 'MONTECH', (SELECT id FROM committees WHERE name = 'COMITE DE TARN-ET-GARONNE de BASKET-BALL'));

-- from clubs/83_var.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('83130', 'SUD0083001', 'CD83 – HORS ASSOCIATION – VAR', 'GARDE (la)', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83240', 'SUD0083004', 'CLUB SPORTIF CAVALAIROIS', 'CAVALAIRE-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83190', 'SUD0083005', 'BASKET CLUB OLLIOULAIS', 'OLLIOULES', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83300', 'SUD0083006', 'DRAGUIGNAN UNION CLUB', 'DRAGUIGNAN', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83600', 'SUD0083007', 'FREJUS VAR BASKET AMSL', 'FREJUS', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83510', 'SUD0083009', 'ES LORGUAISE BASKET CLUB', 'LORGUES', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83130', 'SUD0083011', 'BASKET CLUB LA GARDE', 'GARDE (la)', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83250', 'SUD0083012', 'ESCA LONDAISE', 'LA LONDE-LES-MAURES', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83160', 'SUD0083014', 'UA VALETTOISE BASKET', 'LA VALETTE-DU-VAR', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83220', 'SUD0083015', 'UNION SPORTIVE PRADET BASKET', 'LE PRADET', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83460', 'SUD0083016', 'ATHLETIC SPORTING ARCOIS', 'LES ARCS', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83520', 'SUD0083017', 'CA ROQUEBRUNE SUR ARGENS', 'ROQUEBRUNE-SUR-ARGENS', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83120', 'SUD0083019', 'BASKET CLUB GRIMAUD STE MAXIME', 'SAINTE-MAXIME', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83470', 'SUD0083023', 'SEILLONS BASKET CLUB', 'SEILLONS-SOURCE-D''ARGENS', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83100', 'SUD0083024', 'ASPTT TOULON', 'TOULON', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83143', 'SUD0083029', 'BRIGNOLES BASKET BALL', 'LE VAL', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83210', 'SUD0083031', 'BASKET CLUB SOLLIES FARLEDE', 'SOLLIES-PONT', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83320', 'SUD0083032', 'CARQUEIRANNE VAR BASKET', 'CARQUEIRANNE', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83600', 'SUD0083033', 'SAINT RAPHAEL VAR BASKET', 'FREJUS', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83110', 'SUD0083037', 'SANARY BASKET CLUB', 'SANARY-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83740', 'SUD0083038', 'ENTENTE ST CYR - BANDOL', 'LA CADIERE-D''AZUR', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83430', 'SUD0083042', 'UNION SPORTIVE SAINT MANDRIER', 'SAINT-MANDRIER-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83550', 'SUD0083044', 'VIDAUBAN BASKET ASSOCIATION (V.B.A.)', 'VIDAUBAN', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83400', 'SUD0083046', 'HYERES TOULON VAR BASKET', 'HYERES', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83500', 'SUD0083047', 'LA SEYNE BASKET', 'LA SEYNE-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83470', 'SUD0083048', 'ATHLETIC BASKET CLUB - BAUME SAINT-MAXIMIN', 'SEILLONS-SOURCE-D''ARGENS', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83740', 'SUD0083052', 'BANDOL BASKET CLUB', 'LA CADIERE-D''AZUR', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83700', 'SUD0083053', 'ENTENTE ST RAPHAEL - FREJUS', 'SAINT-RAPHAEL', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83220', 'SUD0083054', 'ENTENTE LE PRADET / CARQUEIRANNE U13M', 'LE PRADET', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83110', 'SUD0083055', 'ENTENTE SANARY / SAINT CYR PRF', 'SANARY-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83140', 'SUD0083056', 'SIX FOURS BASKET CLUB', 'SIX-FOURS-LES-PLAGES', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83390', 'SUD0083057', 'ENTENTE CUERS PIERREFEU VAL D’ISSOLE', 'CUERS', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83740', 'SUD0083062', 'SAINT CYR BASKET CLUB', 'LA CADIERE-D''AZUR', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83440', 'SUD0083063', 'BASKET CLUB DU PAYS DE FAYENCE', 'MONTAUROUX', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL')),
    ('83790', 'SUD0083065', 'BASKET BALL CLUB PIGNANTAIS', 'PIGNANS', (SELECT id FROM committees WHERE name = 'COMITE DU VAR DE BASKET-BALL'));

-- from clubs/84_vaucluse.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('84700', 'SUD0084001', 'CD 84 HORS ASSOCIATION', 'SORGUES', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84400', 'SUD0084004', 'PAYS D''APT BASKET', 'APT', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84220', 'SUD0084005', 'AS ISLE SUR SORGUE', 'GORDES', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84100', 'SUD0084007', 'ORANGE BASKET CLUB', 'ORANGE', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84000', 'SUD0084008', 'UNION SPORTIVE AVIGNON/PONTET', 'AVIGNON', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84500', 'SUD0084010', 'FRJ ST BLAISE BOLLENE BASKET', 'BOLLENE', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84830', 'SUD0084011', 'UNION SPORTIVE SERIGNAN', 'SERIGNAN-DU-COMTAT', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84700', 'SUD0084012', 'SORGUES BASKET CLUB', 'SORGUES', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84120', 'SUD0084014', 'CLUB SPORTIF PERTUIS', 'PERTUIS', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84200', 'SUD0084016', 'ABC CARPENTRAS', 'CARPENTRAS', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84000', 'SUD0084018', 'AVIGNON SPORT BARBIERE BASKET', 'AVIGNON', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84140', 'SUD0084019', 'MONTFAVET BASKET CLUB', 'MONTFAVET', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84300', 'SUD0084020', 'CAVAILLON ESPOIR BASKET CLUB', 'CAVAILLON', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84320', 'SUD0084021', 'US ENTRAIGUES', 'Entraigues-sur-la-Sorgue', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84860', 'SUD0084023', 'BASKET CLUB CADEROUSSIEN', 'CADEROUSSE', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84270', 'SUD0084026', 'MORIERES BASKET CLUB', 'VEDENE', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84210', 'SUD0084029', 'ELAN BASKET PERNOIS', 'PERNES-LES-FONTAINES', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84700', 'SUD0084032', 'BASKET CLUB CHATEAURENARDAIS', 'SORGUES', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84100', 'SUD0084033', 'LASA BC ASPTT', 'ORANGE', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84100', 'SUD0084037', 'ENTENTE ORANGE/SERIGNAN', 'ORANGE', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL')),
    ('84250', 'SUD0084039', 'BASKET THOROIS', 'LE THOR', (SELECT id FROM committees WHERE name = 'COMITE DU VAUCLUSE DE BASKET-BALL'));

-- from clubs/85_vendee.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('85190', 'PDL0085001', 'AIZENAY', 'AIZENAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85670', 'PDL0085003', 'BASKET PAYS DE PALLUAU', 'PALLUAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85470', 'PDL0085005', 'BRETIGNOLLES BREM BASKET CLUB', 'BRETIGNOLLES-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85230', 'PDL0085006', 'BEAUVOIR SUR MER', 'BEAUVOIR-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85480', 'PDL0085009', 'BOURNEZEAU', 'BOURNEZEAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85120', 'PDL0085011', 'EST VENDEE BASKET CLUB', 'BREUIL-BARRET', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85260', 'PDL0085012', 'BROUZILS', 'LES BROUZILS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85310', 'PDL0085013', 'SUD YON BASKET CLUB', 'CHAILLE-SOUS-LES-ORMEAUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85220', 'PDL0085014', 'CHAIZE GIRAUD', 'LA CHAIZE-GIRAUD', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85300', 'PDL0085015', 'VENDEE CHALLANS BASKET', 'CHALLANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85500', 'PDL0085016', 'CHAMBRETAUD SAINT-MALO VENDÉE BASKET', 'CHAMBRETAUD', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85160', 'PDL0085018', 'MONTS ET MARAIS BASKET', 'SAINT-JEAN-DE-MONTS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85100', 'PDL0085019', 'LES SABLES VENDEE BASKET', 'LES SABLES-D''OLONNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85310', 'PDL0085020', 'VENDEE BASKET VICOMTAIS', 'LA CHAIZE-LE-VICOMTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85000', 'PDL0085021', 'Sports Events Projects Association', 'LA ROCHE-SUR-YON', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85390', 'PDL0085023', 'CMS BASKET LES COLLINES', 'CHEFFOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85110', 'PDL0085024', 'BASKET SAINT PROUANT MONSIREIGNE', 'SAINT-PROUANT', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85610', 'PDL0085025', 'CUGAND-BERNARDIERE BASKET ASSO', 'CUGAND', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85170', 'PDL0085026', 'DOMPIERRE SUR YON', 'DOMPIERRE-SUR-YON', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85140', 'PDL0085027', 'BASKET CLUB LES ESSARTS BOULOGNE LA MERLATIERE', 'LES ESSARTS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85280', 'PDL0085029', 'FERRIERE', 'LA FERRIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85200', 'PDL0085031', 'FONTENAY LE COMTE', 'FONTENAY-LE-COMTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85710', 'PDL0085032', 'GARNACHE EV. GARN. BASKET VENDEE', 'LA GARNACHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85190', 'PDL0085033', 'GENETOUZE', 'LA GENETOUZE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85130', 'PDL0085034', 'GAUBRETIERE', 'LA GAUBRETIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85260', 'PDL0085036', 'SMASH VENDEE SUD LOIRE BASKET', 'SAINT-SULPICE-LE-VERDON', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85570', 'PDL0085037', 'HERMENAULT', 'L''HERMENAULT', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85500', 'PDL0085038', 'HERBIERS VENDEE BASKET', 'LES HERBIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85340', 'PDL0085039', 'ILE D''OLONNE', 'L''ILE-D''OLONNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85400', 'PDL0085040', 'LUCON BASKET CLUB', 'LUCON', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85800', 'PDL0085044', 'RIEZ VIE BASKET L''ETOILE', 'SAINT-GILLES-CROIX-DE-VIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85290', 'PDL0085049', 'MORTAGNE SUR SEVRE', 'MORTAGNE-SUR-SEVRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85150', 'PDL0085050', 'JAM BASKET CLUB', 'Achards (Les)', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85640', 'PDL0085051', 'MOUCHAMPS', 'MOUCHAMPS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85000', 'PDL0085052', 'MOUILLERON BASKET CLUB', 'MOUILLERON-LE-CAPTIF', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85320', 'PDL0085054', 'MOUTIERS SUR LAY', 'MOUTIERS-SUR-LE-LAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85620', 'PDL0085055', 'NORD VENDEE BASKET', 'ROCHESERVIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85170', 'PDL0085057', 'BASKET VIE ET BOULOGNE', 'LE POIRE-SUR-VIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85110', 'PDL0085066', 'CHANTONNAY-ST GERMAIN BASKET', 'CHANTONNAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85260', 'PDL0085068', 'SAINT DENIS-COPE. BC 2 ETOILES', 'LA COPECHAGNIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85150', 'PDL0085069', 'SAINTE FLAIVE DES LOUPS', 'SAINTE-FLAIVE-DES-LOUPS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85150', 'PDL0085070', 'SAINTE FOY', 'SAINTE-FOY', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85250', 'PDL0085071', 'BCCF VENDEE', 'SAINT-FULGENT', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85400', 'PDL0085072', 'SAINTE GEMME LA PLAINE', 'SAINTE-GEMME-LA-PLAINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85600', 'PDL0085073', 'MONTAIGU VENDEE BASKET CLUB', 'SAINT-GEORGES-DE-MONTAIGU', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85140', 'PDL0085080', 'SAINT MARTIN DES NOYERS', 'SAINT-MARTIN-DES-NOYERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85220', 'PDL0085085', 'SAINT REVEREND', 'SAINT-REVEREND', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85300', 'PDL0085089', 'SOULLANS BC', 'SOULLANS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85440', 'PDL0085091', 'TALMONT ST HILAIRE', 'TALMONT-SAINT-HILAIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85000', 'PDL0085094', 'BASKET CLUB YONNAIS', 'LA ROCHE-SUR-YON', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85420', 'PDL0085099', 'NIEUL SUR L''AUTIZE BCNOBC', 'OULMES', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85017', 'PDL0085101', 'CD VENDEE HORS ASSOCIATION', 'LA ROCHE-SUR-YON Cedex', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85390', 'PDL0085102', 'AVENIR BASKET LES 3CO''', 'CHAVAGNES-LES-REDOUX', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85150', 'PDL0085104', 'SAINT MATHURIN', 'SAINT-MATHURIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85170', 'PDL0085111', 'VENDEE BELLEVIGNY BASKET', 'BELLEVIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85300', 'PDL0085123', 'SALLERTAINE BASKET CLUB', 'SALLERTAINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85310', 'PDL0085125', 'NESMY-AUBIGNY BASKET CLUB', 'NESMY', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85220', 'PDL0085126', 'COMMEQUIERS SPORT BASKET BALL', 'COMMEQUIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85560', 'PDL0085128', 'ANGLES-LONGEVILLE BASKET CLUB', 'LONGEVILLE-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85600', 'PDL0085132', 'BASKET CLUB GUYONS SEPTIEROIS', 'LA GUYONNIERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85190', 'PDL0085135', 'BEAULIEU SPORT BASKET', 'BEAULIEU-SOUS-LA-ROCHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85140', 'PDL0085138', 'BASKET CLUB OYEN CECILIEN', 'L''OIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85000', 'PDL0085140', 'ROCHE VENDEE BC', 'LA ROCHE-SUR-YON', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85340', 'PDL0085142', 'GROSBREUIL', 'OLONNE-SUR-MER', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85490', 'PDL0085144', 'BENET BASKET CLUB', 'BENET', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85350', 'PDL0085148', 'ILE D''YEU BASKET CLUB', 'L''ILE-D''YEU', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85190', 'PDL0085149', 'VENANSAULT BASKET CLUB', 'VENANSAULT', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85600', 'PDL0085156', 'BOUFFERE', 'BOUFFERE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85330', 'PDL0085159', 'NOIRMOUTIER ETOILE BASKET CLUB', 'NOIRMOUTIER-EN-L''ILE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL')),
    ('85700', 'PDL0085625', 'Haut Bocage Vendée Basket', 'POUZAUGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA VENDEE DE BASKET-BALL'));

-- from clubs/86_vienne.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('86100', 'NAQ0086001', 'ASSOCIATION SPORTIVE BASKET CHAT', 'CHATELLERAULT', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86400', 'NAQ0086002', 'CIVRAY USC', 'CIVRAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86160', 'NAQ0086003', 'GENCAY BASKET-BALL', 'GENCAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86130', 'NAQ0086004', 'VAL VERT BASKET', 'DISSAY', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86240', 'NAQ0086005', 'ITEUIL US', 'ITEUIL', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86600', 'NAQ0086008', 'PAYS MELUSIN BASKET CLUB', 'LUSIGNAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86360', 'NAQ0086009', 'MONTAMISE BASKET ASSOCIATION', 'MONTAMISE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86300', 'NAQ0086010', 'US CHAUVINOISE', 'CHAUVIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86110', 'NAQ0086012', 'MIREBEAU SPORT EN HAUT POITOU BASKET BALL', 'MIREBEAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86170', 'NAQ0086015', 'NEUVILLE BC FJEPS', 'NEUVILLE-DE-POITOU', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86340', 'NAQ0086016', 'NOUAILLE BASKET', 'NOUAILLE-MAUPERTUIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86000', 'NAQ0086018', 'CEP POITIERS', 'POITIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86000', 'NAQ0086019', 'STADE POITEVIN BASKETBALL', 'POITIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86800', 'NAQ0086021', '3X3 POITIERS', 'SEVRES-ANXAUMONT', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86000', 'NAQ0086022', 'POITIERS EC', 'POITIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86000', 'NAQ0086023', 'ASSOCIATION SPORTIVE POITIERS 86', 'POITIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86580', 'NAQ0086026', 'POUZIOUX VOUNEUIL/BIARD BC', 'VOUNEUIL-SOUS-BIARD', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86240', 'NAQ0086028', 'SMARVES BASKET', 'SMARVES', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86000', 'NAQ0086030', 'CD86 – HORS ASSOCIATION – VIENNE', 'POITIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86240', 'NAQ0086034', 'FONTAINE LE COMTE BASKET', 'FONTAINE-LE-COMTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86000', 'NAQ0086038', 'MIGNE AUXANCES BASKET CLUB', 'POITIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86530', 'NAQ0086039', 'BASKET CLUB CENONAIS', 'CENON-SUR-VIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86190', 'NAQ0086040', 'ASSOCIATION SPORTIVE VOUGLAISIENNE', 'VOUILLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86500', 'NAQ0086041', 'BASKET DU MONTMORILLONNAIS', 'MONTMORILLON', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86170', 'NAQ0086047', 'CISSE BASKET CLUB', 'CISSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86180', 'NAQ0086052', 'BALLON ORANGE BUX86', 'BUXEROLLES', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86600', 'NAQ0086053', 'ENTENTE PMBC - FONTAINE LE COMTE', 'LUSIGNAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86240', 'NAQ0086054', 'ENTENTE VALLEE DU CLAIN', 'SMARVES', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL')),
    ('86000', 'NAQ0086098', 'UNION POITIERS BASKET 86', 'POITIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA VIENNE DE BASKET-BALL'));

-- from clubs/87_haute_vienne.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('87000', 'NAQ0087001', 'CD87 - HORS ASSOCIATION - HAUTE-VIENNE', 'LIMOGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87700', 'NAQ0087002', 'AIXE BC VAL DE VIENNE', 'AIXE-SUR-VIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87590', 'NAQ0087004', 'SPORTING BASKET MARTELLOIS', 'SAINT-JUST-LE-MARTEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87270', 'NAQ0087005', 'COUZEIX BASKET CLUB', 'COUZEIX', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87380', 'NAQ0087007', 'SAINT GERMAIN BASKET CLUB', 'SAINT-GERMAIN-LES-BELLES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87220', 'NAQ0087008', 'FEYTIAT BASKET 87', 'FEYTIAT', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87100', 'NAQ0087009', 'LIMOGES LANDOUGE LOISIRS BASKET', 'LIMOGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87100', 'NAQ0087011', 'ASPTT LIMOGES', 'LIMOGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87000', 'NAQ0087013', 'CAPO LIMOGES', 'LIMOGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87000', 'NAQ0087015', 'LA FAC DU BASKETBALL', 'LIMOGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87000', 'NAQ0087017', 'LIMOGES SAINT ANTOINE', 'LIMOGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87000', 'NAQ0087018', 'LIMOGES ABC EN LIMOUSIN', 'LIMOGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87000', 'NAQ0087019', 'ST LOUIS GONZAGUE', 'LIMOGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87000', 'NAQ0087020', 'LIMOGES BASKET CLUB', 'LIMOGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87100', 'NAQ0087021', 'LIMOGES CSP', 'LIMOGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87350', 'NAQ0087022', 'AS PANAZOL', 'PANAZOL', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87570', 'NAQ0087023', 'B.B. RILHAC RANCON', 'RILHAC-RANCON', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87200', 'NAQ0087024', 'AS SAINT JUNIEN', 'SAINT-JUNIEN', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87400', 'NAQ0087025', 'BCUS SAINT LEONARD', 'SAINT-LEONARD-DE-NOBLAT', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87500', 'NAQ0087026', 'BC DU PAYS DE ST YRIEIX', 'SAINT-YRIEIX-LA-PERCHE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87270', 'NAQ0087027', 'PANDA BONNAC BASKET', 'BONNAC-LA-COTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87520', 'NAQ0087032', 'US ORADOUR B.B.', 'ORADOUR-SUR-GLANE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87280', 'NAQ0087033', 'US BEAUNE B.B.', 'LIMOGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87140', 'NAQ0087038', 'UNION SPORTIVE NANTIAT', 'NANTIAT', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87510', 'NAQ0087040', 'ASSOCIATION SPORTIVE SAINT GENCE BASKET CLUB', 'SAINT-GENCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87300', 'NAQ0087046', 'BELLAC BASKET CLUB', 'BELLAC', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87230', 'NAQ0087047', 'MONTS DE CHALUS BASKET', 'CHALUS', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87430', 'NAQ0087049', 'VERNEUIL BASKET CLUB', 'VERNEUIL-SUR-VIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87920', 'NAQ0087051', 'CONDAT BASKET CLUB', 'CONDAT-SUR-VIENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87000', 'NAQ0087058', 'BAMBOCHE BASKET LIMOGES', 'LIMOGES', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87510', 'NAQ0087059', 'ENTENTE ST GENCE/VERNEUIL', 'SAINT-GENCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL')),
    ('87590', 'NAQ0087060', 'ENTENTE SBM/LBC', 'SAINT-JUST-LE-MARTEL', (SELECT id FROM committees WHERE name = 'COMITE DE LA HAUTE-VIENNE DE BASKET-BALL'));

-- from clubs/88_vosges.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('88000', 'GES0088001', 'CD VOSGES HORS ASSOCIATION', 'EPINAL', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88150', 'GES0088003', 'ENTENTE SPORTIVE THAON BASKET BALL (E.S. THAON BASKET BALL)', 'THAON-LES-VOSGES', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88150', 'GES0088006', 'BASKET CLUB CHAVELOTAIS', 'CHAVELOT', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88190', 'GES0088007', 'BASKET CLUB GOLBEY EPINAL', 'GOLBEY', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88640', 'GES0088008', 'ENTENTE GRANGES GERARDMER', 'GRANGES-SUR-VOLOGNE', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88640', 'GES0088011', 'AJ GRINGEAUDE GRANGES', 'GRANGES-SUR-VOLOGNE', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88260', 'GES0088012', 'ESPERANCE HENNEZEL', 'HENNEZEL', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88310', 'GES0088014', 'SO LA BRESSAUDE', 'CORNIMONT', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88350', 'GES0088015', 'AS ST NICOLAS LIFFOL-LE-GRAND', 'LIFFOL-LE-GRAND', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88500', 'GES0088016', 'EFFORT BASKET MIRECOURT', 'MIRECOURT', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88230', 'GES0088018', 'AS LA PATRIE PLAINFAING', 'FRAIZE', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88700', 'GES0088019', 'SL RAMBERVILLERS', 'RAMBERVILLERS', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88100', 'GES0088021', 'SAINT DIE VOSGES BASKET', 'SAINT-DIE', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88340', 'GES0088024', 'LA VALDAJOLAISE', 'VAL-D''AJOL', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88430', 'GES0088026', 'AS DES MYRTILLES DE CORCIEUX', 'CORCIEUX', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88220', 'GES0088027', 'AS XERTIGNY', 'XERTIGNY', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88120', 'GES0088028', 'SAINT AME ASSACS', 'SAINT-AME', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88170', 'GES0088037', 'BASKET CLUB GIRONCOURT', 'GIRONCOURT-SUR-VRAINE', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88430', 'GES0088039', 'AS GERARDMER', 'GERBEPAL', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88130', 'GES0088041', 'CHARMES BASKET CLUB', 'CHARMES', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88200', 'GES0088051', 'ENSEMBLE BASKET REMIREMONT LE THILLOT', 'REMIREMONT', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88120', 'GES0088053', 'ENTENTE SAINT AME - LA BRESSE', 'SAINT-AME', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL')),
    ('88800', 'GES0088677', 'BASKET CLUB THERMAL', 'VITTEL', (SELECT id FROM committees WHERE name = 'COMITE DES VOSGES DE BASKET-BALL'));

-- from clubs/89_yonne.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('89010', 'BFC0089001', 'C D 89 HORS ASSOCIATION', 'AUXERRE', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89000', 'BFC0089005', 'STADE AUXERROIS', 'AUXERRE', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89400', 'BFC0089006', 'ASUC MIGENNES BASKET', 'MIGENNES', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89210', 'BFC0089007', 'SENTINELLE DE BRIENON BASKET', 'BRIENON-SUR-ARMANCON', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89300', 'BFC0089008', 'US JOIGNY', 'JOIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89140', 'BFC0089011', 'PERSEVERANTE PONTOISE', 'PONT-SUR-YONNE', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89000', 'BFC0089012', 'CA DE SAINT GEORGES', 'SAINT-GEORGES-SUR-BAULCHE', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89100', 'BFC0089013', 'ELAN SENS PARON BASKET', 'PARON', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89700', 'BFC0089014', 'AS TONNERROISE', 'TONNERRE', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89500', 'BFC0089015', 'US VILLENEUVE SUR YONNE', 'VILLENEUVE-SUR-YONNE', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89520', 'BFC0089017', 'ES SAINT SAUVEUR MOUTIER', 'SAINT-SAUVEUR-EN-PUISAYE', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89130', 'BFC0089018', 'UNION SPORTIVE TOUCYCOISE', 'TOUCY', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89270', 'BFC0089026', 'BASKET BALL VERMENTONNAIS', 'VERMENTON', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89470', 'BFC0089027', 'PHÉNIX BASKET MONÉTEAU - HÉRY', 'MONETEAU', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89470', 'BFC0089028', 'UNION MONETEAU_VERMENTON', 'MONETEAU', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89200', 'BFC0089029', 'AVALLON BASKET CLUB', 'AVALLON', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89250', 'BFC0089030', 'US SEIGNELAY BASKET', 'SEIGNELAY', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89120', 'BFC0089032', 'USC CHARNY', 'CHARNY', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89110', 'BFC0089033', 'AILLANT SPORT BASKET', 'Montholon', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL')),
    ('89190', 'BFC0089040', 'CB DES SIX GERBES', 'VILLENEUVE-L''ARCHEVEQUE', (SELECT id FROM committees WHERE name = 'COMITE DE L''YONNE DE BASKET-BALL'));

-- from clubs/90_territoire-de-belfort.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('90100', 'BFC0090014', 'ASSOCIATION BASKET CLUB DELLE', 'LEBETAIN', (SELECT id FROM committees WHERE name = 'COMITE DU TERRITOIRE-DE-BELFORT DE BASKET-BALL')),
    ('90000', 'BFC0090015', 'BC BELFORT', 'BELFORT', (SELECT id FROM committees WHERE name = 'COMITE DU TERRITOIRE-DE-BELFORT DE BASKET-BALL')),
    ('90300', 'BFC0090016', 'BC VAL D''OYE', 'VALDOIE', (SELECT id FROM committees WHERE name = 'COMITE DU TERRITOIRE-DE-BELFORT DE BASKET-BALL')),
    ('90300', 'BFC0090017', 'ASM BELFORT', 'CRAVANCHE', (SELECT id FROM committees WHERE name = 'COMITE DU TERRITOIRE-DE-BELFORT DE BASKET-BALL'));

-- from clubs/91_essonne.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('91130', 'IDF0091001', 'CD ESSONNE HORS ASSOCIATION', 'RIS-ORANGIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91290', 'IDF0091002', 'ESR ARPAJON', 'ARPAJON', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91200', 'IDF0091003', 'USO ATHIS MONS', 'ATHIS-MONS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91570', 'IDF0091004', 'USO BIEVRES', 'BIEVRES', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91220', 'IDF0091006', 'CLUB SPORTIF DE BRETIGNY BB', 'BRETIGNY-SUR-ORGE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91800', 'IDF0091007', 'ETINCELLE SPORTIVE DE BRUNOY', 'BRUNOY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91440', 'IDF0091008', 'US BURES SUR YVETTE', 'BURES-SUR-YVETTE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91380', 'IDF0091009', 'BC CHILLY MAZARIN', 'CHILLY-MAZARIN', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91100', 'IDF0091010', 'AS CORBEIL ESSONNES', 'CORBEIL-ESSONNES', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91080', 'IDF0091011', 'CO COURCOURONNES', 'COURCOURONNES', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91210', 'IDF0091012', 'DRAVEIL BASKET CLUB', 'DRAVEIL', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91150', 'IDF0091015', 'BASKET CLUB ETAMPOIS', 'ETAMPES', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91000', 'IDF0091017', 'AMICALE SPORTIVE D''EVRY', 'EVRY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91150', 'IDF0091019', 'TEAM BASKET MORIGNY ETRECHY', 'MORIGNY-CHAMPIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91190', 'IDF0091021', 'OLYMPIQUE CLUB GIF BASKET', 'GIF-SUR-YVETTE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91430', 'IDF0091023', 'CS IGNY BASKETBALL', 'IGNY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91600', 'IDF0091024', 'ALERTE JUVISY BASKET', 'SAVIGNY-SUR-ORGE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91470', 'IDF0091025', 'BASKETBALL CANTON DE LIMOURS', 'LIMOURS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91160', 'IDF0091026', 'LA POSTILLONNE OMNISPORTS DE LONGJUMEAU', 'LONGJUMEAU', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91460', 'IDF0091027', 'AS MARCOUSSIS', 'MARCOUSSIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91630', 'IDF0091028', 'US MAROLLES EN HUREPOIX', 'MAROLLES-EN-HUREPOIX', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91300', 'IDF0091029', 'ENTENTE SPORTIVE MASSY', 'MASSY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91540', 'IDF0091030', 'CLUB SPORTIF MENNECY BB', 'MENNECY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91230', 'IDF0091031', 'ES MONTGERON BASKET BALL', 'MONTGERON', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91620', 'IDF0091032', 'AS NOZAY', 'NOZAY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91400', 'IDF0091033', 'CA ORSAY', 'ORSAY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91120', 'IDF0091034', 'US PALAISEAU', 'PALAISEAU', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91550', 'IDF0091035', 'SC PARAY BASKET', 'PARAY-VIEILLE-POSTE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91480', 'IDF0091037', 'VARENNES-JARCY BASKET CLUB', 'VARENNES-JARCY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91130', 'IDF0091038', 'US RIS ORANGIS', 'RIS-ORANGIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91400', 'IDF0091039', 'CLUB OMNISPORT DE SACLAY', 'SACLAY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91530', 'IDF0091040', 'SAINT CHERON BASKET BALL', 'SAINT-CHERON', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91700', 'IDF0091041', 'SAINTE GENEVIEVE SPORTS', 'SAINTE-GENEVIEVE-DES-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91240', 'IDF0091043', 'SMS BASKET 91', 'SAINT-MICHEL-SUR-ORGE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91600', 'IDF0091044', 'CO SAVIGNY', 'SAVIGNY-SUR-ORGE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91790', 'IDF0091045', 'BOISSY SOUS SAINT YON BASKET', 'BOISSY-SOUS-SAINT-YON', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91370', 'IDF0091046', 'TU VERRIERES LE BUISSON', 'VERRIERES-LE-BUISSON', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91250', 'IDF0091047', 'BASKETBALL RIVE DROITE', 'SAINTRY-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91560', 'IDF0091048', 'ASSOCIATION BASKET CROSNE', 'CROSNE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91860', 'IDF0091049', 'BASKET ACADÉMIE CLUB EPINAY SOUS SÉNART', 'EPINAY-SOUS-SENART', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91700', 'IDF0091050', 'VILLIERS SUR ORGE BASKET-BALL', 'VILLIERS-SUR-ORGE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91170', 'IDF0091051', 'ES VIRY CHATILLON BASKET', 'VIRY-CHATILLON', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91330', 'IDF0091052', 'ES YERRES', 'YERRES', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91940', 'IDF0091053', 'CLUB OMNISPORTS DES ULIS', 'ULIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91070', 'IDF0091055', 'BONDOUFLE AC', 'BONDOUFLE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91360', 'IDF0091056', 'ESO BASKET 91', 'EPINAY-SUR-ORGE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91430', 'IDF0091057', 'ENT. IGNY-SACLAY', 'IGNY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91140', 'IDF0091060', 'CBB VILLEBON', 'VILLEBON-SUR-YVETTE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91590', 'IDF0091067', 'B C LA FERTE SUD ESSONNE', 'FERTE-ALAIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91700', 'IDF0091068', 'FLEURY BASKET BALL', 'FLEURY-MEROGIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91360', 'IDF0091069', 'VSO BASKETBALL VILLEMOISSON', 'VILLEMOISSON-SUR-ORGE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91310', 'IDF0091071', 'LINAS BASKET ACADEMY', 'LINAS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91320', 'IDF0091072', 'TEAM WISSOUS BASKET', 'WISSOUS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91100', 'IDF0091075', 'VILLABE BASKET CLUB', 'VILLABE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91490', 'IDF0091076', 'BASKET CLUB DE MILLY LA FORET', 'MILLY-LA-FORET', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91100', 'IDF0091077', 'SEINE ESSONNE BASKET BALL', 'CORBEIL-ESSONNES', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91270', 'IDF0091078', 'AS VIGNEUX BASKET', 'VIGNEUX-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91390', 'IDF0091079', 'MORSANG BASKET CLUB', 'MORSANG-SUR-ORGE', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91690', 'IDF0091080', 'BASKET CLUB MEREVILLOIS', 'SACLAS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91410', 'IDF0091081', 'DOURDAN BASKET', 'DOURDAN', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91460', 'IDF0091082', 'ENTENTE WEST ESSONNE U13M', 'MARCOUSSIS', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91510', 'IDF0091083', 'AMICALE DES SPORTS ET LOISIRS DE JANVILLE LARDY', 'LARDY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91350', 'IDF0091084', 'US TREMPLIN GRIGNY BASKET', 'GRIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91400', 'IDF0091086', 'ENT SACLAY-IGNY', 'SACLAY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL')),
    ('91350', 'IDF0091087', 'GRIGNY ACADEMY BASKET', 'GRIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE L''ESSONNE DE BASKET-BALL'));

-- from clubs/92_hauts_de_seine.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
('92000', 'IDF0092001', 'CD 92 HORS ASSOCIATION', 'NANTERRE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92100', 'IDF0092002', 'AC BOULOGNE BILLANCOURT', 'BOULOGNE-BILLANCOURT', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92130', 'IDF0092003', 'ISSY BASKET CLUB', 'ISSY-LES-MOULINEAUX', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92250', 'IDF0092004', 'AAE GARENNE COLOMBES', 'GARENNE-COLOMBES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92500', 'IDF0092005', 'ABEILLE RUEIL MALMAISON', 'RUEIL-MALMAISON', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92160', 'IDF0092006', 'ANTONY BASKET', 'ANTONY', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92600', 'IDF0092007', 'ASNIERES BASKETBALL', 'ASNIERES-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92330', 'IDF0092008', 'ASA SCEAUX', 'SCEAUX', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92260', 'IDF0092010', 'AS FONTENAY AUX ROSES', 'FONTENAY-AUX-ROSES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92190', 'IDF0092012', 'AS MEUDON', 'MEUDON', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92200', 'IDF0092014', 'A SAINT PIERRE DE NEUILLY', 'NEUILLY-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92390', 'IDF0092016', 'AMICALE VILLENEUVE LA GARENNE', 'VILLENEUVE-LA-GARENNE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92220', 'IDF0092019', 'COM BAGNEUX', 'BAGNEUX', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92420', 'IDF0092020', 'BASKET CLUB GARCHES VAUCRESSON', 'VAUCRESSON', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92400', 'IDF0092022', 'COURBEVOIE SPORTS BASKET', 'COURBEVOIE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92110', 'IDF0092023', 'CLICHY BASKET ACADEMY', 'CLICHY', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92140', 'IDF0092025', 'CLAMART BASKET CLUB', 'CLAMART', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92230', 'IDF0092026', 'GENNEVILLIERS BASKET CLUB', 'GENNEVILLIERS', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92800', 'IDF0092027', 'CSM PUTEAUX BASKET', 'PUTEAUX', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92350', 'IDF0092028', 'BASKET CLUB PLESSIS ROBINSON', 'PLESSIS-ROBINSON', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92340', 'IDF0092029', 'ESPERANCE DE BOURG LA REINE', 'BOURG-LA-REINE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92000', 'IDF0092031', 'JSF NANTERRE', 'NANTERRE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92700', 'IDF0092035', 'LSO COLOMBES', 'COLOMBES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92500', 'IDF0092036', 'RUEIL ATHLETIC CLUB', 'RUEIL-MALMAISON', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92150', 'IDF0092037', 'SURESNES BASKET CLUB', 'SURESNES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92320', 'IDF0092038', 'ASSOCIATION SPORTIVE CHATILLON BASKET', 'CHATILLON', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92120', 'IDF0092039', 'STADE MULTISPORTS MONTROUGE', 'MONTROUGE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92170', 'IDF0092040', 'STADE DE VANVES', 'VANVES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92240', 'IDF0092041', 'USM MALAKOFF', 'MALAKOFF', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92300', 'IDF0092051', 'LEVALLOIS SPORTING CLUB BASKET', 'LEVALLOIS-PERRET', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92500', 'IDF0092052', 'BULVIS BASKET CLUB', 'RUEIL-MALMAISON', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92210', 'IDF0092055', 'UAS SAINT CLOUD', 'SAINT-CLOUD', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92410', 'IDF0092056', 'VAL DE SEINE BASKET', 'VILLE-D''AVRAY', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92200', 'IDF0092058', 'A.S.PRICE WATERHOUSE COOPERS', 'NEUILLY-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92400', 'IDF0092059', 'KPMG INITIATIVE SPORTS', 'COURBEVOIE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92700', 'IDF0092061', 'BOIS-COLOMBES BASKET CLUB', 'COLOMBES', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL')),
('92340', 'IDF0092062', 'BETA BASKETBALL', 'BOURG-LA-REINE', (SELECT id FROM committees WHERE name = 'COMITE DES HAUTS-DE-SEINE DE BASKET-BALL'));

-- from clubs/93_seine_saint_denis.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('93140', 'IDF0093001', 'CD 93 HORS ASSOCIATION', 'BONDY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93170', 'IDF0093002', 'ALSACE DE BAGNOLET', 'BAGNOLET', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93140', 'IDF0093003', 'ASSOCIATION SPORTIVE BONDY', 'BONDY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93380', 'IDF0093005', 'AS SPORTIVE PIERREFITTE BASKET', 'PIERREFITTE-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93000', 'IDF0093006', 'ATHLETIC CLUB BOBIGNY', 'BOBIGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93600', 'IDF0093008', 'AULNAY FUSION BASKET', 'AULNAY-SOUS-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93170', 'IDF0093009', 'ASSOCIATION ENSEMBLE A BAGNOLET', 'BAGNOLET', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93260', 'IDF0093010', 'CERCLE SPORTIF LILAS ROMAINVILLE BASKET', 'LILAS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93300', 'IDF0093012', 'AUBERVILLIERS AVENIR BASKET BALL', 'AUBERVILLIERS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93150', 'IDF0093013', 'BLANC MESNIL SPORT BASKET', 'LE BLANC-MESNIL', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93190', 'IDF0093015', 'BASKET BALL LIVRY GARGAN', 'LIVRY-GARGAN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93160', 'IDF0093016', 'CS DE NOISY LE GRAND BASKET', 'NOISY-LE-GRAND', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93310', 'IDF0093017', 'EPP GERVAISIENNE', 'PRE-SAINT-GERVAIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93400', 'IDF0093019', 'RED STAR OLYMPIQUE AUDONIEN BASKET', 'SAINT-OUEN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93240', 'IDF0093020', 'ESPERANCE SPORTIVE STAINS', 'STAINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93110', 'IDF0093022', 'JEANNE D''ARC DE ROSNY', 'ROSNY-SOUS-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93360', 'IDF0093024', 'NEUILLY PLAISANCE SPORTS', 'NEUILLY-PLAISANCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93200', 'IDF0093026', 'SAINT DENIS UNION SPORTS', 'SAINT-DENIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93330', 'IDF0093027', 'NEUILLY SUR MARNE BASKET BALL', 'NEUILLY-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93320', 'IDF0093028', 'STADE DE L''EST PAVILLONNAIS', 'PAVILLONS-SOUS-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93220', 'IDF0093029', 'US MUNICIPALE DE GAGNY', 'GAGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93200', 'IDF0093032', 'Sport Event Corporation', 'SAINT-DENIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93290', 'IDF0093034', 'TREMBLAY ATHLETIQUE CLUB', 'TREMBLAY-EN-FRANCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93460', 'IDF0093036', 'BASKET CLUB GOURNAY SUR MARNE', 'GOURNAY-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93170', 'IDF0093038', 'THE PHOENIX ACADEMY', 'BAGNOLET', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93100', 'IDF0093040', 'MONTREUIL BASKET 93', 'MONTREUIL', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93400', 'IDF0093042', 'ASSOCIATION SPORTIVE BASKET ACTIVITY', 'SAINT-OUEN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93130', 'IDF0093045', 'BASKET BALL ASSOCIATION NOISEENNE', 'NOISY-LE-SEC', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93440', 'IDF0093046', 'ASSOCIATION SPORTIVE DE BASKET-BALL DE DUGNY', 'DUGNY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93600', 'IDF0093050', 'SEVRAN BASKET CLUB (SBB)', 'AULNAY-SOUS-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93120', 'IDF0093051', 'BASKET CLUB COURNEUVIEN', 'COURNEUVE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93340', 'IDF0093052', 'LE RAINCY BASKET-BALL', 'RAINCY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93420', 'IDF0093053', 'BASKET CLUB VILLEPINTE', 'VILLEPINTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93250', 'IDF0093054', 'VILLEMOMBLE ACADEMY (V.A)', 'VILLEMOMBLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93390', 'IDF0093055', 'CSM CLICHY SOUS BOIS', 'CLICHY-SOUS-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93430', 'IDF0093058', 'BASKET CLUB VILLETANEUSE', 'VILLETANEUSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93250', 'IDF0093063', 'VILLEMOMBLE SPORTS', 'VILLEMOMBLE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93800', 'IDF0093065', 'CSM EPINAY/SEINE BASKET BALL', 'EPINAY-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93500', 'IDF0093066', 'PANTIN BASKET CLUB', 'PANTIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93700', 'IDF0093069', 'US BASKET DRANCY', 'DRANCY', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL')),
    ('93410', 'IDF0093072', 'VAUJOURS COUBRON BASKET BALL', 'VAUJOURS', (SELECT id FROM committees WHERE name = 'COMITE DE LA SEINE-SAINT-DENIS DE BASKET-BALL'));

-- from clubs/94_val_de_marne.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('94700', 'IDF0094001', 'CD 94 HORS ASSOCIATION', 'MAISONS-ALFORT', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94260', 'IDF0094002', 'AAS FRESNES', 'FRESNES', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94480', 'IDF0094003', 'NEW TOWNS KINGS', 'ABLON-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94170', 'IDF0094004', 'ASSOCIATION LE PERREUX BASKET', 'PERREUX-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94270', 'IDF0094005', 'CSA KREMLIN BICETRE', 'KREMLIN-BICETRE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94000', 'IDF0094006', 'AS CRETEIL', 'CRETEIL', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94700', 'IDF0094007', 'AS LIBERTE MAISONS ALFORT', 'MAISONS-ALFORT', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94310', 'IDF0094008', 'AVENIR SPORTIF D''ORLY BASKET', 'ORLY', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94300', 'IDF0094009', 'BAC VINCENNES', 'VINCENNES', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94120', 'IDF0094010', 'BC FONTENAY SOUS BOIS', 'FONTENAY-SOUS-BOIS', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94350', 'IDF0094011', 'BC VILLIERS SUR MARNE', 'VILLIERS-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94240', 'IDF0094012', 'CA DE L''HAY LES ROSES', 'HAY-LES-ROSES', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94430', 'IDF0094014', 'COC CHENNEVIERES', 'CHENNEVIERES-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94370', 'IDF0094017', 'ESPACE SPORTIF DE SUCY', 'SUCY-EN-BRIE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94550', 'IDF0094018', 'ELAN CHEVILLY LARUE', 'CHEVILLY-LARUE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94400', 'IDF0094019', 'ENTENTE SPORTIVE DE VITRY', 'VITRY-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94520', 'IDF0094020', 'GROUPE FRANCOIS COPPEE MANDRES', 'MANDRES-LES-ROSES', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94320', 'IDF0094021', 'CA THIAIS BASKETBALL', 'THIAIS', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94160', 'IDF0094022', 'LA LORRAINE DE SAINT MANDE', 'SAINT-MANDE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94460', 'IDF0094024', 'VALENTON BASKET ACADEMY', 'VALENTON', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94500', 'IDF0094025', 'RED STAR CLUB DE CHAMPIGNY', 'CHAMPIGNY-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94220', 'IDF0094026', 'SAINT CHARLES CHARENTON SAINT MAURICE', 'CHARENTON-LE-PONT', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94600', 'IDF0094027', 'BASKET CLUB CHOISY LE ROI', 'CHOISY-LE-ROI', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94360', 'IDF0094028', 'BRY SUR MARNE BASKET CLUB', 'BRY-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94000', 'IDF0094029', 'US CRETEIL', 'CRETEIL', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94100', 'IDF0094032', 'VIE AU GRAND AIR SAINT MAUR', 'SAINT-MAUR-DES-FOSSES', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94150', 'IDF0094036', 'RUNGIS BB', 'RUNGIS', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94200', 'IDF0094037', 'UNION SPORTIVE IVRY BASKETBALL', 'IVRY-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94800', 'IDF0094038', 'UNION SPORTIVE DE VILLEJUIF BASKET', 'VILLEJUIF', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94420', 'IDF0094040', 'USM PLESSIS TREVISE', 'PLESSIS-TREVISE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94140', 'IDF0094041', 'UNION SPORTIVE ALFORTVILLE BASKET', 'ALFORTVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94110', 'IDF0094042', 'COSM ARCUEIL', 'ARCUEIL', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94250', 'IDF0094046', 'D.NE GENTILLY', 'GENTILLY', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94600', 'IDF0094047', 'MIND YOUR EXPERIENCE', 'CHOISY-LE-ROI', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94380', 'IDF0094050', 'CSM BONNEUIL SUR MARNE', 'BONNEUIL-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94470', 'IDF0094051', 'BOISSY BASKET BALL', 'BOISSY-SAINT-LEGER', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94340', 'IDF0094057', 'BC JOINVILLE', 'JOINVILLE-LE-PONT', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94130', 'IDF0094059', 'NOGENT BASKET CLUB', 'NOGENT-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94110', 'IDF0094060', 'INDEPENDENTS BASKETBALL FRANCE', 'ARCUEIL', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94400', 'IDF0094070', 'LOL''IDAYS', 'VITRY-SUR-SEINE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94440', 'IDF0094071', 'LES LYONS DE SANTENY BASKET CLUB', 'SANTENY', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94190', 'IDF0094072', 'VSG OMNISPORT', 'VILLENEUVE-SAINT-GEORGES', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL')),
    ('94430', 'IDF0094073', 'ENTENTE COC/USMPT', 'CHENNEVIERES-SUR-MARNE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-DE-MARNE DE BASKET-BALL'));

-- from clubs/95_val_doise.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('95320', 'IDF0095001', 'CD 95 HORS ASSOCIATION', 'SAINT-LEU-LA-FORET', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95200', 'IDF0095002', 'AAS SARCELLES BB', 'SARCELLES', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95240', 'IDF0095004', 'ACS CORMEILLAIS', 'CORMEILLES-EN-PARISIS', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95350', 'IDF0095006', 'SAINT BRICE BASKET', 'SAINT-BRICE-SOUS-FORET', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95430', 'IDF0095007', 'AUVERS BC', 'AUVERS-SUR-OISE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95310', 'IDF0095008', 'AS ST OUEN L''AUMONE', 'SAINT-OUEN-L''AUMÔNE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95120', 'IDF0095009', 'BC ERMONT', 'ERMONT', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95130', 'IDF0095010', 'BASKET CLUB DE FRANCONVILLE (BCF)', 'FRANCONVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95150', 'IDF0095011', 'BC TAVERNY MONTIGNY', 'TAVERNY', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95140', 'IDF0095012', 'CM GARGES LES GONESSE', 'GARGES-LES-GONESSE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95380', 'IDF0095013', 'CM ORVILLE DE LOUVRES', 'LOUVRES', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95600', 'IDF0095016', 'EAUBONNE BASKETBALL', 'EAUBONNE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95280', 'IDF0095017', 'OLYMPIC CLUB JOUY LE MOUTIER', 'JOUY-LE-MOUTIER', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95170', 'IDF0095018', 'USDEM BASKET', 'DEUIL-LA-BARRE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95100', 'IDF0095019', 'ARGENTEUIL BB', 'ARGENTEUIL', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95220', 'IDF0095022', 'HERBLAY BASKETBALL CLUB', 'HERBLAY', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95320', 'IDF0095023', 'E ST LEU B', 'SAINT-LEU-LA-FORET', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95470', 'IDF0095024', 'Entente Fosses Marly Basket Club', 'FOSSES', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95210', 'IDF0095027', 'O SANNOIS ST GRATIEN', 'SAINT-GRATIEN', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95260', 'IDF0095028', 'UMO BEAUMONT B', 'BEAUMONT-SUR-OISE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95420', 'IDF0095029', 'MAGNY VEXIN BASKET', 'MAGNY-EN-VEXIN', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95560', 'IDF0095030', 'US MONTSOULT-BAILLET-MAFFLIERS', 'MONTSOULT', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95330', 'IDF0095031', 'DOMONT B', 'DOMONT', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95870', 'IDF0095037', 'US O BEZONS', 'BEZONS', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95300', 'IDF0095038', 'CERGY-PONTOISE BB', 'PONTOISE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95610', 'IDF0095040', 'ERAGNY BC', 'ERAGNY', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95290', 'IDF0095041', 'BC L''ISLE ADAM', 'ISLE-ADAM', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95300', 'IDF0095042', 'US ENNERY BB', 'ENNERY', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95270', 'IDF0095044', 'UNION VIARMES LUZARCHES BASKET (UVLB)', 'LUZARCHES', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95200', 'IDF0095045', 'MACCABI SARCELLES', 'SARCELLES', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95570', 'IDF0095047', 'BOUFFEMONT AC B', 'BOUFFEMONT', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95480', 'IDF0095048', 'CS PIERRELAYE', 'PIERRELAYE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95740', 'IDF0095049', 'BC FREPILLON MERIEL MERY', 'FREPILLON', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95490', 'IDF0095050', 'VAUREAL BC', 'VAUREAL', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95180', 'IDF0095051', 'MENUCOURT BC', 'MENUCOURT', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95250', 'IDF0095052', 'BEAUCHAMP OLYMPIQUE BASKET CLUB', 'BEAUCHAMP', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95340', 'IDF0095053', 'ES CHAMBLY PERSAN', 'PERSAN', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95160', 'IDF0095055', 'BASKETBALL BESSANCOURT', 'MONTMORENCY', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95410', 'IDF0095064', 'ETOILE GROSLAY BASKET', 'GROSLAY', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95330', 'IDF0095066', 'MONTMAGNY BASKET-BALL', 'DOMONT', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95190', 'IDF0095621', 'EST VAL D''OISE BASKET', 'GOUSSAINVILLE', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL')),
    ('95400', 'IDF0095941', 'VILLIERS LE BEL BASKET (VLB B)', 'VILLIERS-LE-BEL', (SELECT id FROM committees WHERE name = 'COMITE DU VAL-D''OISE DE BASKET-BALL'));

-- from clubs/971_guadeloupe.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('97110', 'GUA0971001', 'COMITE GUADELOUPE BASKETBALL', 'POINTE-A-PITRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97113', 'GUA0971004', 'ASSOCIATION INSER''SPORT', 'GOURBEYRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97110', 'GUA0971011', 'AMICAL CLUB DARBOUSSIER', 'POINTE-A-PITRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97110', 'GUA0971013', 'ASC BAN E LOT', 'POINTE-A-PITRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97110', 'GUA0971014', 'AS VATABLE', 'POINTE-A-PITRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97110', 'GUA0971015', 'NEW STAR', 'POINTE-A-PITRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97123', 'GUA0971017', 'CYGNE NOIR', 'BAILLIF', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97111', 'GUA0971020', 'ETOILE DE MORNE-A-L''EAU', 'MORNE-A-L''EAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97116', 'GUA0971021', 'ETOILE DE L''OUEST POINTE NOIRE', 'POINTE-NOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97119', 'GUA0971022', 'K''ROULE', 'VIEUX-HABITANTS', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97117', 'GUA0971025', 'SOLIDARITE PORT-LOUISIENNE', 'PORT-LOUIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97113', 'GUA0971026', 'ASSOCIATION OMNISPORT GOURBEYRE', 'GOURBEYRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97180', 'GUA0971028', 'JUVENTUS', 'SAINTE-ANNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97123', 'GUA0971029', 'ASSOCIATION COLONIAL CLUB', 'BAILLIF', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97116', 'GUA0971030', 'LA LUCIOLE', 'POINTE-NOIRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97139', 'GUA0971032', 'MJC DES ABYMES', 'LES ABYMES', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97190', 'GUA0971033', 'GRAND GOUSIER BASKET', 'GOSIER', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97100', 'GUA0971034', 'BASSE TERRE BASKET 94', 'BASSE-TERRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97115', 'GUA0971038', 'UNITE SAINTE ROSIENNE BASKET', 'SAINTE-ROSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97118', 'GUA0971040', 'SAINT FRANCOIS SPORT CULTURE', 'SAINT-FRANCOIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97115', 'GUA0971042', 'LES GLADIATEURS DE SAINTE-ROSE', 'SAINTE-ROSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97131', 'GUA0971054', 'PTC FIGTHING', 'PETIT-CANAL', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97130', 'GUA0971055', 'KAP''S HAND', 'CAPESTERRE-BELLE-EAU', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97120', 'GUA0971056', 'BAMBOU BASKET CLUB 120', 'SAINT-CLAUDE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97122', 'GUA0971058', 'BAIE MAHAULT BASKET CLUB', 'BAIE-MAHAULT', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97112', 'GUA0971059', 'KASKOD MARIGALANT'' (KMG)', 'GRAND-BOURG', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97170', 'GUA0971064', 'PHOENIX 95', 'PETIT-BOURG', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97160', 'GUA0971074', 'MOULE BASKET CLUB', 'MOULE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97139', 'GUA0971100', 'LES FLYERS', 'LES ABYMES', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97121', 'GUA0971109', 'OMCS D''ANSE BERTRAND', 'ANSE-BERTRAND', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97180', 'GUA0971113', 'JEUNE INNOVATION SOCIALE ET CULTURELLE', 'SAINTE-ANNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL')),
    ('97129', 'GUA0971114', 'LAMENTIN BASKET CLUB', 'LAMENTIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUADELOUPE DE BASKET-BALL'));

-- from clubs/972_martinique.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('97200', 'MAR0972001', 'LR31 – HORS ASSOCIATION – MARTINIQUE', 'FORT-DE-FRANCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97234', 'MAR0972002', 'USAC DE FLOREAL', 'FORT-DE-FRANCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97231', 'MAR0972003', 'ARSENAL', 'ROBERT', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97212', 'MAR0972005', 'GOLDEN LION BASKETBALL', 'SAINT-JOSEPH', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97211', 'MAR0972006', 'REBOND PILOTIN', 'RIVIERE-PILOTE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97280', 'MAR0972011', 'CLUB SPORTIF VAUCLINOIS BASKET BALL', 'VAUCLIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97220', 'MAR0972014', 'GAULOISE', 'TRINITE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97290', 'MAR0972015', 'HIRONDELLE DU MARIN', 'MARIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97233', 'MAR0972016', 'MARTINIQUE UNIVERSITE CLUB', 'SCHOELCHER', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97232', 'MAR0972019', 'SPORTING CLUB LAMENTINOIS', 'LAMENTIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97215', 'MAR0972020', 'ASSOCIATION ECLAIR BASKETBALL', 'RIVIERE-SALEE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97232', 'MAR0972021', 'MADIN GREY BASKET CLUB (MGBC)', 'LAMENTIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97200', 'MAR0972022', 'GOLDEN-STAR BASKETBALL BB', 'FORT-DE-FRANCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97200', 'MAR0972023', 'INTREPIDE BASKET-CLUB', 'FORT-DE-FRANCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97200', 'MAR0972025', 'GOOD-LUCK', 'FORT-DE-FRANCE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97232', 'MAR0972026', 'AIGLON du LAMENTIN', 'LAMENTIN', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97212', 'MAR0972027', 'TWENTY 4 BASKET-BALL', 'SAINT-JOSEPH', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97223', 'MAR0972028', 'THUNDER ROCK DIAMANT BASKET BALL (TRDBB)', 'LE DIAMANT', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97270', 'MAR0972047', 'AS BLACK STARS', 'SAINT-ESPRIT', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97224', 'MAR0972051', 'UNION SPORTIVE DUCOSSAISE', 'DUCOS', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97213', 'MAR0972055', 'ASC AIGLE NOIR', 'GROS-MORNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97221', 'MAR0972070', 'CSC CARBET', 'LE CARBET', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL')),
    ('97212', 'MAR0972073', 'WAKS BASKET CLUB', 'SAINT-JOSEPH', (SELECT id FROM committees WHERE name = 'COMITE DE LA MARTINIQUE DE BASKET-BALL'));

-- from clubs/973_guyane.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('97300', 'GUY0973001', 'CD HORS ASSOCIATIONS', 'CAYENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL')),
    ('97300', 'GUY0973003', 'ASL SPORT GUYANAIS', 'CAYENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL')),
    ('97351', 'GUY0973005', 'UNION SPORTIVE AMERIQUE DU SUD', 'MATOURY', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL')),
    ('97300', 'GUY0973007', 'ASC LE CYGNE', 'CAYENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL')),
    ('97354', 'GUY0973009', 'USL MONTJOLY', 'REMIRE-MONTJOLY', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL')),
    ('97315', 'GUY0973011', 'US SINNAMARY', 'SINNAMARY', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL')),
    ('97351', 'GUY0973015', 'ASC MATOURY 88', 'MATOURY', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL')),
    ('97300', 'GUY0973017', 'ASC TOURS', 'CAYENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL')),
    ('97320', 'GUY0973019', 'COS MARONI BASKET BALL', 'SAINT-LAURENT-DU-MARONI', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL')),
    ('97300', 'GUY0973020', 'MAGIC TEAM', 'CAYENNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL')),
    ('97310', 'GUY0973021', 'ASC ROU..KOU', 'KOUROU', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL')),
    ('97355', 'GUY0973027', 'ASAM', 'MACOURIA', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL')),
    ('97360', 'GUY0973033', 'MANA. BASKET. ASSOCIATION', 'MANA', (SELECT id FROM committees WHERE name = 'COMITE DE LA GUYANE DE BASKET-BALL'));

-- from clubs/974_reunion.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('97490', 'REU0974001', 'CD HORS ASSOCIATION', 'Sainte Clotilde', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97460', 'REU0974002', 'BASKET CLUB ST PAUL', 'SAINT-PAUL', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97400', 'REU0974003', 'AIGLONS D''ORIENT', 'SAINT-DENIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97425', 'REU0974005', 'AVIRONS BASKET CLUB', 'AVIRONS', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97400', 'REU0974007', 'BASKET CLUB DIONYSIEN', 'SAINT-DENIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97419', 'REU0974008', 'PICKS BASKET LA POSSESSION', 'POSSESSION', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97420', 'REU0974010', 'CLUB SPORTIF PORTOIS BASKET', 'PORT', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97410', 'REU0974012', 'BOA BASKET CLUB', 'SAINT-PIERRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97410', 'REU0974013', 'SAINT PIERRE BASKET BALL', 'SAINT-PIERRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97430', 'REU0974016', 'LA TAMPONNAISE BASKET BALL', 'TAMPON', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97470', 'REU0974018', 'SAINT BENOÎT BASKET CLUB', 'SAINT-BENOIT', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97441', 'REU0974022', 'Basket Club Sainte Suzanne', 'SAINTE-SUZANNE', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97440', 'REU0974023', 'Union Saint André Basket Club (USA Basket Club)', 'SAINT-ANDRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97429', 'REU0974025', 'BASKET CLUB DE PETITE ILE', 'PETITE-ILE', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97418', 'REU0974026', 'PLAINE DES CAFRES BASKETBALL', 'PLAINE DES CAFRES', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97426', 'REU0974027', 'BASKET CLUB DE TROIS BASSINS', 'TROIS-BASSINS', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97440', 'REU0974029', 'ASSOCIATION JEUNESSE TERRITOIRE REUNION', 'SAINT-ANDRE', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97450', 'REU0974030', 'UNION BASKET SAINT-LOUIS', 'SAINT-LOUIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97439', 'REU0974032', 'BASKET CLUB JEUNESSE SPORTIVE SAINTE ROSIENNE', 'SAINTE-ROSE', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97400', 'REU0974033', 'ASSOCIATION MTG BASKETBALL', 'SAINT-DENIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97412', 'REU0974034', 'OLYMPIQUE BASKET PANONNAIS', 'BRAS-PANON', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97424', 'REU0974039', 'BC SAINT LEU', 'SAINT-LEU', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97438', 'REU0974041', 'SAINTE MARIE BASKET', 'SAINTE-MARIE', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97427', 'REU0974046', 'BEST BASKET CLUB', 'L''ETANG-SALE', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97480', 'REU0974100', 'SAINT JOSEPH BASKET CLUB', 'SAINT-JOSEPH', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97400', 'REU0974104', 'CLUB OMNISPORTS DE LA MONTAGNE', 'SAINT-DENIS', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL')),
    ('97430', 'REU0974107', 'ANCIENS DU BASKET REUNIONNAIS', 'TAMPON', (SELECT id FROM committees WHERE name = 'COMITE DE LA REUNION DE BASKET-BALL'));

-- from clubs/975_saint_pierre_et_miquelon.sql
;

-- from clubs/976_mayotte.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('97600', 'MAY0976001', 'COMITE DE MAYOTTE DE BASKETBALL', 'MAMOUDZOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97640', 'MAY0976002', 'A.B.S DE SADA', 'SADA', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976003', 'BASKET CLUB DE CHICONI', 'CHICONI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97620', 'MAY0976004', 'Basket Club de la Commune de Chirongui', 'CHIRONGUI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976006', 'BASKET CLUB DE M''TSAPERE', 'MAMOUDZOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97630', 'MAY0976008', 'TONIC CLUB DE MTZAMBORO', 'MTSAMBORO', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97650', 'MAY0976011', 'FLASH DE MTSANGAMOUJI', 'M''TSANGAMOUJI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97615', 'MAY0976013', 'RAPIDES ECLAIRS', 'PAMANDZI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976014', 'TONIC CLUB OMNISPORT', 'MAMOUDZOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97610', 'MAY0976017', 'VAUTOUR CLUB DE LABATTOIR', 'DZAOUDZI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976020', 'BASKET CLUB D''ACOUA', 'ACOUA', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97630', 'MAY0976021', 'COLORADO BEETLE MTSAHARA', 'MTSAMBORO', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97620', 'MAY0976023', 'UNION DE BASKET BALL DE BOUENI', 'BOUENI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976026', 'ETOILE BLEUE DE KAWENI', 'MAMOUDZOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976028', 'GLADIATOR DE DOUJANI', 'MAMOUDZOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97625', 'MAY0976031', 'HH20 DE MBOUINI', 'KANI-KELI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97615', 'MAY0976032', 'JEUNESSE CANON 2000', 'PAMANDZI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97670', 'MAY0976033', 'BARAKANI COCONI BASKET', 'OUANGANI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97660', 'MAY0976035', 'BASKET CLUB DE TSARARANO', 'DEMBENI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976037', 'SCOLO DUNKS', 'MAMOUDZOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97660', 'MAY0976038', 'BASKET CLUB D''ILONI', 'DEMBENI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976040', 'FUZ''ELLIPS DE CAVANI', 'MAMOUDZOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976041', 'ENTENTE SPORTIVE CSSM', 'MAMOUDZOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976045', 'KOROPA FUSION', 'KOUNGOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97640', 'MAY0976051', 'CLUB DE BASKET MANGAJOU', 'SADA', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976054', 'MAGIC BASKET DE PASSAMAINTY', 'MAMOUDZOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97660', 'MAY0976056', 'PARTISAN BASKET CLUB ASSOCIATION', 'DEMBENI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976058', 'CHICAGO CLUB DE MAMOUDZOU', 'MAMOUDZOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976059', 'GOLDEN FORCE', 'CHICONI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97670', 'MAY0976066', 'BASKET OLYMPIQUE DE OUANGANI', 'OUANGANI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976067', 'WEST STARS DE SOHOA', 'CHICONI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976068', 'FORCING FLY DE BANDRELE', 'BANDRELE', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976069', 'BAK7', 'KOUNGOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97610', 'MAY0976072', 'BASKET GAME', 'DZAOUDZI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97650', 'MAY0976073', 'WAKAÏDI 2015', 'BANDRABOUA', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97615', 'MAY0976076', 'ANGELS DE PAMANDZI', 'PAMANDZI', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97650', 'MAY0976078', 'ETOILE BASKETBALL CLUB DE DZOUMOGNE', 'BANDRABOUA', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976081', 'XP MAYANA (EXPERIENCE MAYOTTE)', 'MAMOUDZOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL')),
    ('97600', 'MAY0976084', 'BASKET CLUB TREVANI', 'KOUNGOU', (SELECT id FROM committees WHERE name = 'COMITE DE MAYOTTE DE BASKET-BALL'));

-- from clubs/977_saint_barthelemy.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('97133', 'GUA0978018', 'PELICAN''S BASKET CLUB ST BARTH', 'SAINT-BARTHELEMY', (SELECT id FROM committees WHERE name = 'COMITE DE SAINT-BARTHELEMY DE BASKET-BALL'));

-- from clubs/978_saint_martin.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('97150', 'GUA0978002', 'LET''S DO IT LDI', 'SAINT-MARTIN', (SELECT id FROM committees WHERE name = 'COMITE DE SAINT-MARTIN DE BASKET-BALL')),
    ('97150', 'GUA0978004', 'ASSOCIATION SPORTIVE DE PHOENICKS', 'SAINT-MARTIN', (SELECT id FROM committees WHERE name = 'COMITE DE SAINT-MARTIN DE BASKET-BALL')),
    ('97150', 'GUA0978094', 'CTBIN HORS ASSOCIATION', 'SAINT-MARTIN', (SELECT id FROM committees WHERE name = 'COMITE DE SAINT-MARTIN DE BASKET-BALL')),
    ('97150', 'GUA0978124', 'RCM BALLERS', 'SAINT-MARTIN', (SELECT id FROM committees WHERE name = 'COMITE DE SAINT-MARTIN DE BASKET-BALL')),
    ('97150', 'GUA0978128', 'BOYS IN THE YARD', 'SAINT-MARTIN', (SELECT id FROM committees WHERE name = 'COMITE DE SAINT-MARTIN DE BASKET-BALL'));

-- from clubs/984_taaf.sql
;

-- from clubs/986_wallis_et_futuna.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('98600', 'WEF0986001', 'HORIZONS 02 BASKET CLUB', 'UVEA', (SELECT id FROM committees WHERE name = 'COMITE DE WALLIS-ET-FUTUNA DE BASKET-BALL')),
    ('98600', 'WEF0986020', 'JEUNESSE SPORTIVE DE WALLIS', 'UVEA', (SELECT id FROM committees WHERE name = 'COMITE DE WALLIS-ET-FUTUNA DE BASKET-BALL'));

-- from clubs/9871_polynesie_archipel_societe.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('98701', 'PFR0987002', 'AS ARUE', 'ARUE', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL')),
    ('98712', 'PFR0987003', 'PAPARA BASKET CLUB', 'PAPARA', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL')),
    ('98701', 'PFR0987006', 'AS FEI PI', 'ARUE', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL')),
    ('98716', 'PFR0987007', 'AS JT', 'PIRAE', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL')),
    ('98717', 'PFR0987008', 'AS PUNARUU', 'PUNAAUIA', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL')),
    ('98713', 'PFR0987009', 'AS AORAI', 'PAPEETE', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL')),
    ('98713', 'PFR0987010', 'AS CENTRAL SPORTS', 'PAPEETE', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL')),
    ('98719', 'PFR0987012', 'AS TAMARII TARAVAO', 'TARAVAO', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL')),
    ('98713', 'PFR0987013', 'AS SDJ', 'PAPEETE', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL')),
    ('98711', 'PFR0987014', 'AS MANU URA PAEA', 'PAEA', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL')),
    ('98713', 'PFR0987018', 'AS DRAGON', 'PAPEETE', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL')),
    ('98704', 'PFR0987019', 'AS TEFANA', 'FAAA', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL')),
    ('98714', 'PFR0987211', 'AS EXCELSIOR', 'PAPEETE TAHITI', (SELECT id FROM committees WHERE name = 'COMITE DE POLYNESIE-FRANCAISE - ARCHIPEL DE LA SOCIÉTÉ DE BASKET-BALL'));

-- from clubs/9872_polynesie_archipel_tuamotu.sql
;

-- from clubs/9873_polynesie_archipel_gambier.sql
;

-- from clubs/9874_polynesie_archipel_australes.sql
;

-- from clubs/9875_polynesie_archipel_marquises.sql
;

-- from clubs/988_nouvelle_caledonie.sql
INSERT INTO clubs (zip_code, code, name, city, committee_id)
VALUES
    ('98809', 'NCA0988002', 'MONT DORE BASKET CLUB', 'LE MONT DORE', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98800', 'NCA0988003', 'OLYMPIQUE DE NOUMEA', 'NOUMEA', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98800', 'NCA0988005', 'AS RIVIERE SALEE', 'NOUMEA', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98850', 'NCA0988006', 'CLUB SPORTIF BOURAILLAIS', 'NOUVELLE CALEDONIE', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98835', 'NCA0988007', 'JEUNESSE SPORTIVE VALLEE DUTIR', 'DUMBEA', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98800', 'NCA0988008', 'A.S.6 ème Km BB', 'NOUMEA', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98800', 'NCA0988009', 'SOCIETE SPORTIVE INDEPENDANTE', 'NOUMEA', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98800', 'NCA0988010', 'TITANS', 'NOUMEA', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98827', 'NCA0988011', 'ASSOCIATION OMNISPORTS NEPOUI', 'POYA', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98825', 'NCA0988012', 'BASKET CLUB DE POUEMBOUT', 'POUEMBOUT', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98850', 'NCA0988016', 'AS TIEBAGHI', 'KOUMAC', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98800', 'NCA0988024', 'LR NOUVELLE CALEDONIE', 'NOUMEA', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98890', 'NCA0988069', 'BASKETCLUB PAÏTA', 'PAITA', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98835', 'NCA0988070', 'ASDUMBEA', 'DUMBEA', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98822', 'NCA0988081', 'CENTRAL SPORT POINDIMIE', 'POINDIMIE', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL')),
    ('98833', 'NCA0988083', 'BASKET CLUB VKP', 'VOH', (SELECT id FROM committees WHERE name = 'COMITE DE NOUVELLE CALEDONIE DE BASKET-BALL'));
