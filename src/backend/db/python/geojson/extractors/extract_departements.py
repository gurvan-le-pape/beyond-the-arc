import json

with open('departments.geojson', encoding='utf-8') as f:
    data = json.load(f)

with open('../../../sql/migrations/04_data/departments/01_insert_departments.sql', 'w', encoding='utf-8') as out:
    out.write("INSERT INTO departments (code, name) VALUES\n")
    values = []
    for feature in data['features']:
        code = feature['properties'].get('code') or feature['properties'].get('code_insee')
        name = feature['properties']['nom'].replace("'", "''")
        values.append(f"('{code}', '{name}')")
    out.write(",\n".join(values))
    out.write(";\n")