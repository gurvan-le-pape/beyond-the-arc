import json


def extract_entities(
    kind: str,
    parent_kind: str | None = None,
    parent_code_property: str | None = None,
) -> None:
    """
    Extract code/name pairs from a GeoJSON file into an INSERT SQL file.
    kind: singular entity name, e.g. "region" or "department".
    parent_kind: singular name of a parent entity to resolve as a foreign key
                 (e.g. "region" when kind="department"), or None for no FK.
    parent_code_property: GeoJSON property key holding the parent's code —
                           required if parent_kind is given. Verify this
                           against the actual source file before relying on
                           it; property naming varies by data provider.
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
        if parent_kind:
            parent_code = feature["properties"][parent_code_property]
            values.append(
                f"('{code}', '{name}', "
                f"(SELECT id FROM {parent_kind}s WHERE code = '{parent_code}'))"
            )
        else:
            values.append(f"('{code}', '{name}')")

    columns = "code, name" if not parent_kind else f"code, name, {parent_kind}_id"
    with open(output_sql, "w", encoding="utf-8") as out:
        out.write(f"INSERT INTO {table} ({columns}) VALUES\n")
        out.write(",\n".join(values))
        out.write(";\n")
