import json


def extract_entities(kind: str) -> None:
    """
    Extract code/name pairs from a GeoJSON file into an INSERT SQL file.
    kind: singular entity name, e.g. "region" or "department".
    """
    geojson_path = f"{kind}s.geojson"
    output_sql = f"../../../sql/migrations/04_data/{kind}s/01_insert_{kind}s.sql"
    table = f"{kind}s"

    with open(geojson_path, encoding="utf-8") as f:
        data = json.load(f)

    values = []
    for feature in data["features"]:
        code = feature["properties"].get("code") or feature["properties"].get(
            "code_insee"
        )
        name = feature["properties"]["nom"].replace("'", "''")
        values.append(f"('{code}', '{name}')")

    with open(output_sql, "w", encoding="utf-8") as out:
        out.write(f"INSERT INTO {table} (code, name) VALUES\n")
        out.write(",\n".join(values))
        out.write(";\n")


def extract_geometries(kind: str) -> None:
    """
    Extract geometries from a GeoJSON file into an INSERT SQL file.
    kind: singular entity name, e.g. "region" or "department".
    """
    geojson_path = f"{kind}s.geojson"
    output_sql = f"../../../sql/migrations/04_data/{kind}s/02_insert_geometries.sql"
    geometries_table = f"{kind}_geometries"
    entities_table = f"{kind}s"
    fk_column = f"{kind}_id"

    with open(geojson_path, encoding="utf-8") as f:
        data = json.load(f)

    values = []
    for feature in data["features"]:
        code = feature["properties"].get("code")
        geometry = feature["geometry"]
        if not code or not geometry:
            continue
        geojson_str = json.dumps(geometry, ensure_ascii=False)
        value = (
            f"((SELECT id FROM {entities_table} WHERE code = '{code}'), "
            f"'{code}', ST_GeomFromGeoJSON('{geojson_str}'))"
        )
        values.append(value)

    if values:
        with open(output_sql, "w", encoding="utf-8") as out:
            out.write(
                f"INSERT INTO {geometries_table} ({fk_column}, geojson_code, geometry)\nVALUES\n"
            )
            out.write(",\n".join(values))
            out.write(";\n")
