# Use the official Python 3.9 image
FROM python:3.9

# Create a non-root user and group
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set the working directory inside the container
WORKDIR /app

# Copy the Python scripts directory
COPY ./src/backend/db/python /app/db/python

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/db/python/requirements.txt

# Make the run-scripts.sh script executable
RUN chmod +x /app/db/python/run-scripts.sh

# Switch to non-root user
# USER appuser

# Command to run the script
CMD ["sh", "/app/db/python/run-scripts.sh"]