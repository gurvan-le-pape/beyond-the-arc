import json

# Path to GeoJSON file
GEOJSON_PATH = 'regions.geojson'
# Output SQL file
OUTPUT_SQL = r'../../../sql/migrations/04_data/regions/02_insert_geometries.sql'


def main():
    with open(GEOJSON_PATH, encoding='utf-8') as f:
        data = json.load(f)

    values = []
    for feature in data['features']:
        code = feature['properties'].get('code')
        geometry = feature['geometry']
        if not code or not geometry:
            continue
        geojson_str = json.dumps(geometry, ensure_ascii=False)
        value = f"((SELECT id FROM regions WHERE code = '{code}'), '{code}', ST_GeomFromGeoJSON('{geojson_str}'))"
        values.append(value)

    if values:
        with open(OUTPUT_SQL, 'w', encoding='utf-8') as out:
            out.write("INSERT INTO region_geometries (region_id, geojson_code, geometry)\nVALUES\n")
            out.write(",\n".join(values))
            out.write(";\n")

if __name__ == '__main__':
    main()
