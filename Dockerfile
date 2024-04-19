# pull official base image
FROM python:3.10

# set work directory
WORKDIR /national_park_explorer

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy project
COPY . .

RUN python manage.py collectstatic