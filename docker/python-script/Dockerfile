# Use the official Python 3.14 slim image
FROM python:3.14-slim

# Create a non-root user and group
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set the working directory inside the container
WORKDIR /app

# Copy the Python scripts directory
COPY ./src/backend/db/python /app/db/python

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/db/python/requirements.txt

# Every container runs on UTC. Date logic must not depend on where the
# host happens to be — see .claude/rules/dates-and-timezones.md.
ENV TZ=UTC

# Set PYTHONPATH so all package imports resolve from the python root
ENV PYTHONPATH=/app/db/python

# Start the long-running scheduler (handles season setup + match generation)
CMD ["python", "/app/db/python/run_scheduler.py"]