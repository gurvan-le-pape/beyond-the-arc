#!/bin/sh

# Check if teams already exist
echo "Checking if teams already exist..."
python3 /app/db/python/scripts/check_database.py teams
if [ $? -eq 0 ]; then
    echo "Teams already exist in the database. Skipping team generation."
else
    echo "Generating teams..."
    python3 /app/db/python/scripts/generate_teams.py
fi

# Check if matches already exist
echo "Checking if matches already exist..."
python3 /app/db/python/scripts/check_database.py matches
if [ $? -eq 0 ]; then
    echo "Matches already exist in the database. Skipping match generation."
else
    echo "Generating matches..."
    python3 /app/db/python/scripts/generate_matches.py
fi