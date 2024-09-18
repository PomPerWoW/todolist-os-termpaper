FROM python:3.9

ENV DEBIAN_FRONTEND=noninteractive 

COPY pyproject.toml poetry.lock / 

RUN pip install poetry

RUN poetry config virtualenvs.create false

RUN poetry install --no-interaction --no-ansi --no-cache

# Set some environment variables. PYTHONUNBUFFERED keeps Python from buffering our standard
# output stream, which means that logs can be delivered to the user quickly. PYTHONDONTWRITEBYTECODE
# keeps Python from writing the .pyc files which are unnecessary in this case. We also update
# PATH so that the train and serve programs are found when the container is invoked.

RUN apt-get -y update && apt-get install -y --no-install-recommends \
         nginx \
         ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# RUN apt-get update && apt install -y build-essential libx11-dev libgl1-mesa-dev


ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONDONTWRITEBYTECODE=TRUE
ENV PATH="/opt/program:${PATH}"

# Set up the program in the image
COPY . /opt/program
WORKDIR /opt/program

# EXPOSE 3000

# Run the program
COPY . .
CMD ["flask", "run", "--debug"]