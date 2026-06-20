# Use an official lightweight Python image
FROM python:3.9-slim

# Set work directory in the container
WORKDIR /app

# Install system dependencies (build-essential needed for some C-extensions if compiling, but slim wheels are usually pre-built)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python libraries
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend server script
COPY app.py .

# Expose API port
EXPOSE 5000

# Run the Flask app
CMD ["python", "app.py"]
