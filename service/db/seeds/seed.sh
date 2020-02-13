set -e

docker exec -it db psql -Uservice -d pol_prog -v ON_ERROR_STOP=1 -c \
    "TRUNCATE TABLE lemma CASCADE; COPY lemma (id, lemma, display_word, variants) FROM '/output_views/lemma.csv' WITH (FORMAT 'csv',DELIMITER ',', HEADER true);"
docker exec -it db psql -Uservice -d pol_prog -v ON_ERROR_STOP=1 -c"UPDATE lemma SET variants_tsv = to_tsvector(variants);"
docker exec -it db psql -Uservice -d pol_prog -v ON_ERROR_STOP=1 -c"TRUNCATE TABLE lemma_usage; COPY lemma_usage FROM '/output_views/lemma_usage.csv' WITH (FORMAT 'csv',DELIMITER ',', HEADER true);"
docker exec -it db psql -Uservice -d pol_prog -v ON_ERROR_STOP=1 -c"TRUNCATE TABLE lemma_similarity; COPY lemma_similarity FROM '/output_views/lemma_similarity.csv' WITH (FORMAT 'csv',DELIMITER ',', HEADER true);"
docker exec -it db psql -Uservice -d pol_prog -v ON_ERROR_STOP=1 -c"TRUNCATE TABLE lemma_time_usage; COPY lemma_time_usage FROM '/output_views/word_time_usage.csv' WITH (FORMAT 'csv',DELIMITER ',', HEADER true);"
docker exec -it db psql -Uservice -d pol_prog -v ON_ERROR_STOP=1 -c"TRUNCATE TABLE lemma_concordance_page; COPY lemma_concordance_page FROM '/output_views/lemma_concordance_page.csv' WITH (FORMAT 'csv',DELIMITER ',', HEADER true);"
docker exec -it db psql -Uservice -d pol_prog -v ON_ERROR_STOP=1 -c"REINDEX DATABASE pol_prog;"