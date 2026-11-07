#!/usr/bin/env python3
"""One-off importer: competitions.ffbb.com -> name/address/gym data for
metropolitan France leagues, committees and clubs. No contact details: phone
numbers, emails and the people named on a page (president, correspondent)
are not collected — the site links to each organisation's FFBB page instead.

Respects robots.txt (crawl-delay: 1s, no relevant Disallow). Writes JSON
Lines checkpoints under ffbb_data/ so an interrupted crawl resumes. A crawl
that finished is not resumed: the next run fetches everything again.

Usage: make refresh-static-data (from the repo root), or directly:
       python3 scrape.py && python3 build_migration.py
"""
import json
import re
import sys
import time
from pathlib import Path

import requests

BASE = "https://competitions.ffbb.com"
UA = "BeyondTheArc-StaticDataSeed/1.0 (portfolio project, one-off seed import; +https://github.com/gurvan-le-pape/beyond-the-arc)"
CRAWL_DELAY = 1.1  # seconds, slightly above the robots.txt-declared 1s

METRO_LEAGUE_CODES = [
    "ara", "bfc", "bre", "cor", "cvl", "ges",
    "hdf", "idf", "naq", "nor", "occ", "pdl", "sud",
]

OUT_DIR = Path(__file__).parent / "ffbb_data"
OUT_DIR.mkdir(exist_ok=True)
# Present from the start of a crawl to its end, so finding it means the last
# crawl was interrupted.
CRAWL_IN_PROGRESS = OUT_DIR / ".crawl_in_progress"

session = requests.Session()
session.headers.update({"User-Agent": UA})


def fetch(path: str) -> str:
    url = f"{BASE}{path}"
    for attempt in range(4):
        try:
            resp = session.get(url, timeout=30)
            if resp.status_code == 200:
                return resp.text
            if resp.status_code == 404:
                return ""
            time.sleep(2 * (attempt + 1))
        except requests.RequestException:
            time.sleep(2 * (attempt + 1))
    print(f"FAILED after retries: {url}", file=sys.stderr)
    return ""


def extract_profile(html: str) -> dict | None:
    """Find the {"data":{"general":{...}}} profile object embedded in the
    page's Next.js RSC payload and parse it. Works unchanged for league,
    committee, and club pages - they all share this shape."""
    marker = 'a\\":{\\"general\\":{'
    idx = html.find(marker)
    if idx == -1:
        return None
    start = idx + len('a\\":')
    depth = 0
    i = start
    n = len(html)
    while i < n:
        c = html[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                break
        i += 1
    else:
        return None
    raw = html[start : i + 1]
    unescaped = raw.replace('\\"', '"').replace("\\\\", "\\")
    try:
        return json.loads(unescaped)
    except json.JSONDecodeError as e:
        print(f"JSON parse failed: {e}", file=sys.stderr)
        return None


def get_informations(profile: dict, block_type: str) -> dict:
    for block in profile.get("informations", []):
        if block.get("type") == block_type:
            out = {}
            for item in block.get("informations", []):
                out[item.get("label") or item.get("type")] = item.get("value")
            return out
    return {}


def parse_entity(profile: dict) -> dict:
    general = profile.get("general", {})
    contact = get_informations(profile, "contact")
    gym = get_informations(profile, "salle")
    return {
        "code": general.get("id"),
        "name": general.get("label"),
        "address": contact.get("Adresse"),
        "gym_name": gym.get("Nom"),
        "gym_address": gym.get("Adresse"),
    }


def load_checkpoint(name: str) -> dict:
    path = OUT_DIR / f"{name}.jsonl"
    done = {}
    if path.exists():
        with path.open(encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                rec = json.loads(line)
                done[rec["_url"]] = rec
    return done


def append_checkpoint(name: str, url: str, data: dict) -> None:
    path = OUT_DIR / f"{name}.jsonl"
    rec = {"_url": url, **data}
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")


def scrape_urls(name: str, urls: list[str]) -> None:
    done = load_checkpoint(name)
    todo = [u for u in urls if u not in done]
    print(f"[{name}] {len(done)} already done, {len(todo)} to fetch", flush=True)
    for i, url in enumerate(todo):
        html = fetch(url)
        data = None
        if html:
            profile = extract_profile(html)
            if profile:
                data = parse_entity(profile)
        if data is None:
            data = {"error": "parse_failed_or_404"}
        append_checkpoint(name, url, data)
        if (i + 1) % 50 == 0:
            print(f"[{name}] {i + 1}/{len(todo)}", flush=True)
        time.sleep(CRAWL_DELAY)
    print(f"[{name}] done: {len(todo)} fetched this run", flush=True)


def start_crawl() -> None:
    """Resume an interrupted crawl, or clear the last crawl's results for a new one."""
    if CRAWL_IN_PROGRESS.exists():
        print("Resuming the interrupted crawl.", flush=True)
        return
    for path in OUT_DIR.glob("*.jsonl"):
        path.unlink()
    # Geocoded from the clubs' addresses, which the new crawl may change.
    (OUT_DIR / "geocode_cache.json").unlink(missing_ok=True)
    CRAWL_IN_PROGRESS.touch()


def main():
    league_urls = [f"/ligues/{code}" for code in METRO_LEAGUE_CODES]

    # Committees are derived from the clubs sitemap rather than the site's
    # own committees sitemap, which is paginated/incomplete (spot-checked at
    # ~100 entries nationally vs. the ~440 real committees). Every club must
    # belong to a real committee, so this is the complete, reliable source.
    clubs_sitemap_xml = fetch("/fr/ligues/ligue/comites/comite/clubs/sitemap.xml")
    club_paths = re.findall(r"<loc>https://competitions\.ffbb\.com//?(.*?)</loc>", clubs_sitemap_xml)
    club_paths = ["/" + p for p in club_paths]

    metro_prefixes = tuple(f"/ligues/{code}/" for code in METRO_LEAGUE_CODES)
    metro_club_paths = [p for p in club_paths if p.startswith(metro_prefixes)]
    print(f"Total club paths in sitemap: {len(club_paths)}, metro: {len(metro_club_paths)}")

    committee_paths = sorted(
        {"/" + "/".join(p.strip("/").split("/")[0:4]) for p in metro_club_paths}
    )
    print(f"Unique metro committees: {len(committee_paths)}")

    # `fetch` returns "" when the site is down. Stop before clearing anything.
    if not metro_club_paths:
        sys.exit("The clubs sitemap listed no metro club: nothing was changed.")

    start_crawl()
    scrape_urls("leagues", league_urls)
    scrape_urls("committees", committee_paths)
    scrape_urls("clubs", metro_club_paths)
    CRAWL_IN_PROGRESS.unlink()


if __name__ == "__main__":
    main()
