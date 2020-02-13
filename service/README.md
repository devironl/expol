# API service

A small Express API to be used with Google Cloud SQL

## Dependencies
- docker & docker-compose

## Usage

### Local dev
Start Postgres DB
```sh
docker-compose up -d postgres
```

Start the server with nodemon locally
```sh
docker-compose up service
```
Note that the above will run migrations which, amongst other things, set the **default_search_text_configuration** to french.

Seed data from selected csv files in `../data/output_views`.
```sh
./db/seeds/seed.sh
```
