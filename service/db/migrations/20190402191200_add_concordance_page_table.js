exports.up = function(knex, Promise) {
  return knex.schema.createTable("lemma_concordance_page", function(table) {
    table.integer("id");
    table.integer("year");
    table.string("party");
    table.integer("page");
    table.jsonb("concordance_list");

    table.index(["id", "year", "party", "page"], null, "btree");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable("lemma_concordance_page");
};
