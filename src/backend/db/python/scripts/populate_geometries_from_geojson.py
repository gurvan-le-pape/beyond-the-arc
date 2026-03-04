import json
from shapely.geometry import shape, mapping, MultiPolygon, Polygon
from psycopg2.extras import execute_values
from utils.db_utils import get_connection, release_connection

def ensure_multipolygon(geom):
    """Convert Polygon to MultiPolygon if needed."""
    if isinstance(geom, Polygon):
        return MultiPolygon([geom])
    return geom

def insert_regions():
    with open("geojson/regions.geojson", encoding="utf-8") as f:
        gj = json.load(f)
    rows = []
    for feature in gj["features"]:
        props = feature["properties"]
        league_code = props["code"]
        geojson_code = props["code"]
        region_name = props["nom"]
        geom = ensure_multipolygon(shape(feature["geometry"]))
        wkt = geom.wkt
        rows.append((league_code, geojson_code, region_name, wkt))
    sql = """
        INSERT INTO regions_geometry (league_code, geojson_code, region_name, geometry)
        VALUES %s
        ON CONFLICT DO NOTHING
    """
    execute_values(cur, sql, rows, template="(%s, %s, %s, ST_GeomFromText(%s, 4326))")
    conn.commit()
    print(f"Inserted {len(rows)} regions.")

def insert_departments():
    with open("geojson/departments.geojson", encoding="utf-8") as f:
        gj = json.load(f)
    rows = []
    for feature in gj["features"]:
        props = feature["properties"]
        department_code = props["code"]
        geojson_code = props["code"]
        department_name = props["nom"]
        geom = ensure_multipolygon(shape(feature["geometry"]))
        wkt = geom.wkt
        rows.append((department_code, geojson_code, department_name, wkt))
    sql = """
        INSERT INTO departments_geometry (department_code, geojson_code, department_name, geometry)
        VALUES %s
        ON CONFLICT DO NOTHING
    """
    execute_values(cur, sql, rows, template="(%s, %s, %s, ST_GeomFromText(%s, 4326))")
    conn.commit()
    print(f"Inserted {len(rows)} départements.")

if __name__ == "__main__":
    conn = get_connection()
    cur = conn.cursor()
    try:
        insert_regions()
        insert_departments()
    finally:
        cur.close()
        release_connection(conn)