#!/bin/bash

set -a
source "$(cd "$(dirname "$0")/../../../.." && pwd)/.env.supabase"
set +a

MIGRATIONS_DIR="$(dirname "$0")/migrations"

apply_migrations() {
    local dir="$1"
    if [[ -d "$dir" ]]; then
        echo "Applying migrations in $dir..."
        for file in $(find "$dir" -name "*.sql" | sort); do
            if [[ -s "$file" ]]; then
                echo "Applying $file..."
                psql "$DATABASE_URL" -f "$file"
            else
                echo "Skipping empty file: $file"
            fi
        done
    fi
    return 0
}

apply_migrations "$MIGRATIONS_DIR/01_schema"
apply_migrations "$MIGRATIONS_DIR/02_indexes"
apply_migrations "$MIGRATIONS_DIR/03_triggers"

PRIORITY_ORDER=("regions" "departments" "presidents" "leagues" "committees" "gyms" "clubs")
for table in "${PRIORITY_ORDER[@]}"; do
    apply_migrations "$MIGRATIONS_DIR/04_data/$table"
done