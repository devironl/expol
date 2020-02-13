exports.up = function(knex, Promise) {
  return knex.schema
    .raw("ALTER DATABASE pol_prog SET default_text_search_config='pg_catalog.french';");
};

exports.down = function(knex, Promise) {};
