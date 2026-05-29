import random
from datetime import date

from faker import Faker

from config import AGE_RANGES, HEIGHT_RANGES, POSITIONS, WEIGHT_RANGES

_faker = Faker("fr_FR")


def generate_player_name(gender: str) -> str:
    if gender == "male":
        first = _faker.first_name_male()
    else:
        first = _faker.first_name_female()
    return f"{first} {_faker.last_name()}"


def generate_player_position() -> str:
    return random.choice(POSITIONS)  # noqa: S2245


def generate_player_height(category: str, gender: str) -> int:
    low, high = HEIGHT_RANGES[gender][category]
    return random.randint(low, high)  # noqa: S2245


def generate_player_weight(category: str, gender: str) -> int:
    low, high = WEIGHT_RANGES[gender][category]
    return random.randint(low, high)  # noqa: S2245


def generate_player_birthdate(category: str) -> date:
    min_age, max_age = AGE_RANGES[category]
    today = date.today()
    birth_year = random.randint(  # noqa: S2245
        today.year - max_age,
        today.year - min_age,
    )
    birth_month = random.randint(1, 12)  # noqa: S2245
    if birth_month == 2:
        max_day = 28
    elif birth_month in (4, 6, 9, 11):
        max_day = 30
    else:
        max_day = 31
    birth_day = random.randint(1, max_day)  # noqa: S2245
    return date(birth_year, birth_month, birth_day)