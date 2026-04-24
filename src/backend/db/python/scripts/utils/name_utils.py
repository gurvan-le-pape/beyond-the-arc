from faker import Faker

fake = Faker("fr_FR")

def generate_player_name(gender: str) -> str:
    if gender == "male":
        first = fake.first_name_male()
    else:
        first = fake.first_name_female()
    last = fake.last_name()
    return f"{first} {last}"