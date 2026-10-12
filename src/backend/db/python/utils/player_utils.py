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


# Where each position sits in its category's height range, as a fraction of
# the range: guards at the short end, centres at the tall end.
POSITION_BUILD = {"PG": 0.2, "SG": 0.35, "SF": 0.5, "PF": 0.68, "C": 0.85}
BUILD_SPREAD = 0.12


def generate_roster_positions(size: int) -> list[str]:
    """
    Positions for one roster: as many full sets of the five positions as fit,
    the rest drawn among guards and forwards, in random order so jersey
    numbers say nothing about position.
    """
    positions = list(POSITIONS) * (size // len(POSITIONS))
    positions += random.choices(["PG", "SG", "SF", "PF"], k=size - len(positions))  # noqa: S2245
    random.shuffle(positions)  # noqa: S2245
    return positions


def generate_player_build(position: str) -> float:
    """
    Where a player sits in their category's height and weight ranges, from 0
    (smallest) to 1 (largest): around their position's usual build, with
    enough spread for a tall guard or a short centre now and then.
    """
    build = random.gauss(POSITION_BUILD[position], BUILD_SPREAD)  # noqa: S2245
    return min(1.0, max(0.0, build))


def _in_range(low: int, high: int, fraction: float) -> int:
    return round(low + (high - low) * fraction)


def generate_player_height(category: str, gender: str, build: float) -> int:
    low, high = HEIGHT_RANGES[gender][category]
    return _in_range(low, high, build)


def generate_player_weight(category: str, gender: str, build: float) -> int:
    # Weight follows height loosely, not exactly.
    low, high = WEIGHT_RANGES[gender][category]
    fraction = min(1.0, max(0.0, build + random.gauss(0, 0.1)))  # noqa: S2245
    return _in_range(low, high, fraction)


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