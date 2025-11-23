# Use official Python lightweight image
FROM python:3.11-slim

# Disable Python buffering
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system packages required by psycopg2
RUN apt-get update && apt-get install -y \
    libpq-dev gcc && \
    apt-get clean

# Copy requirement file
COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Expose Flask/Gunicorn port
EXPOSE 5000

# Run app using Gunicorn and factory function
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "App:create_app()"]