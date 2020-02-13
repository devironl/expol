exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("lemma", function(table) {
      table.integer("id");
      table.string("lemma");
      table.string("display_word");
      table.text("variants");
      table.specificType("variants_tsv", "tsvector");

      table.index("variants_tsv", "variants_tsv_gin", "gin");
      table.unique("id");
    })
    .then(() =>
      knex.schema.createTable("lemma_usage", function(table) {
        table.integer("id");
        table.integer("year");
        table.jsonb("usage_list");

        table.unique(["id", "year"]);
        table.index(["id", "year"], null, "btree");
        table.foreign("id").references("lemma.id");
      })
    )
    .then(() =>
      knex.schema.createTable("lemma_similarity", function(table) {
        table.integer("id");
        table.jsonb("similar_list");

        table.unique("id");
        table.index("id", null, "hash");
        table.foreign("id").references("lemma.id");
      })
    );
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable("lemma_usage")
    .then(() => knex.schema.dropTable("lemma"))
    .then(() => knex.schema.dropTable("lemma_similarity"));
};
