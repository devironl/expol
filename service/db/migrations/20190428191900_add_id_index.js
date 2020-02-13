exports.up = function(knex, Promise) {
  return knex.schema.table("lemma", function(table) {
    table.index("id", null, "hash");
  });
};

exports.down = function() {};
