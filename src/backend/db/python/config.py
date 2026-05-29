import os

SEASON_YEAR = "2025-2026"
SEASON_START_WEEK = 39
SEASON_START_YEAR = 2025

CATEGORIES = ["U11", "U13", "U15", "U18", "U21", "Seniors"]
GENDERS = ["male", "female"]

GAME_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "simulation", "game_config.json")

POSITIONS = ["PG", "SG", "SF", "PF", "C"]

HEIGHT_RANGES = {
    "male": {
        "U11": (130, 150),
        "U13": (145, 165),
        "U15": (155, 180),
        "U18": (165, 195),
        "U21": (170, 205),
        "Seniors": (170, 210),
    },
    "female": {
        "U11": (125, 145),
        "U13": (140, 160),
        "U15": (150, 172),
        "U18": (158, 182),
        "U21": (160, 185),
        "Seniors": (160, 185),
    },
}

WEIGHT_RANGES = {
    "male": {
        "U11": (28, 45),
        "U13": (38, 58),
        "U15": (50, 72),
        "U18": (62, 88),
        "U21": (70, 100),
        "Seniors": (72, 110),
    },
    "female": {
        "U11": (25, 40),
        "U13": (35, 52),
        "U15": (45, 65),
        "U18": (54, 75),
        "U21": (57, 80),
        "Seniors": (57, 82),
    },
}

AGE_RANGES = {
    "U11": (9, 11),
    "U13": (11, 13),
    "U15": (13, 15),
    "U18": (15, 18),
    "U21": (18, 21),
    "Seniors": (18, 38),
}