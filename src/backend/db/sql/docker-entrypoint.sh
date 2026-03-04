#!/bin/bash

# Directory containing migrations
MIGRATIONS_DIR="/app/db/sql/migrations"
DUMP_FILE="/app/db/sql/db_dump.sql"

# Function to recursively apply SQL files in a directory
apply_migrations() {
    local dir="$1"
    if [ -d "$dir" ]; then
        echo "Applying migrations in $dir..."
        # Find all .sql files in the directory and subdirectories, sorted by path
        for file in $(find "$dir" -name "*.sql" | sort); do
            if [ -s "$file" ]; then  # Check if the file is not empty
                echo "Applying $file..."
                psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$file"
            else
                echo "Skipping empty file: $file"
            fi
        done
    else
        echo "Directory $dir does not exist. Skipping."
    fi
}

if [ -f "$DUMP_FILE" ]; then
    echo "Found database dump at $DUMP_FILE. Restoring..."
    psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$DUMP_FILE"
    echo "Database restored from dump."
else
    echo "No database dump found. Running migrations."
    # Apply schema migrations
    apply_migrations "$MIGRATIONS_DIR/01_schema"

    # Apply trigger migrations
    apply_migrations "$MIGRATIONS_DIR/03_triggers"

    # Apply data migrations in a specific order to respect foreign key constraints
    DATA_MIGRATIONS_DIR="$MIGRATIONS_DIR/04_data"

    # Define the priority order for the folders in 04_data
    PRIORITY_ORDER=("regions" "departments" "presidents" "leagues" "committees" "gyms" "clubs")

    # Apply migrations in the specified priority order
    for table in "${PRIORITY_ORDER[@]}"; do
        apply_migrations "$DATA_MIGRATIONS_DIR/$table"
    done

    # Optionally, apply any remaining migrations not covered by the priority order
    # This ensures that any new folders added later are not missed
    for dir in $(find "$DATA_MIGRATIONS_DIR" -mindepth 1 -maxdepth 1 -type d | sort); do
        dir_name=$(basename "$dir")
        if [[ ! " ${PRIORITY_ORDER[*]} " =~ " $dir_name " ]]; then
            apply_migrations "$dir"
        fi
    done
fi