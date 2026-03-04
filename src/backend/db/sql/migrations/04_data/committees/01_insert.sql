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