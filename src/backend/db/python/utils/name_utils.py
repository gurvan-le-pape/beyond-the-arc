from faker import Faker

_faker = Faker("fr_FR")


def generate_player_name(gender: str) -> str:
    if gender == "male":
        first = _faker.first_name_male()
    else:
        first = _faker.first_name_female()
    return f"{first} {_faker.last_name()}"