const config = require('./knexfile');
const knex = require('knex')(config);

knex.migrate.latest(config.migrations).then(() => {
    console.log('Migations done.')
}).finally(() => {
    knex.destroy();
});
