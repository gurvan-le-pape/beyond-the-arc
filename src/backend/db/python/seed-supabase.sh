#!/bin/bash

set -a
source "$(cd "$(dirname "$0")/../../../.." && pwd)/.env.supabase"
set +a

SCRIPTS_DIR="$(dirname "$0")/scripts"

echo "Checking if teams already exist..."
python3 "$SCRIPTS_DIR/check_database.py" teams
if [ $? -eq 0 ]; then
    echo "Teams already exist. Skipping."
else
    echo "Generating teams..."
    python3 "$SCRIPTS_DIR/generate_teams.py"
fi

echo "Checking if matches already exist..."
python3 "$SCRIPTS_DIR/check_database.py" matches
if [ $? -eq 0 ]; then
    echo "Matches already exist. Skipping."
else
    echo "Generating matches..."
    python3 "$SCRIPTS_DIR/generate_matches.py"
fi