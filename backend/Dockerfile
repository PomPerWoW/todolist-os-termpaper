FROM python:3.9-alpine

ENV DEBIAN_FRONTEND=noninteractive 

COPY pyproject.toml poetry.lock / 

RUN pip install poetry

RUN poetry config virtualenvs.create false

RUN poetry install --no-interaction --no-ansi --no-cache

# Set some environment variables. PYTHONUNBUFFERED keeps Python from buffering our standard
# output stream, which means that logs can be delivered to the user quickly. PYTHONDONTWRITEBYTECODE
# keeps Python from writing the .pyc files which are unnecessary in this case. 

RUN rm -rf /var/cache/apt/archives /var/lib/apt/lists/*

ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONDONTWRITEBYTECODE=TRUE

# Copy the application code into the container
COPY . /opt/program
WORKDIR /opt/program

# Expose port 3000 for Gunicorn
# EXPOSE 3000

# Run the app using Gunicorn (bind to port 3000, with 1 worker processes)
CMD ["gunicorn", "-b", "0.0.0.0:3000", "app:create_app()"]

# Run the app using Gunicorn (bind to port 3000, with 4 worker processes)
# CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:3000", "app:create_app()"]