#!/usr/bin/env python3
"""Assemble prisma/migrations/1_seed_static_data/migration.sql from the
scraped FFBB data (see scrape.py) plus BAN-geocoded club coordinates (see
gym_positions.py).
Metropolitan France only.

Run scrape.py first. Regions/departments aren't scraped - FFBB has no
"list of France's regions" page - they're hardcoded below (REGIONS,
DEPARTMENTS) and regenerated from scratch every run, same as everything
else. This script is fully self-contained: it never reads migration.sql,
only writes it.

Writes directly to migration.sql - it's a tracked file, so `git diff` is
the review step and `git checkout -- <file>` is the undo.

Usage: make refresh-static-data (from the repo root), or directly:
       python3 build_migration.py

With --positions PATH, writes a migration updating the positions of the
already seeded clubs to PATH instead, and leaves the seed alone.
"""
import argparse
import csv
import io
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path

import requests

from gym_positions import club_position, coordinates, geocode_gyms

HERE = Path(__file__).parent
DATA = HERE / "ffbb_data"
TARGET_MIGRATION = HERE / "../../src/backend/prisma/migrations/1_seed_static_data/migration.sql"

# FFBB's own league code -> our regions.code (differs only for PCA, which
# FFBB brands "Ligue du Sud" / code SUD)
LEAGUE_TO_REGION = {
    "ARA": "ARA", "BFC": "BFC", "BRE": "BRE", "COR": "COR", "CVL": "CVL",
    "GES": "GES", "HDF": "HDF", "IDF": "IDF", "NAQ": "NAQ", "NOR": "NOR",
    "OCC": "OCC", "PDL": "PDL", "SUD": "PCA",
}

# Metropolitan France only - not scraped (FFBB has no "list of regions"
# page), this is the actual reference data. (code, name)
REGIONS = [
    ("ARA", "Auvergne-Rhône-Alpes"), ("BFC", "Bourgogne-Franche-Comté"),
    ("BRE", "Bretagne"), ("CVL", "Centre-Val de Loire"), ("COR", "Corse"),
    ("GES", "Grand Est"), ("HDF", "Hauts-de-France"), ("IDF", "Île-de-France"),
    ("NOR", "Normandie"), ("NAQ", "Nouvelle-Aquitaine"), ("OCC", "Occitanie"),
    ("PDL", "Pays de la Loire"), ("PCA", "Provence-Alpes-Côte d'Azur"),
]

# (code, name, region_code)
DEPARTMENTS = [
    ("01", "Ain", "ARA"), ("02", "Aisne", "HDF"), ("03", "Allier", "ARA"),
    ("04", "Alpes-de-Haute-Provence", "PCA"), ("05", "Hautes-Alpes", "PCA"),
    ("06", "Alpes-Maritimes", "PCA"), ("07", "Ardèche", "ARA"),
    ("08", "Ardennes", "GES"), ("09", "Ariège", "OCC"), ("10", "Aube", "GES"),
    ("11", "Aude", "OCC"), ("12", "Aveyron", "OCC"),
    ("13", "Bouches-du-Rhône", "PCA"), ("14", "Calvados", "NOR"),
    ("15", "Cantal", "ARA"), ("16", "Charente", "NAQ"),
    ("17", "Charente-Maritime", "NAQ"), ("18", "Cher", "CVL"),
    ("19", "Corrèze", "NAQ"), ("2A", "Corse-du-Sud", "COR"),
    ("2B", "Haute-Corse", "COR"), ("21", "Côte-d'Or", "BFC"),
    ("22", "Côtes-d'Armor", "BRE"), ("23", "Creuse", "NAQ"),
    ("24", "Dordogne", "NAQ"), ("25", "Doubs", "BFC"), ("26", "Drôme", "ARA"),
    ("27", "Eure", "NOR"), ("28", "Eure-et-Loir", "CVL"),
    ("29", "Finistère", "BRE"), ("30", "Gard", "OCC"),
    ("31", "Haute-Garonne", "OCC"), ("32", "Gers", "OCC"),
    ("33", "Gironde", "NAQ"), ("34", "Hérault", "OCC"),
    ("35", "Ille-et-Vilaine", "BRE"), ("36", "Indre", "CVL"),
    ("37", "Indre-et-Loire", "CVL"), ("38", "Isère", "ARA"),
    ("39", "Jura", "BFC"), ("40", "Landes", "NAQ"),
    ("41", "Loir-et-Cher", "CVL"), ("42", "Loire", "ARA"),
    ("43", "Haute-Loire", "ARA"), ("44", "Loire-Atlantique", "PDL"),
    ("45", "Loiret", "CVL"), ("46", "Lot", "OCC"),
    ("47", "Lot-et-Garonne", "NAQ"), ("48", "Lozère", "OCC"),
    ("49", "Maine-et-Loire", "PDL"), ("50", "Manche", "NOR"),
    ("51", "Marne", "GES"), ("52", "Haute-Marne", "GES"),
    ("53", "Mayenne", "PDL"), ("54", "Meurthe-et-Moselle", "GES"),
    ("55", "Meuse", "GES"), ("56", "Morbihan", "BRE"), ("57", "Moselle", "GES"),
    ("58", "Nièvre", "BFC"), ("59", "Nord", "HDF"), ("60", "Oise", "HDF"),
    ("61", "Orne", "NOR"), ("62", "Pas-de-Calais", "HDF"),
    ("63", "Puy-de-Dôme", "ARA"), ("64", "Pyrénées-Atlantiques", "NAQ"),
    ("65", "Hautes-Pyrénées", "OCC"), ("66", "Pyrénées-Orientales", "OCC"),
    ("67", "Bas-Rhin", "GES"), ("68", "Haut-Rhin", "GES"), ("69", "Rhône", "ARA"),
    ("70", "Haute-Saône", "BFC"), ("71", "Saône-et-Loire", "BFC"),
    ("72", "Sarthe", "PDL"), ("73", "Savoie", "ARA"),
    ("74", "Haute-Savoie", "ARA"), ("75", "Paris", "IDF"),
    ("76", "Seine-Maritime", "NOR"), ("77", "Seine-et-Marne", "IDF"),
    ("78", "Yvelines", "IDF"), ("79", "Deux-Sèvres", "NAQ"),
    ("80", "Somme", "HDF"), ("81", "Tarn", "OCC"),
    ("82", "Tarn-et-Garonne", "OCC"), ("83", "Var", "PCA"),
    ("84", "Vaucluse", "PCA"), ("85", "Vendée", "PDL"), ("86", "Vienne", "NAQ"),
    ("87", "Haute-Vienne", "NAQ"), ("88", "Vosges", "GES"), ("89", "Yonne", "BFC"),
    ("90", "Territoire de Belfort", "BFC"), ("91", "Essonne", "IDF"),
    ("92", "Hauts-de-Seine", "IDF"), ("93", "Seine-Saint-Denis", "IDF"),
    ("94", "Val-de-Marne", "IDF"), ("95", "Val-d'Oise", "IDF"),
]


def sql_str(v):
    if v is None:
        return "NULL"
    v = str(v).strip()
    if v == "":
        return "NULL"
    return "'" + v.replace("'", "''") + "'"


def load_jsonl(name):
    records = []
    with (DATA / f"{name}.jsonl").open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


ZIP_CITY_RE = re.compile(r"(\d{5})\s+([A-Za-zÀ-ÿ0-9\-'./() ]+)$")


def parse_zip_city(address):
    """Extract (zip_code, city) from a French address string. FFBB addresses
    reliably end in '<postcode> <CITY>', so this is authoritative - much
    more reliable than geocoding the full free-text address, whose
    venue-name prefixes (e.g. "salle polyvalente") cause BAN's fuzzy matcher
    to occasionally lock onto a same-named venue in a different department.
    """
    if not address:
        return None, None
    m = ZIP_CITY_RE.search(address.strip())
    if not m:
        return None, None
    return m.group(1), m.group(2).strip()


def geocode_clubs(clubs):
    """Bulk-geocode 'zip city' (not the full address - see parse_zip_city)
    via BAN, return dict url -> geocode result."""
    cache_path = DATA / "geocode_cache.json"
    if cache_path.exists():
        return json.loads(cache_path.read_text(encoding="utf-8"))

    rows = []
    for c in clubs:
        if "error" in c:
            continue
        zip_code, city = parse_zip_city(c.get("address"))
        if not zip_code:
            continue
        rows.append({"url": c["_url"], "query": f"{zip_code} {city}"})

    print(f"Geocoding {len(rows)} club zip/city pairs via BAN bulk CSV...")
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=["url", "query"])
    writer.writeheader()
    writer.writerows(rows)

    resp = requests.post(
        "https://api-adresse.data.gouv.fr/search/csv/",
        files={"data": ("addresses.csv", buf.getvalue(), "text/csv")},
        data={"columns": "query"},
        timeout=180,
    )
    resp.raise_for_status()
    reader = csv.DictReader(io.StringIO(resp.text))
    result = {}
    for row in reader:
        result[row["url"]] = row
    cache_path.write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
    return result


def load_excluded_codes():
    """Codes of the FFBB entries that are not clubs, reviewed by hand."""
    with (HERE / "excluded_clubs.csv").open(encoding="utf-8", newline="") as f:
        return {row["code"] for row in csv.DictReader(f)}


def url_parts(url):
    # /ligues/{lig}/comites/{com}/clubs/{club}  or /ligues/{lig}/comites/{com}  or /ligues/{lig}
    parts = url.strip("/").split("/")
    d = {}
    if len(parts) >= 2:
        d["league"] = parts[1]
    if len(parts) >= 4:
        d["committee"] = parts[3]
    if len(parts) >= 6:
        d["club"] = parts[5]
    return d


def name_sort_key(s):
    # Plain string sort isn't locale-aware: 'Î' sorts after every ASCII
    # letter, so "Île-de-France" would land after "Provence..." instead of
    # near "Hauts-de-France" where French alphabetical order puts it.
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().upper()


def dept_sort_key(code):
    # Corse's 2A/2B replace the old numeric "20": plain string sort would
    # place them after 21-29 (letters compare above digits in ASCII), but
    # they belong right after 19 and before 21, per INSEE's own ordering.
    if code in ("2A", "2B"):
        return (20, code)
    return (int(code), "")


def positions_sql(moves):
    """The UPDATE moving each (code, old position, new position). It names the
    old position, so a club whose position has changed since is left alone."""
    rows = []
    for code, old, new in moves:
        values = ", ".join(sql_str(v) for v in (*(old or (None, None)), *new))
        rows.append(f"({sql_str(code)}, {values})")
    return "\n".join([
        "-- Moves clubs from the centre of their commune to their gym's street.",
        "-- Generated by scripts/ffbb-import/build_migration.py --positions.",
        "-- A club no longer at its seeded position is left alone.",
        "UPDATE clubs AS c",
        "SET latitude = v.latitude::decimal(10,8), longitude = v.longitude::decimal(11,8)",
        "FROM (VALUES",
        ",\n".join(rows),
        ") AS v(code, old_latitude, old_longitude, latitude, longitude)",
        "WHERE c.code = v.code",
        "  AND c.latitude IS NOT DISTINCT FROM v.old_latitude::decimal(10,8)",
        "  AND c.longitude IS NOT DISTINCT FROM v.old_longitude::decimal(11,8);\n",
    ])


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--positions", type=Path, metavar="PATH")
    args = parser.parse_args()

    metro_regions = sorted(REGIONS, key=lambda t: name_sort_key(t[1]))
    metro_departments = sorted(DEPARTMENTS, key=lambda t: dept_sort_key(t[0]))
    dept_codes = {c for c, _, _ in metro_departments}
    dept_name_by_code = {c: n.upper() for c, n, _ in metro_departments}

    leagues = load_jsonl("leagues")
    committees = load_jsonl("committees")
    clubs = load_jsonl("clubs")

    # Sort upfront (not just at output time) so every downstream grouping -
    # gym dedup order, club_rows - inherits a
    # stable, readable order for free instead of the incidental order
    # scrape.py happened to visit URLs in.
    leagues.sort(key=lambda lg: name_sort_key(lg.get("name") or ""))

    # Group committees by league in the *same* order as the leagues table
    # above (alphabetical by region name) - sorting by FFBB's own raw league
    # code instead would silently disagree with it (e.g. "cor" < "cvl" but
    # "Centre-Val-de-Loire" < "Corse", so COR committees would end up before
    # CVL committees while the leagues table has it the other way around).
    region_name_by_code = dict(metro_regions)

    def committee_sort_key(co):
        parts = url_parts(co["_url"])
        region_code = LEAGUE_TO_REGION[parts["league"].upper()]
        return (name_sort_key(region_name_by_code[region_code]), parts.get("committee", ""))

    committees.sort(key=committee_sort_key)
    clubs.sort(key=lambda cl: cl.get("code") or "")

    print(f"Loaded: {len(leagues)} leagues, {len(committees)} committees, {len(clubs)} clubs")
    club_errors = [c for c in clubs if "error" in c]
    committee_errors = [c for c in committees if "error" in c]
    print(f"Errors: {len(club_errors)} clubs, {len(committee_errors)} committees")

    geocoded = geocode_clubs(clubs)
    gym_rows = geocode_gyms(clubs)

    # gyms: dedup by (name, address)
    gym_key_to_code = {}
    gyms = []
    for cl in clubs:
        if "error" in cl or not cl.get("gym_name"):
            continue
        key = (cl["gym_name"].strip(), (cl.get("gym_address") or "").strip())
        if key not in gym_key_to_code:
            gym_code = f"GYM-{len(gyms) + 1}"
            gym_key_to_code[key] = gym_code
            gyms.append({"code": gym_code, "name": key[0], "address": key[1] or None})

    # Determine each CLUB's own department directly from its own address'
    # postcode (never guess a single department per committee): some
    # committees genuinely cover 2 departments where club counts are too low
    # to justify a standalone committee (e.g. SUD/0405 "ALPES-DU-SUD" = dept
    # 04 + dept 05 clubs). We split those into one committee row per
    # department instead of picking a majority winner, so no club's
    # department gets silently overridden. Postcode beats geocoding here:
    # BAN's fuzzy match on a generic venue name (no street) can lock onto a
    # same-named venue in an unrelated department (e.g. "Salle Polyvalente"
    # in Var instead of Loire) - the postcode in the club's own address is
    # exact and doesn't have that failure mode. Only Corse (postcode 20xxx
    # covers both 2A and 2B) needs the geocoded citycode as a tiebreaker.
    def club_department(cl):
        zip_code, _city = parse_zip_city(cl.get("address"))
        if not zip_code:
            return None
        dcode = zip_code[:2]
        if dcode == "20":
            geo = geocoded.get(cl["_url"])
            citycode = (geo or {}).get("result_citycode", "")
            if citycode[:2] in ("2A", "2B"):
                return citycode[:2]
            return None
        if dcode in dept_codes:
            return dcode
        return None

    club_dept = {}
    committee_key_by_club = {}
    for cl in clubs:
        if "error" in cl:
            continue
        parts = url_parts(cl["_url"])
        committee_key = f"{parts['league'].upper()}{parts['committee']}"
        committee_key_by_club[cl["_url"]] = committee_key
        dcode = club_department(cl)
        if dcode is not None:
            club_dept[cl["_url"]] = dcode

    depts_by_committee_key = {}
    for url, dcode in club_dept.items():
        depts_by_committee_key.setdefault(committee_key_by_club[url], set()).add(dcode)

    # Fallback for clubs with no parseable address: if every OTHER club in
    # the same committee agrees on a single department, use it.
    unresolved_urls = [cl["_url"] for cl in clubs if "error" not in cl and cl["_url"] not in club_dept]
    fallback_resolved = 0
    for url in unresolved_urls:
        committee_key = committee_key_by_club[url]
        depts = depts_by_committee_key.get(committee_key)
        if depts and len(depts) == 1:
            club_dept[url] = next(iter(depts))
            fallback_resolved += 1
    print(f"{len(unresolved_urls)} clubs had no parseable address; {fallback_resolved} resolved via committee fallback")

    split_committees = {k: v for k, v in depts_by_committee_key.items() if len(v) > 1}
    if split_committees:
        print(f"Splitting {len(split_committees)} multi-department committees: {split_committees}")

    def committee_name_for(committee_key, dept_code, original_name):
        # Split committees (e.g. "AUBE - HAUTE-MARNE") get one row per
        # department, each named after its own department - not the shared
        # merged name - so "committee X/Y" becomes "committee X" and
        # "committee Y", matching how every other (non-merged) FFBB
        # committee is already named after its single department.
        if committee_key in split_committees:
            return dept_name_by_code[dept_code]
        return original_name

    unresolved_committees = [
        f"{url_parts(co['_url'])['league'].upper()}{url_parts(co['_url'])['committee']}"
        for co in committees
        if "error" not in co
        and f"{url_parts(co['_url'])['league'].upper()}{url_parts(co['_url'])['committee']}" not in depts_by_committee_key
    ]
    if unresolved_committees:
        print(f"WARNING: {len(unresolved_committees)} committees have no resolvable department: {unresolved_committees}")

    out = []
    out.append("-- Static reference data (competition structure, geography),")
    out.append("-- metropolitan France only. Order respects foreign keys:")
    out.append("-- regions -> departments -> leagues -> committees -> gyms -> clubs.")
    out.append("-- No contact details: phones, emails and presidents are FFBB's to")
    out.append("-- publish, and the site links to each organisation's FFBB page.\n")

    out.append("INSERT INTO regions (code, name) VALUES")
    out.append(",\n".join(f"({sql_str(c)}, {sql_str(n)})" for c, n in metro_regions) + ";\n")

    out.append("INSERT INTO departments (code, name, region_id) VALUES")
    out.append(",\n".join(
        f"({sql_str(c)}, {sql_str(n)}, (SELECT id FROM regions WHERE code = {sql_str(r)}))"
        for c, n, r in metro_departments
    ) + ";\n")

    out.append("INSERT INTO leagues (name, address, region_id) VALUES")
    league_rows = []
    for lg in leagues:
        if "error" in lg:
            continue
        region_code = LEAGUE_TO_REGION[lg["code"]]
        league_rows.append(
            f"({sql_str(lg['name'])}, {sql_str(lg['address'])}, "
            f"(SELECT id FROM regions WHERE code = {sql_str(region_code)}))"
        )
    out.append(",\n".join(league_rows) + ";\n")

    out.append("INSERT INTO committees (name, address, department_id, league_id) VALUES")
    committee_rows = []
    skipped_committees = []
    for co in committees:
        if "error" in co:
            continue
        parts = url_parts(co["_url"])
        committee_key = f"{parts['league'].upper()}{parts['committee']}"
        depts = depts_by_committee_key.get(committee_key)
        if not depts:
            skipped_committees.append(committee_key)
            continue
        region_code = LEAGUE_TO_REGION[parts["league"].upper()]
        league_sub = f"(SELECT lg.id FROM leagues lg JOIN regions r ON lg.region_id = r.id WHERE r.code = {sql_str(region_code)})"
        for dept_code in sorted(depts):
            name = committee_name_for(committee_key, dept_code, co["name"])
            committee_rows.append(
                f"({sql_str(name)}, {sql_str(co['address'])}, "
                f"(SELECT id FROM departments WHERE code = {sql_str(dept_code)}), "
                f"{league_sub})"
            )
    out.append(",\n".join(committee_rows) + ";\n")

    out.append("INSERT INTO gyms (name, address, code) VALUES")
    out.append(",\n".join(
        f"({sql_str(g['name'])}, {sql_str(g['address'])}, {sql_str(g['code'])})"
        for g in sorted(gyms, key=lambda g: name_sort_key(g["name"]))
    ) + ";\n")

    committee_name_by_key = {}
    for co in committees:
        if "error" in co:
            continue
        parts = url_parts(co["_url"])
        committee_key = f"{parts['league'].upper()}{parts['committee']}"
        committee_name_by_key[committee_key] = co["name"]

    name_counts = {}
    for n in committee_name_by_key.values():
        name_counts[n] = name_counts.get(n, 0) + 1
    dup_names = {n for n, c in name_counts.items() if c > 1}
    if dup_names:
        print(f"WARNING: {len(dup_names)} committee names are not unique: {dup_names}")

    # A 4368-row VALUES list with a correlated subquery per row for each
    # foreign key (~13,000 subplan executions in one statement) contributed
    # to a prod incident - sustained CPU/disk load applying this migration.
    # Instead: build one VALUES list of raw business keys (gym code,
    # committee name, department code) and resolve all of them in a single
    # set-based join, so Postgres does a handful of hash/merge joins over
    # the whole set instead of thousands of independent per-row lookups. Still matches by business key, not by
    # an assumed auto-increment id.
    out.append("INSERT INTO clubs (code, name, address, website, gym_id, committee_id, zip_code, city, latitude, longitude)")
    value_rows = []
    skipped_clubs = []
    moves = []
    position_reasons = Counter()
    excluded_codes = load_excluded_codes()
    for cl in clubs:
        if "error" in cl:
            continue
        parts = url_parts(cl["_url"])
        committee_key = f"{parts['league'].upper()}{parts['committee']}"
        dept_code = club_dept.get(cl["_url"])
        if cl["code"] in excluded_codes:
            continue
        if committee_key in skipped_committees or dept_code is None or committee_key not in committee_name_by_key:
            skipped_clubs.append(cl["code"])
            continue
        gcode = None
        if cl.get("gym_name"):
            key = (cl["gym_name"].strip(), (cl.get("gym_address") or "").strip())
            gcode = gym_key_to_code.get(key)
        zip_code, city = parse_zip_city(cl.get("address"))
        geo = geocoded.get(cl["_url"])
        position, reason = club_position(cl, geo, gym_rows, dept_code)
        position_reasons[reason] += 1
        if reason == "gym too far":
            print(f"Gym too far, centre kept: {cl['code']} {cl['name']} | {cl.get('gym_address')}")
        centre = coordinates(geo)
        if position and position != centre:
            moves.append((cl["code"], centre, position))
        lat, lon = position or (None, None)
        # department_id narrows this in case two unrelated committees ever
        # share a name - see committee_name_for above for split ones.
        committee_name = committee_name_for(committee_key, dept_code, committee_name_by_key[committee_key])
        value_rows.append(
            f"({sql_str(cl['code'])}, {sql_str(cl['name'])}, {sql_str(cl.get('address'))}, "
            f"{sql_str(zip_code)}, {sql_str(city)}, {sql_str(lat)}, {sql_str(lon)}, "
            f"{sql_str(gcode)}, {sql_str(committee_name)}, {sql_str(dept_code)})"
        )

    print(f"Skipped {len(skipped_clubs)} clubs (committee unresolved)")
    print(f"Positions: {dict(position_reasons.most_common())}")
    if args.positions:
        args.positions.write_text(positions_sql(moves), encoding="utf-8")
        print(f"Wrote {len(moves)} moves to {args.positions}")
        return
    out.append("SELECT v.code, v.name, v.address, NULL,")
    out.append("       g.id, c.id, v.zip_code, v.city, v.latitude::decimal(10,8), v.longitude::decimal(11,8)")
    out.append("FROM (VALUES")
    out.append(",\n".join(value_rows))
    out.append(") AS v(code, name, address, zip_code, city, latitude, longitude, gym_code, committee_name, department_code)")
    out.append("LEFT JOIN gyms g ON g.code = v.gym_code")
    out.append("JOIN departments d ON d.code = v.department_code")
    out.append("JOIN committees c ON c.name = v.committee_name AND c.department_id = d.id;\n")

    TARGET_MIGRATION.write_text("\n".join(out), encoding="utf-8")
    print(f"Wrote {TARGET_MIGRATION} - `git diff` it, then verify with a fresh `prisma migrate deploy` before committing.")
    print(
        "This file has already been applied in production. `prisma migrate deploy` does not\n"
        "checksum applied migrations, so it will report nothing pending and the refreshed data\n"
        "will never reach an existing database. To land this: put [refresh-static-data] in the\n"
        "PR title (CI blocks the edit otherwise) and the catch-up SQL in the PR body."
    )
    print(f"leagues={len(league_rows)} committees={len(committee_rows)} gyms={len(gyms)}")


if __name__ == "__main__":
    main()
