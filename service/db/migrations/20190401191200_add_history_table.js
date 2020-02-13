exports.up = function(knex, Promise) {
  return knex.schema.createTable("lemma_time_usage", function(table) {
    table.integer("id");
    table.jsonb("historical_trend");

    table.unique("id");
    table.index("id", null, "hash");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable("lemma_time_usage");
};
