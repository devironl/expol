# Using Cloud storage bucket for static website hosting
## Issues foreseen
- All paths need to be relative,
- Without a domain it looks like setting up index.html as default does not work. Need to use the url (https://storage.googleapis.com/expolbeta/index.html)

## Procedure
From https://cloud.google.com/storage/docs/hosting-static-website
```sh
# Create bucket
gsutil mb gs://expolbeta
# Build the app
yarn build
# Sync with deletion
gsutil rsync -d -x "static/js/.*\.map$" -x ".*DS_Store$" -R ./build gs://expolbeta

# Set index file
gsutil web set -m index.html gs://expolbeta

# Make all objects public
gsutil iam ch allUsers:objectViewer gs://expolbeta
```

# Using Google App Engine

## App
```sh
cd app
# Build and deploy
npm run deploy-prod
# Deploy routing rules if they changed
gcloud app deploy dispatch.yaml
```

## Service
```sh
gcloud app deploy
```

# DB
Based on https://www.the-swamp.info/blog/search-google-cloud-platform-cloud-sql/
```sh
gcloud sql instances create expol --database-version=POSTGRES_9_6 --cpu=1 --memory=3840MiB
gcloud sql databases create pol_prog --instance=expol
```
Create service user with password and permissions via GCloud Console

Connect with psql following https://cloud.google.com/sql/docs/postgres/connect-admin-proxy (used brew to install postgresql@9.6 and have psql locally)
```sh
### Proxy via socket
sudo mkdir /cloudsql; sudo chmod 777 /cloudsql
./cloud_sql_proxy -dir=/cloudsql -instances=inoopa:europe-west1:expol
```

```sh
psql "sslmode=disable host=/cloudsql/inoopa:europe-west1:expol user=postgres"
=> grant all privileges on database pol_prog to service;
```
https://cloud.google.com/sql/docs/postgres/connect-app-engine

Run migration
```sh
source .env
NODE_ENV=production CLOUD_SQL_CONNECTION_NAME=inoopa:europe-west1:expol POSTGRES_USER=service POSTGRES_DB=pol_prog POSTGRES_PASSWORD=<PASWWPRD> npm run migrate
```

```sh
cat ../local_data/output_views/lemma.csv|psql "sslmode=disable host=/cloudsql/inoopa:europe-west1:expol user=service dbname=pol_prog" -c "TRUNCATE lemma CASCADE; COPY lemma (id, lemma, display_word, variants) FROM STDIN WITH (FORMAT 'csv',DELIMITER ',', HEADER true);"
psql "sslmode=disable host=/cloudsql/inoopa:europe-west1:expol user=service dbname=pol_prog" -c"UPDATE lemma SET variants_tsv = to_tsvector(variants);"
cat ../local_data/output_views/lemma_usage.csv|psql "sslmode=disable host=/cloudsql/inoopa:europe-west1:expol user=service dbname=pol_prog" -c"TRUNCATE lemma_usage; COPY lemma_usage FROM STDIN WITH (FORMAT 'csv',DELIMITER ',', HEADER true);"
cat ../local_data/output_views/lemma_similarity.csv|psql "sslmode=disable host=/cloudsql/inoopa:europe-west1:expol user=service dbname=pol_prog" -c"TRUNCATE lemma_similarity; COPY lemma_similarity FROM STDIN WITH (FORMAT 'csv',DELIMITER ',', HEADER true);"
cat ../local_data/output_views/word_time_usage.csv|psql "sslmode=disable host=/cloudsql/inoopa:europe-west1:expol user=service dbname=pol_prog" -c"TRUNCATE lemma_time_usage; COPY lemma_time_usage FROM STDIN WITH (FORMAT 'csv',DELIMITER ',', HEADER true);"
cat ../local_data/output_views/lemma_concordance_page.csv|psql "sslmode=disable host=/cloudsql/inoopa:europe-west1:expol user=service dbname=pol_prog" -c"TRUNCATE lemma_concordance_page; COPY lemma_concordance_page FROM STDIN WITH (FORMAT 'csv',DELIMITER ',', HEADER true);"
psql "sslmode=disable host=/cloudsql/inoopa:europe-west1:expol user=service dbname=pol_prog" -c"REINDEX DATABASE pol_prog;"
```
