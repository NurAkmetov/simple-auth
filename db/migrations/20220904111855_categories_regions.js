/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('categories', function (table) {
            table.increments('id').primary();
            table.string('name');

            table.timestamps(true, true);
        })
        .createTableIfNotExists('regions', function (table) {
            table.increments('id').primary();
            table.string('city');

            table.timestamps(true, true);
        })

        .table('users', function (table) {
            table.integer('category_id').unsigned();
            table.foreign('category_id').references('categories.id');
            table.integer('region_id').unsigned();
            table.foreign('region_id').references('regions.id');
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable('users')
        .dropTable('categories')
        .dropTable('regions')
};
