#!/usr/bin/env python3
"""Choose each club's position: its gym's when the geocoder finds the gym's
street where it is expected, otherwise the centre of the club's commune.

The gym's postal address is geocoded, without the gym's name: venue names
match namesakes in other departments. The club's own address is not used, as
it can be a volunteer's home.
"""
import csv
import io
import json
import math
import re
from pathlib import Path

import requests

CACHE_PATH = Path(__file__).parent / "ffbb_data" / "gym_geocode_cache.json"

# BAN's confidence below which its match is often another street of the commune.
MIN_SCORE = 0.75
# A gym in another commune than the club's is trusted up to this distance from
# the club's commune. Farther ones mix wrong gyms with wrong communes.
MAX_DISTANCE_KM = 15
EARTH_RADIUS_KM = 6371

# Clubs whose gym is far from the commune of their address, but is theirs: the
# address is an officer's, or names another commune of the club's area.
TRUSTED_GYMS = {
    "ARA0063034",  # AL LA GLACIERE, Clermont-Ferrand
    "ARA0069152",  # BASKET ATHLETIQUE CLUB SATOLAS
    "ARA0073098",  # AIX MAURIENNE, Aix-les-Bains
    "GES0054022",  # BASKET CLUB DIEUZE
    "GES0067051",  # STRASBOURG ELECTRICITE A.S.
    "GES0067103",  # SAINTE CROIX AUX MINES C.S.N.
    "GES0067147",  # BITCHE (PAYS DE)
    "HDF0059104",  # LINSELLES B
    "HDF0080020",  # CA PERONNE BASKET BALL
    "NAQ0033158",  # MARSAS BASKET CLUB (MBC)
    "NOR0076066",  # GCO BIHOREL
    "NOR0076073",  # QUINCAMPOIX BASKET
    "PDL0049111",  # SAINT MATHURIN SAINT REMY, Brissac Loire Aubance
    "SUD0006036",  # C.S.L GENDARMERIE ANTIBES
}

# BAN does not cover Monaco, and answers Nouméa for its postcode.
STADE_LOUIS_II = ("43.727600", "7.415600")
MONACO = ("43.738400", "7.424600")
FIXED_POSITIONS = {
    "SUD0006006": STADE_LOUIS_II,  # AS MONACO BASKET, Salle Gaston-Médecin
    "SUD0006041": MONACO,  # ENTENTE MBA - ASM
    "SUD0006054": MONACO,  # MONACO BASKET ASSOCIATION
}

POSTCODE_RE = re.compile(r"\b(\d{5})\b(?!.*\b\d{5}\b)")


def gym_postcode(address):
    """The last five-digit group of the address, or None."""
    match = POSTCODE_RE.search(address or "")
    return match.group(1) if match else None


def geocode_gyms(clubs):
    """Bulk-geocode the distinct gym addresses via BAN, each restricted to its
    postcode. Returns {gym address: BAN row}."""
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text(encoding="utf-8"))

    addresses = sorted({(cl.get("gym_address") or "").strip() for cl in clubs} - {""})
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["query", "postcode"])
    writer.writerows((a, gym_postcode(a)) for a in addresses if gym_postcode(a))

    print(f"Geocoding {len(addresses)} gym addresses via BAN bulk CSV...")
    resp = requests.post(
        "https://api-adresse.data.gouv.fr/search/csv/",
        files={"data": ("gyms.csv", buf.getvalue(), "text/csv")},
        data={"columns": "query", "postcode": "postcode"},
        timeout=300,
    )
    resp.raise_for_status()
    result = {row["query"]: row for row in csv.DictReader(io.StringIO(resp.text))}
    CACHE_PATH.write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
    return result


def coordinates(row):
    """A BAN row's (latitude, longitude) as BAN wrote them, or None."""
    if not row or not row.get("latitude") or not row.get("longitude"):
        return None
    return row["latitude"], row["longitude"]


def distance_km(a, b):
    lat_a, lon_a, lat_b, lon_b = (math.radians(float(v)) for v in (*a, *b))
    x = (lon_b - lon_a) * math.cos((lat_a + lat_b) / 2)
    return EARTH_RADIUS_KM * math.hypot(x, lat_b - lat_a)


def club_position(club, centre_row, gym_rows, dept_code):
    """Return ((latitude, longitude) or None, reason) for a club.

    centre_row is BAN's row for the commune of the club's address, if any;
    dept_code the department of the club's committee.
    """
    if club["code"] in FIXED_POSITIONS:
        return FIXED_POSITIONS[club["code"]], "fixed by hand"

    centre = coordinates(centre_row)
    address = (club.get("gym_address") or "").strip()
    if not address:
        return centre, "no gym address"

    row = gym_rows.get(address)
    gym = coordinates(row)
    if (
        gym is None
        or row["result_type"] not in ("street", "housenumber")
        or row["result_postcode"] != gym_postcode(address)
        or float(row["result_score"]) < MIN_SCORE
    ):
        return centre, "gym not found precisely"

    if club["code"] in TRUSTED_GYMS:
        return gym, "trusted gym"
    if centre is None:
        if row["result_citycode"].startswith(dept_code):
            return gym, "gym, no commune known"
        return None, "gym in another department"
    if row["result_citycode"] == centre_row["result_citycode"]:
        return gym, "gym in the club's commune"
    if distance_km(centre, gym) <= MAX_DISTANCE_KM:
        return gym, "gym nearby"
    return centre, "gym too far"
