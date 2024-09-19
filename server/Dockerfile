FROM python:3.9-slim-bullseye
WORKDIR .
COPY requirements.txt /tmp/
RUN pip install --upgrade pip
RUN pip3 install --no-cache-dir  --requirement /tmp/requirements.txt
RUN apt-get update && apt-get install -y \
    libopencv-dev \
    libzbar-dev \
    && rm -rf /var/lib/apt/lists/*

# Install OpenCV separately using pip for decoding part of the project
RUN pip install opencv-python-headless pyzbar
COPY ./app.py /
COPY ./routes_app.py /
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
