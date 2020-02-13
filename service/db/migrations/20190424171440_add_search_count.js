exports.up = function(knex, Promise) {
  return knex.schema.createTable("lemma_search_count", function(table) {
    table.integer("lemma_id");
    table.integer("count");

    table.unique("lemma_id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable("lemma_search_count");
};
