# Use the official Postrgres image
FROM postgis/postgis:18-3.6

# Set the working directory inside the container
WORKDIR /app

# Copy migrations directory
COPY ./src/backend/db/sql/migrations /app/db/sql/migrations

# Copy the script to a standard location
COPY ./src/backend/db/sql/docker-entrypoint.sh /docker-entrypoint-initdb.d/docker-entrypoint.sh

# Make the script executable
RUN chmod +x /docker-entrypoint-initdb.d/docker-entrypoint.sh

# Explicitly switch to the non-root postgres user for safety
# USER postgres